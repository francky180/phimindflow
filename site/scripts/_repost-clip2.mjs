// One-shot repost for clip 2 ("Eight Years to One Strategy")
// Original post was dedupe-blocked because the random hook collided with clip 1.
// This posts ONLY clip 2, with a fresh caption, to IG + TikTok + LinkedIn + YouTube.

import { readFileSync } from 'node:fs';
import Zernio from '@zernio/node';

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

const VIDEO_URL = 'https://cf.ssemble.com/ssemble-shortsmaker-plugin/export/file_1776526967739_f4lb1e.mp4';
const CAPTION = `Eight years of screens. One strategy that works.

"Eight Years to One Strategy"

The shortcut doesn't exist — but the system does.

📲 Free 7-day trade system → link in bio
📈 phimindflow.com

#fitflybusiness #traderslife #daytrader #forextrader #moneymindset #wealthmindset #businessgrowth #financialfreedom`;

const z = new Zernio({ apiKey: env.ZERNIO_API_KEY });
const accts = (await z.accounts.listAccounts()).data?.accounts || [];
const find = (p) => accts.find((a) => a.platform === p);

const platforms = [];
for (const p of ['instagram', 'tiktok', 'linkedin', 'youtube']) {
  const a = find(p);
  if (!a) { console.log(`⚠️  no ${p} account`); continue; }
  platforms.push({ platform: a.platform, accountId: a.id || a._id });
}

console.log(`📤 Posting clip 2 "Eight Years to One Strategy" to ${platforms.length} platforms…`);
console.log(`   targets: ${platforms.map((p) => p.platform).join(' · ')}`);

try {
  const r = await z.posts.createPost({
    body: {
      content: CAPTION,
      platforms,
      mediaItems: [{ type: 'video', url: VIDEO_URL }],
      publishNow: true,
    },
  });
  const post = r.data?.post || r.data;
  console.log(`\n✅ Posted! Post ID: ${post?._id || '(unknown)'}`);
  if (post?.platforms) {
    for (const pp of post.platforms) {
      console.log(`   ${pp.platform.padEnd(10)} · ${pp.status} · ${pp.platformPostUrl || pp.platformPostId || '(pending)'}`);
    }
  }
} catch (e) {
  console.error('\n❌ FAILED:', e.message, e.statusCode ? `(HTTP ${e.statusCode})` : '');
  if (e.details) console.error('   details:', JSON.stringify(e.details));
  process.exit(1);
}
