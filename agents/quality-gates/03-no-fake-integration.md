# Gate: no-fake-integration

## Rule
Every external integration referenced in code must have:
1. Real env vars configured in `.env.local` AND Vercel
2. A working smoke test proving the integration responds
3. Documented in `ARCHITECTURE.md` or `docs/integrations.md`

## Why
"Fake integrations" — code paths that pretend to call Stripe / Zernio / Supabase but use mock or placeholder values — silently break when shipped. Users hit a dead button.

## Verification

### 1. Env var presence
For every imported SDK in `package.json` or code:
```bash
# Find imports
grep -rE "from ['\"](stripe|@zernio|@supabase|resend|@anthropic-ai)" --include="*.ts" --include="*.tsx" | head

# Confirm matching env vars in .env.local schema
grep -E "STRIPE_|ZERNIO_|SUPABASE_|RESEND_|ANTHROPIC_" .env.example
```

### 2. Smoke test exists
Each integration must have a script in `site/scripts/` that proves it works:
- Stripe: `scripts/verify-stripe.mjs` → calls `stripe.balance.retrieve()` → expects 200
- Zernio: `scripts/verify-posts.mjs` → calls `client.listAccounts()` → expects ≥1 account
- Supabase: `scripts/verify-supabase.mjs` → calls a `select 1` → expects success
- Resend: `scripts/verify-resend.mjs` → calls `resend.domains.list()` → expects 200

### 3. ARCHITECTURE.md mention
The integration must appear in the architecture doc with: purpose, env vars, failure mode, fallback.

## Forbidden patterns (CRITICAL)
- Hardcoded mock URLs (`https://example.com`, `https://api.fake.com`) in production code paths
- `// TODO: replace with real key` or `process.env.FOO || "demo"` in non-dev paths
- Imported but never called SDKs
- Buttons whose `onClick` is empty or `console.log` only

## Fail action
- Block merge
- Either: (a) wire the integration properly, OR (b) remove the fake code, OR (c) flag with `// FAKE: <reason>` and exclude from prod build

## Bypass
Only with explicit `// PLACEHOLDER: <reason + ETA>` comment AND the user's approval AND a tracking issue created.
