# Workflow: full-system-audit

## Trigger
- Weekly (Sunday)
- On demand (`fd321` shortcode)
- Before any major release or stack-wide refactor

## Purpose
Top-down sweep of the entire PHIMINDFLOW operating system. Catch bloat, drift, orphans, secrets, broken integrations, stale docs.

## Steps
1. **Folder hygiene scan**
   - List `C:/Users/franc/Projects/` and `C:/Users/franc/Projects/websites/`
   - Flag duplicate-purpose folders (e.g., system-* sprawl)
   - Flag repos with no GitHub remote
   - Flag any folder > 1 GB (likely .next or assets bloat)
2. **Live URL health check**
   - phimindflow.com — 200, < 2s, no console errors
   - ai-system-factory.vercel.app — same
   - stratoptimizer.vercel.app — same
   - creditpath-delta.vercel.app — same
   - Use Playwright Tester (agent 08)
3. **Stripe revenue path verification**
   - Webhook endpoints registered (Stripe MCP `list webhook_endpoints` if available, else dashboard)
   - Recent successful checkout.session.completed events
   - No failed events in last 7 days
4. **Zernio + clip pipeline health**
   - Recent posts published (no stalls)
   - No 409 retry loops in logs
   - Discord post failures noted (known: Zernio Discord broken)
5. **Discord bot health**
   - "the one" bot online on Fly.io
   - Last weekly digest posted on schedule
6. **Secret hygiene**
   - Run security-check workflow (04) on the whole codebase, not just diff
7. **GitNexus index freshness**
   - Each indexed repo: `.gitnexus/meta.json` mtime within last 7 days
8. **Doc drift**
   - README, ARCHITECTURE, CHANGELOG: do they match current state? (Documentation Writer 10 verifies)
9. **MCP server availability**
   - Stripe, Vercel, Playwright, GitNexus all responding to a smoke call
10. **Output executive report**

## Owner agent
System Architect (01) orchestrating; delegates to specialists per step.

## Output
```
## Full System Audit — <date>

### Health summary
- Live sites (4): <green/yellow/red counts>
- Revenue path: <green/yellow/red>
- Automation: <green/yellow/red>
- Docs drift: <green/yellow/red>
- Folder hygiene: <green/yellow/red>

### Findings (ranked by severity)
1. CRITICAL: ...
2. WARNING: ...
3. NIT: ...

### Action items (next 7 days)
- [ ] ...

### Trend vs last audit
- Net change: <+/- N findings>
- Resolved: <list>
- New: <list>
```

## Pass criteria
- All 4 live sites green
- Revenue path: zero failed checkout.session.completed
- No CRITICAL secret leaks
- No CRITICAL doc drift
- No new repos lacking GitHub remote since last audit
