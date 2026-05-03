// Bootstrap: exchange a short-lived IG access token for a long-lived one (~60 days),
// fetch the IG User ID, and persist everything to .env.local.
//
// Usage:
//   node scripts/meta/bootstrap.mjs <SHORT_LIVED_TOKEN>
//
// Where to get the short-lived token:
//   Meta dashboard -> Use cases -> Customize -> "Generate access tokens" -> Add account
//   Approve the IG login. Copy the token shown.
//
// Requires .env.local to already contain:
//   META_APP_ID
//   META_APP_SECRET

import { loadEnv, upsertEnv, metaGet, requireEnv, envOrProcess } from './_lib.mjs';

const env = loadEnv();
requireEnv(env, ['META_APP_ID', 'META_APP_SECRET']);

const SHORT_TOKEN = process.argv[2];
if (!SHORT_TOKEN) {
  console.error('Usage: node scripts/meta/bootstrap.mjs <SHORT_LIVED_TOKEN>');
  console.error('Get the short-lived token from Meta dashboard -> Use cases -> Customize -> Add account.');
  process.exit(1);
}

const APP_SECRET = envOrProcess(env, 'META_APP_SECRET');

console.log('Exchanging short-lived token for long-lived (60 days)...');

const longLived = await metaGet('/access_token', {
  grant_type: 'ig_exchange_token',
  client_secret: APP_SECRET,
  access_token: SHORT_TOKEN,
});

const LONG_TOKEN = longLived.access_token;
const expiresIn = longLived.expires_in;
const expiresDays = Math.floor(expiresIn / 86400);

console.log(`OK long-lived token issued. Valid ${expiresDays} days.`);

console.log('Fetching IG account info...');
const me = await metaGet('/me', {
  fields: 'id,username,account_type,media_count',
  access_token: LONG_TOKEN,
});

console.log(`OK connected to @${me.username} (${me.account_type})`);
console.log(`   IG User ID  : ${me.id}`);
console.log(`   Media count : ${me.media_count}`);

const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

upsertEnv({
  META_LONG_LIVED_TOKEN: LONG_TOKEN,
  META_IG_USER_ID: me.id,
  META_IG_USERNAME: me.username,
  META_TOKEN_EXPIRES_AT: expiresAt,
});

console.log('OK saved to .env.local:');
console.log('   META_LONG_LIVED_TOKEN');
console.log('   META_IG_USER_ID');
console.log('   META_IG_USERNAME');
console.log(`   META_TOKEN_EXPIRES_AT (${expiresAt})`);
console.log('');
console.log('Next: node scripts/meta/test-connection.mjs');
