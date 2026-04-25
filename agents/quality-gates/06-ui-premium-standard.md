# Gate: ui-premium-standard

## Rule
Every UI component must score ≥ 7/10 against the 10-pattern rubric. Below 7 = BLOCKED.

## Why
PHIMINDFLOW is a premium brand. Generic AI aesthetic kills trust. The 10 patterns catch the most common slop signals.

## Scoring formula
```
SCORE = 10 - (critical_violations × 3) - (moderate_violations × 1) - (minor_violations × 0.5)

PASS  = score ≥ 7
FAIL  = score < 7  (must fix and rescore, max 3 rounds)
```

## The 10 UI patterns

| # | Pattern | Severity | What it catches |
|---|---------|----------|-----------------|
| 1 | Missing UI states | CRITICAL (-3) | No loading / error / empty / skeleton state. Users see blank screens. |
| 2 | No accessibility | CRITICAL (-3) | Missing ARIA labels, no keyboard nav, no focus mgmt, bad contrast. |
| 3 | Not responsive | CRITICAL (-3) | Hardcoded px widths, no mobile breakpoints, overflow, small touch targets (<44px). |
| 4 | Generic AI aesthetics | CRITICAL (-3) | Inter/Roboto only, default Tailwind blue (#3B82F6), purple gradient on white, lorem ipsum. |
| 5 | Design system bypass | MOD (-1) | Raw HTML where tokens exist, inline styles, wrong spacing scale. |
| 6 | God components | MOD (-1) | 300+ LOC components mixing data fetching, logic, and presentation. |
| 7 | No user feedback | MOD (-1) | Async actions with no visual feedback. User clicks, nothing happens. |
| 8 | No reduced-motion | MIN (-0.5) | Animations without `prefers-reduced-motion`. Fails WCAG 2.3.3. |
| 9 | Inconsistent spacing | MIN (-0.5) | Mix of arbitrary px values and design tokens. |
| 10 | No error boundaries | MIN (-0.5) | Async UI sections without error boundaries. One failure crashes the page. |

## PHIMINDFLOW-specific overrides
- The brand is dark/premium/sharp — generic AI aesthetic counts double if it ships light/colorful/generic
- Funnel order on landing pages must be: Broker → Course → Management
- Motion only when it improves clarity (no decorative animation)
- Hierarchy > spacing > color > motion (priority order)

## Verification
- Visual: Playwright snapshot at desktop + mobile
- Code: read component source, audit Tailwind classes, audit imports, audit state usage
- Live: console error count, network 4xx/5xx count

## Fail action
- Return to Frontend Engineer with: list of pattern violations, specific file:line, prescribed fix per violation.
- Loop max 3 rounds. If still <7 after round 3, escalate to user — design intent may be wrong, not just execution.

## Bypass
Never on production routes. Exceptions only on internal admin / debug routes with `// INTERNAL: <reason>` header.
