// Seed Franc's owner account with realistic demo data for the marketing video.
// Idempotent — clears prior demo rows, then inserts a complete picture.
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

// Clear prior demo rows
await sb.from("credit_disputes").delete().eq("user_id", userId);
await sb.from("credit_items").delete().eq("user_id", userId);
await sb.from("credit_scores").delete().eq("user_id", userId);
await sb.from("credit_files").delete().eq("user_id", userId);

// Profile
await sb.from("credit_profiles").upsert({
  user_id: userId,
  full_name: "Francky Delissaint",
  phone: "(305) 555-0142",
  address: "14555 NE 21st Ave",
  city: "North Miami Beach",
  state: "FL",
  zip: "33181",
  dob: "1996-07-22",
  ssn_last4: "4789",
  goal: "720+ score in 6 months to qualify for $50K business credit line and FHA loan.",
}, { onConflict: "user_id" });

// Scores — 3 bureaus, current readings + 1 prior reading each (showing trend)
const today = new Date().toISOString().slice(0, 10);
const sixtyDaysAgo = new Date(Date.now() - 60 * 86400000).toISOString().slice(0, 10);
await sb.from("credit_scores").insert([
  { user_id: userId, bureau: "equifax",    score: 612, recorded_at: today,        notes: "After Round 1 disputes" },
  { user_id: userId, bureau: "experian",   score: 598, recorded_at: today,        notes: "After Round 1 disputes" },
  { user_id: userId, bureau: "transunion", score: 605, recorded_at: today,        notes: "After Round 1 disputes" },
  { user_id: userId, bureau: "equifax",    score: 548, recorded_at: sixtyDaysAgo, notes: "Baseline" },
  { user_id: userId, bureau: "experian",   score: 532, recorded_at: sixtyDaysAgo, notes: "Baseline" },
  { user_id: userId, bureau: "transunion", score: 541, recorded_at: sixtyDaysAgo, notes: "Baseline" },
]);

// Negative items
const { data: items } = await sb.from("credit_items").insert([
  { user_id: userId, creditor: "Capital One",       account_number: "5491", item_type: "charge_off",   bureau: "all",        balance: 1247.00, status: "disputing", date_opened: "2023-08-12" },
  { user_id: userId, creditor: "LVNV Funding LLC",  account_number: "2381", item_type: "collection",   bureau: "all",        balance: 892.43,  status: "disputing", date_opened: "2024-02-03" },
  { user_id: userId, creditor: "Comenity Bank",     account_number: "7610", item_type: "late_payment", bureau: "experian",   balance: 0,       status: "pending",   date_opened: "2023-11-19" },
  { user_id: userId, creditor: "Synchrony Bank",    account_number: "4422", item_type: "collection",   bureau: "transunion", balance: 386.10,  status: "removed",   date_opened: "2024-01-27" },
]).select();

// Dispute letter — Capital One, Equifax, Round 1
const itemId = items?.[0]?.id ?? null;
await sb.from("credit_disputes").insert({
  user_id: userId,
  item_id: itemId,
  bureau: "equifax",
  subject: "Round 1 — Capital One charge-off (Equifax)",
  status: "draft",
  letter_text: `Date: ${today}

To: Equifax Information Services LLC
P.O. Box 740256
Atlanta, GA 30374

Subject: Formal dispute under FCRA §611 — request for investigation

Dear Equifax,

I am writing to dispute the following information that appears on my credit report:

• Creditor: Capital One
• Account #: ending in 5491
• Reason: This account is reporting inaccurately. The balance shown does not match my records, and the date-of-last-activity has been updated past the original delinquency in violation of FCRA §605(c)(1). Additionally, the account is missing required Metro 2 fields including the original creditor and the date of first delinquency.

Pursuant to the Fair Credit Reporting Act, please investigate this matter and remove or correct the inaccurate information within 30 days. Provide me with a copy of the updated report and any documentation used to verify this account.

Sincerely,
Francky Delissaint
14555 NE 21st Ave
North Miami Beach, FL 33181
SSN ending: 4789
DOB: 07/22/1996
`,
});

console.log("✅ Demo data seeded for", userId);
