// One-shot: emails LetterStream support requesting API access for Franc's account.
// Uses Resend (already wired). Run: node scripts/send-letterstream-api-request.mjs
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const envPath = join(dirname(fileURLToPath(import.meta.url)), "..", ".env.local");
const envText = readFileSync(envPath, "utf8");
const env = (k) => envText.match(new RegExp(`^${k}=(.+)$`, "m"))?.[1].trim().replace(/^"|"$/g, "");

const RESEND = env("RESEND_API_KEY");
if (!RESEND) { console.error("RESEND_API_KEY missing"); process.exit(1); }

const FRANC_EMAIL = "franckydelissaint@gmail.com";
const SUPPORT = "support@letterstream.com";

const subject = "API Access Request — PHIMINDFLOW credit-restoration mailing automation";
const text = `Hello LetterStream team,

I'd like to request API access on my LetterStream account.

Account email: ${FRANC_EMAIL}
Company: PHIMINDFLOW
Use case: We're integrating LetterStream to mail FCRA-compliant credit dispute letters (certified mail, all 3 bureaus) on behalf of credit-restoration clients. Volume estimate: starting ~50 letters/month, growing to several hundred as the platform scales.

Please enable API access and Test Mode for this account, and reply with:
- API_ID and API_KEY for production
- Confirmation that Test Mode is enabled (so we can validate end-to-end before going live)
- Any documentation links for the current /api endpoint set

Happy to jump on a call if useful.

Thanks,
Francky Delissaint
PHIMINDFLOW
${FRANC_EMAIL}
`;

const r = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: { Authorization: `Bearer ${RESEND}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    from: "Francky Delissaint <hello@phimindflow.com>",
    to: [SUPPORT],
    reply_to: FRANC_EMAIL,
    subject,
    text,
  }),
});
const body = await r.text();
console.log("status:", r.status);
console.log("body:", body);
if (!r.ok) process.exit(1);
console.log("\n✅ LetterStream support request sent. Reply will go to", FRANC_EMAIL);
