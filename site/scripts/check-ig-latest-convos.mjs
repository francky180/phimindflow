// Show the 5 most recent IG convos with full metadata to spot new threads
// that a handle-string scan might miss.
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

const zernio = new Zernio({ apiKey: env.ZERNIO_API_KEY });
const IG_ID = '69d935357dea335c2bd3c3ed';

const convs = await zernio.messages.listInboxConversations({ query: { accountId: IG_ID, limit: 10 } });
const items = convs.data?.data || convs.data?.conversations || convs.data || [];
console.log(`Top 10 IG conversations (newest first):\n`);
for (const c of items.slice(0, 10)) {
  const pv = c.lastMessage?.text || c.lastMessage?.body || c.lastMessage?.preview || '';
  const who = c.participants?.map((p) => p.username || p.name || p.id).join(', ') || c.displayName || '?';
  const when = c.updatedAt || c.lastMessage?.sentAt || c.createdAt || '?';
  console.log(`• ${when}  [${c.id}]  @${who}  →  "${String(pv).slice(0, 80)}"`);
}
