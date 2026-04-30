// One-shot: post Franc's full affiliate/product link library to the Discord hub
// Usage: node scripts/post-links-library.mjs

import { notify, GOLD } from './discord-notify.mjs';

await notify({
  title: '📚 Link Library',
  description: 'Every affiliate + product URL you need, one pinnable message.',
  color: GOLD,
  fields: [
    {
      name: '💹 Forex Brokers (affiliate)',
      value:
        '• **Genesis FX** → https://dashboard.genesisfxmarkets.com/auth/register?ref=FRADEL185\n' +
        '• **AAAFX** → https://app.aaafx.com/register?refLink=NTU4NQ==&refRm=11',
      inline: false,
    },
    {
      name: '🎯 Phimindflow (your products)',
      value:
        '• Course $250 → https://phimindflow.com/checkout?plan=course\n' +
        '• Management $1500 → https://phimindflow.com/checkout?plan=management\n' +
        '• Fibonacci Whop $250 → (Whop URL)\n' +
        '• Managed Whop $1500 → (Whop URL)',
      inline: false,
    },
    {
      name: '💳 CreditPath (your products)',
      value:
        '• Credit Analysis $49 → https://creditpath-delta.vercel.app/checkout?plan=analysis\n' +
        '• Credit Repair $149/mo → https://creditpath-delta.vercel.app/checkout?plan=repair-monthly\n' +
        '• Complete Credit Fix $1500 → https://creditpath-delta.vercel.app/checkout?plan=credit-fix',
      inline: false,
    },
    {
      name: '🧠 AI Services',
      value: '• AI System Factory $1500 + $250/mo → https://ai-system-factory.vercel.app',
      inline: false,
    },
    {
      name: '📱 Social',
      value:
        '• IG: [@fitflybusiness](https://instagram.com/fitflybusiness)\n' +
        '• Twitter: [@Fitflybusiness](https://twitter.com/Fitflybusiness)\n' +
        '• TikTok: Thebeststores\n' +
        '• LinkedIn: francky delissaint',
      inline: false,
    },
  ],
});

console.log('✅ Link library posted to Discord.');
