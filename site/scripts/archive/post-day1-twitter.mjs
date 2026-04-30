import Zernio from '@zernio/node';

const TWEET = `Your credit score dropped and you don't know why?

3 things silently killing it:

1. Utilization over 30%
2. Hard inquiries you forgot about
3. Errors you never disputed

Free AI credit analyzer 👇
phimindflow.com/credit/analyze

#CreditRepairTips #Phimindflow`;

const zernio = new Zernio({ apiKey: process.env.ZERNIO_API_KEY });

async function main() {
  // List accounts — also grab TikTok ID for future posts
  const { data: accountsData, error: accErr } = await zernio.accounts.listAccounts();
  if (accErr) throw new Error('List accounts failed: ' + JSON.stringify(accErr));

  const accounts = accountsData?.accounts || accountsData?.data || accountsData || [];
  console.log('Connected accounts:');
  accounts.forEach(a => console.log(`  ${a.platform}: ${a.username || a.displayName} (${a._id})`));

  const tw = accounts.find(a => ['twitter', 'x'].includes((a.platform || '').toLowerCase()));
  if (!tw) throw new Error('No Twitter/X account connected');

  const twId = tw._id || tw.id || tw.accountId;
  console.log(`\nPosting to Twitter @${tw.username || tw.displayName} (${twId})...`);

  const { data: post, error: postErr } = await zernio.posts.createPost({
    body: {
      content: TWEET,
      platforms: [
        { platform: 'twitter', accountId: twId },
      ],
      publishNow: true,
    },
  });
  if (postErr) throw new Error('Post failed: ' + JSON.stringify(postErr));
  console.log('\nPosted successfully!');
  console.log(JSON.stringify(post, null, 2));
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
