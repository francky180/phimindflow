import { readFileSync } from 'node:fs';
import Zernio from '@zernio/node';
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n').filter((l)=>l.includes('=')&&!l.trim().startsWith('#')).map((l)=>{const i=l.indexOf('=');return[l.slice(0,i).trim(),l.slice(i+1).trim().replace(/^"|"$/g,'').replace(/\\n$/,'').trim()];})
);
const id = process.argv[2];
if (!id) { console.error('Usage: node scripts/delete-post.mjs <postId>'); process.exit(1); }
const z = new Zernio({ apiKey: env.ZERNIO_API_KEY });
const r = await z.posts.deletePost({ path: { postId: id } });
console.log(JSON.stringify(r.data || r, null, 2));
