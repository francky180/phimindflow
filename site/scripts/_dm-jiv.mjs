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

// Find Jiv's convo
const c = await z.messages.listInboxConversations({ query: { limit: 30 } });
const convos = c.data?.data || [];
const jiv = convos.find((x) => (x.participantName || '').toLowerCase().includes('jiv'));
if (!jiv) {
  console.error('Jiv convo not found in last 30.');
  console.log('Available participants:', convos.map((x) => x.participantName).join(' | '));
  process.exit(1);
}
console.log(`Found: ${jiv.participantName} · id=${jiv.id} · last="${jiv.lastMessage}" · ${jiv.updatedTime}`);
console.log('Full convo object:', JSON.stringify(jiv, null, 2));

const msg = "yo bro, what's good?";
console.log(`\n→ Sending: "${msg}"`);

try {
  const r = await z.messages.sendInboxMessage({
    path: { conversationId: jiv.id },
    body: { accountId: jiv.accountId, message: msg },
  });
  console.log('\n✅ Sent.');
  console.log('Response:', JSON.stringify(r.data || r, null, 2).slice(0, 600));
} catch (e) {
  console.error('❌ Send failed:', e.message);
  process.exit(1);
}
