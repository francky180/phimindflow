import { readFileSync } from 'node:fs';
import Zernio from '@zernio/node';
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n').filter((l)=>l.includes('=')&&!l.trim().startsWith('#')).map((l)=>{const i=l.indexOf('=');return[l.slice(0,i).trim(),l.slice(i+1).trim().replace(/^"|"$/g,'').replace(/\\n$/,'').trim()];})
);
const z = new Zernio({ apiKey: env.ZERNIO_API_KEY });
const r = await z.posts.listPosts({ query: { limit: 5 } });
const posts = r.data?.posts || r.data || [];
for (const p of posts) {
  const tw = (p.platforms || []).find((pl) => pl.platform === 'twitter' || pl.platform === 'x');
  if (tw && tw.status === 'failed') {
    console.log(`FAIL: ${p.content.slice(0, 40).replace(/\n/g, ' ')}`);
    console.log('  error:', tw.publishError || tw.error || tw.failureReason || JSON.stringify(tw.platformSpecificData, null, 2).slice(0, 400));
    console.log('  attempts:', tw.publishAttempts, 'status:', tw.status);
    console.log('---');
  }
}
