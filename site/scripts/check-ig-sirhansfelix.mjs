// One-off: check if @sirhansfelix has an existing IG convo with @fitflybusiness.
// Needed because Zernio can't CREATE new IG convos (only reply).

import { readFileSync } from 'node:fs';
import Zernio from '@zernio/node';

function cleanEnvValue(v) {
  let s = v.trim();
  let prev;
  do {
    prev = s;
    if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1);
    else if (s.startsWith('"')) s = s.slice(1);
    else if (s.endsWith('"')) s = s.slice(0, -1);
    if (s.endsWith('\\n')) s = s.slice(0, -2);
    s = s.trim();
  } while (s !== prev);
  return s;
}
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), cleanEnvValue(l.slice(idx + 1))];
    })
);

const zernio = new Zernio({ apiKey: env.ZERNIO_API_KEY });
const IG_ID = '69d935357dea335c2bd3c3ed';
const TARGET = 'sirhansfelix';

const convs = await zernio.messages.listInboxConversations({
  query: { accountId: IG_ID, limit: 200 },
});
const items = convs.data?.data || convs.data?.conversations || convs.data || [];
console.log(`Scanned ${Array.isArray(items) ? items.length : 0} IG conversations for @${TARGET}`);

const match = (Array.isArray(items) ? items : []).find((c) => {
  const s = JSON.stringify(c).toLowerCase();
  return s.includes(TARGET.toLowerCase());
});

if (!match) {
  console.log(`❌ NO existing DM thread with @${TARGET}.`);
  console.log(`   Zernio cannot create new IG conversations — Franc must DM first from IG.`);
  process.exit(2);
}

console.log(`✅ FOUND existing convo with @${TARGET}`);
console.log(`   conversationId: ${match.id}`);
console.log(`   raw: ${JSON.stringify(match, null, 2).slice(0, 400)}`);
