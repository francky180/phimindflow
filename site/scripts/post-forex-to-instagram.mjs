import Zernio from '@zernio/node';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const zernio = new Zernio();

const ASSET_DIR = 'C:/Users/franc/Downloads/forex-highs-lows/out';
const SLIDES = [
  '01-hook.png',
  '02-high-low.png',
  '03-uptrend.png',
  '04-downtrend.png',
  '05-cta.png',
];
const REEL = 'reel.mp4';

const CAROUSEL_CAPTION = `How price actually moves — market structure 101 📈

The one concept every trader should understand before touching a chart:

• HIGH = a peak before price turns down
• LOW = a valley before price turns up
• Uptrend = Higher High + Higher Low (HH + HL)
• Downtrend = Lower High + Lower Low (LH + LL)

Break the structure — the trend breaks.
Hold the structure — the trend continues.

Save this for later. Share it with a trader who needs it.
Follow @fitflybusiness for daily setups.

#forex #trading #priceaction #marketstructure #daytrading #forextrader #trendtrading #smartmoney #technicalanalysis #tradingeducation`;

const REEL_CAPTION = `Market structure in 15 seconds 🎯

Higher High + Higher Low = UPTREND
Lower High + Lower Low = DOWNTREND

That's 90% of chart reading right there.
Follow @fitflybusiness — daily setups, zero fluff.

#forex #priceaction #tradingreels #marketstructure #daytrading`;

// ---------- helpers ----------
const logStep = (s) => console.log(`\n▶ ${s}`);

async function uploadFile(absPath, mime) {
  const buf = await readFile(absPath);
  const filename = path.basename(absPath);

  // Step 1 — get presigned URL
  const presign = await zernio.media.getMediaPresignedUrl({
    body: { filename, contentType: mime, size: buf.length },
  });
  const payload = presign?.data ?? presign;
  const uploadUrl = payload?.uploadUrl;
  const publicUrl = payload?.publicUrl;
  if (!uploadUrl || !publicUrl) {
    console.error('presign response:', JSON.stringify(presign, null, 2).slice(0, 1500));
    throw new Error(`No presigned URL returned for ${filename}`);
  }

  // Step 2 — PUT bytes to presigned URL
  const putRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': mime },
    body: buf,
  });
  if (!putRes.ok) {
    const t = await putRes.text().catch(() => '');
    throw new Error(`PUT failed ${putRes.status} for ${filename}: ${t.slice(0, 300)}`);
  }
  console.log(`  uploaded ${filename} → ${publicUrl}`);
  return publicUrl;
}

async function findInstagramAccountId() {
  const res = await zernio.accounts.listAccounts({ query: { platform: 'instagram' } });
  // hey-api response shape: { data: { accounts: [...] }, error, response }
  const accounts =
    res?.data?.accounts ??
    res?.accounts ??
    (Array.isArray(res?.data) ? res.data : []) ??
    [];
  if (!accounts.length) {
    console.error('raw response keys:', Object.keys(res ?? {}));
    console.error('raw response:', JSON.stringify(res, null, 2).slice(0, 2000));
    throw new Error('No Instagram accounts returned from Zernio');
  }
  console.log(`  found ${accounts.length} IG account(s):`);
  accounts.forEach((a) =>
    console.log(`    - ${a.username ?? a.handle ?? a.name ?? '?'}  id=${a.id ?? a.accountId ?? a._id}`)
  );
  const ig =
    accounts.find((a) =>
      (a.username ?? a.handle ?? a.name ?? '').toLowerCase().includes('fitfly')
    ) ?? accounts[0];
  const id = ig.id ?? ig.accountId ?? ig._id;
  console.log(`  using: ${ig.username ?? ig.handle ?? '(unknown)'} → ${id}`);
  return id;
}

async function main() {
  logStep('Resolving Instagram account');
  const accountId = await findInstagramAccountId();

  logStep('Uploading 5 carousel PNGs');
  const imageUrls = [];
  for (const s of SLIDES) {
    const url = await uploadFile(path.join(ASSET_DIR, s), 'image/png');
    imageUrls.push(url);
  }

  logStep('Uploading Reel MP4');
  const videoUrl = await uploadFile(path.join(ASSET_DIR, REEL), 'video/mp4');

  logStep('Creating Instagram CAROUSEL post (publishNow)');
  const carouselRes = await zernio.posts.createPost({
    body: {
      content: CAROUSEL_CAPTION,
      mediaItems: imageUrls.map((url) => ({ type: 'image', url })),
      platforms: [{ platform: 'instagram', accountId }],
      publishNow: true,
    },
  });
  const carouselId = carouselRes?.data?.id ?? carouselRes?.id ?? JSON.stringify(carouselRes).slice(0, 200);
  console.log(`  carousel post → ${carouselId}`);

  logStep('Creating Instagram REEL post (publishNow)');
  const reelRes = await zernio.posts.createPost({
    body: {
      content: REEL_CAPTION,
      mediaItems: [{ type: 'video', url: videoUrl }],
      platforms: [
        {
          platform: 'instagram',
          accountId,
          platformSpecificData: { shareToFeed: true },
        },
      ],
      publishNow: true,
    },
  });
  const reelId = reelRes?.data?.id ?? reelRes?.id ?? JSON.stringify(reelRes).slice(0, 200);
  console.log(`  reel post → ${reelId}`);

  console.log('\n✅ DONE');
  console.log('carousel:', JSON.stringify(carouselRes, null, 2).slice(0, 800));
  console.log('reel:', JSON.stringify(reelRes, null, 2).slice(0, 800));
}

try {
  await main();
} catch (err) {
  console.error('\n❌ FAILED:', err?.message ?? err);
  if (err?.response) console.error('response:', JSON.stringify(err.response, null, 2).slice(0, 2000));
  process.exit(1);
}
