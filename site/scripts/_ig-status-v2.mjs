import { readFileSync } from 'node:fs';
import Zernio from '@zernio/node';
function cleanEnvValue(v) {
  let s = v.trim(); let prev;
  do { prev = s;
    if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1);
    else if (s.startsWith('"')) s = s.slice(1);
    else if (s.endsWith('"')) s = s.slice(0, -1);
    if (s.endsWith('\\n')) s = s.slice(0, -2);
    s = s.trim();
  } while (s !== prev);
  return s;
}
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n').filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), cleanEnvValue(l.slice(i + 1))]; })
);
const z = new Zernio({ apiKey: env.ZERNIO_API_KEY });

console.log('=== CONVERSATIONS (IG DMs, last 20) ===');
const c = await z.messages.listInboxConversations({ query: { limit: 20 } });
const convos = c.data?.data || [];
console.log(`Total: ${convos.length}\n`);
for (const x of convos) {
  const time = (x.updatedTime || '').slice(0, 16).replace('T', ' ');
  const follows = x.instagramProfile?.followerCount ? `${x.instagramProfile.followerCount.toLocaleString()} followers` : '';
  const isFollower = x.instagramProfile?.isFollower ? ' · follows you' : '';
  const isFollowing = x.instagramProfile?.isFollowing ? ' · you follow' : '';
  console.log(`${time} · ${x.participantName} (${follows})${isFollower}${isFollowing}`);
  console.log(`   "${(x.lastMessage || '').slice(0, 100)}"`);
  if (x.url) console.log(`   ${x.url}`);
  console.log('');
}

console.log('\n=== COMMENTS ON RECENT POSTS (last 10) ===');
const cm = await z.comments.listInboxComments({ query: { limit: 10 } });
const comments = cm.data?.data || [];
for (const x of comments) {
  const time = (x.createdTime || '').slice(0, 16).replace('T', ' ');
  const author = x.userName || x.author || x.from?.name || 'unknown';
  const preview = (x.content || x.text || '').slice(0, 80).replace(/\n/g, ' ');
  const metrics = `❤ ${x.likeCount || 0} · 💬 ${x.commentCount || 0}`;
  console.log(`${time} · ${metrics}`);
  console.log(`   "${preview}"`);
  if (x.permalink) console.log(`   ${x.permalink}`);
  console.log('');
}
