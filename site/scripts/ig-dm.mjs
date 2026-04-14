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
const RECIPIENT = 'purposespeaks';
const MESSAGE = 'How you doin today?';

console.log(`Sending "${MESSAGE}" to @${RECIPIENT} from @fitflybusiness...`);

try {
  const result = await zernio.messages.createInboxConversation({
    body: {
      accountId: IG_ID,
      participantUsername: RECIPIENT,
      message: MESSAGE,
    },
  });
  console.log('RESULT:', JSON.stringify(result.data || result.error, null, 2));
} catch (err) {
  console.error('ERROR:', err.statusCode, err.message);
  if (err.details) console.error('details:', JSON.stringify(err.details, null, 2));
  process.exit(1);
}
