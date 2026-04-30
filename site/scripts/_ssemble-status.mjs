import { readFileSync } from 'node:fs';

function cleanEnvValue(v) {
  let s = v.trim();
  let prev;
  do {
    prev = s;
    if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1);
    else if (s.startsWith('"')) s = s.slice(1);
    else if (s.endsWith('"')) s = s.slice(0, -1);
    if (s.endsWith('\\n')) s = s.slice(0, -2);
    s = s.trim();
  } while (s !== prev);
  return s;
}

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), cleanEnvValue(l.slice(i + 1))]; })
);

const id = process.argv[2];
if (!id) { console.error('usage: node _ssemble-status.mjs <requestId>'); process.exit(1); }
const r = await fetch(`https://aiclipping.ssemble.com/api/v1/shorts/${id}/status`, {
  headers: { 'X-API-Key': env.SSEMBLE_API_KEY },
});
const txt = await r.text();
console.log('HTTP', r.status);
console.log(txt);
