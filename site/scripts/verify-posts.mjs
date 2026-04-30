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
const r = await z.posts.listPosts({ query: { limit: 10 } });
const posts = r.data?.posts || r.data || [];
console.log(`Total returned: ${posts.length}\n`);
for (const p of posts.slice(0, 10)) {
  const plats = (p.platforms || []).map((pl) => `${pl.platform}:${pl.status || '?'}`).join(', ');
  const when = p.publishedAt || p.createdAt || p.scheduledAt || '';
  const preview = (p.content || '').replace(/\n/g, ' ').slice(0, 70);
  console.log(`[${p.status || '?'}] ${plats} | ${when}`);
  console.log(`  "${preview}..."\n`);
}
