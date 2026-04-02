# Forex Lead Discovery

How to find likely audiences and communities for PHIMINDFLOW using available tools.

## Where to Look

### Forex Communities (web reading)
```bash
# Read forex forums and communities
curl -s "https://r.jina.ai/https://www.forexfactory.com/forum.php"
curl -s "https://r.jina.ai/https://www.babypips.com/forexforum"
curl -s "https://r.jina.ai/https://www.myfxbook.com/community"
```

### YouTube Comments (for audience signals)
```bash
# Find popular forex videos and extract comments
yt-dlp --write-comments --skip-download --write-info-json \
  --extractor-args "youtube:max_comments=20" \
  -o "/tmp/%(id)s" "VIDEO_URL"

# Read comments from the JSON
python -c "
import json
data = json.load(open('/tmp/VIDEO_ID.info.json'))
for c in data.get('comments', [])[:20]:
    print(f\"{c.get('author','')} — {c.get('text','')[:100]}\")
"
```

### Whop Discovery
```bash
# See what's popular in forex on Whop
curl -s "https://r.jina.ai/https://whop.com/categories/forex/"
```

## Audience Profiles to Target

| Profile | Pain Point | Best CTA |
|---------|-----------|----------|
| Beginner trader | No system, confused by signals | Broker signup (free) → Starter |
| Intermediate trader | Inconsistent results, no framework | Starter → Premium |
| Experienced trader wanting passive | No time to trade actively | Premium → VIP/Elite |
| Content creator/affiliate | Looking for products to promote | White-Label Bot |

## Safe Lead Discovery Rules

- Only observe public discussions — do not spam or DM
- Identify common questions and pain points
- Create content that answers those questions naturally
- Let the funnel do the conversion work
- Link to the free entry point (broker signup) to minimize friction

## Turning Discovery Into Action

1. Find 3-5 active discussions or communities per week
2. Note the top 3 pain points mentioned
3. Create content addressing those pain points
4. Include appropriate affiliate link (see `FOREX_PROMOTION_SYSTEM.md`)
5. Post where the audience already is
