# PHIMINDFLOW — Install Guide

## Prerequisites

- Node.js 24+ (current: v24.14.1)
- npm 11+ (current: 11.11.0)
- Git

## Website Setup

```bash
# Clone the repo
git clone <repo-url> phimindflow-site
cd phimindflow-site/site

# Install dependencies
npm install

# Development server
npm run dev
# → http://localhost:3000

# Production build
npm run build
npm start
```

## Video Setup (Remotion)

```bash
cd phimindflow-site/video

# Install dependencies
npm install

# Preview in browser
npx remotion preview src/index.ts

# Render video
npx remotion render src/index.ts PhimindflowPromo out/forex-video.mp4
```

Requires: Node.js, no additional system dependencies on Windows.

## External Tooling (optional)

These are installed at `C:\Users\franc\ai-tools\` and are NOT required to run the website.

### Agent Reach (Python CLI)
```bash
cd ~/ai-tools/agent-reach
pip install -e .
agent-reach --version  # Should show v1.4.0
```

### oh-my-claudecode (Node.js CLI)
```bash
npm install -g oh-my-claude-sisyphus
oh-my-claudecode --version  # Should show 4.9.3
```

### AI Marketing Claude (Skills)
Already installed as Claude skills. Invoke via `/market` commands in Claude Code.

### UI/UX Pro Max (CLI)
```bash
npx uipro-cli --version  # Should show 2.2.3
```

## Verification

```bash
cd site
npm run lint    # Should be clean
npm run build   # Should compile successfully
```

Check `site/app/constants.ts` to verify funnel links are correct.
