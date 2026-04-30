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
  readFileSync('.env.local', 'utf8').split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), cleanEnvValue(l.slice(i + 1))]; })
);

const z = new Zernio({ apiKey: env.ZERNIO_API_KEY });

console.log('=== IG ACCOUNT ===');
const accts = (await z.accounts.listAccounts()).data?.accounts || [];
const ig = accts.find((a) => a.platform === 'instagram');
if (!ig) { console.log('No IG account connected'); process.exit(0); }
const igId = ig.id || ig._id || ig.accountId;
console.log(`Platform: ${ig.platform} · Username: @${ig.username || ig.handle || '?'} · ID: ${igId}`);
try {
  const hs = await z.accounts.getFollowerStats({ params: { id: igId } });
  const h = hs.data?.followerStats || hs.data || {};
  console.log(`Followers: ${h.followers ?? h.followerCount ?? '?'} · Following: ${h.following ?? h.followingCount ?? '?'} · Posts: ${h.posts ?? h.postCount ?? '?'}`);
} catch (e) { console.log('Follower stats err:', e.message); }
try {
  const health = await z.accounts.getAccountHealth({ params: { id: igId } });
  const h = health.data?.health || health.data || {};
  console.log(`Account status: ${h.status || h.state || '?'} · Last synced: ${h.lastSyncedAt || '?'}`);
} catch (e) { console.log('Health err:', e.message); }

console.log('\n=== RECENT POSTS (last 10) ===');
const posts = await z.posts.listPosts({ query: { limit: 10 } });
for (const p of posts.data?.posts || []) {
  const igStatus = (p.platforms || []).find((x) => x.platform === 'instagram')?.status || '-';
  const time = (p.publishedAt || p.createdAt || '').slice(0, 16).replace('T', ' ');
  const preview = (p.content || '').replace(/\n/g, ' ').slice(0, 60);
  console.log(`[${igStatus}] ${time} · "${preview}..."`);
}

console.log('\n=== INBOX CONVERSATIONS (IG DMs) ===');
try {
  const convos = await z.messages.listInboxConversations({
    query: { accountId: igId, limit: 15 },
  });
  const list = convos.data?.conversations || convos.data || [];
  if (list.length === 0) {
    console.log('No conversations returned. Trying without accountId filter...');
    const allConvos = await z.messages.listInboxConversations({ query: { limit: 15 } });
    const allList = allConvos.data?.conversations || allConvos.data || [];
    console.log(`Total conversations across accounts: ${allList.length}`);
    for (const c of allList.slice(0, 15)) {
      const platform = c.platform || c.account?.platform || '?';
      const unread = c.unreadCount || 0;
      const name = c.participant?.name || c.participant?.handle || c.name || c.with || '?';
      const lastMsg = (c.lastMessage?.text || c.lastMessage?.content || '').slice(0, 50);
      const updated = (c.updatedAt || c.lastMessageAt || '').slice(0, 16).replace('T', ' ');
      console.log(`[${platform}] ${unread > 0 ? '🔴' : '⚪'} ${name} · ${updated} · "${lastMsg}"`);
    }
  } else {
    for (const c of list) {
      const unread = c.unreadCount || 0;
      const name = c.participant?.name || c.participant?.handle || c.name || c.with || '?';
      const lastMsg = (c.lastMessage?.text || c.lastMessage?.content || '').slice(0, 50);
      const updated = (c.updatedAt || c.lastMessageAt || '').slice(0, 16).replace('T', ' ');
      console.log(`${unread > 0 ? '🔴' : '⚪'} ${name} · ${updated} · "${lastMsg}"`);
    }
  }
} catch (e) { console.log('Conversations err:', e.message); }

console.log('\n=== COMMENTS ON RECENT POSTS ===');
try {
  const comments = await z.comments.listInboxComments({
    query: { accountId: igId, limit: 10 },
  });
  const list = comments.data?.comments || comments.data || [];
  if (list.length === 0) console.log('No new comments.');
  for (const c of list) {
    const name = c.user?.name || c.from?.name || c.author?.name || '?';
    const text = (c.text || c.message || c.content || '').slice(0, 80);
    const when = (c.createdAt || '').slice(0, 16).replace('T', ' ');
    console.log(` • ${name} · ${when} · "${text}"`);
  }
} catch (e) { console.log('Comments err:', e.message); }

console.log('\n=== INSIGHTS (24h / 7d) ===');
try {
  const ins = await z.analytics.getInstagramAccountInsights({
    query: { accountId: igId, period: 'week' },
  });
  const d = ins.data || {};
  console.log(JSON.stringify(d, null, 2).slice(0, 600));
} catch (e) { console.log('Insights err:', e.message); }
