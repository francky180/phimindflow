import { readFileSync } from 'node:fs';
import Zernio from '@zernio/node';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const idx = l.indexOf('=');
      return [
        l.slice(0, idx).trim(),
        l.slice(idx + 1).trim().replace(/^"|"$/g, '').replace(/\\n$/, '').trim(),
      ];
    })
);

const zernio = new Zernio({ apiKey: env.ZERNIO_API_KEY });

const IG_ID = '69d935357dea335c2bd3c3ed';
const CONV_ID = '949697677709347';
const MESSAGE = `Hey Flo — my bad, just pushed the real fix. The new headshot is live now: https://creditpath-delta.vercel.app

Refresh once if you still see the old one (edge cache was serving stale). Let me know if the crop looks right.`;

console.log(`Sending into Flo's IG thread (conv ${CONV_ID})...`);

try {
  const sent = await zernio.messages.sendInboxMessage({
    path: { conversationId: CONV_ID },
    body: { accountId: IG_ID, message: MESSAGE },
  });
  console.log('SEND RESULT:', JSON.stringify(sent.data || sent.error, null, 2));
} catch (err) {
  console.error('SEND ERROR:', err.statusCode, err.message);
  if (err.details) console.error('details:', JSON.stringify(err.details, null, 2));
  process.exit(1);
}
