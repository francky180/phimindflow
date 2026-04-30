import { readFileSync } from 'node:fs';
import Zernio from '@zernio/node';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => l.split('=').map((s) => s.trim()))
);

const zernio = new Zernio({ apiKey: env.ZERNIO_API_KEY });
const IG_ID = '69d935357dea335c2bd3c3ed';

const convs = await zernio.messages.listInboxConversations({
  query: { accountId: IG_ID, limit: 100 },
});

const items = convs.data?.data || convs.data?.conversations || convs.data || [];
console.log(`Found ${Array.isArray(items) ? items.length : 0} IG conversations.`);

const match = (Array.isArray(items) ? items : []).find((c) => {
  const s = JSON.stringify(c).toLowerCase();
  return s.includes('purposespeaks');
});

if (!match) {
  console.log('No existing DM thread with @purposespeaks.');
  console.log('First 3 conv previews:', JSON.stringify((Array.isArray(items) ? items : []).slice(0, 3), null, 2));
  process.exit(2);
}

console.log('Match found:', JSON.stringify(match, null, 2));
console.log('Conversation id:', match.id);

const sent = await zernio.messages.sendInboxMessage({
  path: { conversationId: match.id },
  body: { accountId: IG_ID, message: 'How you doin today?' },
});
console.log('SEND RESULT:', JSON.stringify(sent.data || sent.error, null, 2));
