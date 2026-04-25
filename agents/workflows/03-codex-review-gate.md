# Workflow: codex-review-gate

## Trigger
- Any change ≥ 50 LOC
- Any change touching auth, payment, webhook, security, env vars
- Any architectural decision (escalates to council mode)

## Purpose
Independent adversarial review by Codex (different model = different blind spots). Cross-model discipline.

## Steps
1. **Collect context** — assemble full diff + relevant file contents into a single prompt.
2. **Invoke Codex**:
   ```bash
   codex exec \
     -m gpt-5.2 \
     -s read-only \
     --skip-git-repo-check \
     "<adversarial review prompt with full diff>"
   ```
3. **Parse verdict** — extract CRITICAL / WARNING / NIT findings + final verdict line.
4. **If REVISE**:
   - Apply fixes
   - Re-invoke `codex exec` (max 3 rounds)
   - If still REVISE after round 3 → escalate to user.
5. **If TRADEOFF detected** — escalate to council mode:
   - State Claude position
   - Get Codex independent position
   - Up to 2 rebuttal rounds
   - Synthesize and present both sides; user decides.

## Codex command reference
```bash
# One-shot review
codex exec -m gpt-5.2 -s read-only --skip-git-repo-check "<prompt>"

# Multi-turn deep dive (resume session)
codex --resume <session-id>

# Inside a git repo (omit --skip-git-repo-check, lets Codex run git diff itself)
codex exec -m gpt-5.2 -s read-only "Review uncommitted changes; flag CRITICAL/WARNING/NIT."
```

## Owner agent
Codex Reviewer (07)

## Output
Per `agents/roles/07-codex-reviewer.md` output format.

## Pass criteria
- Final verdict: APPROVED (no CRITICAL findings)
- All WARNING findings either fixed or explicitly waived with rationale
- TRADEOFF findings surfaced to user (not silently ignored)
- Session ID logged for future resume
