# Workflow: security-check

## Trigger
- Pre-commit on auth, env, payment, webhook code
- Pre-deploy on every release
- Weekly full audit
- After ANY new external SaaS integration

## Purpose
Block credential exposure, OWASP issues, fake integrations, missing webhook signature verification.

## Steps
1. **Secret pattern scan** — on staged diff:
   ```bash
   git diff --cached | grep -iE "(rk_live_|sk_live_|pk_live_|Bearer [A-Za-z0-9]{20,}|password\s*=|api_key\s*=|secret\s*=)" || echo "clean"
   ```
2. **Env file scan** — confirm no `.env*` (other than `.env.example`) is staged or tracked:
   ```bash
   git ls-files | grep -E "^\.env" | grep -v "\.env\.example"
   ```
3. **Webhook signature check** — for each webhook handler in diff, verify `stripe.webhooks.constructEvent` (or equivalent) is called.
4. **Input validation check** — verify Zod schemas or explicit checks at endpoint boundaries.
5. **Money path check** — search for `req.body.amount`, `req.body.price` — flag if used without server-side derivation.
6. **OWASP Top 10 quick scan** — A01–A10 checklist:
   - A01 Broken Access Control — auth checks present?
   - A02 Cryptographic Failures — HTTPS only, no plaintext secrets?
   - A03 Injection — parameterized queries, no string interpolation?
   - A04 Insecure Design — threat model considered?
   - A05 Security Misconfig — CORS, headers, default creds?
   - A06 Vuln Components — `npm audit` recent?
   - A07 Auth Failures — sessions invalidated on logout, 2FA where critical?
   - A08 Software/Data Integrity — webhook sigs, package lockfiles?
   - A09 Logging — sensitive data not logged?
   - A10 SSRF — outbound URLs validated?
7. **Output verdict** — CRITICAL findings block; WARNING fix before merge; NIT optional.

## Owner agent
Security Reviewer (06)

## Output
Per `agents/roles/06-security-reviewer.md` output format.

## Pass criteria
- Zero CRITICAL findings
- All WARNING findings fixed OR explicitly waived with documented rationale
- `npm audit` shows no high/critical vulnerabilities
- No `.env*` staged
