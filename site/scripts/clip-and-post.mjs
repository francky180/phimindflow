// Pipeline: YouTube URL(s) -> Ssemble clips -> Zernio posts to IG + Twitter
// Usage: node scripts/clip-and-post.mjs "https://youtu.be/ABC" "https://youtu.be/XYZ"
// Optional flags: --no-post (just clip), --ig-only, --tw-only, --max=2 (max clips per video)

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import Zernio from '@zernio/node';
import { notify, GREEN, RED } from './discord-notify.mjs';

// ---- env loader ----
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
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), cleanEnvValue(l.slice(idx + 1))];
    })
);

const SSEMBLE_KEY = env.SSEMBLE_API_KEY || process.env.SSEMBLE_API_KEY;
const ZERNIO_KEY = env.ZERNIO_API_KEY || process.env.ZERNIO_API_KEY;
if (!SSEMBLE_KEY) { console.error('Missing SSEMBLE_API_KEY'); process.exit(1); }
if (!ZERNIO_KEY)  { console.error('Missing ZERNIO_API_KEY');  process.exit(1); }

const SSEMBLE = 'https://aiclipping.ssemble.com/api/v1';

// ---- args ----
const argv = process.argv.slice(2);
const urls = argv.filter((a) => a.startsWith('http'));
const noPost = argv.includes('--no-post');
const igOnly = argv.includes('--ig-only');
const twOnly = argv.includes('--tw-only');
const maxArg = argv.find((a) => a.startsWith('--max='));
const MAX_CLIPS = maxArg ? parseInt(maxArg.split('=')[1], 10) : 3;

if (urls.length === 0) {
  console.error('Pass at least one YouTube URL.');
  process.exit(1);
}

// ---- output dir ----
if (!existsSync('out')) mkdirSync('out');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const reportPath = `out/clip-report-${stamp}.json`;
const report = { startedAt: new Date().toISOString(), urls, clips: [], posts: [], errors: [] };

function writeReport() { writeFileSync(reportPath, JSON.stringify(report, null, 2)); }

// ---- Ssemble client ----
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

