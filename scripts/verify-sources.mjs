import fs from 'node:fs/promises';
const refs=JSON.parse(await fs.readFile('src/_data/references.json'));
const results=[];
for(const r of refs){
 const result={id:r.id,objectUrl:r.objectUrl,checkedAt:new Date().toISOString()};
 try{
  const response=await fetch(r.objectUrl,{signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw Error(`Collection page HTTP ${response.status}; inspect the museum page manually`);
  const html=await response.text();
  if(!/Public Domain|free and in the public domain/i.test(html))throw Error('Public-domain label absent; manual review required');
  result.pageRightsVerified=true;
  if(r.apiRequest){
   const apiResponse=await fetch(r.apiRequest,{signal:AbortSignal.timeout(30000)});
   if(!apiResponse.ok)throw Error(`Museum API HTTP ${apiResponse.status}`);
   const data=await apiResponse.json();if(data.isPublicDomain!==true)throw Error('API no longer marks image public domain');
   const urls=[data.primaryImage,...data.additionalImages];
   if(!r.images.every(im=>urls.includes(im.downloadUrl)))throw Error('Official image URLs changed; re-review provenance');
   result.apiRightsVerified=true;
  }
  result.status='verified';
 }catch(e){result.status='needs-review';result.error=e.message;}
 results.push(result);console.log(r.id,result.status);
}
await fs.mkdir('qa',{recursive:true});await fs.writeFile('qa/source-check.json',JSON.stringify(results,null,2)+'\n');
if(results.some(r=>r.status!=='verified')){console.error('Some source checks require manual review; see qa/source-check.json. No rights approvals were changed.');process.exitCode=1;}
