import {chromium} from 'playwright';
import {pathPrefix} from '../site.config.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const output=path.resolve('_site');
const server=http.createServer(async(req,res)=>{
 try{
  let relative=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(!relative.startsWith(pathPrefix))throw Error('Outside public mount point');
  relative='/'+relative.slice(pathPrefix.length);
  if(relative.endsWith('/'))relative+='index.html';
  const file=path.resolve(output,'.'+relative);
  if(!file.startsWith(output+path.sep))throw Error('Invalid path');
  const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg'};
  res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(await fs.readFile(file));
 }catch{res.writeHead(404);res.end('Not found');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}${pathPrefix.slice(0,-1)}`;
let browser;
try{
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/sbin/chromium',headless:true,args:['--no-sandbox']});
 const context=await browser.newContext();const page=await context.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await fs.mkdir('qa',{recursive:true});
 const names=(await fs.readdir('src/chapters')).filter(n=>n.endsWith('.md')).sort();
 const routes=['/','/orientation/',...names.map(n=>`/chapter/${n.slice(0,-3)}/`)];
 const report=[];
 for(const route of routes){
  await page.goto(origin+route);await page.evaluate(()=>Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode();})));
  for(const width of [375,1280]){
   await page.setViewportSize({width,height:900});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Horizontal overflow ${route} at ${width}`);
  }
  assert.equal(await page.locator('h1').count(),1,route+' one h1');
  if(route==='/'){
   assert.equal(await page.locator('html').getAttribute('lang'),'de');
   await page.screenshot({path:'qa/desktop.png',fullPage:true});
   await page.setViewportSize({width:375,height:900});await page.screenshot({path:'qa/mobile.png',fullPage:true});
   let toggle=page.locator('.completion input').first();await toggle.check();await page.goto(origin+'/');toggle=page.locator('.completion input').first();assert(await toggle.isChecked());await toggle.uncheck();
   const keyboardPage=await context.newPage();await keyboardPage.goto(origin+'/');await keyboardPage.keyboard.press('Tab');assert(await keyboardPage.locator('.skip-link').evaluate(el=>el===document.activeElement));await keyboardPage.close();
   const languagePage=await context.newPage();await languagePage.goto(origin+'/');await languagePage.locator('.language-toggle').click();await languagePage.waitForURL(origin+'/en/');assert.equal(await languagePage.locator('html').getAttribute('lang'),'en');await languagePage.locator('.language-toggle').click();await languagePage.waitForURL(origin+'/');assert.equal(await languagePage.locator('html').getAttribute('lang'),'de');await languagePage.close();
   continue;
  }
  await page.emulateMedia({media:'print'});
  const dimensions=await page.evaluate(()=>({calibration:document.querySelector('.calibration')?.getBoundingClientRect().width,spaces:[...document.querySelectorAll('.drawing-space')].map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height,expectedWidth:e.closest('.composition-grid')?50:e.closest('.thumbnail-grid,.process-grid')?85:180,expectedHeight:e.classList.contains('copy-space')?100:e.classList.contains('early-creation')?110:e.classList.contains('final-space')?165:e.classList.contains('drill-space')?65:e.classList.contains('process-space')?75:50})),heights:[...document.querySelectorAll('.worksheet-page,.orientation-sheet')].map(e=>e.getBoundingClientRect().height)}));
  assert(Math.abs(dimensions.calibration-50*96/25.4)<.1,route+' 50 mm calibration');
  for(const box of dimensions.spaces){assert(Math.abs(box.w-box.expectedWidth*96/25.4)<.1&&Math.abs(box.h-box.expectedHeight*96/25.4)<.1,route+' incorrect drawing-space dimensions');}
  assert(dimensions.heights.every(h=>h<=263*96/25.4),route+' worksheet exceeds A4 usable height: '+dimensions.heights);
  if(route.includes('10-perspective')) assert.notEqual(await page.locator('.ruled').first().evaluate(e=>getComputedStyle(e).backgroundImage),'none');
  const name=route.split('/').filter(Boolean).at(-1);const pdf=`qa/${name}.pdf`;
  await page.pdf({path:pdf,preferCSSPageSize:true,printBackground:true});
  const info=execFileSync('pdfinfo',[pdf],{encoding:'utf8'});const pages=Number(info.match(/Pages:\s+(\d+)/)[1]);
  const expected=await page.locator('.worksheet-page,.orientation-sheet').count();assert.equal(pages,expected,route+' page budget');
  report.push({route,pages,dimensions});console.log(name+': '+pages+' pages');
  await page.emulateMedia({media:'screen'});
 }
 const nojs=await browser.newContext({javaScriptEnabled:false});const staticPage=await nojs.newPage();
 for(const route of [...routes,'/sources/']){
  await staticPage.goto(origin+route);await staticPage.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));assert(await staticPage.locator('h1').isVisible());
  assert.equal(await staticPage.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.alt.trim()).length),0);
  assert.equal(await staticPage.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||!i.naturalWidth).length),0,route+' no-JS images');
  assert(await staticPage.locator('.print-button').isHidden());
 }
 assert.deepEqual(errors,[]);
 await fs.writeFile('qa/browser-report.json',JSON.stringify({pathPrefix,chromium:browser.version(),routes:routes.length+1,javaScriptDisabled:true,report},null,2));
 console.log(`Verified ${routes.length+1} routes at mobile/desktop and without JavaScript; rendered ${report.length} A4 packets.`);
}finally{await browser?.close();server.close();}
