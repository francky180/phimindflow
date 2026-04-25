#!/usr/bin/env bash
# codex-review-diff.sh — send the current uncommitted diff to Codex for adversarial review
# Implements `agents/workflows/03-codex-review-gate.md`.
#
# Usage:
#   ./scripts/agent-tests/codex-review-diff.sh                  # review staged + unstaged
#   ./scripts/agent-tests/codex-review-diff.sh --staged          # review staged only
#   ./scripts/agent-tests/codex-review-diff.sh main..HEAD        # review branch vs main
#
# Codex must be installed and authenticated. No API key passed — uses subscription auth.

set -u

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT" || exit 1

# Build the diff
case "${1:-}" in
  --staged)
    DIFF="$(git diff --cached)"
    SCOPE="staged changes"
    ;;
  "")
    DIFF="$(git diff HEAD)"
    SCOPE="uncommitted changes (staged + unstaged)"
    ;;
  *)
    DIFF="$(git diff "$1")"
    SCOPE="$1"
    ;;
esac

if [ -z "$DIFF" ]; then
  echo "No changes to review for: $SCOPE"
  exit 0
fi

# Trim diff if huge (Codex prompt size budget)
LINES=$(echo "$DIFF" | wc -l)
if [ "$LINES" -gt 1500 ]; then
  echo "⚠ Diff is $LINES lines — truncating to first 1500 for prompt budget."
  DIFF="$(echo "$DIFF" | head -1500)"
  DIFF="$DIFF

[... diff truncated for prompt size; review covers first 1500 lines only ...]"
fi

PROMPT="You are an adversarial code reviewer for the PHIMINDFLOW project.

Scope: $SCOPE

Review the following git diff. Group findings by severity:
- CRITICAL — must fix before merge (correctness bugs, security holes, data loss, broken contracts)
- WARNING — should fix (race conditions, missing validation, fragile assumptions, idempotency holes)
- NIT — consider fixing (style, naming, minor improvements)

For each finding, give:
- file:line reference
- one-line description
- one-line concrete fix

End with:
- Total counts (N CRITICAL / N WARNING / N NIT)
- Final verdict: APPROVED / REVISE / REJECT
- If you find a TRADEOFF (genuine design choice, not a defect), label it TRADEOFF.

DIFF:
$DIFF"

echo "═══════════════════════════════════════════════"
echo " Codex Review — $SCOPE"
echo " $(date)"
echo "═══════════════════════════════════════════════"

codex exec \
  -m gpt-5.2 \
  -s read-only \
  --skip-git-repo-check \
  "$PROMPT"

echo ""
echo "─── Review complete ───"
