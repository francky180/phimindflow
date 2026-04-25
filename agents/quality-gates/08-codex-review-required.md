# Gate: codex-review-required

## Rule
The following changes MUST pass Codex review (verdict: APPROVED) before merge:
1. Any change ≥ 50 lines of code (LOC)
2. Any change touching auth code paths
3. Any change touching payment / Stripe / Whop logic
4. Any change touching webhook handlers
5. Any change touching env var schema or secret handling
6. Any architectural decision (escalates to council)

## Why
Single-model blind spots are real. A second model with different training catches things Claude misses. Codex (GPT-5.2) is fundamentally different from Claude (Opus) — different bias, different blind spots.

## Required evidence
- Codex session ID
- Severity-grouped findings (CRITICAL / WARNING / NIT)
- Final verdict line: APPROVED / REVISE / REJECT
- For TRADEOFF findings: council-mode synthesis with both positions

## Verification
- File `agents/workflows/03-codex-review-gate.md` invoked
- File `agents/roles/07-codex-reviewer.md` output format produced
- Stored to: `agents/reviews/<YYYY-MM-DD>-<scope>.md`

## Verdict requirements
- **APPROVED** — ship it (still address NIT findings if cheap)
- **REVISE** — fix CRITICAL + WARNING, then re-run Codex review (max 3 rounds)
- **REJECT** — fundamental issue, redesign before retry
- **TRADEOFF** — surface to user, do not silently choose

## Fail action
- BLOCK merge until verdict ≠ REJECT and CRITICAL count = 0
- If round 3 still REVISE: stop, escalate to user — pattern suggests design issue, not implementation

## Bypass
Allowed for:
- Comment-only changes
- Test-file-only changes
- Doc-only changes
- Generated file changes (lockfiles, build outputs)
- Emergency hotfix reverts (must follow up with Codex review post-merge)

Never bypass for:
- Anything touching money path
- Anything touching auth
- Anything touching webhooks
