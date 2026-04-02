# Forex Content Research

How to use Agent Reach + available tools to find trending topics, content angles, and sources for PHIMINDFLOW content.

## Find Trending Forex Topics

### YouTube (verified working)
```bash
# Search for trending forex algo content
yt-dlp --dump-json "ytsearch10:forex algo trading" 2>/dev/null | python -c "
import sys,json
for line in sys.stdin:
  d=json.loads(line)
  print(f\"{d.get('title','')} | {d.get('view_count',0)} views | {d.get('upload_date','')}\")
"

# Get subtitles from a specific video for content ideas
yt-dlp --write-sub --write-auto-sub --sub-lang en --skip-download -o "/tmp/%(id)s" "VIDEO_URL"
cat /tmp/VIDEO_ID.en.vtt
```

### Web Pages (verified working)
```bash
# Read any forex article as clean Markdown
curl -s "https://r.jina.ai/https://www.babypips.com/learn/forex"

# Read competitor landing pages
curl -s "https://r.jina.ai/https://whop.com/categories/forex/"
```

### RSS Feeds (verified working)
```bash
# Subscribe to forex news feeds
python -c "
import feedparser
feed = feedparser.parse('https://www.forexfactory.com/rss.php')
for e in feed.entries[:5]:
    print(f'{e.title} — {e.link}')
"
```

## Content Angle Generation

After gathering raw research, look for these patterns:

1. **Pain points** — What are traders struggling with? (risk management, overtrading, no system)
2. **Proof angles** — What results are people sharing? How does PHIMINDFLOW compare?
3. **Education gaps** — What questions are being asked but not answered well?
4. **Trend hooks** — What's trending in forex right now that we can tie into?

## Turn Research Into Output

| Research Finding | Content Type | Where to Post |
|-----------------|--------------|---------------|
| Trending topic | Short video script | TikTok, YouTube Shorts, Reels |
| Competitor weakness | Comparison post | Twitter/X, Discord |
| Education gap | Tutorial/explainer | YouTube, Blog |
| Proof/results | Testimonial-style | Instagram, Discord |

## Source Quality Rules

- Only use publicly available information
- Do not fabricate claims or results
- Reference real data from the PHIMINDFLOW system
- Keep tone premium, direct, and confidence-building (see `docs/copy-guidelines.md`)
