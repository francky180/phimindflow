# PHIMINDFLOW

Premium Fibonacci-based forex trading system website.

## Quick Start

```bash
cd site
npm install
npm run dev
# Open http://localhost:3000
```

## Build

```bash
cd site
npm run build
npm start
```

## Project Structure

```
phimindflow-site/
├── site/                  # Next.js 16 application
│   ├── app/               # App router (page, layout, navbar, constants)
│   ├── public/            # Static assets
│   ├── docs/              # Site-specific reports
│   └── .next/             # Build output (gitignored)
├── docs/                  # System documentation
│   └── workflows/         # Agent Reach research workflows
├── offers/                # Offer copy and structure
├── prompts/               # Build prompts
├── skills/                # Reusable skill packs (planned)
├── video/                 # Remotion video project
│   ├── src/               # Video components
│   └── out/               # Rendered video output
├── CLAUDE.md              # Claude system instructions
├── PROJECT_BRIEF.md       # Project vision and goals
├── OPERATING_SYSTEM.md    # Operating philosophy
└── system-loop.md         # Execution loop checklist
```

## Funnel Order

1. **Broker Signup** (FREE) — Genesis FX Markets (ref=FRADEL185)
2. **Course Purchase** ($250) — Stripe
3. **Management Purchase** ($1,500) — Stripe

Link source of truth: `site/app/constants.ts`

## Tech Stack

- Next.js 16.2.1
- React 19.2.4
- Tailwind CSS 4
- Motion (Framer Motion) 12.38
- TypeScript 5
- Remotion 4.0.443 (video subsystem)

## Design

- Premium dark theme (#0A0A0A)
- Restrained gold accents (#C9A84E)
- Clean typography, subtle motion
- Conversion-focused, minimal, no clutter

## Deployment

- Platform: Vercel (auto-deploy from GitHub)
- Production: https://site-pied-two-69.vercel.app
- Custom domain: phimindflow.com (not yet configured)
