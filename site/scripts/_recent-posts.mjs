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

const z = new Zernio({ apiKey: env.ZERNIO_API_KEY });
const r = await z.posts.listPosts({ query: { limit: 10, sort: '-createdAt' } });
const posts = r.data?.posts || r.data || [];
console.log(`Found ${posts.length} recent posts\n`);
for (const p of posts) {
  console.log(`[${p._id || p.id}]  ${p.createdAt}  status=${p.status}`);
  console.log(`  content: ${(p.content || '').slice(0, 80).replace(/\n/g, ' | ')}`);
  for (const pp of (p.platforms || [])) {
    const u = pp.platformPostUrl || pp.platformPostId || '(pending)';
    console.log(`  ${pp.platform.padEnd(10)} · ${pp.status.padEnd(12)} · ${u}`);
  }
  console.log();
}
