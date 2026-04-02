# PHIMINDFLOW — System Blueprint

## Architecture

Single-page marketing site built with Next.js 16 App Router. No database, no auth, no API routes. Pure static generation with client-side animations.

## Page Structure (page.tsx)

1. **Hero** — Headline, trust counters, portfolio card, trust ticker
2. **Credibility / Positioning** — Metrics, growth chart, 6 feature pillars, testimonials
3. **3-Step Process** — Broker → Course → Management with pricing
4. **Why This Order Matters** — Narrative + explanation cards
5. **Course Section** — Benefits, features, CTA ($250)
6. **Management Section** — Benefits, features, premium badge, CTA ($1,500)
7. **Who This Is For** — Self-qualification + exclusion filter
8. **FAQ** — 6 expandable items
9. **Final CTA** — All 3 steps stacked
10. **Footer** — Navigation, copyright, risk disclosure
11. **Sticky Mobile CTA** — Fixed bottom bar (broker link only)

## Component Architecture

All components are inline in `page.tsx` (acceptable for single-page marketing site):
- `Label`, `GoldBtn`, `OutlineBtn`, `SectionBtn`, `Divider`, `Icon`
- `AnimatedCounter`, `TrustTicker`, `FaqItem`, `CheckItem`, `StickyMobileCTA`

External component: `Navbar.tsx`
Constants: `constants.ts` (centralized funnel links)

## Animation System

Uses `motion/react` (Framer Motion v12):
- Scroll-triggered reveals (useInView)
- Hero parallax (useScroll + useTransform)
- Animated counters (useMotionValue + useSpring)
- Spring physics on buttons (hover/tap)
- Staggered children delays

## Styling

- Tailwind CSS 4 (PostCSS plugin)
- CSS custom properties in globals.css for theme tokens
- No component library — all custom

## Video Subsystem

Separate Remotion project in `/video/`:
- 6 scenes: Brand intro, Problem, 3-Step Process, Why Order, Results, CTA
- 450 frames @ 30fps = 15 seconds
- 1920x1080 resolution
- Output: `video/out/forex-video.mp4`

## External Tooling (installed at ~/ai-tools/)

- **Agent Reach** v1.4.0 — Internet research CLI (17+ platforms)
- **oh-my-claudecode** v4.9.3 — Multi-agent orchestration
- **ai-marketing-claude** — 15 marketing agent skills
- **UI/UX Pro Max** v2.5.0 — Design intelligence skill
