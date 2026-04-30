import { readFileSync } from 'node:fs';
import Zernio from '@zernio/node';
function cleanEnvValue(v) { let s = v.trim(); let prev;
  do { prev = s;
    if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1);
    else if (s.startsWith('"')) s = s.slice(1);
    else if (s.endsWith('"')) s = s.slice(0, -1);
    if (s.endsWith('\n')) s = s.slice(0, -2);
    s = s.trim();
  } while (s !== prev); return s;
}
const env = Object.fromEntries(readFileSync('.env.local','utf8').split('\n')
  .filter(l => l.includes('=') && !l.trim().startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0,i).trim(), cleanEnvValue(l.slice(i+1))]; }));
const z = new Zernio({ apiKey: env.ZERNIO_API_KEY });
const r = await z.posts.listPosts({ query: { limit: 3, sort: '-createdAt' } });
const posts = r.data?.posts || r.data || [];
console.log('post keys:', Object.keys(posts[0]||{}));
console.log('platform[0] keys:', Object.keys(posts[0]?.platforms?.[0]||{}));
console.log(JSON.stringify(posts[0]?.platforms?.[0], null, 2));
