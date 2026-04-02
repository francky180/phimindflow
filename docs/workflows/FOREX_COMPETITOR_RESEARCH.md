# Forex Competitor Research

How to analyze competing forex algo/copy-trading offers using available tools.

## Step 1: Find Competitors

```bash
# Scan Whop forex category
curl -s "https://r.jina.ai/https://whop.com/categories/forex/"

# Search for specific competitor pages
curl -s "https://r.jina.ai/https://whop.com/COMPETITOR_SLUG/"

# YouTube competitor content
yt-dlp --dump-json "ytsearch5:best forex algo bot 2026" 2>/dev/null | python -c "
import sys,json
for line in sys.stdin:
  d=json.loads(line)
  print(f\"{d.get('title','')} | {d.get('channel','')} | {d.get('view_count',0)} views\")
"
```

## Step 2: Analyze Key Dimensions

For each competitor, capture:

| Dimension | What to Check |
|-----------|---------------|
| Pricing | Tier structure, price points, free vs paid |
| Positioning | How they describe themselves, unique claims |
| CTA flow | What the first action is, how they funnel |
| Social proof | Reviews, testimonials, member counts |
| Weaknesses | Missing features, unclear messaging, poor UX |

## Step 3: Compare Against PHIMINDFLOW

| Factor | PHIMINDFLOW | Competitor |
|--------|-------------|------------|
| Entry point | Free broker signup | ? |
| Tier range | Starter → Elite | ? |
| Differentiation | Fibonacci system, structured 3-step funnel | ? |
| Copy quality | Premium, direct, confidence-building | ? |
| Broker integration | Genesis FX + Liquid Brokers | ? |

## Step 4: Extract Actionable Insights

- What pricing gaps exist we can fill?
- What CTA patterns are working for top sellers?
- What claims are competitors making that we can do better?
- What content angles are competitors ignoring?

## Automation

Use Claude Code's `/market-competitors` skill for a structured analysis:
```
/market-competitors [competitor URL or name]
```

This generates a full competitive intelligence report using the AI Marketing Suite.
