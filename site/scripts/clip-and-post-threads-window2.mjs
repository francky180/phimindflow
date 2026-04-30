// One-off: re-scan window 1500–2700s of YouTube 6qIpmHfE-TI → 2 new clips → Threads @fitflybusiness only.

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

const SSEMBLE_KEY = env.SSEMBLE_API_KEY;
const ZERNIO_KEY  = env.ZERNIO_API_KEY;
const SSEMBLE = 'https://aiclipping.ssemble.com/api/v1';

const SOURCE_URL  = 'https://www.youtube.com/watch?v=6qIpmHfE-TI';
const SCAN_START  = 1500;
const SCAN_END    = 2700;
const MAX_CLIPS   = 2;
const THREADS_ID  = '69e96bc27dea335c2b277a6f';
const DELAY_SEC   = 60;

async function ssemble(path, init = {}) {
  const res = await fetch(`${SSEMBLE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', 'X-API-Key': SSEMBLE_KEY, ...(init.headers || {}) },
  });
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch { json = text; }
  if (!res.ok) throw new Error(`Ssemble ${path} ${res.status}: ${typeof json === 'string' ? json : JSON.stringify(json)}`);
  return json;
}

console.log(`🎬 Scanning ${SOURCE_URL} on window ${SCAN_START}–${SCAN_END}s (${SCAN_END-SCAN_START}s)`);
const createRes = await ssemble('/shorts/create', {
  method: 'POST',
  body: JSON.stringify({ url: SOURCE_URL, start: SCAN_START, end: SCAN_END, preferredLength: 'under60sec', language: 'en' }),
});
const requestId = createRes?.data?.requestId || createRes?.data?.id || createRes?.requestId || createRes?.id;
if (!requestId) throw new Error(`No requestId: ${JSON.stringify(createRes)}`);
console.log(`   requestId: ${requestId}`);

const TIMEOUT = 45 * 60 * 1000;
const startTs = Date.now();
let lastLog = '';
let resultData;
while (Date.now() - startTs < TIMEOUT) {
  const sres = await ssemble(`/shorts/${requestId}/status`);
  const s = sres?.data || sres;
  const line = `[window2] status=${s.status} progress=${s.progress ?? '?'}`;
  if (line !== lastLog) { console.log(line); lastLog = line; }
  if (s.status === 'completed') { resultData = (await ssemble(`/shorts/${requestId}`))?.data; break; }
  if (s.status === 'failed' || s.status === 'error') throw new Error(`Ssemble failed: ${JSON.stringify(s)}`);
  await new Promise((r) => setTimeout(r, 15000));
}
if (!resultData) throw new Error('Ssemble timed out');

const shorts = (resultData.shorts || []).slice(0, MAX_CLIPS);
console.log(`\n✅ ${shorts.length} clip(s) rendered`);
shorts.forEach((s, i) => console.log(`  [${i+1}] "${s.title}" score=${s.viral_score}`));

if (shorts.length === 0) { console.error('No shorts returned'); process.exit(1); }

if (!existsSync('out')) mkdirSync('out');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const reportPath = `out/threads-window2-${stamp}.json`;
const report = { startedAt: new Date().toISOString(), source: SOURCE_URL, window: [SCAN_START, SCAN_END], requestId, shorts, posts: [], errors: [] };
function flush() { writeFileSync(reportPath, JSON.stringify(report, null, 2)); }
flush();

const z = new Zernio({ apiKey: ZERNIO_KEY });

for (let i = 0; i < shorts.length; i++) {
  const s = shorts[i];
  const caption = `"${s.title}"\n\n📲 Free 7-day trade system → link in bio\n📈 phimindflow.com`;
  console.log(`\n[${i + 1}/${shorts.length}] posting "${s.title}" to Threads`);
  console.log(`   → ${s.video_url}`);
  try {
    const post = await z.posts.createPost({
      body: {
        content: caption,
        platforms: [{ platform: 'threads', accountId: THREADS_ID }],
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
    report.posts.push({ clipId: s.id, title: s.title, url: s.video_url, zernioPostId: postId, status: result?.status, platforms: result?.platforms });
  } catch (e) {
    console.error(`   ❌ ${e.statusCode || ''} ${e.message}`);
    report.errors.push({ clipId: s.id, title: s.title, error: e.message, statusCode: e.statusCode });
  }
  flush();
  if (i < shorts.length - 1) {
    console.log(`   ⏸  waiting ${DELAY_SEC}s...`);
    await new Promise((r) => setTimeout(r, DELAY_SEC * 1000));
  }
}

report.finishedAt = new Date().toISOString();
flush();
console.log(`\n📋 report → ${reportPath}`);
console.log(`✅ posted: ${report.posts.length}  ❌ errors: ${report.errors.length}`);
