/**
 * FCRA + FDCPA + Metro 2 Compliant Dispute Letter Generator
 *
 * Generates original dispute letters across 3 rounds with escalating language.
 * Every letter embeds Metro 2 compliance verification demands and cites
 * the relevant federal consumer protection law.
 *
 * Round 1: Request Verification (FCRA §611, FDCPA §809)
 * Round 2: Demand Removal (failed verification + Metro 2 compliance)
 * Round 3: Final Demand (CFPB / FTC / State AG / FCRA §616 willful noncompliance)
 *
 * Legal references live in src/lib/credit-laws.ts.
 */

import { METRO2_REQUIRED_FIELDS } from "./credit-laws";

export type DisputeType =
  | "collection"
  | "late-payment"
  | "charge-off"
  | "inquiry"
  | "identity-theft"
  | "inaccurate-balance"
  | "student-loan"
  | "medical-debt"
  | "repossession"
  | "obsolete"
  | "mixed-file";

export type DisputeRound = 1 | 2 | 3;

export interface DisputeInput {
  type: DisputeType;
  round: DisputeRound;
  creditorName: string;
  accountNumber: string;
  userName: string;
  userAddress: string;
  bureau: "Equifax" | "Experian" | "TransUnion";
  reason: string;
}

function maskAccountNumber(raw: string): string {
  if (!raw) return "XXXX";
  const digits = raw.replace(/\D/g, "");
  if (digits.length >= 4) return digits.slice(-4);
  const trimmed = raw.trim();
  if (/^[0-9xX*#]{1,4}$/.test(trimmed) && trimmed.length === 4) return trimmed;
  return "XXXX";
}


const METRO2_TARGETED_FIELDS: Record<DisputeType, string[]> = {
  collection: ["Date of First Delinquency (DOFD)", "Account Status Code", "Current Balance", "Original Amount / High Balance", "Date of Account Opening", "ECOA Code"],
  "late-payment": ["Payment Rating", "Date of First Delinquency (DOFD)", "Account Status Code", "Current Balance", "Original Amount / High Balance", "ECOA Code"],
  "charge-off": ["Date of First Delinquency (DOFD)", "Account Status Code", "Current Balance", "Original Amount / High Balance", "Date of Account Opening", "ECOA Code"],
  inquiry: ["Account Status Code", "ECOA Code"],
  "identity-theft": ["Date of Account Opening", "Account Status Code", "Current Balance", "Original Amount / High Balance", "ECOA Code", "Consumer Information Indicator (CII)"],
  "inaccurate-balance": ["Current Balance", "Original Amount / High Balance", "Payment Rating", "Account Status Code"],
  "student-loan": ["Payment Rating", "Date of First Delinquency (DOFD)", "Account Status Code", "Terms Duration", "Current Balance"],
  "medical-debt": ["Date of First Delinquency (DOFD)", "Current Balance", "Account Status Code", "Special Comment Code"],
  repossession: ["Date of First Delinquency (DOFD)", "Account Status Code", "Current Balance", "Original Amount / High Balance"],
  obsolete: ["Date of First Delinquency (DOFD)", "Date of Account Opening", "Account Status Code"],
  "mixed-file": ["ECOA Code", "Consumer Information Indicator (CII)", "Account Status Code", "Date of Account Opening"],
};

const MOV_DEMAND_BLOCK = `Method of Verification (MOV) Demand:

A response stating this account was "verified" through an automated system (including e-OSCAR) is not sufficient under FCRA §611 or §609. I am formally requesting:

1. The specific method of verification used for each disputed data field
2. The name, address, and telephone number of the party who provided or verified the information
3. Copies of the actual source documents relied upon to verify the account

If you cannot produce each of the above, the tradeline must be deleted in accordance with FCRA §611(a)(5)(A).`;

const BUREAU_ADDRESSES: Record<string, string> = {
  Equifax: "Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374",
  Experian: "Experian\nP.O. Box 4500\nAllen, TX 75013",
  TransUnion: "TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016",
};

const ROUND_LABELS: Record<DisputeRound, string> = {
  1: "Initial Dispute — Request for Verification",
  2: "Second Notice — Demand for Removal",
  3: "Final Demand — Intent to File Complaints",
};

// Metro 2 compliance block included in every letter
function getMetro2Block(round: DisputeRound, _type: DisputeType): string {
  const targeted = METRO2_TARGETED_FIELDS[_type] || [];
  const filtered = targeted.length
    ? METRO2_REQUIRED_FIELDS.filter((f) => targeted.includes(f.field))
    : METRO2_REQUIRED_FIELDS;
  const fieldLines = filtered
    .map((f) => `  • ${f.field} — ${f.description}`)
    .join("\n");

  const base = `Additionally, under the Consumer Data Industry Association (CDIA) Credit Reporting Resource Guide, every furnisher is required to report to the bureaus using the Metro 2 format. Any required field that is missing, inaccurate, or cannot be verified renders the entire tradeline non-compliant — and under FCRA §611(a)(5)(A) and §623(b) must be modified or deleted.

I request verification of the following Metro 2 required fields for this account:

${fieldLines}

A "computer-generated verification" or e-OSCAR response stating "verified" is NOT sufficient. Under FCRA §609 and §611, I am entitled to the actual source documentation used to verify each field.`;

  if (round === 1) {
    return base + `

Any Metro 2 field that cannot be verified as accurate must be corrected or the entire tradeline must be removed per FCRA Section 611(a)(5)(A).`;
  }

  if (round === 2) {
    return base + `

Per my previous dispute dated approximately 30 days ago, I requested verification of this account. If the furnisher could not provide documentation meeting Metro 2 standards, continued reporting constitutes a violation of both the FCRA Section 611 and Section 623(b) (duty of furnishers after notice of dispute).

I have documented the following Metro 2 reporting deficiencies:
- The account may contain a missing or incorrect Date of First Delinquency (Metro 2 field required for all derogatory accounts)
- The Payment Rating field may not reflect the actual payment pattern
- The Account Status Code may be inconsistent with the current account condition

These deficiencies render the tradeline unverifiable and it must be removed.`;
  }

  // Round 3
  return base + `

This is my third written dispute regarding this account. Despite two prior written requests for verification, this account continues to appear on my credit report. I have documented the following Metro 2 compliance failures:

1. The furnisher has failed to verify the accuracy of critical Metro 2 fields
2. Continued reporting of unverifiable data violates FCRA Section 623(b)
3. The CDIA Metro 2 Format requires accurate reporting — any deviation constitutes non-compliance
4. Under FCRA Section 616 and 617, I am entitled to actual damages, statutory damages of $100-$1,000, and attorney's fees for willful or negligent noncompliance

I am prepared to file formal complaints and pursue all available legal remedies if this matter is not resolved within 15 days.`;
}

function getDisputeBody(input: DisputeInput): string {
  const { type, round, creditorName, accountNumber, reason } = input;

  // Type-specific details
  const typeDetails: Record<DisputeType, string> = {
    collection: `Creditor/Collection Agency: ${creditorName}\nAccount Number (last digits): ${accountNumber}\nAccount Type: Collection Account`,
    "late-payment": `Creditor: ${creditorName}\nAccount Number (last digits): ${accountNumber}\nAccount Type: Late Payment Dispute`,
    "charge-off": `Creditor: ${creditorName}\nAccount Number (last digits): ${accountNumber}\nAccount Type: Charge-Off Dispute`,
    inquiry: `Company: ${creditorName}\nInquiry Type: Hard Inquiry`,
    "identity-theft": `Creditor: ${creditorName}\nAccount Number (last digits): ${accountNumber}\nAccount Type: Fraudulent Account — Identity Theft`,
    "inaccurate-balance": `Creditor: ${creditorName}\nAccount Number (last digits): ${accountNumber}\nAccount Type: Inaccurate Information Dispute`,
    "student-loan": `Loan Servicer: ${creditorName}\nAccount Number (last digits): ${accountNumber}\nAccount Type: Student Loan Dispute`,
    "medical-debt": `Medical Provider/Agency: ${creditorName}\nAccount Number (last digits): ${accountNumber}\nAccount Type: Medical Debt Dispute`,
    repossession: `Creditor: ${creditorName}\nAccount Number (last digits): ${accountNumber}\nAccount Type: Repossession Dispute`,
    obsolete: `Furnisher: ${creditorName}\nAccount Number (last digits): ${accountNumber}\nAccount Type: Obsolete Information (past 7-year reporting limit)`,
    "mixed-file": `Furnisher: ${creditorName}\nAccount Number (last digits): ${accountNumber}\nAccount Type: Mixed File — Not My Account`,
  };

  // Round-specific verification requests by type
  const verificationRequests: Record<DisputeType, Record<DisputeRound, string>> = {
    collection: {
      1: `I request the following verification under FCRA Section 611 and FDCPA Section 809(b):

1. The original signed contract or agreement bearing my signature
2. Complete payment history from the original creditor to this collection agency
3. Documentation of the chain of assignment (original creditor → each subsequent buyer → current holder)
4. Proof that the statute of limitations has not expired in my state
5. Verification that the collection agency is properly licensed in my state
6. The original creditor's name and address`,
      2: `My previous dispute, sent approximately 30 days ago, requested verification of this collection account. If verification was not provided, this account must be removed immediately per FCRA Section 611(a)(5)(A).

I again request:
1. Proof of the signed original agreement — not a generated printout
2. A complete chain of title from the original creditor to the current owner
3. Proof this debt is within the statute of limitations
4. Verification the collection agency is licensed in my state

If these documents were not provided to you by the furnisher during your previous investigation, you had a legal obligation to remove this tradeline. Continued reporting without verification is a willful violation of the FCRA.`,
      3: `This is my THIRD written dispute regarding this collection account. Despite TWO prior written requests for verification, you have failed to either verify or remove this account.

Under FCRA Section 611(a)(5)(A), if the information cannot be verified, you must promptly delete it. Under Section 616, willful noncompliance entitles me to statutory damages of $100 to $1,000 per violation, plus punitive damages and attorney's fees.

I am providing you with 15 days to remove this account. If it is not removed, I intend to:
1. File a complaint with the Consumer Financial Protection Bureau (CFPB)
2. File a complaint with the Federal Trade Commission (FTC)
3. File a complaint with my State Attorney General
4. Consult with an FCRA attorney regarding litigation for willful noncompliance`,
    },
    "late-payment": {
      1: `I request verification under FCRA Section 611:

1. Proof of the exact date(s) the payment(s) were received
2. Documentation showing the payment arrived after the due date AND after any applicable grace period
3. Complete account statements for the months in question
4. Proof that billing statements were sent to my correct address
5. Records of any autopay or recurring payment arrangements`,
      2: `My previous dispute requested verification of this late payment reporting. If the furnisher could not prove the exact date of receipt and that the payment was received after the grace period, this late payment must be removed.

I request:
1. Certified payment processing records showing exact timestamps
2. Proof that no system errors, autopay failures, or processing delays caused this reporting
3. Evidence that any required advance notice of late reporting was provided to me

Failure to remove unverified late payment data is a violation of FCRA Section 623(a)(1)(A) — the duty to report accurate information.`,
      3: `This is my THIRD dispute regarding this late payment. It has not been verified or removed despite two prior written requests.

The burden of proof is on the furnisher under FCRA Section 623(b). If they cannot produce certified payment processing records proving the exact date my payment was received and that it was outside the grace period, continued reporting is willful noncompliance.

You have 15 days to remove this late payment notation. Failure to do so will result in formal complaints to the CFPB, FTC, and my State Attorney General, as well as consultation with an FCRA attorney.`,
    },
    "charge-off": {
      1: `I request verification under FCRA Section 611:

1. The original signed credit agreement
2. Complete account statements from account opening through charge-off
3. An itemized accounting of how the charge-off balance was calculated
4. Proof the account was properly charged off per the creditor's internal policies
5. Documentation of any payments received after the charge-off date
6. The date of first delinquency leading to the charge-off`,
      2: `My previous dispute requested documentation of this charge-off. If the original agreement and proper accounting were not provided, this tradeline must be removed.

Under FCRA Section 623(a)(2), a furnisher that has been notified of a dispute must conduct an investigation. If the furnisher cannot provide the original contract and a verified accounting, continued reporting violates the FCRA.

Remove this charge-off within 30 days or correct the reported balance and status.`,
      3: `This is my THIRD dispute regarding this charge-off account. Two prior requests for verification have not resulted in removal or correction.

I intend to file complaints with the CFPB, FTC, and State Attorney General within 15 days if this account is not removed. Under FCRA Section 616, I am entitled to damages for willful noncompliance.`,
    },
    inquiry: {
      1: `Under FCRA Section 604 (15 U.S.C. § 1681b), a credit report may only be accessed with permissible purpose and my written authorization.

I did not authorize this inquiry. I request:
1. A copy of the written authorization bearing my signature
2. Proof of the permissible purpose under FCRA Section 604
3. Documentation of when and how my consent was obtained`,
      2: `My previous dispute stated I did not authorize this inquiry. If no signed authorization exists, this inquiry must be removed immediately.

Under FCRA Section 604, accessing a consumer's credit report without permissible purpose is a violation. Each unauthorized inquiry damages my credit score and constitutes a separate violation.

Remove this inquiry within 30 days.`,
      3: `This is my THIRD dispute regarding this unauthorized inquiry. If authorization cannot be produced, you must remove it within 15 days.

Unauthorized access to credit reports violates FCRA Section 604 and may constitute identity theft. I will file complaints with the CFPB and FTC and consult an attorney if this inquiry remains.`,
    },
    "identity-theft": {
      1: `I am a victim of identity theft. This account was opened fraudulently without my knowledge or authorization.

Under FCRA Section 605B, I request that this fraudulent account be blocked and removed within 4 business days. I request:
1. Complete application and account opening documentation
2. Any identification used to open this account
3. All transaction records
4. IP addresses and device information used to open or access the account

I have filed (or am filing) an identity theft report with the FTC and local law enforcement.`,
      2: `This fraudulent account was reported in my previous dispute. Under FCRA Section 605B, you are required to block reporting of information resulting from identity theft within 4 business days of receiving an identity theft report.

This account remains on my report. Remove it immediately. Continued reporting of fraudulent accounts after notification constitutes willful noncompliance.`,
      3: `This is my THIRD notice regarding this fraudulent account. I have provided identity theft documentation and demanded removal twice.

Under FCRA Section 605B and 616, your failure to block this fraudulent tradeline constitutes willful noncompliance. I am filing complaints with the CFPB, FTC, and State Attorney General this week. I am also consulting an FCRA attorney.

Remove this account within 5 business days.`,
    },
    "inaccurate-balance": {
      1: `I request verification under FCRA Section 611:

1. The current balance with an itemized statement
2. Documentation of all payments, credits, and charges
3. Proof of the correct balance as of the last reporting date
4. Verification of the credit limit or high balance
5. All account terms and conditions`,
      2: `My previous dispute reported an inaccurate balance. If the furnisher could not provide an itemized accounting verifying the reported balance, it must be corrected or removed.

Under FCRA Section 623(a)(1)(A), furnishers have a duty to report accurate information. An incorrect balance inflates my utilization ratio and damages my score.

Correct the balance or remove the tradeline within 30 days.`,
      3: `This is my THIRD dispute about this inaccurate balance. Correct it or remove the tradeline within 15 days. I will file CFPB, FTC, and State AG complaints and consult an FCRA attorney if this is not resolved.`,
    },
    "student-loan": {
      1: `I request verification under FCRA Section 611:

1. The original promissory note bearing my signature
2. Complete payment history including all forbearance and deferment periods
3. Verification that delinquencies occurred outside forbearance/deferment
4. Current balance with itemized breakdown of principal, interest, and fees
5. Records of all servicer transfers and their dates
6. Documentation of any income-driven repayment applications I submitted`,
      2: `My previous dispute requested documentation of this student loan account. If the servicer could not verify that delinquencies occurred outside forbearance/deferment periods, the derogatory reporting must be removed.

Student loan servicers have a documented history of mishandling forbearance and deferment records, especially during servicer transfers. The burden of proof is on the furnisher.

Remove or correct this reporting within 30 days.`,
      3: `This is my THIRD dispute. Student loan servicer reporting errors are well-documented and have been the subject of CFPB enforcement actions. If this account is not corrected within 15 days, I will file complaints with the CFPB (which has active enforcement in this area), the Department of Education, and my State AG.`,
    },
    "medical-debt": {
      1: `I request verification under FCRA Section 611 and applicable medical debt protections:

1. An itemized bill from the original medical provider
2. Proof that my insurance was billed and the Explanation of Benefits (EOB)
3. Documentation showing the remaining patient responsibility after insurance
4. Proof I was properly notified of this debt before collection placement
5. Verification this debt exceeds the $500 reporting threshold (per updated FCRA/CFPB rules)
6. Proof the 365-day waiting period was observed before credit reporting`,
      2: `My previous dispute requested verification of this medical debt. Under current FCRA rules and CFPB guidance:

- Medical debts under $500 should not appear on credit reports
- Medical debts paid by insurance must be removed
- There is a mandatory 365-day waiting period before medical debt can be reported

If any of these conditions apply and were not followed, this account must be removed immediately. The furnisher has the burden of proving compliance.

Remove this account within 30 days.`,
      3: `This is my THIRD dispute regarding this medical debt. Medical debt reporting is under heightened CFPB scrutiny. If this debt was reported before the 365-day waiting period, is under $500, or was covered by insurance, continued reporting is a clear violation.

I will file a CFPB complaint (medical debt is a CFPB enforcement priority), contact my State AG, and consult an FCRA attorney within 15 days if this is not removed.`,
    },
    repossession: {
      1: `I request verification under FCRA Section 611 and the Uniform Commercial Code (UCC):

1. The original signed financing agreement
2. Proof of proper repossession notice as required by my state's UCC
3. Documentation that the vehicle was sold in a commercially reasonable manner
4. Itemized accounting: sale price, fees, remaining deficiency balance
5. Proof of proper notification of the deficiency balance
6. Complete payment history prior to repossession`,
      2: `My previous dispute requested documentation of this repossession. Under the UCC, a creditor must:

- Provide proper notice before repossession
- Sell the collateral in a commercially reasonable manner
- Properly account for the sale proceeds
- Notify the debtor of any deficiency

If any of these requirements were not met, the deficiency balance is invalid and the tradeline must be corrected or removed. Remove within 30 days.`,
      3: `This is my THIRD dispute regarding this repossession. If the creditor cannot prove compliance with all UCC requirements — proper notice, commercially reasonable sale, proper accounting — continued reporting is inaccurate.

Remove this account within 15 days. I will file complaints with the CFPB, FTC, and State AG and consult an attorney if not resolved.`,
    },
    obsolete: {
      1: `Under FCRA §605 (15 U.S.C. §1681c), most adverse information must be removed from my credit report 7 years from the Date of First Delinquency (DOFD). Bankruptcies are subject to a 10-year limit.

Based on my records, this account has exceeded the reporting window and must be removed. I request:

1. The exact Date of First Delinquency on file, verified against the original creditor's records
2. Confirmation that the 7-year (or 10-year) limit has not been reset by re-aging
3. Removal of this obsolete tradeline within 30 days per FCRA §605`,
      2: `My previous dispute requested verification of the Date of First Delinquency and removal of this obsolete account. It has not been removed.

Re-aging accounts to extend reporting past the 7-year limit is a direct violation of FCRA §605 and §623(a)(5). If the furnisher cannot produce the original, unmodified DOFD, this account must be deleted immediately.

Remove this tradeline within 15 days.`,
      3: `This is my THIRD dispute regarding this obsolete account. Continued reporting of information past the FCRA §605 time limit is willful noncompliance under §616.

I will file complaints with the CFPB, FTC, and State Attorney General within 15 days and consult an FCRA attorney if this is not removed. Statutory damages under §616 range from $100 to $1,000 per willful violation.`,
    },
    "mixed-file": {
      1: `This account does NOT belong to me. It appears to be the result of a mixed file — information from another consumer's record merged into mine.

Under FCRA §607 (15 U.S.C. §1681e(b)), credit reporting agencies must follow reasonable procedures to assure the maximum possible accuracy of information concerning the individual.

I request:
1. Immediate investigation into why this account was placed on my file
2. Verification of the account holder's name, Social Security Number, date of birth, and address on the original furnisher record
3. Removal of this account from my credit report within 30 days per FCRA §611
4. A review of all other tradelines to identify additional mixed-file errors`,
      2: `My previous dispute stated this account does not belong to me. The continued presence of another consumer's data in my file is a direct violation of FCRA §607(b) — the maximum-possible-accuracy standard.

If the furnisher's records show a different name, SSN, or date of birth than mine, the account must be immediately removed from my file. Remove within 15 days.`,
      3: `This is my THIRD dispute about this mixed-file error. Maintaining another consumer's data in my file after being notified twice is willful noncompliance under FCRA §616.

I will file complaints with the CFPB (mixed files are a CFPB enforcement priority), the FTC, and my State Attorney General within 15 days. I will also consult an FCRA attorney about statutory damages for each month this tradeline has damaged my score.`,
    },
  };

  return `${typeDetails[type]}

Reason for Dispute: ${reason}

${verificationRequests[type][round]}

${getMetro2Block(round, type)}`;
}

export function generateDisputeLetter(rawInput: DisputeInput): string {
  const input: DisputeInput = { ...rawInput, accountNumber: maskAccountNumber(rawInput.accountNumber) };
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const bureauAddress = BUREAU_ADDRESSES[input.bureau];
  const roundLabel = ROUND_LABELS[input.round];

  return `${input.userName}
${input.userAddress}

${date}

${bureauAddress}

Re: ${roundLabel} — ${input.creditorName} — Account ending in ${input.accountNumber}
${input.round > 1 ? `Previous Dispute Reference: This is dispute #${input.round} regarding this account.\n` : ""}
To Whom It May Concern:

${input.round === 1 ? "I am writing to dispute the following account appearing on my credit report, which I believe is inaccurate, incomplete, or unverifiable." : ""}${input.round === 2 ? "I am writing as a follow-up to my previous dispute regarding the account below. Approximately 30 days have passed and this account remains on my report without adequate verification." : ""}${input.round === 3 ? "This is my THIRD and FINAL written dispute regarding the account below. Despite two prior written requests for verification under the Fair Credit Reporting Act, this unverified account continues to appear on my credit report." : ""}

${getDisputeBody(input)}

${MOV_DEMAND_BLOCK}

${input.round === 1 ? "If this information cannot be verified within 30 days, I request that it be removed from my credit report immediately, as required by FCRA Section 611(a)(5)(A)." : ""}${input.round === 2 ? "Under FCRA Section 611(a)(5)(A), if the information was not verified during your previous investigation, you are required to delete it promptly. I request immediate removal." : ""}${input.round === 3 ? "I am giving you 15 days from receipt of this letter to remove this account. If it remains on my report after that date, I will:\n\n1. File a formal complaint with the Consumer Financial Protection Bureau (CFPB)\n2. File a complaint with the Federal Trade Commission (FTC)\n3. File a complaint with my State Attorney General\n4. Consult with a consumer rights attorney regarding litigation under FCRA Sections 616 and 617\n\nI have documented all three disputes with dates and certified mail receipts." : ""}

Please send me written confirmation of the results of your investigation to the address above.

Sincerely,

${input.userName}

Enclosures:
- Copy of government-issued photo identification
- Proof of current address (utility bill or bank statement)

${input.round >= 2 ? "CC: Consumer Financial Protection Bureau\n    Federal Trade Commission" : ""}${input.round === 3 ? "\n    State Attorney General's Office\n    [Attorney Name — if applicable]" : ""}

---
Sent via Certified Mail, Return Receipt Requested
${input.round > 1 ? `This is Dispute #${input.round} of 3. All prior correspondence has been documented.` : "Keep this letter and your certified mail receipt for your records."}`;
}

export const DISPUTE_TYPE_LABELS: Record<DisputeType, string> = {
  collection: "Collection Account",
  "late-payment": "Late Payment",
  "charge-off": "Charge-Off",
  inquiry: "Unauthorized Inquiry",
  "identity-theft": "Identity Theft / Fraud",
  "inaccurate-balance": "Inaccurate Balance",
  "student-loan": "Student Loan",
  "medical-debt": "Medical Debt",
  repossession: "Repossession",
  obsolete: "Obsolete (past 7-year limit)",
  "mixed-file": "Mixed File (not my account)",
};

export const ROUND_INFO: Record<DisputeRound, { label: string; description: string; timing: string }> = {
  1: {
    label: "Round 1 — Request Verification",
    description: "Initial dispute. Requests the bureau to verify the account with the furnisher. Includes Metro 2 compliance demands.",
    timing: "Send first. Wait 30-45 days for response.",
  },
  2: {
    label: "Round 2 — Demand Removal",
    description: "Follow-up if item wasn't removed. Stronger language citing failure to verify. References Metro 2 deficiencies.",
    timing: "Send after Round 1 response (or 45 days with no response).",
  },
  3: {
    label: "Round 3 — Final Demand",
    description: "Final notice. Threatens CFPB, FTC, and State AG complaints. References willful noncompliance and potential legal action.",
    timing: "Send after Round 2 response (or 30 days with no response).",
  },
};
