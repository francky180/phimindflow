// Health check: verify the Meta / Instagram Graph API connection.
// Usage: node scripts/meta/test-connection.mjs

import { loadEnv, metaGet, requireEnv, envOrProcess } from './_lib.mjs';

const env = loadEnv();
requireEnv(env, ['META_LONG_LIVED_TOKEN', 'META_IG_USER_ID']);

const TOKEN = envOrProcess(env, 'META_LONG_LIVED_TOKEN');
const USER_ID = envOrProcess(env, 'META_IG_USER_ID');

console.log('Testing Meta/Instagram API connection...\n');

const me = await metaGet('/me', {
  fields: 'id,username,account_type,media_count',
  access_token: TOKEN,
});
console.log(`Account     : @${me.username} (${me.account_type})`);
console.log(`User ID     : ${me.id} ${me.id === USER_ID ? '(matches env)' : '(MISMATCH vs env)'}`);
console.log(`Media count : ${me.media_count}`);

const media = await metaGet('/me/media', {
  fields: 'id,caption,media_type,permalink,timestamp',
  limit: 5,
  access_token: TOKEN,
});
console.log(`\nLatest 5 posts (any type):`);
for (const m of media.data || []) {
  const cap = (m.caption || '').slice(0, 60).replace(/\n/g, ' ');
  console.log(`   [${m.media_type.padEnd(8)}] ${m.id} - ${cap}...`);
}

const expiry = env.META_TOKEN_EXPIRES_AT;
if (expiry) {
  const days = Math.floor((new Date(expiry) - Date.now()) / 86400000);
  console.log(`\nToken expires in ${days} days (${expiry})`);
  if (days < 14) console.log('   Refresh soon: node scripts/meta/refresh-token.mjs');
}

console.log('\nConnection healthy.');
