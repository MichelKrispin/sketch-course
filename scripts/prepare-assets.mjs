import fs from 'node:fs/promises';
import sharp from 'sharp';
const path='src/_data/references.json';
const refs=JSON.parse(await fs.readFile(path));
const selections=JSON.parse(await fs.readFile('scripts/crop-selections.json'));
for(const r of refs){
 r.crops=[];
 for(const im of r.images){const m=await sharp('src'+im.masterImage).metadata(); im.width=m.width;im.height=m.height;}
 const master=r.images[0];
 const overviewPath=`/assets/crops/${r.id}-sheet.jpg`;
 const out=await sharp('src'+master.masterImage).grayscale().normalize({lower:1,upper:99}).resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true}).jpeg({quality:90}).toFile('src'+overviewPath);
 r.overview={sourceRect:{x:0,y:0,width:master.width,height:master.height},path:overviewPath,width:out.width,height:out.height,masterImage:master.masterImage,transformation:'Full sheet; grayscale; 1–99 percentile normalization; fit inside 1600 px, no enlargement; JPEG quality 90'};
 r.views=[r.overview];
 for(const index of new Set(selections.filter(c=>c.reference===r.id&&c.image).map(c=>c.image))){
  const im=r.images[index];const dest=`/assets/crops/${r.id}-sheet-${index}.jpg`;
  const output=await sharp('src'+im.masterImage).grayscale().normalize({lower:1,upper:99}).resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true}).jpeg({quality:90}).toFile('src'+dest);
  r.views.push({path:dest,width:output.width,height:output.height,masterImage:im.masterImage,sourceRect:{x:0,y:0,width:im.width,height:im.height},transformation:r.overview.transformation});
 }
 for(const selection of selections.filter(c=>c.reference===r.id)){
  const im=r.images[selection.image||0];if(!im)throw Error(`Missing selected view ${r.id}`);
  const [x,y,w,h]=selection.rect;
  const rect={left:Math.round(x*im.width),top:Math.round(y*im.height),width:Math.round(w*im.width),height:Math.round(h*im.height)};
  rect.width=Math.min(rect.width,im.width-rect.left);rect.height=Math.min(rect.height,im.height-rect.top);
  const dest=`/assets/crops/${r.id}-${selection.id}.jpg`;
  const output=await sharp('src'+im.masterImage).extract(rect).grayscale().normalize({lower:1,upper:99}).resize({width:1800,height:1800,fit:'inside',withoutEnlargement:true}).jpeg({quality:94}).toFile('src'+dest);
  r.crops.push({id:selection.id,path:dest,sheetPath:r.views.find(v=>v.masterImage===im.masterImage).path,purpose:selection.purpose,alt:selection.alt,masterImage:im.masterImage,sourceRect:{x:rect.left,y:rect.top,width:rect.width,height:rect.height},width:output.width,height:output.height,printWidthMm:Math.min(85,Math.floor(output.width*25.4/160)),transformation:'Extract integer sourceRect; grayscale; 1–99 percentile normalization; fit inside 1800 px, no enlargement; JPEG quality 94',reviewedAt:'2026-09-08'});
 }
}
await fs.writeFile(path,JSON.stringify(refs,null,2)+'\n');
console.log(`Prepared ${refs.length} sheets and ${selections.length} reproducible study crops.`);
