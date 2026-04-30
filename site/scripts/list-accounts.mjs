import { readFileSync } from 'node:fs';
import Zernio from '@zernio/node';
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n').filter((l)=>l.includes('=')&&!l.trim().startsWith('#')).map((l)=>{const i=l.indexOf('=');return[l.slice(0,i).trim(),l.slice(i+1).trim().replace(/^"|"$/g,'').replace(/\\n$/,'').trim()];})
);
const z = new Zernio({ apiKey: env.ZERNIO_API_KEY });
const r = await z.accounts.listAccounts();
const accounts = r.data?.accounts || [];
console.log(`Connected: ${accounts.length}`);
for (const a of accounts) {
  console.log(`  - ${a.platform} | ${a.displayName || a.username} | active: ${a.isActive}`);
}
