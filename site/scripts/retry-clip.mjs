// Retry specific clips from an Ssemble requestId with custom captions
// Usage: node scripts/retry-clip.mjs <requestId> <clipIndex> "<caption>" [--ig-only|--tw-only]
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

const SSEMBLE_KEY = env.SSEMBLE_API_KEY;
const ZERNIO_KEY = env.ZERNIO_API_KEY;

const [reqId, idxStr, caption, ...flags] = process.argv.slice(2);
if (!reqId || idxStr === undefined || !caption) {
  console.error('Usage: node scripts/retry-clip.mjs <requestId> <clipIndex> "<caption>" [--ig-only|--tw-only]');
  process.exit(1);
}
const idx = parseInt(idxStr, 10);
const igOnly = flags.includes('--ig-only');
const twOnly = flags.includes('--tw-only');

const res = await fetch(`https://aiclipping.ssemble.com/api/v1/shorts/${reqId}`, {
  headers: { 'X-API-Key': SSEMBLE_KEY },
});
const data = (await res.json()).data;
const shorts = data.shorts || [];
const short = shorts[idx];
if (!short) { console.error(`No clip at index ${idx}. Total: ${shorts.length}`); process.exit(1); }
const videoUrl = short.video_url || short.videoUrl || short.url;
console.log(`Clip: "${short.title}"\nURL: ${videoUrl}`);

const zernio = new Zernio({ apiKey: ZERNIO_KEY });
const accounts = (await zernio.accounts.listAccounts()).data?.accounts || [];
const ig = accounts.find((a) => a.platform === 'instagram');
const tw = accounts.find((a) => a.platform === 'twitter' || a.platform === 'x');
const platforms = [];
if (!twOnly && ig) platforms.push({ platform: 'instagram', accountId: ig.id || ig._id || ig.accountId });
if (!igOnly && tw) platforms.push({ platform: tw.platform, accountId: tw.id || tw._id || tw.accountId });

console.log(`\nPosting to: ${platforms.map((p) => p.platform).join(' + ')}`);
const post = await zernio.posts.createPost({
  body: { content: caption, platforms, mediaItems: [{ type: 'video', url: videoUrl }], publishNow: true },
});
console.log('\nRESULT:', JSON.stringify(post.data || post.error, null, 2));
