# Creator Marketing Skills — Placement in OMC

> Status: INSTALLED AND ACTIVE (32 skills via `npx skills add archive-dot-com/creator-marketing-skills`)
> Location: ~/.agents/skills/ (symlinked to ~/.claude/skills/)
> Brand context: .claude/brand-context.md (PHIMINDFLOW)
> Last verified: 2026-04-03

## What It Is

Creator Marketing Skills is a **strategy intelligence layer** within the OMC system. It provides SEO intelligence, creator marketing strategy, campaign planning, outreach planning, audience/creator analysis, KPI/ROI planning, compliance support, and content repurposing.

It is NOT backend transport, API routing, webhook validation, ManyChat message transport, or CRM execution.

## System Flow Position

```
ClickUp plan → OMC → Creator Marketing Skills → BrandJet → ManyChat → Backend → Remotion
                      ^^^^^^^^^^^^^^^^^^^^^^^^
                      STRATEGY LAYER (this module)
```

## Where It Belongs

```
OMC Autonomy Core
    ├── system-architect         (planning, structure, integration safety)
    ├── backend-system           (API, webhooks, data flow, server logic)
    ├── conversation-system      (DM flows, qualification, lead interaction)
    └── creator-marketing-skills (strategy, SEO, campaigns, audience intel)
```

Creator Marketing Skills sits **alongside** the other agents, not inside them. It is a peer in the agent chain, called when marketing intelligence improves the quality of another agent's output.

## Installed Skills (32 total)

### Brand Foundation (run first)
- `/brand-context` — Build brand context file that all other skills read

### Campaign Planning & Strategy
- `/campaign-brief-generator` — Generate campaign briefs
- `/campaign-goal-to-kpi-framework-builder` — Build KPI frameworks from goals
- `/campaign-roi-calculator` — Calculate campaign ROI
- `/campaign-status-dashboard-digest` — Weekly status dashboards

### Creator Analysis & Outreach
- `/audience-demographic-analyzer` — Analyze audience demographics
- `/niche-fit-scorer` — Score creator-brand niche fit
- `/creator-rate-estimator` — Estimate creator rates
- `/creator-outreach-sequence-generator` — Generate outreach sequences
- `/creator-negotiation-assistant` — Assist with creator negotiations
- `/creator-briefing-faq-generator` — Generate creator FAQ docs
- `/universal-creator-follow-up-chaser` — Follow-up message sequences
- `/engagement-rate-calculator-benchmarker` — Calculate and benchmark engagement

### Content & Compliance
- `/creator-content-concept-generator` — Generate content concepts
- `/content-capture-checklist-builder` — Build content capture checklists
- `/content-approval-feedback-formatter` — Format content approval feedback
- `/content-to-brief-compliance-checker` — Check content against briefs
- `/creator-posting-compliance-tracker` — Track posting compliance
- `/ftc-disclosure-spot-checker` — Check FTC disclosure compliance
- `/brand-safety-screen` — Screen for brand safety issues

### Content Repurposing
- `/organic-repost-caption-writer` — Write organic repost captions
- `/paid-ad-copy-adapter` — Adapt content for paid ads
- `/paid-social-creative-brief` — Generate paid social briefs
- `/multi-platform-format-adapter` — Adapt content across platforms

### Analytics & Reporting
- `/metrics-normalization-formatter` — Normalize and format metrics
- `/performance-benchmark-setter` — Set performance benchmarks
- `/post-campaign-creator-scorecard` — Post-campaign creator scoring
- `/quarterly-creator-program-review` — Quarterly program reviews
- `/story-metrics-screenshot-parser` — Parse story metrics screenshots

### Operations
- `/reply-triage-classifier` — Classify and triage replies
- `/utm-parameter-builder` — Build UTM parameters
- `/verbal-agreement-summarizer` — Summarize verbal agreements

## When to Use It

Use Creator Marketing Skills when:

- **Building campaigns**: Generate strategy-aware briefs before execution
- **Planning outreach**: Create creator outreach sequences informed by brand context
- **Improving prompts**: Marketing context can sharpen conversation prompts
- **Qualification enhancement**: Campaign context helps score leads more accurately
- **Content strategy**: Generating or evaluating content that supports the funnel
- **SEO intelligence**: Keyword or search intent data can improve response quality
- **Compliance checks**: FTC disclosure verification, content-to-brief compliance
- **Reporting**: Campaign dashboards, creator scorecards, quarterly reviews
- **Content repurposing**: Converting creator content into ad briefs and paid social

## When NOT to Use It

Do NOT use Creator Marketing Skills for:

- **Backend code** — that's backend-system's role
- **API transport logic** — route handlers, webhook validation, HTTP responses
- **ManyChat transport** — payload parsing, field mapping, webhook configuration
- **Runtime validation** — input checking, schema enforcement, security
- **Database operations** — data storage, retrieval, caching
- **Infrastructure** — deployment, environment config, server setup
- **CRM execution** — that's BrandJet's role (when implemented)

## How It Stays Separate

1. Creator Marketing Skills never writes to `app/api/` or `omc/utils/`
2. Its outputs are **informational** — they feed into prompts, qualification criteria, or strategic decisions
3. It does not have direct access to the request/response pipeline
4. It operates at the **strategy layer**, not the **transport layer**

## Brand Context Dependency

All skills read `.claude/brand-context.md` before executing. If this file does not exist, run `/brand-context` first. The brand context file provides:

- Brand overview, positioning, and products
- Target consumer profile
- Platform presence and content style
- Creator program status and workflow
- Brand voice and content preferences
- Goals, budget, and success metrics
- Competitive landscape
- Segment and maturity signals

## Summary

Creator Marketing Skills = **strategic brain, not operational hands**. It thinks about *what to say and why*. The backend and conversation systems handle *how to say it and where to send it*. BrandJet handles *outbound execution*. ManyChat handles *inbound conversation*.
