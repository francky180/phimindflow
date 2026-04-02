# Agent Reach — System Map

## What It Does

Agent Reach gives Claude Code (and other AI agents) direct access to internet platforms via CLI, curl, and Python scripts. It is a routing + scaffolding layer — not a wrapper. After install, the agent calls upstream tools directly.

## Install Locations

| Component | Path |
|-----------|------|
| Source/repo | `C:\Users\franc\ai-tools\agent-reach` |
| CLI binary | `C:\Users\franc\AppData\Local\Programs\Python\Python312\Scripts\agent-reach.exe` |
| Claude Code skill | `C:\Users\franc\.claude\skills\agent-reach` |
| yt-dlp config | `C:\Users\franc\AppData\Roaming\yt-dlp\config` |

## Verified Channels (Current Machine)

| Channel | Status | Method |
|---------|--------|--------|
| Any webpage | Working | `curl -s "https://r.jina.ai/URL"` |
| RSS/Atom feeds | Working | Python feedparser |
| V2EX | Working | Public API |
| Bilibili (basic) | Working | yt-dlp |
| YouTube subtitles | Partial | yt-dlp (JS runtime configured) |
| GitHub | Partial | Needs `gh` CLI install |

## Not Yet Unlocked

| Channel | Requires |
|---------|----------|
| Twitter/X | Cookie-based auth |
| Reddit | `rdt-cli` install |
| Exa semantic search | `mcporter` + MCP config |
| LinkedIn | MCP service (Docker) |
| WeChat articles | `mcporter` + Exa MCP |
| Douyin/TikTok | MCP service |
| XiaoHongShu | MCP service (Docker) |

## Essential Commands

```bash
# Check system health
agent-reach doctor

# Version
agent-reach --version

# Read any webpage as clean Markdown
curl -s "https://r.jina.ai/https://example.com"

# YouTube search (top 5 results)
yt-dlp --dump-json "ytsearch5:forex algo trading"

# YouTube subtitles
yt-dlp --write-sub --write-auto-sub --sub-lang en --skip-download -o "/tmp/%(id)s" "VIDEO_URL"

# RSS feed
python -c "import feedparser; [print(e.title, e.link) for e in feedparser.parse('FEED_URL').entries[:5]]"

# V2EX hot topics
curl -s "https://www.v2ex.com/api/topics/hot.json" -H "User-Agent: agent-reach/1.0"
```

## Integration with Claude Code

Agent Reach is registered as a Claude Code skill. Claude Code can automatically route platform requests (search, read, scrape) through Agent Reach's routing table without manual CLI usage.

## Uninstall (if ever needed)

```bash
pip uninstall agent-reach
# Then delete: C:\Users\franc\ai-tools\agent-reach
# Then delete: C:\Users\franc\.claude\skills\agent-reach
```
