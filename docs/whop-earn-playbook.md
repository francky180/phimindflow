# Whop Content Rewards — Earn Playbook

Your Ssemble → Zernio pipeline makes you a clip-production machine. These campaigns pay you per 1K views.

## How the flow works

1. Click **Join Campaign** on Whop → accept rules → get a tracking code
2. Run your normal pipeline: `node scripts/clip-and-post.mjs "<youtube-url>"` (IG + Twitter + TikTok auto)
3. For Whop campaigns: also manually post the clip on the platform(s) they require (usually TikTok), with the campaign's hashtags/link in bio
4. Whop tracks views via their tracking link or hashtag → pays 2x/month to your Whop wallet
5. Withdraw via Stripe/PayPal/bank

## 🎯 Campaigns ranked for your audience (@fitflybusiness: credit, wealth, faith, forex)

### Tier 1 — Direct audience fit, low effort

| Campaign | CPM | Budget | Source content | Your edge |
|---|---|---|---|---|
| **Crypto Fund Trader** | $1.50/1K | ~$1.5K | Their YouTube tutorials / funded trader stories | You already make forex content — direct fit |
| **Market AI [TRADING]** | $0.75/1K | $5K | AI trading product demos | Fits faceless page exactly |
| **Tradevisor.ai** | $2/1K | $2K | Their trading AI demos | Same as above |
| **AI Crypto Signals Pro** | $4/1K | $500 | Their signal alerts / wins | Small budget, easy to saturate |
| **MyFundedFutures (MFF)** | $1/1K | $5K | Funded trader testimonials | $5K budget = lots of room |

**Why these first:** Your @fitflybusiness IG+Twitter+TikTok already posts trading/faith/money content. These clips fit native feed, not a new audience pivot. Minimum friction.

### Tier 2 — Lifestyle / personal brand (your page vibe works)

| Campaign | CPM | Budget | Source | Effort |
|---|---|---|---|---|
| **Russell Brunson** | $3/1K | $3.5K | His speeches, ClickFunnels clips | Medium — need his YT catalog |
| **Yomi Denzel Clipping** | $1/1K | $100K | His YT (business/ecom) | Low — huge budget, easy pay |
| **Polymarket UGC Reposting** | $0.50/1K | $45K | Their trending market predictions | Low CPM but $45K pool = steady |
| **Eric Spofford Clips** | $1/1K | $5K | His podcast / speeches | Med — recovery/sobriety angle |
| **House of Profits** | $0.50/1K | $10K | Their YT teaching content | Low but established |

### Tier 3 — Skip unless you like the brand

Polymarket [Reaction Clipping] ($1/1K), Abu Lahya ($1.50/1K), Adaptive AI — all fine but require more niche understanding.

### Avoid (for now)
- Sports/gaming campaigns (wrong audience for @fitflybusiness)
- Spanish/German-only campaigns (wrong language for your account)
- Music video clipping (unless you like the artist) — lower retention, harder fit

---

## 🎬 Clip spec template (what makes these pay out)

Each campaign has specific rules (check their page for exact wording), but the universal pattern:

### Format
- **Vertical 9:16 · 1080x1920** (your `direct-clip-post.mjs` already does this)
- **Length: 30–60 seconds** (under 60 for Reels/Shorts, under 90 for TikTok)
- **Subtitles burned in** — most rules require it
- **Hook in first 2 seconds** — stop the scroll

### Caption + hashtag rules (typical)
```
{Short hook sentence}

{1 line of context / benefit}

{Campaign-required hashtag} (e.g. #polymarket #yomidenzel)
{Campaign-required @mention}
```

### Link placement
- Campaign tracking link goes in the platform's bio OR in the caption (depends on rules)
- Don't swap their link for yours — you'll get disqualified
- You CAN link to `phimindflow.com` in bio AFTER their primary tracking link is in caption

### Where to post
- **TikTok is usually primary** (highest CPM on their side)
- Most campaigns allow IG Reels + YT Shorts too
- Some forbid reposting your own old content — read rules

---

## 📊 Earnings math (realistic)

Your pipeline stats:
- 3 clips per YouTube source (Ssemble default)
- ~15–20 min per end-to-end run (your 45-min timeout is rare)
- Current @fitflybusiness reach: ~14.7K IG + Twitter

**Per clip, typical view range on a 14K page:**
- Low: 1K views (bad clip, off-peak timing)
- Typical: 5–15K views (good clip)
- Viral spike: 50K–500K+ (rare but happens)

**Weekly target — 10 clips/week across 2-3 campaigns:**

| Scenario | Views/clip avg | Total weekly views | At $1/1K | At $2/1K |
|---|---|---|---|---|
| Conservative | 5K | 50K | $50/wk | $100/wk |
| Typical | 10K | 100K | $100/wk | $200/wk |
| Good | 25K | 250K | $250/wk | $500/wk |
| Viral (1 clip pops) | 100K+ | 500K+ | $500+/wk | $1000+/wk |

**Scale:** 3-5 campaigns running concurrently = $400–$2000/mo passive, on top of phimindflow course/management sales.

---

## 📅 Week 1 action plan (minimum viable earn)

| Day | Action | Time |
|---|---|---|
| Mon | Join Crypto Fund Trader + Market AI + Tradevisor (3 campaigns) | 10 min |
| Mon | Find 3 YouTube source videos (one per campaign) | 15 min |
| Mon | Run `clip-and-post.mjs` on all 3 → posts to your IG+TW+TT | 30 min + Ssemble wait |
| Tue | Manually cross-post the best clips to their campaign's required platform with their hashtag/link | 20 min |
| Wed–Fri | Add 2 more source videos per day → 2 new clips/day | 30 min/day |
| Sat | Check Whop dashboard — see views counted, adjust winning clip style | 10 min |
| Sun | Double down on what's converting | — |

**First week target: $25–$75 earned.** Not life-changing but zero cost and it compounds.

---

## 🔗 Where to find more

- `https://whop.com/discover/content-rewards/` — full campaign marketplace
- Filter by: **Category** (Personal Brand, Product, etc.) and **Payout** (high CPM first)
- **Join anything that matches @fitflybusiness vibe** — you can post for 10+ simultaneously with one clip if it hits multiple campaigns' rules

---

## ❓ Tracking your earnings (automated)

Once bot deploys to Fly.io, add `/earnings` slash command that:
1. Fetches your Whop earnings API (if exposed)
2. Posts summary to Discord

Stripe webhook already pipes sales to Discord — same pattern for Whop payouts.
