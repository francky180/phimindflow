# Workflow: playwright-validation

## Trigger
- Any UI change (`.tsx`, `.jsx`, `.css`, layout files)
- Pre-deploy gate
- Post-deploy canary

## Purpose
Verify UI renders correctly in real browser, on both viewports, with clean console + network.

## Steps
1. **Navigate** — `browser_navigate(url)` to target URL.
2. **Desktop snapshot** — `browser_resize(1920, 1080)` → `browser_snapshot()` → `browser_take_screenshot(filename: "<route>-desktop.png")`.
3. **Mobile snapshot** — `browser_resize(390, 844)` → `browser_snapshot()` → `browser_take_screenshot(filename: "<route>-mobile.png")`.
4. **Console check** — `browser_console_messages()` — capture all errors and warnings.
5. **Network check** — `browser_network_requests()` — flag any 4xx / 5xx.
6. **Flow execution** — for each named flow, click/type per the script, verify expected state via `browser_snapshot()`.
7. **Evidence** — save screenshots to `scripts/agent-tests/evidence/<date>/`.

## Owner agent
Playwright Tester (08)

## Output
Per `agents/roles/08-playwright-tester.md` output format.

## Pass criteria
- Both viewports render expected content
- Zero console errors (warnings allowed if noted)
- Zero 5xx network responses
- All flow steps verified by snapshot, not by URL change alone
- Screenshots saved as evidence
