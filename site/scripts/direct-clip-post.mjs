// Direct clip + post: yt-dlp download segment → ffmpeg to 9:16 → Zernio presign upload → post IG+Twitter
// Usage: node scripts/direct-clip-post.mjs <youtubeUrl> [--start=120] [--duration=50] [--ig-only] [--tw-only]
import { readFileSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
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

const ZERNIO_KEY = env.ZERNIO_API_KEY;
if (!ZERNIO_KEY) { console.error('Missing ZERNIO_API_KEY'); process.exit(1); }

const argv = process.argv.slice(2);
const url = argv.find((a) => a.startsWith('http'));
if (!url) { console.error('Pass a YouTube URL'); process.exit(1); }
const startArg = argv.find((a) => a.startsWith('--start='));
const durArg = argv.find((a) => a.startsWith('--duration='));
const START = startArg ? parseInt(startArg.split('=')[1], 10) : 180;
const DUR = durArg ? parseInt(durArg.split('=')[1], 10) : 55;
const igOnly = argv.includes('--ig-only');
const twOnly = argv.includes('--tw-only');

if (!existsSync('out')) mkdirSync('out');
const stamp = Date.now();
const raw = `out/raw-${stamp}.mp4`;
const final = `out/clip-${stamp}.mp4`;

console.log(`\n📥 yt-dlp: fetching ${DUR}s starting at ${START}s from ${url}`);
const end = START + DUR;
const hmsStart = new Date(START * 1000).toISOString().substr(11, 8);
const hmsEnd = new Date(end * 1000).toISOString().substr(11, 8);
execSync(
  `yt-dlp -f "bv*[height<=1080]+ba/b[height<=1080]" --download-sections "*${hmsStart}-${hmsEnd}" --force-keyframes-at-cuts -o "${raw}" "${url}"`,
  { stdio: 'inherit' }
);

console.log(`\n🎬 ffmpeg: converting to 9:16 1080x1920 H.264/AAC...`);
execSync(
  `ffmpeg -y -i "${raw}" -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1" -c:v libx264 -preset veryfast -crf 22 -c:a aac -b:a 128k -movflags +faststart -pix_fmt yuv420p "${final}"`,
  { stdio: 'inherit' }
);

const size = statSync(final).size;
console.log(`\n✅ Clip ready: ${final} (${(size / 1024 / 1024).toFixed(2)} MB)`);

const zernio = new Zernio({ apiKey: ZERNIO_KEY });
const accounts = (await zernio.accounts.listAccounts()).data?.accounts || [];
const ig = accounts.find((a) => a.platform === 'instagram');
const tw = accounts.find((a) => a.platform === 'twitter' || a.platform === 'x');
console.log(`Accounts: ${accounts.map((a) => a.platform).join(', ')}`);

console.log(`\n📤 Presigning upload...`);
const presign = await zernio.media.getMediaPresignedUrl({
  body: { filename: `clip-${stamp}.mp4`, contentType: 'video/mp4', size },
});
const { uploadUrl, publicUrl } = presign.data;
console.log(`   upload URL ready`);

const bytes = readFileSync(final);
const put = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': 'video/mp4' }, body: bytes });
if (!put.ok) { console.error('Upload failed:', await put.text()); process.exit(1); }
console.log(`   upload ${put.status} OK → ${publicUrl}`);

const caption = `They told you to grind harder.\n\nWatch this twice. It'll click.\n\n📲 Free 7-day trade system → link in bio\n📈 phimindflow.com\n\n#fitflybusiness #moneymindset #entrepreneur #businessowner #wealthbuilding #grindset #passiveincome`;

const platforms = [];
if (!twOnly && ig) platforms.push({ platform: 'instagram', accountId: ig.id || ig._id || ig.accountId });
if (!igOnly && tw) platforms.push({ platform: tw.platform, accountId: tw.id || tw._id || tw.accountId });

console.log(`\n🚀 Posting to: ${platforms.map((p) => p.platform).join(' + ')}`);
const post = await zernio.posts.createPost({
  body: { content: caption, platforms, mediaItems: [{ type: 'video', url: publicUrl }], publishNow: true },
});
console.log('\nPOST RESULT:', JSON.stringify(post.data || post.error, null, 2));
