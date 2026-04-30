import { readFileSync } from 'node:fs';
import Zernio from '@zernio/node';
function cleanEnvValue(v) {
  let s = v.trim(); let prev;
  do { prev = s;
    if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1);
    else if (s.startsWith('"')) s = s.slice(1);
    else if (s.endsWith('"')) s = s.slice(0, -1);
    if (s.endsWith('\\n')) s = s.slice(0, -2);
    s = s.trim();
  } while (s !== prev);
  return s;
}
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n').filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), cleanEnvValue(l.slice(i + 1))]; })
);
const z = new Zernio({ apiKey: env.ZERNIO_API_KEY });
const igId = '69d935357dea335c2bd3c3ed';

console.log('--- CONVERSATIONS (all) ---');
const c1 = await z.messages.listInboxConversations({ query: { limit: 10 } });
console.log(JSON.stringify(c1, null, 2).slice(0, 2000));

console.log('\n\n--- COMMENTS (all) ---');
try {
  const c2 = await z.comments.listInboxComments({ query: { limit: 10 } });
  console.log(JSON.stringify(c2, null, 2).slice(0, 1500));
} catch (e) { console.log('err:', e.message); }
