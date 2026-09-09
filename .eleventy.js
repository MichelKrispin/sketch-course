import { readFileSync } from 'node:fs';
import { pathPrefix } from './site.config.mjs';
export default function (config) {
  config.addPassthroughCopy({'src/assets/css':'assets/css','src/assets/js':'assets/js','src/assets/crops':'assets/crops'});
  config.addCollection('chapters', api => api.getFilteredByTag('chapter').sort((a,b)=>a.data.number-b.data.number));
  config.addFilter('pad', n => String(n).padStart(2,'0'));
  config.addFilter('reference', id => JSON.parse(readFileSync('src/_data/references.json','utf8')).find(r=>r.id===id));
  config.addFilter('crop', (r,id) => r.crops.find(c=>c.id===id));
  return {pathPrefix,dir:{input:'src',output:'_site'},markdownTemplateEngine:'njk',htmlTemplateEngine:'njk'};
}
