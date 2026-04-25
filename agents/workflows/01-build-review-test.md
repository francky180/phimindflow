# Workflow: build-review-test

## Trigger
Any code change in `phimindflow-site/site/` (or any sibling project).

## Purpose
Standard quality pipeline for every code change. Enforces minimum bar before merge.

## Steps
1. **Plan** — write plan, confirm with user (Franc Rule 2 — phase control).
2. **Impact** — `gitnexus_impact({target, direction:"upstream"})` for every symbol about to change. Abort on HIGH/CRITICAL without rollback plan.
3. **Edit** — minimal surgical edits via `Edit` tool. No `Write` rewrites of existing files.
4. **Local verify** — `npm run dev` → Playwright snapshot of changed pages.
5. **Lint** — `npm run lint` (if script exists).
6. **Build** — `npm run build` — full production build (Franc Rule 4). Fail = stop.
7. **Codex review** — invoke `agents/roles/07-codex-reviewer.md` if change ≥ 50 LOC OR touches auth/payment/webhook.
8. **Detect changes** — `gitnexus_detect_changes()` — confirm scope matches expectation.
9. **Commit** — message follows `Stage / Goal / Plan / Execution / Files Changed / Next Step`.

## Owner agents
Frontend Engineer (02) → UI/UX Reviewer (04) → QA Tester (05) → Codex Reviewer (07) → Deployment Checker (09)

## Output
- Green build log
- Codex verdict APPROVED (when applicable)
- Playwright snapshot evidence
- Commit pushed

## Pass criteria
- Build exits 0
- Lint exits 0 (or accepted warnings explicitly noted)
- Codex verdict ≠ REJECT
- No new HIGH/CRITICAL impact findings
- No new console errors in Playwright snapshot
