import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
export function parseChapter(source){
 const match=source.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n/);
 if(!match)throw Error('Missing front matter');
 return JSON.parse(match[1]);
}
export async function validate(root=process.cwd(),{expectedCount=20}={}){
 const problems=[];const check=(ok,message)=>{if(!ok)problems.push(message);};
 const read=async p=>fs.readFile(path.join(root,p));
 const local=async p=>{check(typeof p==='string'&&p.startsWith('/assets/')&&!p.includes('..'),`Invalid local path: ${p}`);try{return await read('src'+p);}catch{problems.push(`Missing local file: ${p}`);return null;}};
 const refs=JSON.parse(await read('src/_data/references.json'));const ids=new Set();
 for(const r of refs){
  check(!ids.has(r.id),`Duplicate reference: ${r.id}`);ids.add(r.id);
  for(const key of ['id','artist','title','date','medium','museum','objectUrl','rights','rightsUrl','downloadUrl','retrievedAt','originalFilename','sha256','masterImage','rightsEvidence'])check(typeof r[key]==='string'&&r[key].trim(),`${r.id}: missing ${key}`);
  check(r.rights==='Public Domain / CC0',`${r.id}: unapproved rights`);
  for(const key of ['objectUrl','rightsUrl','downloadUrl']){try{const u=new URL(r[key]);check(u.protocol==='https:'&&/(^|\.)(metmuseum\.org|nga\.gov)$/.test(u.hostname),`${r.id}: non-museum ${key}`);}catch{problems.push(`${r.id}: invalid ${key}`);}}
  check(/^\d{4}-\d{2}-\d{2}$/.test(r.retrievedAt),`${r.id}: invalid retrieval date`);
  check(Array.isArray(r.images)&&r.images.length,`${r.id}: no masters`);
  const imageMap=new Map();
  for(const im of r.images||[]){
   const bytes=await local(im.masterImage);imageMap.set(im.masterImage,im);
   if(bytes){check(createHash('sha256').update(bytes).digest('hex')===im.sha256,`${r.id}: checksum mismatch ${im.masterImage}`);const m=await sharp(bytes).metadata();check(m.width===im.width&&m.height===im.height,`${r.id}: master dimensions mismatch`);}
   check(!!im.downloadUrl&&!!im.originalFilename&&!!im.retrievedAt,`${r.id}: incomplete master provenance`);
  }
  check(imageMap.get(r.masterImage)?.sha256===r.sha256,`${r.id}: primary provenance mismatch`);
  if(r.overview){const data=await local(r.overview.path);if(data){const m=await sharp(data).metadata();check(m.width===r.overview.width&&m.height===r.overview.height,`${r.id}: overview dimensions mismatch`);}}else problems.push(`${r.id}: missing overview`);
  for(const view of r.views||[]){const data=await local(view.path);const im=imageMap.get(view.masterImage);check(im&&view.sourceRect?.width===im.width&&view.sourceRect?.height===im.height,`${r.id}: invalid full-sheet provenance`);if(data){const m=await sharp(data).metadata();check(m.width===view.width&&m.height===view.height,`${r.id}: full-sheet dimensions mismatch`);}}
  const crops=new Set();
  for(const c of r.crops||[]){
   check(!crops.has(c.id),`${r.id}: duplicate crop ${c.id}`);crops.add(c.id);
   for(const key of ['id','path','purpose','alt','masterImage','transformation','reviewedAt'])check(typeof c[key]==='string'&&c[key].trim(),`${r.id}/${c.id}: missing ${key}`);
   check(r.views?.some(v=>v.path===c.sheetPath&&v.masterImage===c.masterImage),`${r.id}/${c.id}: incorrect full-sheet view`);
   const im=imageMap.get(c.masterImage),rect=c.sourceRect;
   check(im&&rect&&[rect.x,rect.y,rect.width,rect.height].every(Number.isInteger)&&rect.x>=0&&rect.y>=0&&rect.width>0&&rect.height>0&&rect.x+rect.width<=im.width&&rect.y+rect.height<=im.height,`${r.id}/${c.id}: invalid source rectangle`);
   check(c.width>0&&c.height>0&&c.width<=rect?.width&&c.height<=rect?.height,`${r.id}/${c.id}: missing dimensions or upscaling`);
   check(c.printWidthMm>0&&c.printHeightMm>0,`${r.id}/${c.id}: missing print dimensions`);
   check(Math.max(c.width/c.printWidthMm,c.height/c.printHeightMm)*25.4>=150,`${r.id}/${c.id}: below 150 dpi at copy print size`);
   const data=await local(c.path);if(data){const m=await sharp(data).metadata();check(m.width===c.width&&m.height===c.height,`${r.id}/${c.id}: derivative dimensions mismatch`);}
  }
 }
 const files=(await fs.readdir(path.join(root,'src/chapters'))).filter(f=>f.endsWith('.md'));
 check(files.length===expectedCount,`Expected ${expectedCount} chapters, found ${files.length}`);
 const numbers=new Set(),slugs=new Set();
 for(const f of files){
  let c;try{c=parseChapter((await read('src/chapters/'+f)).toString());}catch(e){problems.push(`${f}: ${e.message}`);continue;}
  check(Number.isInteger(c.number)&&c.number>=1&&c.number<=20,`${f}: invalid chapter number`);
  check(!numbers.has(c.number),`Duplicate chapter number: ${c.number}`);numbers.add(c.number);
  check(typeof c.slug==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.slug)&&!slugs.has(c.slug),`Invalid or duplicate chapter slug: ${c.slug}`);slugs.add(c.slug);
  check(c.permalink===`/chapter/${String(c.number).padStart(2,'0')}-${c.slug}/`,`${f}: route mismatch`);
  check(c.difficulty>=1&&c.difficulty<=5,`${f}: invalid difficulty`);
  for(const key of ['title','duration','goal','look','map','drill','creation','transfer','part'])check(typeof c[key]==='string'&&c[key].trim(),`${f}: missing ${key}`);
  for(const [key,min,max] of [['references',2,2],['studies',2,2],['comparison',3,5],['checks',1,12],['sequence',5,10]])check(Array.isArray(c[key])&&c[key].length>=min&&c[key].length<=max,`${f}: invalid ${key}`);
  check(c.printPages===(c.number<=10?5:c.number<=18?6:c.number===19?7:8),`${f}: invalid page budget`);
  check(c.checkpoint===[4,8,10,14,18].includes(c.number),`${f}: review checkpoint mismatch`);
  for(const id of c.references||[])check(ids.has(id),`${f}: unknown reference ${id}`);
  for(const [i,s] of (c.studies||[]).entries()){
   check(s.reference===c.references?.[i],`${f}: reference order mismatch`);
   check(refs.find(r=>r.id===s.reference)?.crops.some(p=>p.id===s.crop),`${f}: missing crop ${s.crop}`);
   check(s.use&&s.why&&s.instructions?.length>=2,`${f}: incomplete copy instructions`);
  }
 }
 if(problems.length)throw Error(problems.join('\n'));
 return {chapters:files.length,references:refs.length};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{console.log('Content validated:',await validate());}catch(e){console.error(e.message);process.exitCode=1;}
}
