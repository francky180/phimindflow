// Seed Franc's owner account with his REAL data extracted from SmartCredit PDF (10/14/2025).
// Idempotent — clears all prior rows then inserts the real picture.
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const envPath = join(dirname(fileURLToPath(import.meta.url)), "..", ".env.local");
const envText = readFileSync(envPath, "utf8");
const env = (k) => envText.match(new RegExp(`^${k}=(.+)$`, "m"))?.[1].trim().replace(/^"|"$/g, "");

const sb = createClient(env("NEXT_PUBLIC_SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
  auth: { autoRefreshToken: false, persistSession: false },
});

const userId = "fa24f766-80be-4973-8d6a-193cbaee4f6a"; // Franc's owner account

// Clear prior rows (demo + anything else)
await sb.from("credit_disputes").delete().eq("user_id", userId);
await sb.from("credit_items").delete().eq("user_id", userId);
await sb.from("credit_scores").delete().eq("user_id", userId);

// PROFILE — real address from SmartCredit, real name. SSN/DOB left for Franc to fill manually.
await sb.from("credit_profiles").upsert({
  user_id: userId,
  full_name: "Francky Delissaint",
  address: "1825 Baywood Ave",
  city: "Orlando",
  state: "FL",
  zip: "32818",
  goal: "Remove the Credit Acceptance 180-day-late auto loan from all 3 bureaus and clean up the Navy FCU late marks. Target 720+ in 6 months.",
}, { onConflict: "user_id" });

// SCORES — actual SmartCredit reading 10/14/2025
await sb.from("credit_scores").insert([
  { user_id: userId, bureau: "transunion", score: 639, recorded_at: "2025-10-14", notes: "SmartCredit pull" },
  { user_id: userId, bureau: "experian",   score: 631, recorded_at: "2025-10-14", notes: "SmartCredit pull" },
  { user_id: userId, bureau: "equifax",    score: 604, recorded_at: "2025-10-14", notes: "SmartCredit pull" },
]);

// REAL NEGATIVE ITEMS from the SmartCredit report
const { data: items } = await sb.from("credit_items").insert([
  {
    user_id: userId,
    creditor: "Credit Acceptance Corp",
    account_number: "9646",
    item_type: "late_payment",
    bureau: "all",
    balance: 5330.00,
    date_opened: "2019-06-01",
    status: "pending",
    notes: "AUTO LOAN — high balance $6,124, currently $5,330. Experian shows 'Late 180 Days', Equifax shows 'Late 120 Days'. ~65-67 months of 90+ day lates over 7 yr history. PRIORITY #1 — biggest score drag. Dispute Metro 2 reporting + re-aging + obsolete inaccurate balance.",
  },
  {
    user_id: userId,
    creditor: "Navy Federal Credit Union",
    account_number: "5***",
    item_type: "late_payment",
    bureau: "all",
    balance: 0,
    date_opened: "2022-12-16",
    status: "pending",
    notes: "Secured credit card, $300 limit. PAID + CLOSED 5/26/2023 with $0 balance. Experian shows 'Late 60 Days' payment status on a closed paid account — 1× 30-day + 1× 60-day late. Already disputed once on Equifax (consumer disagrees with resolution). Disputable as inaccurate / obsolete on paid closed.",
  },
  {
    user_id: userId,
    creditor: "SYNCB/Amazon",
    account_number: "—",
    item_type: "inquiry",
    bureau: "transunion",
    balance: 0,
    date_opened: "2024-05-02",
    status: "pending",
    notes: "Hard inquiry on TransUnion only. If you didn't apply for an Amazon Synchrony card on 5/2/2024 → dispute as unauthorized.",
  },
]).select();

