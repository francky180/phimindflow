#!/usr/bin/env bash
# run-safe-checks.sh — read-only health check for the PHIMINDFLOW agent system
# This script runs the safe portion of `agents/workflows/06-full-system-audit.md`.
# It does NOT modify files, deploy, or call external APIs that cost money.

set -u  # error on unset variables; do NOT use -e (we want to continue on individual failures)

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SITE="$ROOT/site"
PASS=0
FAIL=0

check() {
  local name="$1"
  local cmd="$2"
  echo ""
  echo "── $name"
  if eval "$cmd"; then
    echo "  ✓ PASS"
    PASS=$((PASS + 1))
  else
    echo "  ✗ FAIL"
    FAIL=$((FAIL + 1))
  fi
}

echo "═══════════════════════════════════════════════"
echo " PHIMINDFLOW Agent System — Safe Health Check"
echo " $(date)"
echo "═══════════════════════════════════════════════"

check "Node available" "node --version > /dev/null"
check "npm available"  "npm --version > /dev/null"
check "git available"  "git --version > /dev/null"
check "Codex CLI available" "codex --version > /dev/null 2>&1 || command -v codex > /dev/null"

check "agents/roles/ has 10 files"        "[ \$(ls $ROOT/agents/roles/*.md 2>/dev/null | wc -l) -eq 10 ]"
check "agents/workflows/ has 6 files"     "[ \$(ls $ROOT/agents/workflows/*.md 2>/dev/null | wc -l) -eq 6 ]"
check "agents/quality-gates/ has 8 files" "[ \$(ls $ROOT/agents/quality-gates/*.md 2>/dev/null | wc -l) -eq 8 ]"

check "site/package.json exists" "[ -f $SITE/package.json ]"
check "no .env staged" "! git -C $ROOT diff --cached --name-only 2>/dev/null | grep -E '^\\.env(\\.|$)' | grep -v 'env\\.example'"
check "no Untitled* / *.bak / *.tmp at site root" "! find $SITE -maxdepth 2 \\( -iname 'untitled*' -o -name '*.bak' -o -name '*.tmp' -o -name '*~' \\) -not -path '*/node_modules/*' -not -path '*/.next/*' 2>/dev/null | grep -q ."

echo ""
echo "═══════════════════════════════════════════════"
echo " Results: $PASS passed, $FAIL failed"
echo "═══════════════════════════════════════════════"

[ $FAIL -eq 0 ]
