import { readFileSync } from 'node:fs';
import Zernio from '@zernio/node';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => l.split('=').map((s) => s.trim()))
);

const zernio = new Zernio({ apiKey: env.ZERNIO_API_KEY });

const accounts = await zernio.accounts.listAccounts();
const list = accounts.data?.accounts || [];
const ig = list.find((a) => a.platform === 'instagram');
if (!ig) {
  console.error('No Instagram account. Available:', list.map((a) => a.platform));
  process.exit(1);
}
console.log('IG account object:', JSON.stringify(ig, null, 2));

const igId = ig.id || ig._id || ig.accountId;
console.log('Using IG id:', igId);

// Upload phimindflow-post.png via presigned URL
const imagePath = 'phimindflow-post.png';
const imageBytes = readFileSync(imagePath);
console.log('Image size:', imageBytes.length, 'bytes');

const presign = await zernio.media.getMediaPresignedUrl({
  body: {
    filename: 'phimindflow-post.png',
    contentType: 'image/png',
    size: imageBytes.length,
  },
});
console.log('Presign response:', JSON.stringify(presign.data, null, 2));

const { uploadUrl, publicUrl } = presign.data;
const putRes = await fetch(uploadUrl, {
  method: 'PUT',
  headers: { 'Content-Type': 'image/png' },
  body: imageBytes,
});
console.log('Upload status:', putRes.status);
if (!putRes.ok) {
  console.error('Upload failed:', await putRes.text());
  process.exit(1);
}
console.log('Public URL:', publicUrl);

const post = await zernio.posts.createPost({
  body: {
    content: 'How you doin today? 👀',
    platforms: [{ platform: 'instagram', accountId: igId }],
    mediaItems: [{ type: 'image', url: publicUrl }],
    publishNow: true,
  },
});

console.log('POST RESULT:', JSON.stringify(post.data || post.error, null, 2));
