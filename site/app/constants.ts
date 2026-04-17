/* ════════════════════════════════════════════════════
   PHIMINDFLOW — Centralized Constants
   Source of truth for all funnel links and pricing.
   Funnel order: Broker → Course → Management
   ════════════════════════════════════════════════════ */

// ── Step 1: Broker Signup (FREE) ───────────────────
export const brokerLink = "https://dashboard.genesisfxmarkets.com/auth/register?ref=FRADEL185";
export const brokerLinkAaafx = "https://app.aaafx.com/register?refLink=NTU4NQ==&refRm=11";

// ── Step 2: Course Purchase ($250) ─────────────────
export const courseLink = "/checkout?plan=course";

// ── Step 3: Management Purchase ($1,500) ───────────
export const managementLink = "/checkout?plan=management";

// ── Credit Pillar ──────────────────────────────────
export const creditAnalysisLink = "/credit/checkout?plan=analysis";
export const creditRepairLink = "/credit/checkout?plan=repair-monthly";
export const creditFixLink = "/credit/checkout?plan=credit-fix";

export const creditPricing = {
  analysis: { price: 49, label: "Credit Analysis", type: "one-time" as const },
  repairMonthly: { price: 149, label: "Credit Repair Monthly", type: "monthly" as const },
  creditFix: { price: 1500, label: "Complete Credit Fix", type: "one-time" as const },
};
