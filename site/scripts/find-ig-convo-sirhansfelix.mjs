// Fetch each recent IG conversation's full details to find one where
// participant username matches sirhansfelix. Then send the clip DM via sendInboxMessage.
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
const TARGET = 'sirhansfelix';

const convs = await zernio.messages.listInboxConversations({ query: { accountId: IG_ID, limit: 15 } });
const items = convs.data?.data || convs.data?.conversations || convs.data || [];
console.log(`Deep-scanning ${items.length} most recent IG convos for @${TARGET}...\n`);

let foundId = null;
for (let i = 0; i < Math.min(items.length, 15); i++) {
  const cId = items[i].id;
  try {
    const detail = await zernio.messages.getInboxConversation({
      path: { conversationId: cId },
      query: { accountId: IG_ID },
    });
    const raw = JSON.stringify(detail.data || detail);
    const hay = raw.toLowerCase();
    const hit = hay.includes(TARGET.toLowerCase()) || hay.includes('hansfelix') || hay.includes('hans felix');
    console.log(`[${i+1}/${items.length}] ${cId} ${hit ? '← MATCH' : ''}`);
    if (hit) {
      foundId = cId;
      console.log(`\n🟢 Match detail preview (first 800 chars):\n${raw.slice(0, 800)}\n`);
      break;
    }
  } catch (e) {
    console.log(`[${i+1}/${items.length}] ${cId} ← error: ${e.message}`);
  }
}

if (!foundId) {
  console.log(`\n❌ No match found in top 15 convos.`);
  console.log(`Dumping first 3 convos full detail so you can identify sirhansfelix manually:\n`);
  for (let i = 0; i < Math.min(items.length, 3); i++) {
    const cId = items[i].id;
    const detail = await zernio.messages.getInboxConversation({
      path: { conversationId: cId },
      query: { accountId: IG_ID },
    });
    console.log(`--- Convo ${i+1} (${cId}) ---`);
    console.log(JSON.stringify(detail.data || detail, null, 2).slice(0, 1200));
    console.log();
  }
  process.exit(2);
}

console.log(`\n🟢 CONVO ID: ${foundId}`);
console.log(`Run this next to send the DM:\n  node scripts/send-ig-to-convo.mjs ${foundId}`);
