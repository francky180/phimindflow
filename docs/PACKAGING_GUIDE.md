# PHIMINDFLOW — Packaging Guide

## What Ships

### Core (required)
```
site/                    # Next.js application
├── app/                 # Source code
├── public/              # Static assets
├── package.json         # Dependencies
├── next.config.ts       # Framework config
├── tsconfig.json        # TypeScript config
├── postcss.config.mjs   # Tailwind config
└── eslint.config.mjs    # Linting config
```

### Documentation (recommended)
```
docs/                    # All documentation
offers/                  # Offer structure
prompts/                 # Build prompts
skills/                  # Skill packs
CLAUDE.md                # Claude instructions
PROJECT_BRIEF.md         # Vision
README.md                # Overview
```

### Video (optional)
```
video/src/               # Remotion source
video/out/               # Rendered MP4
video/package.json       # Video dependencies
```

## What Does NOT Ship

```
site/node_modules/       # Regenerated via npm install
site/.next/              # Regenerated via npm run build
site/.vercel/            # Vercel-specific (auto-created)
video/node_modules/      # Regenerated via npm install
.git/                    # Git history (unless cloning)
.claude/                 # Local Claude settings
```

## Creating a Clean Package

```bash
# From project root
cd ..

# Create archive excluding generated files
tar --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.vercel' \
    --exclude='.git' \
    --exclude='.claude' \
    -czf phimindflow-site.tar.gz phimindflow-site/
```

On Windows (PowerShell):
```powershell
# Compress excluding generated dirs
$exclude = @('node_modules', '.next', '.vercel', '.git', '.claude')
# Use 7-Zip or manual selection
```

## Recipient Setup

After receiving the package:

```bash
# Extract
tar -xzf phimindflow-site.tar.gz
cd phimindflow-site/site

# Install and run
npm install
npm run build
npm run dev
# → http://localhost:3000
```

## Machine-Specific Items

The following are machine-specific and will need reconfiguration on a new machine:
- `.vercel/project.json` (Vercel project ID)
- Any `.env` files (none currently exist)
- External tooling in ~/ai-tools/ (separate installation)

## Portability Notes

- No environment variables required
- No database or external services required
- All funnel links are hardcoded in `site/app/constants.ts`
- Site is fully static — can be hosted anywhere that serves HTML
- Vercel deployment is configured via GitHub integration
