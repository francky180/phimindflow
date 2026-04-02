# Forex Daily Operator Loop

A repeatable daily sequence for running the PHIMINDFLOW / OxyAlgo forex system.

## Morning: Research (15 min)

1. **Check forex news/sentiment**
   ```bash
   curl -s "https://r.jina.ai/https://www.forexfactory.com/calendar"
   ```

2. **Scan competitor offers** (pick 1-2 per day)
   ```bash
   curl -s "https://r.jina.ai/https://whop.com/categories/forex/"
   ```

3. **Check YouTube for trending forex content ideas**
   ```bash
   yt-dlp --dump-json "ytsearch5:forex algo trading 2026" 2>/dev/null | python -c "
   import sys,json
   for line in sys.stdin:
     d=json.loads(line)
     print(f\"{d.get('title','')} — {d.get('view_count',0)} views\")
   "
   ```

## Midday: Content + Promotion (20 min)

4. **Create content from research**
   - Use findings from morning research
   - Create 1 social post or 1 short-form script
   - Reference the PHIMINDFLOW brand guidelines: `docs/brand.md`, `docs/copy-guidelines.md`

5. **Select promotion angle**
   - Refer to `FOREX_PROMOTION_SYSTEM.md` for which link to use
   - Primary entry: Broker signup (free, lowest friction)
   - Secondary: Starter tier (Whop)
   - Premium upsell: Premium/VIP tier

6. **Post or schedule content**
   - Include affiliate link for the selected angle
   - Track which angle you used

## Evening: Review (5 min)

7. **Check Whop dashboard** for new signups
8. **Check broker dashboard** for new registrations
9. **Note what worked** — which angle, which content type

## Weekly Addition

- Run `/market-competitors` skill for structured competitive analysis
- Run `/market-seo` skill against the live site
- Review and update content calendar

## Key Principle

Research → Content → Traffic → Whop. Every day pushes one step of this loop.
