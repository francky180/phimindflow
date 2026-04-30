import Zernio from '@zernio/node';

const VIDEO_URL = 'https://cf.ssemble.com/ssemble-shortsmaker-plugin/export/file_1776294887458_47qo7s.mp4';

const CAPTION = `The most intense moment of Beast Games Season 1 — a $1 million bribe changes everything 😱

Would you take it? #BeastGames #MrBeast #GameShow #Viral #FYP #Entertainment`;

const zernio = new Zernio({ apiKey: process.env.ZERNIO_API_KEY });

async function main() {
  const { data: accountsData, error: accErr } = await zernio.accounts.listAccounts();
  if (accErr) throw new Error('List accounts failed: ' + JSON.stringify(accErr));

  const accounts = accountsData?.accounts || accountsData?.data || accountsData || [];
  const tk = accounts.find(a => (a.platform || '').toLowerCase() === 'tiktok');
  if (!tk) throw new Error('No TikTok account connected');

  const tkId = tk._id || tk.id || tk.accountId;
  console.log(`Posting to TikTok @${tk.username || tk.displayName} (${tkId})...`);
  console.log(`Video: ${VIDEO_URL}`);

  const { data: post, error: postErr } = await zernio.posts.createPost({
    body: {
      content: CAPTION,
      mediaItems: [{ type: 'video', url: VIDEO_URL }],
      platforms: [
        { platform: 'tiktok', accountId: tkId },
      ],
      publishNow: true,
    },
  });
  if (postErr) throw new Error('Post failed: ' + JSON.stringify(postErr));
  console.log('\nResult:');
  console.log(JSON.stringify(post, null, 2));
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
