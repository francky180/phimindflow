# PHIMINDFLOW — System Map

## File Tree (significant files only)

```
phimindflow-site/
│
├── CLAUDE.md                          # Claude agent system instructions
├── PROJECT_BRIEF.md                   # Project vision and goals
├── OPERATING_SYSTEM.md                # Fibonacci operating philosophy
├── system-loop.md                     # Execution loop checklist
├── README.md                          # Project overview and quick start
├── README_LOCAL_SETUP.md              # Legacy setup notes
│
├── site/                              # ── NEXT.JS APPLICATION ──
│   ├── app/
│   │   ├── page.tsx                   # Homepage (979 lines, 12 sections)
│   │   ├── layout.tsx                 # Root layout + metadata
│   │   ├── Navbar.tsx                 # Navigation + mobile menu
│   │   ├── constants.ts              # ★ FUNNEL LINKS SOURCE OF TRUTH
│   │   ├── not-found.tsx             # Custom 404 page
│   │   ├── globals.css               # Theme tokens + global styles
│   │   └── favicon.ico               # Browser tab icon
│   ├── public/                        # Static assets (currently empty)
│   ├── docs/
│   │   └── PHIMINDFLOW_OPTIMIZATION_REPORT.md
│   ├── package.json                   # Dependencies
│   ├── next.config.ts                 # Next.js config
│   ├── tsconfig.json                  # TypeScript config
│   ├── postcss.config.mjs             # PostCSS + Tailwind
│   └── eslint.config.mjs             # ESLint config
│
├── docs/                              # ── DOCUMENTATION ──
│   ├── brand.md                       # Brand identity + colors
│   ├── copy-guidelines.md            # Copywriting standards
│   ├── funnel-flow.md                # Funnel order definition
│   ├── links.md                       # All links (active + legacy)
│   ├── web-design-rules.md           # Design system rules
│   ├── FOREX_FINAL_SYSTEM_SUMMARY.md # System summary
│   ├── SYSTEM_BLUEPRINT.md           # Architecture overview
│   ├── SYSTEM_MAP.md                 # This file
│   ├── INSTALL_GUIDE.md              # Setup instructions
│   ├── TOOLING_STATUS.md             # External tool status
│   ├── VIDEO_STATUS.md               # Remotion/video status
│   ├── NEXT_STEPS.md                 # Remaining work
│   ├── PACKAGING_GUIDE.md            # Portability guide
│   ├── DEMO_PLAN.md                  # Proof-of-completion plan
│   └── workflows/                     # Agent Reach workflows
│       ├── AGENT_REACH_SYSTEM_MAP.md
│       ├── FOREX_COMPETITOR_RESEARCH.md
│       ├── FOREX_CONTENT_RESEARCH.md
│       ├── FOREX_DAILY_OPERATOR_LOOP.md
│       ├── FOREX_LEAD_DISCOVERY.md
│       └── FOREX_PROMOTION_SYSTEM.md
│
├── offers/
│   └── main-offer.md                 # Core offer path
│
├── prompts/
│   └── homepage-prompt.md            # Homepage build prompt
│
├── skills/
│   └── README.md                     # Planned skill packs
│
└── video/                             # ── REMOTION VIDEO PROJECT ──
    ├── src/
    │   ├── index.ts                   # Entry point
    │   ├── Root.tsx                   # Composition setup
    │   └── PhimindflowVideo.tsx      # Main video (6 scenes)
    ├── out/
    │   └── forex-video.mp4           # Rendered output (1.3 MB)
    ├── package.json                   # Remotion dependencies
    ├── tsconfig.json                  # TypeScript config
    └── remotion.config.ts            # Render settings
```

## External Tooling (~/ai-tools/)

```
C:\Users\franc\ai-tools\
├── agent-reach/              # v1.4.0 — Internet research CLI
├── ai-marketing-claude/      # 15 marketing agents
├── oh-my-claudecode/         # v4.9.3 — Multi-agent orchestration
├── ui-ux-pro-max-skill/      # v2.5.0 — Design intelligence
└── GLOBAL_AI_SYSTEM_REPORT.md
```

## Claude Skills (registered)

```
~/.claude/skills/
├── agent-reach/              # SKILL.md + references/
├── market/                   # Orchestrator
├── market-ads/               # Ad creative generation
├── market-audit/             # Marketing audit
├── market-brand/             # Brand voice analysis
├── market-competitors/       # Competitive intelligence
├── market-copy/              # Copywriting
├── market-emails/            # Email sequences
├── market-funnel/            # Funnel optimization
├── market-landing/           # Landing page CRO
├── market-launch/            # Launch playbook
├── market-proposal/          # Client proposals
├── market-report/            # Reports (Markdown)
├── market-report-pdf/        # Reports (PDF)
├── market-seo/               # SEO audit
└── market-social/            # Social media calendar
```
