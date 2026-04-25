# Gate: playwright-required

## Rule
Every UI change must have Playwright snapshot evidence (desktop + mobile) before merge.

## Why
"Looks good in Storybook" ≠ "works in production." Real-browser, both viewports, every time.

## When this gate fires
- Any change to `.tsx`, `.jsx`, `.css`, `.svelte`, `.vue` files
- Any change to `app/layout.tsx`, `app/page.tsx`, `app/**/page.tsx`
- Any change to global styles, design tokens, Tailwind config
- Any change to motion / animation logic
- Any deploy (post-deploy canary)

## Required evidence per change
1. Desktop snapshot: 1920×1080 — saved as `<route>-desktop-<date>.png`
2. Mobile snapshot: 390×844 — saved as `<route>-mobile-<date>.png`
3. Console summary: count of errors + sample messages
4. Network summary: count of 4xx/5xx + sample URLs
5. Flow verification: if change touches a flow (checkout, signup, form), full flow tested

## Verification
Invoke `agents/workflows/02-playwright-validation.md` and confirm output includes all 5 evidence items.

## Storage
Save evidence to: `scripts/agent-tests/evidence/<YYYY-MM-DD>/<route>/`

## Fail action
- BLOCK merge
- If Playwright MCP cannot reach URL: confirm dev server running OR use live preview deploy
- If snapshots reveal regression: open issue, return to Frontend Engineer

## Bypass
Allowed for: README-only changes, doc-only changes, comment-only changes, env var schema changes (no UI surface).
