// Option 2 execution: force clip 2 onto Instagram.
// Flow: delete stuck Zernio post → download Ssemble MP4 → upload to Zernio storage → IG-only post.
// Runs with fresh Zernio-hosted media URL to bypass IG's internal dedupe on the Ssemble CDN URL.

import { readFileSync, writeFileSync, unlinkSync, existsSync, statSync } from 'node:fs';
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

const STUCK_POST_ID = '69e3a6e6618d5b22d51a90c2';
const SSEMBLE_URL = 'https://cf.ssemble.com/ssemble-shortsmaker-plugin/export/file_1776526967739_f4lb1e.mp4';
const LOCAL_PATH = 'out/clip2-eight-years.mp4';
const CAPTION = `Eight years of screens. One lesson.

"Eight Years to One Strategy"

You don't skip the reps. You compress them.

📲 Free 7-day trade system → link in bio
📈 phimindflow.com

#daytrading #forextrader #tradingmindset #wealthmindset #businessowner #financialfreedom #grindset #fitflybusiness`;

const z = new Zernio({ apiKey: env.ZERNIO_API_KEY });

// --- Step 1: Delete stuck post to cancel in-flight IG attempt ---
console.log('━━━ Step 1: cancel stuck Zernio post ' + STUCK_POST_ID + ' ━━━');
try {
  await z.posts.deletePost({ path: { postId: STUCK_POST_ID } });
  console.log('✅ stuck post cancelled (live TikTok/LinkedIn/YouTube on platforms are unaffected)');
} catch (e) {
  console.log(`⚠️  delete failed (${e.statusCode}): ${e.message} — continuing anyway`);
}

// --- Step 2: Download Ssemble MP4 locally ---
console.log('\n━━━ Step 2: download clip MP4 from Ssemble CDN ━━━');
const r = await fetch(SSEMBLE_URL);
if (!r.ok) throw new Error(`Ssemble CDN fetch ${r.status}`);
const buf = Buffer.from(await r.arrayBuffer());
writeFileSync(LOCAL_PATH, buf);
const size = statSync(LOCAL_PATH).size;
console.log(`✅ downloaded ${size.toLocaleString()} bytes → ${LOCAL_PATH}`);

// --- Step 3: Get Zernio presigned upload URL ---
console.log('\n━━━ Step 3: request Zernio presigned upload URL ━━━');
const presign = await z.media.getMediaPresignedUrl({
  body: {
    filename: 'eight-years-to-one-strategy.mp4',
    contentType: 'video/mp4',
    size,
  },
});
const { uploadUrl, publicUrl, key } = presign.data || {};
if (!uploadUrl || !publicUrl) throw new Error(`No presigned URL: ${JSON.stringify(presign)}`);
console.log(`✅ upload target: ${uploadUrl.slice(0, 80)}…`);
console.log(`   public URL:  ${publicUrl}`);
console.log(`   storage key: ${key}`);

// --- Step 4: PUT the file to the presigned URL ---
console.log('\n━━━ Step 4: upload MP4 to Zernio storage ━━━');
const putRes = await fetch(uploadUrl, {
  method: 'PUT',
  headers: { 'Content-Type': 'video/mp4' },
  body: buf,
});
if (!putRes.ok) throw new Error(`Upload PUT ${putRes.status}: ${await putRes.text()}`);
console.log(`✅ uploaded (${putRes.status})`);

// --- Step 5: Create IG-only post with Zernio-hosted URL ---
console.log('\n━━━ Step 5: create Instagram-only post ━━━');
const accts = (await z.accounts.listAccounts()).data?.accounts || [];
const ig = accts.find((a) => a.platform === 'instagram');
if (!ig) throw new Error('No Instagram account connected');

const post = await z.posts.createPost({
  body: {
    content: CAPTION,
    platforms: [{ platform: 'instagram', accountId: ig.id || ig._id }],
    mediaItems: [{ type: 'video', url: publicUrl, key }],
    publishNow: true,
  },
});
const postData = post.data?.post || post.data;
console.log(`\n✅ POST CREATED — Zernio post ID: ${postData?._id || '(unknown)'}`);
console.log(`   overall status: ${postData?.status || '(unknown)'}`);
for (const pp of (postData?.platforms || [])) {
  console.log(`   ${pp.platform} · ${pp.status} · ${pp.platformPostUrl || pp.platformPostId || '(pending)'}`);
}

// --- Step 6: Cleanup ---
try { unlinkSync(LOCAL_PATH); console.log(`\n🧹 cleaned up ${LOCAL_PATH}`); } catch {}
console.log('\n🎯 Done. Check IG status in 60s with: node scripts/_recent-posts.mjs');
