// Send the clip DM to sirhansfelix (convo 1403850790796362) via sendInboxMessage.
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
const CONV_ID = '1403850790796362';

const MESSAGE = [
  'Yo — just dropped 3 fresh clips. Check em out:',
  '',
  '1. How Prop Firms Catch Cheaters',
  '   https://www.instagram.com/reel/DXXIab2Cc0f/',
  '',
  '2. Prop Firms Know Your Every Move',
  '   https://www.instagram.com/reel/DXXIvFCAp6g/',
  '',
  '3. Forex and Futures at Fortunes Funding',
  '   https://www.instagram.com/reel/DXXI5B3kXcA/',
  '',
  'Also live on TikTok and YouTube @fitflybusiness 🎬',
].join('\n');

console.log(`Sending to convo ${CONV_ID} (Hans Felix)...`);

try {
  const result = await zernio.messages.sendInboxMessage({
    path: { conversationId: CONV_ID },
    body: { accountId: IG_ID, message: MESSAGE },
  });
  const data = result.data || result;
  console.log('\n✅ SENT');
  console.log(JSON.stringify(data, null, 2));
} catch (err) {
  console.error('❌ SEND FAILED:', err.statusCode || '', err.message);
  if (err.details) console.error('details:', JSON.stringify(err.details, null, 2));
  process.exit(1);
}
