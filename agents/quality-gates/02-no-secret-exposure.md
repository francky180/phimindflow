# Gate: no-secret-exposure

## Rule
No live API keys, bearer tokens, passwords, or `.env*` files (other than `.env.example`) may be staged or committed.

## Why
One leaked `rk_live_` key on GitHub = immediate Stripe rotation + potential financial loss. One leaked OpenAI key = burn rate.

## Forbidden patterns (CRITICAL)
```
rk_live_      sk_live_      pk_live_
rk_test_      sk_test_      pk_test_   (still leak, lower severity)
Bearer [A-Za-z0-9._-]{20,}
api[_-]?key\s*[:=]\s*["'][^"']{16,}
password\s*[:=]\s*["'][^"']+
OPENAI_API_KEY=sk-
ANTHROPIC_API_KEY=sk-ant-
SUPABASE_SERVICE_ROLE_KEY=ey
```

## Forbidden files
- `.env`
- `.env.local`
- `.env.production`
- `.env.development`
- `*.pem`, `*.key`, `id_rsa*`
- `service-account*.json`

## Allowed
- `.env.example` (placeholders only — `STRIPE_SECRET_KEY=sk_live_xxxxx`)
- `.env.template`

## Verification commands
```bash
# 1. Pattern scan on staged diff
git diff --cached | grep -iE "(rk_live_|sk_live_|pk_live_|Bearer [A-Za-z0-9._-]{20,}|password\s*=|api_key\s*=)" && echo "FAIL" || echo "PASS"

# 2. Forbidden files scan
git diff --cached --name-only | grep -E "^\.env(\.|$)|\.pem$|\.key$|id_rsa" | grep -v "\.env\.example$\|\.env\.template$" && echo "FAIL" || echo "PASS"

# 3. Tracked file audit (anything ever committed)
git ls-files | grep -E "^\.env(\.|$)" | grep -v "\.env\.example$" && echo "FAIL" || echo "PASS"
```

## Fail action
- BLOCK commit immediately
- Reset staging: `git reset HEAD <file>`
- Add file to `.gitignore`
- If secret was previously committed: rotate key NOW, then run `git filter-repo` or BFG to scrub history (advanced, ask user)

## Bypass
Never. No exceptions. If a real key MUST be referenced in code (e.g., webhook secret name), use the env var name, not the value.
