import { readFileSync } from 'node:fs';
import Zernio from '@zernio/node';

const raw = readFileSync('.env.local', 'utf8');
const line = raw.split('\n').find((l) => l.startsWith('ZERNIO_API_KEY='));
let key = line.slice('ZERNIO_API_KEY='.length);
// Strip surrounding quotes + literal \n suffix + whitespace — iterate until stable
let prev;
do {
  prev = key;
  if (key.startsWith('"')) key = key.slice(1);
  if (key.endsWith('"')) key = key.slice(0, -1);
  if (key.endsWith('\\n')) key = key.slice(0, -2);
  key = key.trim();
} while (key !== prev);

console.log(`key length: ${key.length}, first4: ${key.slice(0, 4)}, last4: ${key.slice(-4)}`);

const z = new Zernio({ apiKey: key });
const r = await z.accounts.listAccounts();
const accts = r.data?.accounts || [];
console.log(`\nConnected accounts: ${accts.length}`);
for (const a of accts) {
  console.log(`  ${a.platform.padEnd(10)} · ${(a.username || a.name || '(no handle)').padEnd(22)} · ${a.id || a._id}`);
}
