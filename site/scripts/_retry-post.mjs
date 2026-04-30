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
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
  .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), cleanEnvValue(l.slice(i + 1))]; }));

const id = process.argv[2];
if (!id) { console.error('usage: node _retry-post.mjs <postId>'); process.exit(1); }

const z = new Zernio({ apiKey: env.ZERNIO_API_KEY });

// Try every shape the SDK might accept
const variants = [
  { path: { id } },
  { path: { postId: id } },
  { id },
  id,
];
for (const v of variants) {
  try {
    console.log(`Trying retryPost with variant:`, typeof v === 'string' ? `"${v}"` : JSON.stringify(v));
    const r = await z.posts.retryPost(v);
    console.log('✅ SUCCESS:', JSON.stringify(r.data || r, null, 2).slice(0, 800));
    break;
  } catch (e) {
    console.log(`  ↳ ${e.statusCode || ''} ${e.message}`);
  }
}
