# Gate: no-duplicate-folders

## Rule
No two folders may serve overlapping purposes within the same scope. One canonical source per concept.

## Why
The current `Projects/` root has 5 overlapping system folders (`franc-system-backup`, `franc-system-template`, `system-audit-docs`, `system-rebuild-docs`, `system-setup-package`). Cognitive load + stale information + onboarding confusion.

## Forbidden patterns
- Two folders with same prefix and similar purpose: `system-*`, `*-backup`, `*-old`, `archived-*`
- Two repos for the same product (e.g., `phimindflow-site` and `phimindflow-website`)
- A `*/copy/` or `*/v2/` folder alongside the original
- A nested project inside a project (`websites/phimindflow-site/old-version/`)

## Verification
```bash
# Top-level duplicate scan
ls /c/Users/franc/Projects/ | sort | awk '{prefix=substr($1, 1, 6); print prefix}' | sort | uniq -c | sort -rn | head

# Duplicate-purpose name scan
ls /c/Users/franc/Projects/websites/ | grep -iE "(backup|old|copy|v[0-9]|archived|deprecated)" && echo "FOUND DUPLICATES" || echo "CLEAN"

# Nested-project scan
find /c/Users/franc/Projects/websites/*/site -name "package.json" -path "*/site/site/*"
```

## Approved exceptions
- `system/archive/` (one collection of archived snapshots, not five top-level folders)
- `_research_*` (clearly marked research/scratch, gitignored from main work)
- `*-template` (one canonical template per system)

## Fail action
- Flag in audit
- Propose consolidation plan to user (which is canonical, what to archive, what to delete)
- Never auto-delete — always require explicit approval

## Bypass
Allowed when: (a) two folders genuinely serve different purposes despite similar names, AND (b) a 1-line comment in each folder's README explains the distinction.
