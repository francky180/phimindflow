// Posts clips from a clip-report JSON to @purposespeak IG only.
// Usage: node scripts/post-to-purposespeak.mjs <reportPath> [--max=N] [--caption="..."] [--delay=60]
// Default caption: 🎬 (minimal, no PHIMINDFLOW branding conflict)

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

const PURPOSESPEAK_ID = '69e9528b7dea335c2b26e66a';

const argv = process.argv.slice(2);
const reportPath = argv.find((a) => !a.startsWith('--'));
if (!reportPath || !existsSync(reportPath)) { console.error('Pass a valid clip-report JSON path'); process.exit(1); }

const maxFlag = argv.find((a) => a.startsWith('--max='));
const MAX = maxFlag ? parseInt(maxFlag.split('=')[1], 10) : Infinity;
const capFlag = argv.find((a) => a.startsWith('--caption='));
const CAPTION = capFlag ? capFlag.split('=').slice(1).join('=') : '🎬';
const delayFlag = argv.find((a) => a.startsWith('--delay='));
const DELAY_SEC = delayFlag ? parseInt(delayFlag.split('=')[1], 10) : 60;

const report = JSON.parse(readFileSync(reportPath, 'utf8'));
const allShorts = (report.clips || []).flatMap((c) => c.shorts || []);
const targets = allShorts.slice(0, MAX);
if (targets.length === 0) { console.error('No clips found in report'); process.exit(1); }

const z = new Zernio({ apiKey: env.ZERNIO_API_KEY });
const accts = (await z.accounts.listAccounts()).data?.accounts || [];
const target = accts.find((a) => (a.id || a._id) === PURPOSESPEAK_ID);
if (!target) { console.error(`@purposespeak not found (id ${PURPOSESPEAK_ID})`); process.exit(1); }
console.log(`✅ target: ${target.platform} · @${target.username} · ${PURPOSESPEAK_ID}`);
console.log(`📤 posting ${targets.length} clip(s) with caption "${CAPTION}" · ${DELAY_SEC}s delay\n`);

if (!existsSync('out')) mkdirSync('out');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outPath = `out/purposespeak-report-${stamp}.json`;
const outReport = { startedAt: new Date().toISOString(), source: reportPath, accountId: PURPOSESPEAK_ID, caption: CAPTION, posts: [], errors: [] };
function flush() { writeFileSync(outPath, JSON.stringify(outReport, null, 2)); }

for (let i = 0; i < targets.length; i++) {
  const s = targets[i];
  console.log(`[${i + 1}/${targets.length}] "${s.title}"`);
  console.log(`   → ${s.video_url}`);
  try {
    const post = await z.posts.createPost({
      body: {
        content: CAPTION,
        platforms: [{ platform: 'instagram', accountId: PURPOSESPEAK_ID }],
        mediaItems: [{ type: 'video', url: s.video_url }],
        publishNow: true,
      },
    });
    const result = post.data?.post || post.data;
    const postId = result?._id || '(unknown)';
    console.log(`   ✅ zernio ${postId} · ${result?.status || '?'}`);
    for (const pp of (result?.platforms || [])) {
      console.log(`      ${pp.platform} · ${pp.status} · ${pp.platformPostUrl || pp.platformPostId || '(pending)'}`);
    }
    outReport.posts.push({ clipId: s.id, title: s.title, url: s.video_url, zernioPostId: postId, status: result?.status, platforms: result?.platforms });
  } catch (e) {
    console.error(`   ❌ ${e.statusCode || ''} ${e.message}`);
    outReport.errors.push({ clipId: s.id, title: s.title, error: e.message, statusCode: e.statusCode });
  }
  flush();
  if (i < targets.length - 1) {
    console.log(`   ⏸  waiting ${DELAY_SEC}s...\n`);
    await new Promise((r) => setTimeout(r, DELAY_SEC * 1000));
  }
}

outReport.finishedAt = new Date().toISOString();
flush();
console.log(`\n📋 report → ${outPath}`);
console.log(`✅ posted: ${outReport.posts.length}  ❌ errors: ${outReport.errors.length}`);
