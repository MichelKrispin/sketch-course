import { spawn } from 'node:child_process';

function run(lang, output) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['node_modules/@11ty/eleventy/cmd.cjs'], {
      stdio: 'inherit',
      env: { ...process.env, SITE_LANG: lang, SITE_OUTPUT: output }
    });
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`Eleventy (${lang}) exited with ${code}`)));
  });
}

await run('de', '_site');
await run('en', '_site/en');
