import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';
import {pathPrefix} from '../site.config.mjs';
export async function verifyLinks(root='_site', prefix='/'){
 root=path.resolve(root);const files=[];
 async function walk(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())await walk(p);else if(p.endsWith('.html'))files.push(p);}}
 await walk(root);const errors=[];let count=0;
 for(const file of files){
  const html=await fs.readFile(file,'utf8');const $=load(html);
  const ids=new Set();$('[id]').each((_,el)=>{const id=$(el).attr('id');if(ids.has(id))errors.push(`${file}: duplicate id ${id}`);ids.add(id);});
  for(const el of $('a[href],img[src],script[src],link[href]').toArray()){
   const attr=$(el).attr('href')??$(el).attr('src');
   if(/^(https?:|mailto:|tel:)/.test(attr)){if(el.tagName!=='a')errors.push(`${file}: remote runtime dependency ${attr}`);continue;}
   const current=prefix+path.relative(root,file).split(path.sep).join('/');const url=new URL(attr,'https://course.local'+current);
   if(url.origin!=='https://course.local'||!url.pathname.startsWith(prefix)){errors.push(`${file}: link outside pathPrefix ${attr}`);continue;}
   const target=path.resolve(root,decodeURIComponent(url.pathname.slice(prefix.length)));
   if(target!==root&&!target.startsWith(root+path.sep)){errors.push(`${file}: invalid link ${attr}`);continue;}
   let resolved=target;try{const stat=await fs.stat(resolved);if(stat.isDirectory())resolved=path.join(resolved,'index.html');await fs.access(resolved);}catch{errors.push(`${file}: missing ${attr}`);continue;}
   if(url.hash){const other=load(await fs.readFile(resolved,'utf8'));const anchor=decodeURIComponent(url.hash.slice(1));if(!other('[id]').toArray().some(e=>other(e).attr('id')===anchor))errors.push(`${file}: missing anchor ${attr}`);}
   count++;
  }
 }
 if(errors.length)throw Error(errors.join('\n'));
 return {pages:files.length,localLinks:count};
}
if(process.argv[1]?.endsWith('verify-links.mjs')){try{console.log('Links verified:',await verifyLinks('_site',pathPrefix));}catch(e){console.error(e.message);process.exitCode=1;}}
