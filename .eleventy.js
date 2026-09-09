import { readFileSync } from 'node:fs';
import { pathPrefix } from './site.config.mjs';
import { de } from './src/_data/i18n.js';
export default function (config) {
  const locale = process.env.SITE_LANG === 'en' ? 'en' : 'de';
  config.addPassthroughCopy({'src/assets/css':'assets/css','src/assets/js':'assets/js','src/assets/crops':'assets/crops'});
  config.addCollection('chapters', api => api.getFilteredByTag('chapter').sort((a,b)=>a.data.number-b.data.number));
  config.addFilter('pad', n => String(n).padStart(2,'0'));
  config.addFilter('sentence', value => value ? value[0].toLocaleUpperCase(locale) + value.slice(1) : value);
  config.addFilter('t', value => locale === 'de' ? de.get(value) ?? value : value);
  config.addFilter('localeUrl', value => locale === 'en' && value.startsWith('/') ? `/en${value}` : value);
  config.addFilter('alternateUrl', value => locale === 'de' ? `/en${value}` : value);
  config.addFilter('reference', id => JSON.parse(readFileSync('src/_data/references.json','utf8')).find(r=>r.id===id));
  config.addFilter('crop', (r,id) => r.crops.find(c=>c.id===id));
  config.addGlobalData('locale', locale);
  return {pathPrefix,dir:{input:'src',output:process.env.SITE_OUTPUT || '_site'},markdownTemplateEngine:'njk',htmlTemplateEngine:'njk'};
}
