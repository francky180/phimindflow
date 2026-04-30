// Discord webhook notifier — send rich embeds to the FrancHub channel
// Usage from other scripts:
//   import { notify } from './discord-notify.mjs';
//   await notify({ title: 'X', description: 'Y', fields: [...] });

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

const WEBHOOK_URL = env.DISCORD_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;

export const GOLD = 0xc9a84e;
export const GREEN = 0x22c55e;
export const RED = 0xef4444;
export const BLUE = 0x3b82f6;

export async function notify({ title, description, color = GOLD, fields, url, thumbnail, image, username = 'FrancHub' }) {
  if (!WEBHOOK_URL) {
    console.warn('[discord-notify] No DISCORD_WEBHOOK_URL — skipping');
    return { ok: false, reason: 'no-webhook' };
  }
  const embed = { title, description, color, timestamp: new Date().toISOString() };
  if (fields) embed.fields = fields;
  if (url) embed.url = url;
  if (thumbnail) embed.thumbnail = { url: thumbnail };
  if (image) embed.image = { url: image };
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, embeds: [embed] }),
    });
    return { ok: res.ok, status: res.status };
  } catch (e) {
    console.error('[discord-notify] error:', e.message);
    return { ok: false, error: e.message };
  }
}

// CLI usage: node scripts/discord-notify.mjs "title" "description"
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  const [title, description] = process.argv.slice(2);
  if (title) {
    notify({ title, description: description || '', color: GOLD }).then((r) => console.log(r));
  }
}
