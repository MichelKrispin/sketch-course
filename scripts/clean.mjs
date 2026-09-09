import fs from 'node:fs/promises';
await fs.rm(new URL('../_site/',import.meta.url),{recursive:true,force:true});
