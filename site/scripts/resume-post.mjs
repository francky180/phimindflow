// Resume an in-flight Ssemble job → post clips via Zernio
// Usage: node scripts/resume-post.mjs <requestId> [--max=3] [--ig-only] [--tw-only]
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
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
const SSEMBLE = 'https://aiclipping.ssemble.com/api/v1';

const argv = process.argv.slice(2);
const id = argv.find((a) => !a.startsWith('--'));
if (!id) { console.error('Pass requestId'); process.exit(1); }
const maxArg = argv.find((a) => a.startsWith('--max='));
const MAX = maxArg ? parseInt(maxArg.split('=')[1], 10) : 3;

async function ssemble(path) {
  const r = await fetch(`${SSEMBLE}${path}`, { headers: { 'X-API-Key': SSEMBLE_KEY } });
  const t = await r.text();
  let j; try { j = JSON.parse(t); } catch { j = t; }
  if (!r.ok) throw new Error(`${path} ${r.status}: ${t}`);
  return j;
}

if (!existsSync('out')) mkdirSync('out');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const reportPath = `out/resume-${id}-${stamp}.json`;
const report = { requestId: id, startedAt: new Date().toISOString(), posts: [], errors: [] };
const save = () => writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log(`\n⏳ Resuming poll for ${id}...\n`);
const t0 = Date.now();
const TIMEOUT = 45 * 60 * 1000;
let last = '';
let result;
while (true) {
  const s = (await ssemble(`/shorts/${id}/status`)).data;
  const line = `status=${s.status} step=${s.step || '?'} progress=${s.progress ?? '?'}`;
  if (line !== last) { console.log(line); last = line; }
  if (s.status === 'completed') { result = (await ssemble(`/shorts/${id}`)).data; break; }
  if (s.status === 'failed' || s.status === 'error') throw new Error(`Failed: ${JSON.stringify(s)}`);
  if (Date.now() - t0 > TIMEOUT) throw new Error('Timeout');
  await new Promise((r) => setTimeout(r, 20000));
}

const shorts = (result.shorts || []).slice(0, MAX);
console.log(`\n✅ ${shorts.length} clip(s) ready`);
report.shorts = shorts;
save();

const zernio = new Zernio({ apiKey: ZERNIO_KEY });
const accounts = (await zernio.accounts.listAccounts()).data?.accounts || [];
const find = (p) => accounts.find((a) => a.platform === p || (p === 'twitter' && a.platform === 'x'));
const accId = (a) => a.id || a._id || a.accountId;
const onlyFlags = ['--ig-only', '--tw-only', '--tt-only', '--li-only', '--dc-only'].filter((f) => argv.includes(f));
const isolated = onlyFlags.length > 0;
const want = (flag, defaultOn) => isolated ? argv.includes(flag) : defaultOn;
const pick = {
  instagram: want('--ig-only', true),
  twitter: want('--tw-only', false) || (!isolated && argv.includes('--tw')),
  tiktok: want('--tt-only', true),
  discord: want('--dc-only', false) || (!isolated && argv.includes('--dc')),
  linkedin: want('--li-only', false) || (!isolated && argv.includes('--li')),
};

const hooks = [
  'They told you to grind harder.',
  "Watch this twice. It'll click.",
  'Most of you scrolled past the lesson.',
  'This is why broke stays broke.',
  '90% will miss the point.',
  'POV: you finally got it.',
];
const cta = '\n\n📲 Free 7-day trade system → link in bio\n📈 phimindflow.com';
const tags = '\n\n#fitflybusiness #moneymindset #entrepreneur #fitnessmotivation #businessowner #wealthbuilding #grindset #passiveincome';

for (const short of shorts) {
  const videoUrl = short.video_url || short.videoUrl || short.url;
  if (!videoUrl) { console.warn('Skip (no url):', short.id); continue; }
  const hook = hooks[Math.floor(Math.random() * hooks.length)];
  const title = short.title ? `\n\n"${short.title.trim()}"` : '';
  const caption = `${hook}${title}${cta}${tags}`;
  const platforms = [];
  for (const [p, on] of Object.entries(pick)) {
    if (!on) continue;
    const a = find(p);
    if (a) platforms.push({ platform: a.platform, accountId: accId(a) });
  }
  try {
    console.log(`📤 Posting "${(short.title || short.id).slice(0, 50)}" → ${platforms.map(p => p.platform).join('+')}`);
    const p = await zernio.posts.createPost({ body: { content: caption, platforms, mediaItems: [{ type: 'video', url: videoUrl }], publishNow: true } });
    report.posts.push({ clipId: short.id, videoUrl, caption, result: p.data || p.error });
    console.log('   → posted');
    save();
  } catch (e) {
    console.error('   ❌', e.message);
    report.errors.push({ clipId: short.id, error: e.message });
    save();
  }
}

report.finishedAt = new Date().toISOString();
save();
console.log(`\n📋 ${reportPath}`);
console.log(`   Clips: ${shorts.length} | Posts: ${report.posts.length} | Errors: ${report.errors.length}`);
