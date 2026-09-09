import fs from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import sharp from 'sharp';
const dir='/tmp/drawing-pdf-review';await fs.mkdir(dir,{recursive:true});
const files=(await fs.readdir('qa')).filter(f=>f.endsWith('.pdf')).sort();const pages=[];
for(const file of files){
 const name=file.slice(0,-4);execFileSync('pdftoppm',['-scale-to','700','-png','qa/'+file,dir+'/'+name]);
 const renders=(await fs.readdir(dir)).filter(n=>n.startsWith(name+'-')&&n.endsWith('.png')).sort();
 for(const render of renders)pages.push(dir+'/'+render);
}
for(let i=0;i<pages.length;i+=20){
 const batch=pages.slice(i,i+20),tiles=[];
 for(let j=0;j<batch.length;j++)tiles.push({input:await sharp(batch[j]).resize(280,396,{fit:'contain',background:'white'}).png().toBuffer(),left:j%4*288,top:Math.floor(j/4)*404});
 await sharp({create:{width:1152,height:Math.ceil(batch.length/4)*404,channels:3,background:'#aaa'}}).composite(tiles).png().toFile(dir+'/contact-'+i/20+'.png');
}
console.log(`Rendered ${pages.length} pages for visual review in ${dir}`);
