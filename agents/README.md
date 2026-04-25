# PHIMINDFLOW Agent System

Project-scoped agent system. Lives in this repo. No global Claude/Codex config touched.

## Structure

```
agents/
├── README.md                    ← you are here
├── roles/                       ← 10 specialized agents
│   ├── 01-system-architect.md
│   ├── 02-frontend-engineer.md
│   ├── 03-backend-engineer.md
│   ├── 04-ui-ux-reviewer.md
│   ├── 05-qa-tester.md
│   ├── 06-security-reviewer.md
│   ├── 07-codex-reviewer.md
│   ├── 08-playwright-tester.md
│   ├── 09-deployment-checker.md
│   └── 10-documentation-writer.md
├── workflows/                   ← 6 multi-step pipelines
│   ├── 01-build-review-test.md
│   ├── 02-playwright-validation.md
│   ├── 03-codex-review-gate.md
│   ├── 04-security-check.md
│   ├── 05-deploy-readiness-check.md
│   └── 06-full-system-audit.md
├── quality-gates/               ← 8 hard rules
│   ├── 01-no-broken-build.md
│   ├── 02-no-secret-exposure.md
│   ├── 03-no-fake-integration.md
│   ├── 04-no-duplicate-folders.md
│   ├── 05-no-random-files.md
│   ├── 06-ui-premium-standard.md
│   ├── 07-playwright-required.md
│   └── 08-codex-review-required.md
└── reviews/                     ← stored Codex review outputs
```

## How to use

When an AI assistant works on this repo:

1. **Pick the right agent** — match the task to a role (Frontend Engineer for UI, Backend for API, etc.)
2. **Follow the workflow** — workflows compose multiple agents into a sequence
3. **Pass quality gates** — every gate must be green before merge

## Cross-model review (Codex)

This repo uses bidirectional review between Claude (Opus) and Codex (GPT-5.2):

- **From Claude:** invoke Codex Reviewer (role 07) via `codex exec -m gpt-5.2 -s read-only "..."`
- **Council mode:** for architectural tradeoffs, both models debate, you decide.
- **Anti-slop scoring:** UI changes scored 0–10 against 10 patterns; <7 blocks merge.

Codex CLI is installed at: `codex` on PATH (verified version 0.125.0).

## Folder conventions

- **roles/** — what an agent does, what tools it uses, what it produces
- **workflows/** — sequences of agents working together for a specific goal
- **quality-gates/** — non-negotiable rules; bypass only with documented justification
- **reviews/** — append-only log of Codex review outputs for audit trail

## Maintenance

- Update the role/workflow/gate file when the rule changes
- Update `docs/agent-system/ARCHITECTURE.md` when the system shape changes
- Don't add new roles without updating this README
- Don't bypass gates without documenting why

## Related docs

- `docs/agent-system/ARCHITECTURE.md` — how agents interact
- `CLAUDE.md` — project operating rules (parent directory)
- `PROJECT_BRIEF.md` — brand + mission context
