import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import Zernio from '@zernio/node';

const FILE_PATH = 'C:/Users/franc/Downloads/AI-Is-Rewriting-Wealth-Build-Automated-Income-Engines-with-PHIMINDFLOW—Try-It-Free-Now.mp4';

const CAPTION = `AI is rewriting wealth.

Build automated income engines with PHIMINDFLOW — forex, credit, and AI systems working while you sleep.

Try it free → phimindflow.com

#AI #PassiveIncome #Forex #CreditRepair #Automation #WealthBuilding #PHIMINDFLOW`;

const TWEET = `AI is rewriting wealth.

Build automated income engines with PHIMINDFLOW.

Try it free → phimindflow.com`;

const zernio = new Zernio({ apiKey: process.env.ZERNIO_API_KEY });

async function main() {
  console.log('Listing connected accounts...');
  const { data: accountsData, error: accErr } = await zernio.accounts.listAccounts();
  if (accErr) throw new Error('List accounts failed: ' + JSON.stringify(accErr));

  const accounts = accountsData?.accounts || accountsData?.data || accountsData || [];
  console.log('Accounts found:', accounts.map(a => `${a.platform}:${a.username || a.displayName}(${a._id})`).join(', '));

  const ig = accounts.find(a => (a.platform || '').toLowerCase() === 'instagram');
  const tw = accounts.find(a => ['twitter', 'x'].includes((a.platform || '').toLowerCase()));

  if (!ig) throw new Error('No Instagram account connected');
  if (!tw) throw new Error('No Twitter/X account connected');
  console.log(`IG: ${ig._id || ig.id || ig.accountId} | TW: ${tw._id || tw.id || tw.accountId}`);

  console.log('Requesting presigned upload URL...');
  const fileBuf = readFileSync(FILE_PATH);
  const fileName = basename(FILE_PATH);

  const { data: presign, error: preErr } = await zernio.media.getMediaPresignedUrl({
    body: { filename: fileName, contentType: 'video/mp4', fileSize: fileBuf.length },
  });
  if (preErr) throw new Error('Presign failed: ' + JSON.stringify(preErr));
  console.log('Presign response:', JSON.stringify(presign, null, 2));

  const uploadUrl = presign.uploadUrl || presign.url || presign.data?.uploadUrl;
  const mediaUrl = presign.publicUrl || presign.mediaUrl || presign.fileUrl || presign.data?.publicUrl;

  console.log('Uploading 48MB file...');
  const up = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'video/mp4' },
    body: fileBuf,
  });
  if (!up.ok) throw new Error(`Upload failed: ${up.status} ${await up.text()}`);
  console.log('Upload complete.');

  console.log('Creating post on Instagram + Twitter...');
  const { data: post, error: postErr } = await zernio.posts.createPost({
    body: {
      content: CAPTION,
      mediaItems: [{ type: 'video', url: mediaUrl }],
      platforms: [
        { platform: 'instagram', accountId: ig._id, platformSpecificData: { mediaType: 'REELS' } },
        { platform: 'twitter', accountId: tw._id, customContent: TWEET },
      ],
      publishNow: true,
    },
  });
  if (postErr) throw new Error('Post failed: ' + JSON.stringify(postErr));
  console.log('Posted:', JSON.stringify(post, null, 2));
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
