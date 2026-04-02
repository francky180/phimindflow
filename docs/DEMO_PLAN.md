# PHIMINDFLOW — Demo / Proof-of-Completion Plan

## Purpose

Step-by-step walkthrough to prove the system is complete, working, and verified.

## Recording Setup

- Screen recorder: OBS, Loom, or Windows Game Bar (Win+G)
- Resolution: 1920x1080
- Browser: Chrome or Edge (dark mode)
- Terminal: Open alongside browser

## Demo Script

### Part 1: Build Verification (30 seconds)

```bash
cd C:\Users\franc\Projects\websites\phimindflow-site\site
npm run build
```

Show: Clean build with zero errors, 4 static pages generated.

### Part 2: Local Site (60 seconds)

```bash
npm run dev
```

Open http://localhost:3000 and scroll through:
1. Hero section — animated counters, portfolio card
2. Credibility section — metrics, feature pillars
3. 3-Step Process — broker, course, management in order
4. Course section ($250)
5. Management section ($1,500)
6. FAQ — expand one item
7. Final CTA — all 3 steps visible
8. Footer — risk disclosure present

### Part 3: Funnel Link Verification (30 seconds)

Right-click each CTA button → "Copy link address":
1. Broker → must contain `genesisfxmarkets.com/auth/register?ref=FRADEL185`
2. Course → must contain `buy.stripe.com/3cI14n7Og2rn6g00Vhao804`
3. Management → must contain `buy.stripe.com/14k2bnf256Oh0gwdQQ`

### Part 4: Mobile View (20 seconds)

Open DevTools (F12) → toggle device toolbar → show:
- Mobile layout is responsive
- Sticky CTA bar appears at bottom
- Navigation hamburger menu works

### Part 5: Theme Verification (10 seconds)

Show: Dark background (#0A0A0A), gold accents, clean typography, no clutter.

### Part 6: Documentation (20 seconds)

Open file explorer, show:
- docs/ folder with all documentation files
- README.md at project root
- CLAUDE.md system instructions

### Part 7: Tooling Status (20 seconds)

```bash
agent-reach --version          # → 1.4.0
oh-my-claudecode --version     # → 4.9.3
npx uipro-cli --version        # → 2.2.3
```

### Part 8: Video Output (10 seconds)

Open `video/out/forex-video.mp4` in media player — show 15-second promo video.

## Total Demo Time: ~3-4 minutes

## What This Proves

- Build compiles without errors
- Site loads and renders correctly
- All funnel links are correct
- Funnel order is enforced (Broker → Course → Management)
- Dark premium theme is active
- Mobile responsive design works
- Documentation is complete and accurate
- External tools are installed and verified
- Video subsystem has rendered output
- System is production-ready
