// Posts clips from out/threads-window2-*.json to @fitflybusiness IG + YouTube AND @purposespeak IG.
// Different captions per audience; 2 createPost calls per clip (one per caption group) to stay quota-efficient.
// Usage: node scripts/post-threads-clips-everywhere.mjs <reportPath>

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
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

const argv = process.argv.slice(2);
const reportPath = argv.find((a) => !a.startsWith('--'));
if (!reportPath || !existsSync(reportPath)) { console.error('Pass a report path'); process.exit(1); }
const report = JSON.parse(readFileSync(reportPath, 'utf8'));
const shorts = report.shorts || [];
if (shorts.length === 0) { console.error('No shorts in report'); process.exit(1); }

const DELAY_SEC = 60;
const PURPOSESPEAK_ID = '69e9528b7dea335c2b26e66a';

const z = new Zernio({ apiKey: env.ZERNIO_API_KEY });
const accts = (await z.accounts.listAccounts()).data?.accounts || [];
const fbIg = accts.find((a) => a.platform === 'instagram' && a.username === 'fitflybusiness');
const fbYt = accts.find((a) => a.platform === 'youtube');
const ps    = accts.find((a) => (a.id || a._id) === PURPOSESPEAK_ID);
if (!fbIg) { console.error('fitflybusiness IG not found'); process.exit(1); }
if (!fbYt) { console.error('YouTube account not found'); process.exit(1); }
if (!ps)   { console.error('purposespeak not found'); process.exit(1); }

console.log(`targets: IG @fitflybusiness · YouTube · IG @purposespeak`);
console.log(`clips to post: ${shorts.length}\n`);

if (!existsSync('out')) mkdirSync('out');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outPath = `out/threads-clips-everywhere-${stamp}.json`;
const out = { startedAt: new Date().toISOString(), source: reportPath, posts: [], errors: [] };
function flush() { writeFileSync(outPath, JSON.stringify(out, null, 2)); }

for (let i = 0; i < shorts.length; i++) {
  const s = shorts[i];
  const fbCaption = `"${s.title}"\n\n📲 Free 7-day trade system → link in bio\n📈 phimindflow.com\n\n#fitflybusiness #entrepreneur #businessowner #wealthbuilding #grindset`;
  const psCaption = '🎬';

  console.log(`\n[${i + 1}/${shorts.length}] "${s.title}"  (score=${s.viral_score})`);
  console.log(`   → ${s.video_url}`);

  // Post 1: fitflybusiness IG + YouTube (shared PHIMINDFLOW caption)
  try {
    const p1 = await z.posts.createPost({
      body: {
        content: fbCaption,
        platforms: [
          { platform: 'instagram', accountId: fbIg.id || fbIg._id },
          { platform: 'youtube',   accountId: fbYt.id || fbYt._id },
        ],
        mediaItems: [{ type: 'video', url: s.video_url }],
        publishNow: true,
      },
    });
    const r1 = p1.data?.post || p1.data;
    console.log(`   ✅ fb+yt zernio ${r1?._id} · ${r1?.status}`);
    for (const pp of (r1?.platforms || [])) {
      console.log(`      ${pp.platform} · ${pp.status} · ${pp.platformPostUrl || pp.platformPostId || '(pending)'}`);
    }
    out.posts.push({ clipId: s.id, title: s.title, group: 'fb+yt', zernioPostId: r1?._id, status: r1?.status, platforms: r1?.platforms });
  } catch (e) {
    console.error(`   ❌ fb+yt ${e.statusCode || ''} ${e.message}`);
    out.errors.push({ clipId: s.id, group: 'fb+yt', error: e.message, statusCode: e.statusCode });
  }
  flush();

  console.log(`   ⏸  waiting ${DELAY_SEC}s before purposespeak...`);
  await new Promise((r) => setTimeout(r, DELAY_SEC * 1000));

  // Post 2: purposespeak IG (minimal caption)
  try {
    const p2 = await z.posts.createPost({
      body: {
        content: psCaption,
        platforms: [{ platform: 'instagram', accountId: PURPOSESPEAK_ID }],
        mediaItems: [{ type: 'video', url: s.video_url }],
        publishNow: true,
      },
    });
    const r2 = p2.data?.post || p2.data;
    console.log(`   ✅ purposespeak zernio ${r2?._id} · ${r2?.status}`);
    for (const pp of (r2?.platforms || [])) {
      console.log(`      ${pp.platform} · ${pp.status} · ${pp.platformPostUrl || pp.platformPostId || '(pending)'}`);
    }
    out.posts.push({ clipId: s.id, title: s.title, group: 'purposespeak', zernioPostId: r2?._id, status: r2?.status, platforms: r2?.platforms });
  } catch (e) {
    console.error(`   ❌ purposespeak ${e.statusCode || ''} ${e.message}`);
    out.errors.push({ clipId: s.id, group: 'purposespeak', error: e.message, statusCode: e.statusCode });
  }
  flush();

  if (i < shorts.length - 1) {
    console.log(`   ⏸  waiting ${DELAY_SEC}s before next clip...`);
    await new Promise((r) => setTimeout(r, DELAY_SEC * 1000));
  }
}

out.finishedAt = new Date().toISOString();
flush();
console.log(`\n📋 report → ${outPath}`);
console.log(`✅ posts: ${out.posts.length}  ❌ errors: ${out.errors.length}`);
