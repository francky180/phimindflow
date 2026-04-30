import { readFileSync } from 'node:fs';
import Zernio from '@zernio/node';
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '').replace(/\\n$/, '').trim()];
    })
);
const z = new Zernio({ apiKey: env.ZERNIO_API_KEY });
const r = await z.posts.listPosts({ query: { limit: 3 } });
const posts = r.data?.posts || r.data || [];
console.log('Available post methods:', Object.keys(z.posts));
console.log('\nRecent posts:');
for (const p of posts) {
  console.log(`  ${p._id || p.id} | ${p.status} | ${(p.content||'').slice(0,50).replace(/\n/g,' ')}`);
}
