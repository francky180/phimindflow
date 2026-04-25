# Gate: no-broken-build

## Rule
`npm run build` must exit 0 BEFORE any commit pushed to a deploy-tracked branch.

## Why
Auto-deploy repos (phimindflow-site, ai-system-factory, ai-agency-system) push directly to prod. A broken build = broken prod.

## Verification command
```bash
cd /c/Users/franc/Projects/websites/<repo>/site && npm run build
echo "Exit code: $?"
```

## Pass
- Exit code 0
- Output ends with `✓ Compiled successfully` (Next.js) or framework equivalent
- No new TypeScript errors
- No new ESLint errors

## Fail action
- BLOCK commit
- Capture build output
- Hand back to engineer with full error log
- Suggest first 3 candidate fixes if pattern is recognizable (missing import, type error, env var)

## Bypass
Never. There is no `--no-verify` for a broken build going to prod.
