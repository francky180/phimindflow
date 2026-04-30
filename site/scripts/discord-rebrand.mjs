// Rebrand TTR 2 server → PHIMINDFLOW via Discord Bot API
// Uses admin bot "the one" to rename server, list channels, and report OXY ALGO content
// Usage: node scripts/discord-rebrand.mjs

import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '').replace(/\\n$/, '').trim()];
    })
);

const TOKEN = env.DISCORD_BOT_TOKEN;
const GUILD_ID = env.DISCORD_GUILD_ID;
const API = 'https://discord.com/api/v10';

async function api(method, path, body) {
  const r = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bot ${TOKEN}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await r.text();
  let json; try { json = JSON.parse(text); } catch { json = text; }
  if (!r.ok) throw new Error(`${method} ${path} ${r.status}: ${typeof json === 'string' ? json : JSON.stringify(json)}`);
  return json;
}

console.log('\n🔍 Inspecting server...\n');
const guild = await api('GET', `/guilds/${GUILD_ID}`);
console.log(`Current server: ${guild.name} · ${guild.description || '(no description)'}`);
console.log(`Owner: ${guild.owner_id} · Icon: ${guild.icon || 'none'}`);

const channels = await api('GET', `/guilds/${GUILD_ID}/channels`);
console.log(`\nChannels (${channels.length}):`);
for (const c of channels.sort((a, b) => (a.position || 0) - (b.position || 0))) {
  const type = ['GUILD_TEXT', 'DM', 'GUILD_VOICE', 'GROUP_DM', 'GUILD_CATEGORY', 'GUILD_ANNOUNCEMENT'][c.type] || `T${c.type}`;
  console.log(`  [${type}] #${c.name}${c.parent_id ? ` (in ${c.parent_id})` : ''}`);
}

const integrations = await api('GET', `/guilds/${GUILD_ID}/integrations`);
console.log(`\nIntegrations/Bots (${integrations.length}):`);
for (const i of integrations) {
  console.log(`  - ${i.name} · type=${i.type} · id=${i.id}${i.application?.name ? ` · app=${i.application.name}` : ''}`);
}
