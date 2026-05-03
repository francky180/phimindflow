// Pull deep analytics for the latest N reels and rank by save rate.
// Save rate (saves / reach) is the strongest viral signal.
//
// Usage: node scripts/meta/insights.mjs [N]
//   N defaults to 10

import { loadEnv, metaGet, requireEnv, envOrProcess } from './_lib.mjs';

const env = loadEnv();
requireEnv(env, ['META_LONG_LIVED_TOKEN']);
const TOKEN = envOrProcess(env, 'META_LONG_LIVED_TOKEN');
const N = parseInt(process.argv[2], 10) || 10;

const REEL_METRICS = [
  'reach',
  'likes',
  'comments',
  'shares',
  'saved',
  'views',
  'total_interactions',
  'ig_reels_avg_watch_time',
  'ig_reels_video_view_total_time',
];

console.log(`Pulling insights for last ${N} reels...\n`);

const media = await metaGet('/me/media', {
  fields: 'id,media_type,caption,permalink,timestamp',
  limit: 50,
  access_token: TOKEN,
});

const reels = (media.data || [])
  .filter((m) => m.media_type === 'VIDEO' || m.media_type === 'REELS')
  .slice(0, N);

if (!reels.length) {
  console.log('No reels found in last 50 posts.');
  process.exit(0);
}

const rows = [];
for (const reel of reels) {
  try {
    const ins = await metaGet(`/${reel.id}/insights`, {
      metric: REEL_METRICS.join(','),
      access_token: TOKEN,
    });
    const m = {};
    for (const item of ins.data) m[item.name] = item.values?.[0]?.value ?? 0;

    const watchSec = (m.ig_reels_avg_watch_time || 0) / 1000;
    const saveRate = m.reach ? (m.saved / m.reach) * 100 : 0;
    const shareRate = m.reach ? (m.shares / m.reach) * 100 : 0;

    rows.push({
      id: reel.id,
      date: reel.timestamp?.slice(0, 10),
      caption: (reel.caption || '').slice(0, 50).replace(/\n/g, ' '),
      reach: m.reach || 0,
      views: m.views || 0,
      saves: m.saved || 0,
      shares: m.shares || 0,
      saveRate: saveRate.toFixed(2),
      shareRate: shareRate.toFixed(2),
      avgWatchSec: watchSec.toFixed(1),
      permalink: reel.permalink,
    });
  } catch (e) {
    console.log(`Skipping ${reel.id}: ${e.message}`);
  }
}

rows.sort((a, b) => parseFloat(b.saveRate) - parseFloat(a.saveRate));

console.log('Ranked by save rate (saves / reach, >2% = strong viral signal):\n');
console.log('Date       | Reach  | Views  | Saves | Save% | Share% | AvgWatch | Caption');
console.log('-'.repeat(110));
for (const r of rows) {
  console.log(
    `${r.date} | ${String(r.reach).padStart(6)} | ${String(r.views).padStart(6)} | ${String(r.saves).padStart(5)} | ${r.saveRate.padStart(5)}% | ${r.shareRate.padStart(5)}% | ${r.avgWatchSec.padStart(7)}s | ${r.caption}...`
  );
}

const top = rows[0];
console.log('\nTop performer:');
console.log(`   ${top.permalink}`);
console.log(`   Save rate: ${top.saveRate}%`);
console.log(`   Hook: ${top.caption}...`);
console.log('\nUse this hook style as a HeyReach Msg 1 variant for ASF.');
