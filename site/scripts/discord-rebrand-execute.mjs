// Execute the TTR 2 → PHIMINDFLOW rebrand
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

const WELCOME_CH = '1481059341296467979';
const ANNOUNCEMENTS_CH = '1481059348661670052';
const UPGRADE_CH = '1481059362175717570';
const RESOURCES_CH = '1481059359701209260';
const OXY_ALGO_INTEGRATION = '1481058606739624100';

// ─── Step 1: Remove OXY ALGO bot ─────────────────────
console.log('\n🧹 Step 1 — Removing OXY ALGO integration...');
try {
  await api('DELETE', `/guilds/${GUILD_ID}/integrations/${OXY_ALGO_INTEGRATION}`);
  console.log('  ✅ OXY ALGO removed');
} catch (e) {
  console.log('  ⚠️', e.message);
}

// ─── Step 2: Rename server ───────────────────────────
console.log('\n🏷️  Step 2 — Renaming server...');
try {
  await api('PATCH', `/guilds/${GUILD_ID}`, { name: 'PHIMINDFLOW' });
  console.log('  ✅ Renamed: TTR 2 → PHIMINDFLOW');
} catch (e) {
  console.log('  ⚠️', e.message);
}

// ─── Step 3: Clear OXY ALGO messages from channels ───
console.log('\n🧹 Step 3 — Clearing OXY ALGO messages...');
async function purgeOxyAlgoFrom(channelId, channelName) {
  try {
    const msgs = await api('GET', `/channels/${channelId}/messages?limit=50`);
    const oxyMsgs = msgs.filter((m) => {
      const content = (m.content || '') + ' ' + JSON.stringify(m.embeds || []);
      return /oxy\s*algo|FROM THE FOUNDER/i.test(content) || m.author?.username?.toLowerCase().includes('oxy');
    });
    console.log(`  #${channelName}: ${oxyMsgs.length} OXY messages found`);
    for (const m of oxyMsgs) {
      try {
        await api('DELETE', `/channels/${channelId}/messages/${m.id}`);
        await new Promise((r) => setTimeout(r, 250));
      } catch (e) {
        console.log(`    skip ${m.id}: ${e.message.slice(0, 60)}`);
      }
    }
    console.log(`  #${channelName}: ${oxyMsgs.length} purged`);
  } catch (e) {
    console.log(`  #${channelName} err:`, e.message.slice(0, 80));
  }
}
await purgeOxyAlgoFrom(WELCOME_CH, 'welcome');
await purgeOxyAlgoFrom(ANNOUNCEMENTS_CH, 'announcements');
await purgeOxyAlgoFrom(UPGRADE_CH, 'upgrade');
await purgeOxyAlgoFrom(RESOURCES_CH, 'resources');

// ─── Step 4: Post phimindflow content ────────────────
console.log('\n✨ Step 4 — Posting phimindflow content...');

const GOLD = 0xc9a84e;

// #welcome — command center
await api('POST', `/channels/${WELCOME_CH}/messages`, {
  embeds: [{
    title: '🏛️ Welcome to PHIMINDFLOW',
    description:
      '**Structured wealth. Zero guesswork.**\n\n' +
      'The Fibonacci system that tells you where the market turns — before it does.',
    color: GOLD,
    fields: [
      { name: '🎯 The 3-Step Path', value: '**1.** Open broker (free) → **2.** Unlock the course → **3.** Activate managed execution', inline: false },
      { name: '💹 Broker Options', value: '[Genesis FX](https://dashboard.genesisfxmarkets.com/auth/register?ref=FRADEL185) · [AAAFX](https://app.aaafx.com/register?refLink=NTU4NQ==&refRm=11)', inline: true },
      { name: '🌐 Site', value: '[phimindflow.com](https://phimindflow.com)', inline: true },
      { name: '💳 Credit Pillar', value: '[creditpath-delta.vercel.app](https://creditpath-delta.vercel.app)', inline: true },
      { name: '📚 What\'s next', value: 'Check #resources for tools · #upgrade for tiers · #results for the leaderboard', inline: false },
    ],
  }],
});
console.log('  ✅ #welcome posted');

// #upgrade — premium tiers
await api('POST', `/channels/${UPGRADE_CH}/messages`, {
  embeds: [{
    title: '👑 Upgrade Your Edge',
    description: 'Three tiers. Each one compounds on the last.',
    color: GOLD,
    fields: [
      { name: '🎓 Fibonacci Course — $250', value: 'Master the full framework, risk rules, execution process.\n[→ Unlock the course](https://phimindflow.com/checkout?plan=course)', inline: false },
      { name: '👑 Managed Execution — $1,500', value: 'Hands-off. We execute the system on your account.\n[→ Apply for management](https://phimindflow.com/checkout?plan=management)', inline: false },
      { name: '💳 Credit Fix — $1,500', value: 'Full credit rebuild. One-time, done-for-you.\n[→ Start credit fix](https://creditpath-delta.vercel.app/checkout?plan=credit-fix)', inline: false },
      { name: '⚡ Before any of this', value: 'Open your free broker account first — step 1 is non-negotiable.\n[Genesis FX](https://dashboard.genesisfxmarkets.com/auth/register?ref=FRADEL185) or [AAAFX](https://app.aaafx.com/register?refLink=NTU4NQ==&refRm=11)', inline: false },
    ],
    footer: { text: 'phimindflow.com · Limited spots on Managed' },
  }],
});
console.log('  ✅ #upgrade posted');

// #resources — link library
await api('POST', `/channels/${RESOURCES_CH}/messages`, {
  embeds: [{
    title: '📚 Resource Library',
    description: 'Everything you need, one place.',
    color: GOLD,
    fields: [
      { name: '💹 Brokers', value: '• [Genesis FX](https://dashboard.genesisfxmarkets.com/auth/register?ref=FRADEL185)\n• [AAAFX](https://app.aaafx.com/register?refLink=NTU4NQ==&refRm=11)', inline: false },
      { name: '🎯 Your Products', value: '• [Fibonacci Course $250](https://phimindflow.com/checkout?plan=course)\n• [Managed $1,500](https://phimindflow.com/checkout?plan=management)\n• [Credit Analysis $49](https://creditpath-delta.vercel.app/checkout?plan=analysis)\n• [Credit Repair $149/mo](https://creditpath-delta.vercel.app/checkout?plan=repair-monthly)\n• [Credit Fix $1,500](https://creditpath-delta.vercel.app/checkout?plan=credit-fix)', inline: false },
      { name: '🧠 AI Services', value: '• [AI System Factory](https://ai-system-factory.vercel.app)', inline: false },
      { name: '📱 Social', value: '• IG: [@fitflybusiness](https://instagram.com/fitflybusiness)\n• X: [@Fitflybusiness](https://twitter.com/Fitflybusiness)', inline: false },
    ],
  }],
});
console.log('  ✅ #resources posted');

// #announcements — welcome announcement
await api('POST', `/channels/${ANNOUNCEMENTS_CH}/messages`, {
  embeds: [{
    title: '🎉 Welcome to PHIMINDFLOW',
    description: 'The server just rebranded. Same community, now fully aligned under the phimindflow brand.',
    color: GOLD,
    fields: [
      { name: 'What changed', value: 'Server name → PHIMINDFLOW · Branding refreshed · New upgrade + resources layout', inline: false },
      { name: 'What to do', value: 'Read #welcome · Pick your broker in #upgrade · Jump into the markets channels', inline: false },
    ],
  }],
});
console.log('  ✅ #announcements posted');

console.log('\n✨ Rebrand complete.');
