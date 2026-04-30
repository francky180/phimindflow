// Follow-up to LetterStream API request. CCs Franc's Gmail so he has a copy + can reply directly.
// References original Resend message ID so support can cross-check.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const envPath = join(dirname(fileURLToPath(import.meta.url)), "..", ".env.local");
const envText = readFileSync(envPath, "utf8");
const env = (k) => envText.match(new RegExp(`^${k}=(.+)$`, "m"))?.[1].trim().replace(/^"|"$/g, "");

const RESEND = env("RESEND_API_KEY");
if (!RESEND) { console.error("RESEND_API_KEY missing"); process.exit(1); }

const FRANC = "franckydelissaint@gmail.com";
const SUPPORT = "support@letterstream.com";
const PRIOR_MSG_ID = "a402e4d6-4f63-47ed-bfcd-bdc43329e583"; // first send

const subject = "Following up — API access for PHIMINDFLOW (credit dispute mailing)";
const text = `Hi LetterStream team,

Following up on my earlier message (Resend reference ${PRIOR_MSG_ID}, sent ~1 hour ago) to make sure it reached the right person and didn't get caught in a filter.

Quick recap of the ask:

I'm Francky from PHIMINDFLOW (https://phimindflow.com). We just launched a credit-restoration dashboard at /credit where users draft FCRA-compliant dispute letters. We'd like to integrate your API so users can press "Send via LetterStream" and have certified mail go directly to the bureaus, with tracking auto-saved in their dashboard.

What we need:
  • API access enabled on my account (email: ${FRANC})
  • Test Mode turned on so we can validate the full submit → receipt → tracking flow before going live
  • API_ID and API_KEY for production
  • Any current docs / sample payloads for the certified-mail letter endpoint

Volume estimate: starting at ~50 certified letters/month, growing to several hundred as the platform scales. Bureau addresses (Equifax / Experian / TransUnion) only at first, expanding to creditors and CFPB cover letters later.

Happy to jump on a call if useful — or just reply with the credentials and I'll handle integration on our end.

Thanks for getting back,

Francky Delissaint
PHIMINDFLOW
${FRANC}
https://phimindflow.com/credit
`;

const r = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: { Authorization: `Bearer ${RESEND}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    from: "Francky Delissaint <hello@phimindflow.com>",
    to: [SUPPORT],
    cc: [FRANC],
    reply_to: FRANC,
    subject,
    text,
  }),
});
const body = await r.text();
console.log("status:", r.status);
console.log("body:", body);
if (!r.ok) process.exit(1);
console.log(`\n✅ Follow-up sent.`);
console.log(`   To:       ${SUPPORT}`);
console.log(`   CC:       ${FRANC}  (your Gmail will have a copy)`);
console.log(`   Reply-to: ${FRANC}  (their reply goes straight to your inbox)`);
console.log(`\n   Check your Gmail in 30s. If it's there → delivery is solid.`);
console.log(`   If it's in Spam → mark as 'Not spam' so future LetterStream replies hit Primary.`);