async function getDurationSec(youtubeUrl) {
  const { execSync } = await import('node:child_process');
  try {
    const out = execSync(`yt-dlp --print "%(duration)s" "${youtubeUrl}"`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    const n = parseInt(out.trim(), 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch { return null; }
}

async function createClip(url) {
  const dur = (await getDurationSec(url)) ?? 1800;
  // Ssemble allows max 1200s window. For long videos, skip 5-min intro, take the next 20 min of meat.
  const WINDOW = 1200;
  const start = dur > WINDOW + 300 ? 300 : 0;
  const end = Math.min(dur, start + WINDOW);
  console.log(`   detected duration: ${dur}s, scanning ${start}–${end}s (${(end-start)}s window)`);
  const res = await ssemble('/shorts/create', {
    method: 'POST',
    body: JSON.stringify({ url, start, end, preferredLength: 'under60sec', language: 'en' }),
  });
  const id = res?.data?.requestId || res?.data?.id || res?.requestId || res?.id;
  if (!id) throw new Error(`No requestId: ${JSON.stringify(res)}`);
  return { id, raw: res };
}

async function getStatus(id) {
  const res = await ssemble(`/shorts/${id}/status`);
  return res?.data || res;
}

async function getResult(id) {
  const res = await ssemble(`/shorts/${id}`);
  return res?.data || res;
}

async function poll(id, label) {
  const start = Date.now();
  const TIMEOUT = 45 * 60 * 1000;
  let lastLog = '';
  while (Date.now() - start < TIMEOUT) {
    const s = await getStatus(id);
    const line = `[${label}] status=${s.status} progress=${s.progress ?? '?'}`;
    if (line !== lastLog) { console.log(line); lastLog = line; }
    if (s.status === 'completed') return getResult(id);
    if (s.status === 'failed' || s.status === 'error') throw new Error(`Failed: ${JSON.stringify(s)}`);
    await new Promise((r) => setTimeout(r, 15000));
  }
  throw new Error(`Timeout for ${id}`);
}

// ---- Zernio client + posting ----
const zernio = new Zernio({ apiKey: ZERNIO_KEY });

let cachedAccounts = null;
async function getAccounts() {
  if (cachedAccounts) return cachedAccounts;
  const r = await zernio.accounts.listAccounts();
  cachedAccounts = r.data?.accounts || [];
  return cachedAccounts;
}

async function postToZernio({ caption, videoUrl }) {
  const accounts = await getAccounts();
  const find = (p) => accounts.find((a) => a.platform === p || (p === 'twitter' && a.platform === 'x'));
  const accId = (a) => a.id || a._id || a.accountId;
  const onlyFlags = ['--ig-only', '--tw-only', '--tt-only', '--li-only', '--dc-only', '--yt-only'].filter((f) => argv.includes(f));
  const isolated = onlyFlags.length > 0;
  const want = (flag, defaultOn) => isolated ? argv.includes(flag) : defaultOn;
  // Defaults: IG + TikTok only. Twitter/Discord/LinkedIn/YouTube all opt-in.
  const pick = {
    instagram: want('--ig-only', true),
    twitter: want('--tw-only', false) || (!isolated && argv.includes('--tw')),
    tiktok: want('--tt-only', true),
    discord: want('--dc-only', false) || (!isolated && argv.includes('--dc')),
    linkedin: want('--li-only', false) || (!isolated && argv.includes('--li')),
    youtube: want('--yt-only', false) || (!isolated && argv.includes('--yt')),
  };
  const platforms = [];
  for (const [p, on] of Object.entries(pick)) {
    if (!on) continue;
    const a = find(p);
    if (a) platforms.push({ platform: a.platform, accountId: accId(a) });
  }
  if (platforms.length === 0) throw new Error(`No matching accounts. Have: ${accounts.map((a) => a.platform).join(',')}`);

  const post = await zernio.posts.createPost({
    body: {
      content: caption,
      platforms,
      mediaItems: [{ type: 'video', url: videoUrl }],
      publishNow: true,
    },
  });
  return post.data || post.error;
}

// ---- caption generator (Hormozi/funny + funnel) ----
function genCaption(short, sourceUrl) {
  const hooks = [
    'They told you to grind harder.',
    'Watch this twice. It\'ll click.',
    'Most of you scrolled past the lesson.',
    'This is why broke stays broke.',
    '90% will miss the point.',
    'POV: you finally got it.',
  ];
  const cta = '\n\n📲 Free 7-day trade system → link in bio\n📈 phimindflow.com';
  const tags = '\n\n#fitflybusiness #moneymindset #entrepreneur #fitnessmotivation #businessowner #wealthbuilding #grindset #passiveincome';
  const hook = hooks[Math.floor(Math.random() * hooks.length)];
  const title = short.title ? `\n\n"${short.title.trim()}"` : '';
  return `${hook}${title}${cta}${tags}`;
}

// ---- main ----
console.log(`\n🎬 Pipeline starting on ${urls.length} video(s). MAX_CLIPS=${MAX_CLIPS} no-post=${noPost} ig-only=${igOnly} tw-only=${twOnly}\n`);

const jobs = [];
for (const url of urls) {
  try {
    console.log(`📥 Creating Ssemble job: ${url}`);
    const { id, raw } = await createClip(url);
    console.log(`   → requestId: ${id}`);
    jobs.push({ url, id, raw });
    report.clips.push({ url, requestId: id, status: 'queued' });
    writeReport();
  } catch (e) {
    console.error(`❌ Failed to create job for ${url}:`, e.message);
    report.errors.push({ stage: 'create', url, error: e.message });
    writeReport();
  }
}

if (jobs.length === 0) {
  console.error('No jobs created. Exiting.');
  process.exit(1);
}

console.log(`\n⏳ Polling ${jobs.length} job(s) in parallel — typically 5–15 min each...\n`);

const results = await Promise.allSettled(
  jobs.map((j) => poll(j.id, j.url.slice(-12)).then((r) => ({ ...j, result: r })))
);

for (const r of results) {
  if (r.status === 'rejected') {
    console.error('❌ Job failed:', r.reason?.message || r.reason);
    report.errors.push({ stage: 'poll', error: String(r.reason?.message || r.reason) });
    continue;
  }
  const { url, id, result } = r.value;
  const shorts = (result.shorts || []).slice(0, MAX_CLIPS);
  console.log(`\n✅ ${url} → ${shorts.length} clip(s)`);
  const idx = report.clips.findIndex((c) => c.requestId === id);
  if (idx >= 0) report.clips[idx] = { ...report.clips[idx], status: 'completed', shorts };
  writeReport();

  if (noPost) continue;

  for (const short of shorts) {
    const videoUrl = short.video_url || short.videoUrl || short.url;
    if (!videoUrl) { console.warn('Skipping clip with no video_url:', short.id); continue; }
    const caption = genCaption(short, url);
    try {
      console.log(`📤 Posting clip "${(short.title || short.id).slice(0, 50)}"...`);
      const postResult = await postToZernio({ caption, videoUrl });
      console.log('   → posted');
      report.posts.push({ source: url, clipId: short.id, videoUrl, caption, result: postResult });
      writeReport();
    } catch (e) {
      console.error('   ❌ Post failed:', e.message);
      report.errors.push({ stage: 'post', clipId: short.id, error: e.message });
      writeReport();
    }
  }
}

report.finishedAt = new Date().toISOString();
writeReport();

console.log(`\n📋 Full report → ${reportPath}`);
const totalClips = report.clips.reduce((n, c) => n + (c.shorts?.length || 0), 0);
console.log(`\n🎯 Summary:`);
console.log(`   Videos processed: ${urls.length}`);
console.log(`   Clips created:    ${totalClips}`);
console.log(`   Posts published:  ${report.posts.length}`);
console.log(`   Errors:           ${report.errors.length}`);

// Discord alert
const clipTitles = report.clips
  .flatMap((c) => (c.shorts || []).map((s) => `• ${s.title || s.id}`))
  .slice(0, 10)
  .join('\n') || 'none';
await notify({
  title: report.errors.length === 0 ? '🎬 Clip pipeline complete' : '⚠️ Clip pipeline finished with errors',
  description: urls.map((u) => `[${u.slice(-15)}](${u})`).join(' · '),
  color: report.errors.length === 0 ? GREEN : RED,
  fields: [
    { name: 'Clips', value: String(totalClips), inline: true },
    { name: 'Posts', value: String(report.posts.length), inline: true },
    { name: 'Errors', value: String(report.errors.length), inline: true },
    { name: 'Titles', value: clipTitles.slice(0, 1000), inline: false },
  ],
});
