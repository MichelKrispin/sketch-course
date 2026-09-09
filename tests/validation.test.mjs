import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {validate,parseChapter} from '../scripts/validate-content.mjs';
import {verifyLinks} from '../scripts/verify-links.mjs';
async function fixture(t){
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'drawing-validation-'));t.after(()=>fs.rm(root,{recursive:true,force:true}));
 await fs.mkdir(path.join(root,'src/_data'),{recursive:true});
 await fs.cp('src/chapters',path.join(root,'src/chapters'),{recursive:true});
 await fs.copyFile('src/_data/references.json',path.join(root,'src/_data/references.json'));
 await fs.symlink(path.resolve('src/assets'),path.join(root,'src/assets'),'dir');return root;
}
async function mutateRefs(root,fn){const p=path.join(root,'src/_data/references.json');const refs=JSON.parse(await fs.readFile(p));fn(refs);await fs.writeFile(p,JSON.stringify(refs));}
test('complete course validates',async()=>assert.deepEqual(await validate(),{chapters:20,references:36}));
test('build gate rejects missing rights, corrupt provenance, and absent files',async t=>{
 const root=await fixture(t);await mutateRefs(root,rs=>{delete rs[0].rights;rs[1].images[0].sha256='0'.repeat(64);rs[2].crops[0].path='/assets/crops/missing.jpg';});
 await assert.rejects(validate(root),e=>e.message.includes('missing rights')&&e.message.includes('checksum mismatch')&&e.message.includes('Missing local file'));
});
test('build gate rejects duplicate chapters and unresolved reference IDs',async t=>{
 const root=await fixture(t);const files=await fs.readdir(path.join(root,'src/chapters'));const p=path.join(root,'src/chapters',files[1]);const c=parseChapter(await fs.readFile(p,'utf8'));c.number=1;c.slug='line-quality';c.references[0]='missing-reference';await fs.writeFile(p,'---\n'+JSON.stringify(c)+'\n---\n');
 await assert.rejects(validate(root),e=>e.message.includes('Duplicate chapter number')&&e.message.includes('duplicate chapter slug')&&e.message.includes('unknown reference'));
});
test('build gate rejects out-of-bounds crops and enlargement',async t=>{
 const root=await fixture(t);await mutateRefs(root,rs=>{rs[0].crops[0].sourceRect.x=999999;rs[1].crops[0].width=999999;});
 await assert.rejects(validate(root),e=>e.message.includes('invalid source rectangle')&&e.message.includes('upscaling'));
});
test('link checker accepts root and anchors, rejects missing targets and remote scripts',async t=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'drawing-links-'));t.after(()=>fs.rm(root,{recursive:true,force:true}));
 await fs.writeFile(path.join(root,'index.html'),'<h1 id="main">Course</h1><a href="/">Home</a><a href="/#main">Main</a>');assert.deepEqual(await verifyLinks(root),{pages:1,localLinks:2});
 await fs.writeFile(path.join(root,'index.html'),'<a href="/missing/">Missing</a><a href="#absent">Anchor</a><script src="https://example.com/tracking.js"></script>');
 await assert.rejects(verifyLinks(root),e=>e.message.includes('missing /missing/')&&e.message.includes('missing anchor')&&e.message.includes('remote runtime dependency'));
});
test('link checker validates a GitHub Pages path prefix',async t=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'drawing-prefix-'));t.after(()=>fs.rm(root,{recursive:true,force:true}));
 await fs.mkdir(path.join(root,'orientation'),{recursive:true});
 await fs.writeFile(path.join(root,'index.html'),'<h1 id="course">Course</h1><a href="/sketch-course/orientation/">Start</a>');
 await fs.writeFile(path.join(root,'orientation/index.html'),'<h1>Orientation</h1><a href="/sketch-course/#course">Course</a>');
 assert.deepEqual(await verifyLinks(root,'/sketch-course/'),{pages:2,localLinks:2});
 await fs.writeFile(path.join(root,'index.html'),'<a href="/orientation/">Wrong mount point</a>');
 await assert.rejects(verifyLinks(root,'/sketch-course/'),/link outside pathPrefix/);
});
