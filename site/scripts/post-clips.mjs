// Posts pre-existing Ssemble clips (from a clip-report JSON) to IG + Twitter via Zernio.
// Usage: node scripts/post-clips.mjs <reportPath> [--ids=id1,id2,...] [--ig-only] [--tw-only] [--delay=60]
//   --delay = seconds between posts (default 60s, lets algos breathe)

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
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

const ZERNIO_KEY = env.ZERNIO_API_KEY || process.env.ZERNIO_API_KEY;
if (!ZERNIO_KEY) { console.error('Missing ZERNIO_API_KEY'); process.exit(1); }

const argv = process.argv.slice(2);
const reportPath = argv.find((a) => !a.startsWith('--'));
if (!reportPath || !existsSync(reportPath)) { console.error('Pass a valid clip-report JSON path'); process.exit(1); }

const idsFlag = argv.find((a) => a.startsWith('--ids='));
const onlyIds = idsFlag ? idsFlag.split('=')[1].split(',').map((s) => s.trim()) : null;
const igOnly = argv.includes('--ig-only');
const twOnly = argv.includes('--tw-only');
const delayFlag = argv.find((a) => a.startsWith('--delay='));
const DELAY_SEC = delayFlag ? parseInt(delayFlag.split('=')[1], 10) : 60;

const report = JSON.parse(readFileSync(reportPath, 'utf8'));

const allShorts = [];
for (const c of report.clips || []) {
  for (const s of c.shorts || []) {
    allShorts.push({ ...s, sourceUrl: c.url });
  }
}

const targets = onlyIds
  ? allShorts.filter((s) => onlyIds.includes(s.id))
  : allShorts;

console.log(`\n📤 Posting ${targets.length} clip(s) | ig=${!twOnly} tw=${!igOnly} delay=${DELAY_SEC}s\n`);
if (targets.length === 0) { console.error('No clips matched --ids'); process.exit(1); }

const zernio = new Zernio({ apiKey: ZERNIO_KEY });
const accountsRes = await zernio.accounts.listAccounts();
const accounts = accountsRes.data?.accounts || [];
const ig = accounts.find((a) => a.platform === 'instagram');
const tw = accounts.find((a) => a.platform === 'twitter' || a.platform === 'x');
console.log('Accounts available:', accounts.map((a) => `${a.platform}(${a.username || a.id})`).join(', '));

function caption(short) {
  const hooks = {
    'Starting Over at 29': 'They told you 30 was over.',
    'Sleeping at 7PM for Family': 'Most won\'t do this.',
    'Beast Games Biggest Bribe Ever': 'Watch what $1M does to people.',
    'Build It Once, Destroy It': 'This is what billionaires do.',
    'Why ASMR Has No Words': 'Quiet money moves.',
    'YouTube to TV Empire': 'From bedroom to billion.',
  };
  const hook = hooks[short.title] || 'Watch this twice.';
  const cta = '\n\n📲 Free 7-day trade system → link in bio\n📈 phimindflow.com';
  const tags = '\n\n#fitflybusiness #moneymindset #entrepreneur #grindset #businessowner #wealthbuilding #fitnessmotivation #passiveincome #hustle #mindset';
  const ctx = short.title ? `\n\n"${short.title}"` : '';
  return `${hook}${ctx}${cta}${tags}`;
}

const platforms = [];
if (!twOnly && ig) platforms.push({ platform: 'instagram', accountId: ig.id || ig._id || ig.accountId });
if (!igOnly && tw) platforms.push({ platform: tw.platform, accountId: tw.id || tw._id || tw.accountId });
if (platforms.length === 0) { console.error('No platforms matched. Available:', accounts.map((a) => a.platform)); process.exit(1); }

if (!existsSync('out')) mkdirSync('out');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outPath = `out/post-report-${stamp}.json`;
const outReport = { startedAt: new Date().toISOString(), targets: targets.length, posts: [], errors: [] };
function flush() { writeFileSync(outPath, JSON.stringify(outReport, null, 2)); }

for (let i = 0; i < targets.length; i++) {
  const s = targets[i];
  const cap = caption(s);
  console.log(`\n[${i + 1}/${targets.length}] "${s.title}" (score=${s.viral_score})`);
  console.log(`   → video: ${s.video_url}`);
  try {
    const post = await zernio.posts.createPost({
      body: {
        content: cap,
        platforms,
        mediaItems: [{ type: 'video', url: s.video_url }],
        publishNow: true,
      },
    });
    const result = post.data || post.error;
    console.log('   ✅ posted:', JSON.stringify(result).slice(0, 250));
    outReport.posts.push({ clipId: s.id, title: s.title, viral_score: s.viral_score, video_url: s.video_url, caption: cap, result });
  } catch (e) {
    console.error('   ❌ error:', e.message);
    outReport.errors.push({ clipId: s.id, title: s.title, error: e.message });
  }
  flush();
  if (i < targets.length - 1 && DELAY_SEC > 0) {
    console.log(`   ⏸  waiting ${DELAY_SEC}s before next post...`);
    await new Promise((r) => setTimeout(r, DELAY_SEC * 1000));
  }
}

outReport.finishedAt = new Date().toISOString();
flush();
console.log(`\n📋 Post report → ${outPath}`);
console.log(`✅ Successful: ${outReport.posts.length}  ❌ Errors: ${outReport.errors.length}`);
