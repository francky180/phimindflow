import { readFileSync } from 'node:fs';
import Zernio from '@zernio/node';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim().replace(/^"|"$/g, '').replace(/\\n$/, '').trim()];
    })
);

const z = new Zernio({ apiKey: env.ZERNIO_API_KEY });
const r = await z.accounts.listAccounts();
const accounts = r.data?.accounts || [];
console.log('Connected accounts:');
for (const a of accounts) {
  console.log(`  ${a.platform.padEnd(12)} → ${a.username || a.id} (${a.id || a._id})`);
}
const hasTikTok = accounts.some((a) => a.platform === 'tiktok');
console.log(`\nTikTok connected via Zernio: ${hasTikTok ? 'YES' : 'NO'}`);
