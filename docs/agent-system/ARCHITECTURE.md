# Agent System Architecture

## Layers

```
                       ┌────────────────────────────────────┐
                       │         YOU (Franc)                │
                       │   single chat surface              │
                       └────────────────┬───────────────────┘
                                        │
                       ┌────────────────▼───────────────────┐
                       │   CLAUDE CODE (orchestrator)        │
                       │   - reads agents/roles/             │
                       │   - executes agents/workflows/      │
                       │   - enforces agents/quality-gates/  │
                       └─┬─────────┬─────────┬─────────┬─────┘
                         │         │         │         │
              ┌──────────▼──┐  ┌───▼──┐  ┌───▼──┐  ┌───▼──────┐
              │ Filesystem  │  │GitNex│  │Stripe│  │ Vercel   │
              │ MCP         │  │ MCP  │  │ MCP  │  │ MCP      │
              └─────────────┘  └──────┘  └──────┘  └──────────┘
                         │
              ┌──────────▼─────┐
              │ Playwright MCP │
              │ (browser ctrl) │
              └────────────────┘
                         │
              ┌──────────▼─────────────────────────────────┐
              │ CODEX CLI (adversarial reviewer brain)       │
              │ invoked via `codex exec -m gpt-5.2 -s ro`    │
              └────────────────────────────────────────────┘
```

## Routing logic

| Task type | Primary agent | Reviewer | Gate |
|-----------|---------------|----------|------|
| New UI component | Frontend Engineer | UI/UX Reviewer + Codex | ui-premium-standard, playwright-required |
| API / webhook | Backend Engineer | Security + Codex | no-secret-exposure, codex-review-required |
| Architectural change | System Architect | Codex (council mode) | no-duplicate-folders, codex-review-required |
| Pre-deploy | Deployment Checker | QA + Playwright | no-broken-build, playwright-required |
| Pre-commit | Security Reviewer | — | no-secret-exposure, no-random-files |
| Doc update | Documentation Writer | — | — |

## Workflow composition

Each workflow is a directed sequence of agents. Quality gates are enforced at the boundaries.

### Standard ship flow
```
Plan
  │
  ▼
[01-build-review-test] ──── gate: no-broken-build
  │
  ▼
[02-playwright-validation] ── gate: playwright-required
  │
  ▼
[03-codex-review-gate] ───── gate: codex-review-required (if ≥50 LOC or sensitive)
  │
  ▼
[04-security-check] ──────── gate: no-secret-exposure
  │
  ▼
[05-deploy-readiness-check] ─ gate: all of above
  │
  ▼
Live + canary
```

### Weekly audit
```
[06-full-system-audit] orchestrated by System Architect
  ├─ Folder hygiene (no-duplicate-folders, no-random-files)
  ├─ Live URL health (Playwright Tester)
  ├─ Stripe revenue path (Backend Engineer)
  ├─ Zernio + automation health (Automation Engineer / scripts logs)
  ├─ Discord bot health
  ├─ Secret hygiene (Security Reviewer, full repo)
  ├─ GitNexus index freshness
  ├─ Doc drift (Documentation Writer)
  └─ MCP availability smoke check
```

## Cross-model review architecture

Two flows:

### Claude → Codex
```
Claude proposes change
  │
  ▼
Codex Reviewer (role 07)
  │ codex exec -m gpt-5.2 -s read-only "..."
  ▼
Verdict: APPROVED / REVISE / REJECT / TRADEOFF
  │
  ├── APPROVED  → continue
  ├── REVISE    → fix + re-run (max 3 rounds)
  ├── REJECT    → redesign
  └── TRADEOFF  → council mode (escalate to user)
```

### Council mode (architectural debates)
```
Question framed
  │
  ▼
Claude takes position (no hedging)
  │
  ▼
codex exec → Codex independent position
  │
  ▼
Up to 2 rebuttal rounds (each model concedes where the other is right)
  │
  ▼
Synthesis → present both sides → user decides
```

## Storage

| What | Where | Retention |
|------|-------|-----------|
| Agent role specs | `agents/roles/` | Permanent |
| Workflow specs | `agents/workflows/` | Permanent |
| Quality gate specs | `agents/quality-gates/` | Permanent |
| Codex review outputs | `agents/reviews/<date>-<scope>.md` | 90 days |
| Playwright evidence | `scripts/agent-tests/evidence/<date>/` | 30 days |
| Audit reports | `agents/reviews/audits/<date>.md` | Permanent |

## Future extensions (not built yet)

- Pre-commit git hook auto-running gates 02 + 05
- Vercel deployment webhook → auto-trigger post-deploy canary
- Slack/Discord notification on gate failures
- Per-PR Codex review embedded in GitHub PR comments

These remain manual until Franc explicitly approves automation.
