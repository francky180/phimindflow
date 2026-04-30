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

const id = process.argv[2];
if (!id) { console.error('usage: node _check-post.mjs <postId>'); process.exit(1); }

const z = new Zernio({ apiKey: env.ZERNIO_API_KEY });
try {
  const r = await z.posts.getPost({ path: { id } });
  const p = r.data?.post || r.data;
  console.log('Status:', p?.status);
  console.log('Created:', p?.createdAt);
  console.log('Scheduled for:', p?.scheduledFor);
  console.log('Content snippet:', (p?.content || '').slice(0, 120));
  console.log('\nPlatforms:');
  for (const pp of (p?.platforms || [])) {
    console.log(`  ${pp.platform.padEnd(10)} · ${pp.status.padEnd(12)} · ${pp.platformPostUrl || pp.platformPostId || '(none yet)'}`);
  }
} catch (e) {
  console.error('ERROR:', e.message, e.statusCode ? `(${e.statusCode})` : '');
}
