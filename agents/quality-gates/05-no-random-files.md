# Gate: no-random-files

## Rule
No untitled, temp, backup, or editor-artifact files at project root or in tracked paths.

## Why
Clutter compounds. "Untitled-1.md", "Copy of homepage.tsx", "page.tsx.bak" — each one is a trip hazard for future edits. Premium projects don't have stray files.

## Forbidden patterns
- `Untitled*`, `untitled*`
- `Copy of *`, `* copy`, `* (1).*`, `* (2).*`
- `*.bak`, `*.tmp`, `*.swp`, `*.swo`, `*~`, `.DS_Store`
- `Thumbs.db`, `desktop.ini`
- `test.txt`, `scratch.md`, `notes.txt` at project root
- `*.log` outside `logs/` directory
- IDE artifacts: `.idea/workspace.xml` (per-user state — should be gitignored)

## Verification
```bash
# Project-root scan
find /c/Users/franc/Projects/websites/phimindflow-site -maxdepth 2 \
  \( -iname "untitled*" -o -name "*copy*" -o -name "*.bak" -o -name "*.tmp" \
     -o -name "*~" -o -name ".DS_Store" -o -name "Thumbs.db" \
     -o -name "*.swp" -o -name "*.swo" \) \
  -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.git/*"
```

## Allowed (do NOT flag)
- Test files following naming convention: `*.test.ts`, `*.spec.ts`
- Build outputs in `.next/`, `dist/`, `build/` (gitignored)
- Logs in `logs/` directory (gitignored)
- Lockfiles: `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`

## Fail action
- List all violations
- Propose: delete (if clearly stray) OR move to `archive/` OR rename properly
- Update `.gitignore` to prevent recurrence
- Never auto-delete — show user the list, get approval per file or per category

## Bypass
Allowed when: file is intentional + has a 1-line comment at top explaining why + matches a documented exception in `docs/file-conventions.md`.
