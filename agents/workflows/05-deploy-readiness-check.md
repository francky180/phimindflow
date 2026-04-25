# Workflow: deploy-readiness-check

## Trigger
Before any deploy to production (auto-deploy push OR `vercel --prod`).

## Purpose
Final gate. Stop broken code from reaching prod. Capture rollback target before deploy.

## Steps
1. **Branch state** — confirm on `main` (or release branch) and synced with origin.
2. **Build** — `cd site && npm run build` — must exit 0.
3. **Lint** — `npm run lint` — must exit 0 (or accepted warnings explicit).
4. **Tests** — `npm test` (if script exists) — must exit 0.
5. **Deploy source verification** — confirm:
   - `phimindflow-site` → auto-deploys on push to main
   - `ai-system-factory` → auto-deploys on push to main
   - `ai-agency-system` → auto-deploys on push to main
   - `credit-system` → CLI-only (`vercel --prod` from `site/`)
   - `cosmic-observatory` → CLI-only
   - `stratoptimizer-ai` → CLI-only (verify before each deploy)
6. **Capture rollback target** — `vercel ls` (or Vercel MCP `list_deployments`) → save current prod deployment ID.
7. **Run all upstream gates**:
   - build-review-test (workflow 01) green
   - playwright-validation (workflow 02) green
   - security-check (workflow 04) green
   - codex-review-gate (workflow 03) APPROVED
8. **Deploy** — via correct method per repo type.
9. **Wait for READY** — poll Vercel deployment status until READY or ERROR.
10. **Canary** — invoke playwright-validation against the live URL.
11. **Health verify** — Vercel MCP `get_deployment_health` — confirm green.
12. **Update DEPLOYMENT.md** — record new deploy ID, timestamp, rollback target ID.

## Owner agent
Deployment Checker (09)

## Output
Per `agents/roles/09-deployment-checker.md` output format.

## Pass criteria
- All upstream gates green
- Build + lint + tests exit 0
- Deploy lands READY (not ERROR)
- Post-deploy canary clean
- Rollback ID saved
- DEPLOYMENT.md updated

## Rollback trigger
Any of:
- Canary fails (console errors, broken render, network 5xx)
- Vercel deployment health DEGRADED
- User reports breakage within 10 minutes of deploy

Rollback action: `vercel rollback <previous-prod-id>` OR Vercel MCP `rollback_deployment`.
