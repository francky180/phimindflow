import Zernio from '@zernio/node';

const CLIPS = [
  {
    video_url: 'https://cf.ssemble.com/ssemble-shortsmaker-plugin/export/file_1776294845229_3actve.mp4',
    tiktok: `He thought he was building a brand empire, then God flipped the script at 29. The pivot that changed everything 🔥

Would you start over? #StartingOver #Motivation #Grind #FYP #Viral`,
    instagram: `He thought he was building a brand empire, then God flipped the script at 29.

The pivot that changed everything. Sometimes losing the plan is finding the purpose.

Would you start over at 29? Drop a 🙏 if you've been through it.

#StartingOver #Motivation #Branding #ContentCreator #Grind #FaithOverFear #GodFirst #Mindset #Hustle #Phimindflow`,
  },
  {
    video_url: 'https://cf.ssemble.com/ssemble-shortsmaker-plugin/export/file_1776294838546_u5czbc.mp4',
    tiktok: `Going to bed at 7PM and ignoring calls just to level up. The discipline is REAL 😤

Would you sacrifice your social life for success? #Discipline #MorningRoutine #Grindset #FYP #Viral`,
    instagram: `Going to bed at 7PM. Ignoring calls. Missing parties.

Not because he hates fun — because he loves his future family MORE than tonight's fun.

This level of discipline isn't for everyone. But if you're building something bigger than yourself, you already understand.

Would you make this sacrifice? 👇

#Discipline #MorningRoutine #Grindset #SuccessMindset #Sacrifice #Motivation #SelfImprovement #HardWork #DisciplineEqualsFreedom #Phimindflow`,
  },
  {
    video_url: 'https://cf.ssemble.com/ssemble-shortsmaker-plugin/export/file_1776294890040_h4v8ai.mp4',
    tiktok: `They built an insane obstacle course over water, used it ONCE for $800K, then tore it down 🤯

This is not your average TV show. #BeastGames #MrBeast #Crazy #FYP #Viral`,
    instagram: `They built a MASSIVE obstacle course over water. Used it ONCE. Then tore the whole thing down.

Cost? $800,000. For ONE episode.

MrBeast doesn't think like normal creators. He thinks in moments — not budgets. That's why Beast Games broke every record.

What would YOU build with $800K? 👇

#BeastGames #MrBeast #Crazy #GameShow #Viral #Entertainment #BigThinking #ContentCreator #YouTube #Phimindflow`,
  },
];

const DELAY_MS = 10_000; // 10 sec between posts to avoid rate limits

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
    console.log(`Video: ${clip.video_url}`);

    // Post to TikTok
    console.log('Posting to TikTok...');
    const { data: tkPost, error: tkErr } = await zernio.posts.createPost({
      body: {
        content: clip.tiktok,
        mediaItems: [{ type: 'video', url: clip.video_url }],
        platforms: [{ platform: 'tiktok', accountId: tkId }],
        publishNow: true,
      },
    });
    if (tkErr) {
      console.error('TikTok failed:', JSON.stringify(tkErr));
    } else {
      const tkStatus = tkPost?.post?.platforms?.[0]?.status || tkPost?.post?.status || 'unknown';
      const tkUrl = tkPost?.post?.platforms?.[0]?.platformPostUrl || '';
      console.log(`TikTok: ${tkStatus} ${tkUrl}`);
    }

    // Small delay
    await new Promise(r => setTimeout(r, 3000));

    // Post to Instagram as Reel
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
    if (igErr) {
      console.error('Instagram failed:', JSON.stringify(igErr));
    } else {
      const igStatus = igPost?.post?.platforms?.[0]?.status || igPost?.post?.status || 'unknown';
      const igUrl = igPost?.post?.platforms?.[0]?.platformPostUrl || '';
      console.log(`Instagram: ${igStatus} ${igUrl}`);
    }

    // Delay between clips
    if (i < CLIPS.length - 1) {
      console.log(`Waiting ${DELAY_MS / 1000}s before next clip...`);
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  console.log('\n=== BATCH COMPLETE ===');
  console.log('3 clips posted to TikTok + Instagram (6 total posts)');
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
