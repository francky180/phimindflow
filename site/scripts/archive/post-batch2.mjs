import Zernio from '@zernio/node';

const CLIPS = [
  {
    video_url: 'https://cf.ssemble.com/ssemble-shortsmaker-plugin/export/file_1776316648606_hhysdc.mp4',
    tiktok: `If you think money's only for paying bills, you'll stay broke forever.

Your mindset is the real problem 🧠💰

#Money #Mindset #FinancialFreedom #Wealth #FYP #Viral`,
    instagram: `If you think money is only for paying bills... you'll stay broke forever.

The way you SEE money determines how much of it you keep. Poor people see money as something to spend. Wealthy people see it as a tool to BUILD.

Your "financial house" starts with how you think — not how much you earn.

What's one money belief you had to unlearn? 👇

#Money #Mindset #FinancialFreedom #Wealth #Motivation #MoneyMindset #WealthBuilding #RichMindset #PersonalFinance #Phimindflow`,
  },
  {
    video_url: 'https://cf.ssemble.com/ssemble-shortsmaker-plugin/export/file_1776316640009_e3yqxi.mp4',
    tiktok: `The one shift that changed his financial life forever — focus on income-producing assets and watch everything transform 🔥

#Wealth #FinancialFreedom #Mindset #Money #FYP #Viral`,
    instagram: `In 1999, one idea changed everything: income-producing assets.

Not savings. Not budgeting harder. Not cutting lattes.

ASSETS that put money in your pocket while you sleep.

That shift — from "work for money" to "build things that earn for you" — is the only financial advice that actually matters.

What's your first income-producing asset going to be? 👇

#Wealth #FinancialFreedom #Mindset #Money #Rich #IncomeStreams #PassiveIncome #Assets #Investing #Phimindflow`,
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
    else {
      const s = tkPost?.post?.platforms?.[0]?.status || 'unknown';
      console.log(`TikTok: ${s}`);
    }

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
      const s = igPost?.post?.platforms?.[0]?.status || 'unknown';
      const url = igPost?.post?.platforms?.[0]?.platformPostUrl || '';
      console.log(`Instagram: ${s} ${url}`);
    }

    if (i < CLIPS.length - 1) {
      console.log(`Waiting ${DELAY_MS / 1000}s...`);
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  console.log('\n=== BATCH 2 COMPLETE ===');
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