// REAL ROUND 1 DISPUTE LETTER — Credit Acceptance Corp / Equifax (highest-impact target)
const itemId = items?.[0]?.id ?? null;
const today = new Date().toISOString().slice(0, 10);
await sb.from("credit_disputes").insert([
  {
    user_id: userId,
    item_id: itemId,
    bureau: "equifax",
    subject: "Round 1 — Credit Acceptance Corp auto loan (Equifax)",
    status: "draft",
    letter_text: `Date: ${today}

To: Equifax Information Services LLC
P.O. Box 740256
Atlanta, GA 30374

Re: Formal dispute under FCRA §611 and §623 — request for investigation

Dear Equifax,

I am writing to dispute the following information that appears on my Equifax credit report. The account contains multiple inaccuracies and Metro 2 reporting violations that I am requesting be investigated, corrected, or deleted.

Account in dispute:
• Creditor: Credit Acceptance Corp
• Account #: ending in 9646 (originally 949646**)
• Account type: Auto Financing / Auto Loan
• Date opened (per report): 06/01/2019

Specific reasons for dispute:

1. INACCURATE PAYMENT STATUS. Equifax currently reports this account as "Late 120 Days" while Experian reports the SAME account as "Late 180 Days" for the same monthly period. Per FCRA §623(a)(1)(A), a furnisher must report consistent and accurate information to all consumer reporting agencies. The mismatch on its face proves at least one bureau's reporting is inaccurate.

2. METRO 2 VIOLATIONS. The account is missing required Metro 2 fields, including but not limited to: original creditor identification, date of first delinquency (DOFD), and current status code consistent with reported balance. These are required fields under the CDIA Metro 2 Format. Without them, the account cannot be considered to be reported with the maximum possible accuracy required by FCRA §607(b).

3. RE-AGING. The "Date Reported" continues to be updated past the original date of first delinquency in 2019, which has the effect of artificially extending the 7-year reporting window in violation of FCRA §605(c)(1).

4. PRIOR DISPUTE NOTATION. Your file contains the remark "Account previously in dispute - now resolved by data furnisher" — yet the inaccuracies described above remain. The prior investigation was therefore not adequate under FCRA §611(a)(1).

Action requested:
Pursuant to the Fair Credit Reporting Act, please conduct a full reinvestigation of this account, contact the furnisher to verify each disputed element above, and either correct the inaccurate information or remove this tradeline from my Equifax credit file within 30 days. Provide me with a written copy of the updated report and the documentation used to verify this account.

Failure to investigate, or verification without addressing the specific inaccuracies described, will be considered a violation of FCRA §611 and §623, and I reserve the right to escalate to the Consumer Financial Protection Bureau and to seek statutory damages.

Sincerely,

Francky Delissaint
1825 Baywood Ave
Orlando, FL 32818

Enclosures: copy of government-issued ID and proof of address available upon request.
`,
  },
  {
    user_id: userId,
    item_id: itemId,
    bureau: "experian",
    subject: "Round 1 — Credit Acceptance Corp auto loan (Experian)",
    status: "draft",
    letter_text: `Date: ${today}

To: Experian
P.O. Box 4500
Allen, TX 75013

Re: Formal dispute under FCRA §611 and §623 — request for investigation

Dear Experian,

I am writing to dispute the following information that appears on my Experian credit report. The account contains multiple inaccuracies and Metro 2 reporting violations that I am requesting be investigated, corrected, or deleted.

Account in dispute:
• Creditor: Credit Acceptance Corp
• Account #: ending in 9646
• Account type: Auto Financing / Auto Loan
• Date opened (per report): 06/01/2019

Specific reasons for dispute:

1. INACCURATE PAYMENT STATUS. Experian reports this account as "Late 180 Days" while Equifax reports the SAME account as "Late 120 Days" for the same period. Per FCRA §623(a)(1)(A), a furnisher must report consistent and accurate information to all consumer reporting agencies. The mismatch proves at least one of the two reports is inaccurate, and likely both.

2. METRO 2 VIOLATIONS. The account is missing required Metro 2 fields, including but not limited to: date of first delinquency (DOFD), and a current status consistent with the reported "Late 180 Days" rating combined with the still-open status. The combination is internally inconsistent with the CDIA Metro 2 Format.

3. AGE OF DELINQUENCY. The 7-year payment history shows 65 months of 90+ day late payments. Under FCRA §605(c)(1), the original date of first delinquency (which appears to be approximately 11/15/2019 based on the Last Payment date) governs the maximum 7-year reporting period. Any reporting that extends past that 7-year window is a per-se violation.

Action requested:
Pursuant to the Fair Credit Reporting Act, please conduct a full reinvestigation of this account, contact the furnisher to verify each disputed element above, and either correct the inaccurate information or remove this tradeline from my Experian credit file within 30 days. Provide me with a written copy of the updated report and the documentation used to verify this account.

Sincerely,

Francky Delissaint
1825 Baywood Ave
Orlando, FL 32818
`,
  },
]);

console.log("✅ Real SmartCredit data seeded for Franc.");
console.log("   Profile:  Francky Delissaint, 1825 Baywood Ave, Orlando, FL 32818");
console.log("   Scores:   TU 639 · EX 631 · EQ 604 (10/14/2025)");
console.log("   Items:    Credit Acceptance Corp (PRIORITY) · Navy FCU · SYNCB/Amazon inquiry");
console.log("   Letters:  2 drafts ready — Equifax + Experian Round 1 targeting Credit Acceptance");
console.log("\nMissing — fill in yourself when logged in:");
console.log("   • SSN last 4");
console.log("   • Date of birth (full)");
console.log("   • Phone");
