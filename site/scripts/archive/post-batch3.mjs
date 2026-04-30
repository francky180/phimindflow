import Zernio from '@zernio/node';

const CLIPS = [
  {
    video_url: 'https://cf.ssemble.com/ssemble-shortsmaker-plugin/export/file_1776317307486_yf7x0n.mp4',
    tiktok: `Venezuela, Iran, Iraq, Canada — what do they all have in common? Oil.

Is that why the US keeps picking fights? 🤔🛢️

#GeoPolitics #OilWars #Canada #Trump #TradeWar #FYP #Viral`,
    instagram: `Venezuela. Iran. Iraq. Canada.

What do they all have in common? Oil.

Every major conflict the US has been involved in traces back to energy. And now the tension with Canada — the most reliable oil partner America has — is following the same pattern.

Coincidence? You decide. 👇

#GeoPolitics #OilWars #Canada #Trump #TradeWar #Oil #USPolitics #WorldNews #Viral #Phimindflow`,
  },
  {
    video_url: 'https://cf.ssemble.com/ssemble-shortsmaker-plugin/export/file_1776317316338_wsoge1.mp4',
    tiktok: `Canada is the most reliable oil partner for the US — and they're giving it away at a discount.

Time to change that 🇨🇦🛢️

#Canada #Oil #TradeWar #EnergyPolicy #FYP #Viral`,
    instagram: `Canada sits on one of the largest oil reserves in the world. And unlike Venezuela, Iran, or Russia — Canada is a stable, democratic ally.

Yet somehow, Canadian oil gets sold at a DISCOUNT.

This clip breaks down why that's about to change — and what it means for the global energy game.

Thoughts? 👇

#Canada #Oil #USCanada #TradeWar #EnergyPolicy #GeoPolitics #WorldNews #Business #Phimindflow`,
  },
  {
    video_url: 'https://cf.ssemble.com/ssemble-shortsmaker-plugin/export/file_1776317307630_02pssi.mp4',
    tiktok: `Is America making a massive strategic blunder by going it alone?

The Cold War was won through alliances, not isolation 🌍

#GeoPolitics #NATO #USCanada #ColdWar #Strategy #FYP #Viral`,
    instagram: `The Cold War wasn't won by America alone. It was won through alliances — NATO, Five Eyes, trade partnerships.

Now there's a shift toward isolation. Going it alone. Burning bridges with allies.

History has a clear answer on how this plays out.

What do you think — stronger alone or stronger together? 👇

#GeoPolitics #NATO #USCanada #ColdWar #Strategy #WorldPolitics #History #Business #Phimindflow`,
  },
];

const DELAY_MS = 10_000;
const zernio = new Zernio({ apiKey: process.env.ZERNIO_API_KEY });

async function main() {
  const { data: accountsData, error: accErr } = await zernio.accounts.listAccounts();
  if (accErr) throw new Error('List accounts failed: ' + JSON.stringify(accErr));

  const accounts = accountsData?.accounts || accountsData?.data || accountsData || [];
  const tk = accounts.find(a => (a.platform || '').toLowerCase() === 'tiktok');
  const ig = accounts.find(a => (a.platform || '').toLowerCase() === 'instagram');
  if (!tk) throw new Error('No TikTok account connected');
  if (!ig) throw new Error('No Instagram account connected');

  const tkId = tk._id || tk.id || tk.accountId;
  const igId = ig._id || ig.id || ig.accountId;
  console.log(`TikTok: @${tk.username} (${tkId})`);
  console.log(`Instagram: @${ig.username} (${igId})`);

  for (let i = 0; i < CLIPS.length; i++) {
    const clip = CLIPS[i];
    console.log(`\n--- Clip ${i + 1}/${CLIPS.length} ---`);

    console.log('Posting to TikTok...');
    const { data: tkPost, error: tkErr } = await zernio.posts.createPost({
      body: {
        content: clip.tiktok,
        mediaItems: [{ type: 'video', url: clip.video_url }],
        platforms: [{ platform: 'tiktok', accountId: tkId }],
        publishNow: true,
      },
    });
    if (tkErr) console.error('TikTok failed:', JSON.stringify(tkErr));
    else console.log(`TikTok: ${tkPost?.post?.platforms?.[0]?.status || 'unknown'}`);

    await new Promise(r => setTimeout(r, 3000));

    console.log('Posting to Instagram...');
    const { data: igPost, error: igErr } = await zernio.posts.createPost({
      body: {
        content: clip.instagram,
        mediaItems: [{ type: 'video', url: clip.video_url }],
        platforms: [
          { platform: 'instagram', accountId: igId, platformSpecificData: { mediaType: 'REELS' } },
        ],
        publishNow: true,
      },
    });
    if (igErr) console.error('Instagram failed:', JSON.stringify(igErr));
    else {
      const url = igPost?.post?.platforms?.[0]?.platformPostUrl || '';
      console.log(`Instagram: ${igPost?.post?.platforms?.[0]?.status || 'unknown'} ${url}`);
    }

    if (i < CLIPS.length - 1) {
      console.log(`Waiting ${DELAY_MS / 1000}s...`);
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  console.log('\n=== BATCH 3 COMPLETE ===');
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
