# PHIMINDFLOW — Tooling Status

Last verified: 2026-04-01

## Summary

| Tool | Version | Status | Location |
|------|---------|--------|----------|
| Agent Reach | 1.4.0 | INSTALLED + ACTIVE | ~/ai-tools/agent-reach/ |
| oh-my-claudecode | 4.9.3 | INSTALLED + ACTIVE | ~/ai-tools/oh-my-claudecode/ |
| AI Marketing Claude | latest | INSTALLED + ACTIVE | ~/ai-tools/ai-marketing-claude/ |
| UI/UX Pro Max | 2.5.0 | INSTALLED + ACTIVE | ~/ai-tools/ui-ux-pro-max-skill/ |
| Remotion | 4.0.443 | INSTALLED (project-local) | video/node_modules/ |

## Detailed Status

### Agent Reach — PRESENT AND ACTIVE
- **Path:** C:\Users\franc\ai-tools\agent-reach\
- **CLI:** `agent-reach --version` → v1.4.0
- **Python:** Installed via `pip install -e .`
- **Skill:** Registered at ~/.claude/skills/agent-reach/
- **Channels:** 17+ (Twitter, Reddit, YouTube, Bilibili, Xiaohongshu, etc.)
- **Dependencies:** All resolved (requests, feedparser, rich, yt-dlp, etc.)
- **Limitations:** Some API credentials need manual setup (Exa, Groq)

### oh-my-claudecode (OMC) — PRESENT AND ACTIVE
- **Path:** C:\Users\franc\ai-tools\oh-my-claudecode\
- **CLI:** `oh-my-claudecode --version` → 4.9.3
- **npm global:** oh-my-claude-sisyphus@4.9.3
- **MCP:** Configured in .mcp.json
- **Features:** Multi-agent orchestration, missions, hooks, skills
- **Limitations:** tmux not available on Windows (partial feature set)

### AI Marketing Claude — PRESENT AND ACTIVE
- **Path:** C:\Users\franc\ai-tools\ai-marketing-claude\
- **Skills:** 15 agents registered in ~/.claude/skills/market*/
- **Dependencies:** None required (source-based)
- **Invocation:** `/market`, `/market-seo`, `/market-audit`, etc.
- **All agents:** market, market-ads, market-audit, market-brand, market-competitors, market-copy, market-emails, market-funnel, market-landing, market-launch, market-proposal, market-report, market-report-pdf, market-seo, market-social

### UI/UX Pro Max — PRESENT AND ACTIVE
- **Path:** C:\Users\franc\ai-tools\ui-ux-pro-max-skill\
- **CLI:** `npx uipro-cli` → v2.2.3
- **Capabilities:** 67 UI styles, 161 color palettes, 57 font pairings, 99 UX guidelines
- **Registration:** Not registered as Claude skill (standalone reference + CLI)

### Remotion — PRESENT (PROJECT-LOCAL)
- **Path:** C:\Users\franc\Projects\websites\phimindflow-site\video\
- **Version:** 4.0.443 (in video/package.json)
- **Global CLI:** Not installed (use `npx remotion` from video/ directory)
- **Output:** video/out/forex-video.mp4 (1.3 MB, 15s @ 30fps, 1920x1080)
- **Status:** Installed and renders successfully

## Runtime Environment

| Component | Version |
|-----------|---------|
| Node.js | v24.14.1 |
| npm | 11.11.0 |
| Python | 3.12.10 |
| pip | 25.0.1 |
| Git | installed |

## Not Installed (by design)

- **21st-dev tooling:** No standalone install found. Not a separate tool — it's a design reference/approach, not installable software.
- **Remotion global CLI:** Not needed; project uses `npx remotion` locally.
