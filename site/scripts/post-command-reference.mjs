// Post the PHIMINDFLOW bot command reference to #announcements
import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n').filter((l)=>l.includes('=')&&!l.trim().startsWith('#')).map((l)=>{const i=l.indexOf('=');return[l.slice(0,i).trim(),l.slice(i+1).trim().replace(/^"|"$/g,'').replace(/\\n$/,'').trim()];})
);

const TOKEN = env.DISCORD_BOT_TOKEN;
const GUILD_ID = env.DISCORD_GUILD_ID;
const ANNOUNCEMENTS = '1481059348661670052';

const GOLD = 0xc9a84e;

const embed = {
  title: '🤖 PHIMINDFLOW Bot — Command Reference',
  description: 'All slash commands · type `/` in any channel to see autocomplete',
  color: GOLD,
  fields: [
    {
      name: '🎯 /claim `<email>`',
      value: '**How course-buyers unlock signals.** Provide the email you used at Stripe checkout · bot verifies payment via Stripe API · grants `course-member` role → you see signals channels · tags on red-folder events',
      inline: false,
    },
    {
      name: '🔴 /signals',
      value: 'Force-trigger a forex signals sweep now (admin bypass for market-hours gate) · bot scans ForexFactory red-folder events for next 12h and posts to currency basket channels',
      inline: false,
    },
    {
      name: '📚 /links',
      value: 'Full phimindflow link library · brokers (Genesis FX + AAAFX), products (Course $250, Managed $1500, Credit tiers), AI System Factory, socials · everything in one embed',
      inline: false,
    },
    {
      name: '🏥 /status',
      value: 'Live health check of phimindflow.com, creditpath, ai-system-factory · green/red per site + response time',
      inline: false,
    },
    {
      name: '🎬 /clip `<url>`',
      value: 'Receipt for the Ssemble → IG/TikTok clip pipeline · drops acknowledgement (remote execution from bot comes next)',
      inline: false,
    },
    {
      name: '💰 /revenue',
      value: 'Stripe revenue summary (coming soon · wiring Stripe API query next)',
      inline: false,
    },
    {
      name: '🏓 /ping',
      value: 'Bot heartbeat check · replies with latency in ms',
      inline: false,
    },
    {
      name: '⚙️ Automatic (no command needed)',
      value:
        '• **Signals bot** auto-scans every 12h during forex week (Sun 5pm → Fri 5pm EST) → posts to currency baskets + #news\n' +
        '• **Stripe sales** auto-post to server when a checkout completes\n' +
        '• **Clip pipeline** runs auto-alert embeds when `clip-and-post.mjs` finishes',
      inline: false,
    },
  ],
  footer: { text: 'Bot: the one · Host: Fly.io 24/7 · phimindflow.com' },
};

const res = await fetch(`https://discord.com/api/v10/channels/${ANNOUNCEMENTS}/messages`, {
  method: 'POST',
  headers: { Authorization: `Bot ${TOKEN}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ embeds: [embed] }),
});
const j = await res.json();
console.log('Post status:', res.status, j.id ? `msg ${j.id}` : j);

// Also pin it
if (j.id) {
  const pin = await fetch(`https://discord.com/api/v10/channels/${ANNOUNCEMENTS}/pins/${j.id}`, {
    method: 'PUT',
    headers: { Authorization: `Bot ${TOKEN}` },
  });
  console.log('Pin status:', pin.status);
}
