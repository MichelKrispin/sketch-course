"""Retrieve official API records and untouched image masters. Re-run safely to resume."""
import json,pathlib,urllib.request,urllib.parse,hashlib,datetime,concurrent.futures
root=pathlib.Path(__file__).resolve().parents[1]
existing_path=root/'src/_data/references.json'
existing={r['id']:r for r in json.loads(existing_path.read_text())} if existing_path.exists() else {}
seeds=json.loads((root/'scripts/reference-seeds.json').read_text())
nga={'nga-56210':('feec1bdb-f2df-4ad1-afc7-5ac40a25cdae','landscape_1976.81.1.jpg'),'nga-74237':('1b3ea2de-6bfe-4fb4-87cc-092ade969d13','eye_and_part_of_face_a_breton_woman_and_two_men_recto_1991.217.51.a.jpg'),'nga-184327':('68a8203a-9bf0-474a-9076-b68aa5749202','studies_of_a_man_s_head_2015.19.714.jpg')}
def get(url):
 with urllib.request.urlopen(urllib.parse.quote(url,safe=':/?=&%'),timeout=45) as f:return f.read()
def fetch(r):
 r={**r,**existing.get(r['id'],{})}
 previous_images={im['masterImage']:im for im in r.get('images',[])}
 rid=r['id']; folder=root/'src/assets/references'/rid;folder.mkdir(parents=True,exist_ok=True)
 if rid.startswith('met'):
  api='https://collectionapi.metmuseum.org/public/collection/v1/objects/'+rid.split('-')[1]
  path=folder/'record.json'
  if not path.exists():path.write_bytes(get(api))
  data=json.loads(path.read_text()); assert data['isPublicDomain'],rid+' not public domain'
  r.update(artist=((data.get('artistPrefix','')+' ') if data.get('artistPrefix') and not data['artistDisplayName'].startswith(data['artistPrefix']) else '')+data['artistDisplayName'],title=data['title'],date=data['objectDate'] or 'Date not specified',medium=data['medium'],apiRequest=api,rightsEvidence='isPublicDomain: true in record.json')
  urls=[data['primaryImage']]+data['additionalImages']
 else:
  uid,name=nga[rid];urls=[f'https://api.nga.gov/iiif/{uid}/full/full/0/default.jpg?attachment_filename={name}']
  r.update(rightsEvidence='Collection page: This object’s media is free and in the public domain.',rightsReviewedAt='2026-09-08',rightsReviewMethod='Official collection page reviewed with web browser')
 r['images']=[]
 for i,url in enumerate(urls):
  if not url:continue
  name=url.split('attachment_filename=')[-1] if 'attachment_filename=' in url else url.split('/')[-1]
  path=folder/name
  if not path.exists():
   temp=path.with_suffix(path.suffix+'.part');temp.write_bytes(get(url));temp.replace(path)
  r['images'].append(dict(downloadUrl=url,originalFilename=name,sha256=hashlib.sha256(path.read_bytes()).hexdigest(),masterImage='/'+str(path.relative_to(root/'src')),retrievedAt=previous_images.get('/'+str(path.relative_to(root/'src')),{}).get('retrievedAt',datetime.date.today().isoformat())))
 assert r['images'],rid+' missing image'
 r.update(r['images'][0]);r.setdefault('crops',[])
 print(rid,len(r['images']),flush=True);return r
results=[];errors=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
 futures={pool.submit(fetch,r):r for r in seeds}
 for f in concurrent.futures.as_completed(futures):
  try:results.append(f.result())
  except Exception as e:errors.append(futures[f]['id']+': '+str(e))
if errors:raise SystemExit('Downloads incomplete; existing metadata preserved.\n'+'\n'.join(errors))
(root/'src/_data/references.json').write_text(json.dumps(sorted(results,key=lambda r:r['id']),ensure_ascii=False,indent=2)+'\n')
