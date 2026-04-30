import { readFileSync } from 'node:fs';
import Zernio from '@zernio/node';
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0,i).trim(), l.slice(i+1).trim().replace(/^"|"$/g,'').replace(/\\n$/,'').trim()]; })
);
const z = new Zernio({ apiKey: env.ZERNIO_API_KEY });
const r = await z.posts.listPosts({ query: { limit: 1 } });
const p = (r.data?.posts || r.data || [])[0];
console.log(JSON.stringify(p, null, 2));
