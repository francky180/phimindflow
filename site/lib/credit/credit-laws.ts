/**
 * CREDIT LAW REFERENCE LIBRARY
 *
 * Citations used across dispute letters. All are federal statutes, CFPB rules,
 * or Metro 2 format fields — public law / public standards.
 *
 * Structure: { id, citation, short, description, appliesTo[] }
 */

export type LawId =
  // FCRA — Fair Credit Reporting Act (15 USC §1681 et seq.)
  | "fcra-604" | "fcra-605" | "fcra-605b" | "fcra-607" | "fcra-609"
  | "fcra-609e" | "fcra-611" | "fcra-611-a-5" | "fcra-615" | "fcra-616" | "fcra-617"
  | "fcra-623-a" | "fcra-623-b" | "fcra-623-a-8"
  // FDCPA — Fair Debt Collection Practices Act (15 USC §1692)
  | "fdcpa-805" | "fdcpa-807" | "fdcpa-808" | "fdcpa-809" | "fdcpa-809b" | "fdcpa-811" | "fdcpa-813"
  // FCBA — Fair Credit Billing Act (15 USC §1666)
  | "fcba-161"
  // TILA — Truth in Lending Act
  | "tila-1640"
  // Regulation V — FCRA implementation (12 CFR §1022)
  | "reg-v"
  // CFPB rules on medical debt
  | "cfpb-medical-500" | "cfpb-medical-365"
  // Metro 2 format compliance
  | "metro2"
  // UCC — for repossessions
  | "ucc-9-610" | "ucc-9-611" | "ucc-9-614";

export type LawRef = {
  id: LawId;
  citation: string;
  short: string;
  description: string;
};

export const LAWS: Record<LawId, LawRef> = {
  // ========== FCRA ==========
  "fcra-604": {
    id: "fcra-604",
    citation: "15 U.S.C. § 1681b",
    short: "FCRA §604",
    description:
      "Permissible purposes. A credit report may only be accessed with a legally permissible purpose AND the consumer's written authorization.",
  },
  "fcra-605": {
    id: "fcra-605",
    citation: "15 U.S.C. § 1681c",
    short: "FCRA §605",
    description:
      "Obsolete information. Most negative items must be removed 7 years from the date of first delinquency (10 years for bankruptcies).",
  },
  "fcra-605b": {
    id: "fcra-605b",
    citation: "15 U.S.C. § 1681c-2",
    short: "FCRA §605B",
    description:
      "Identity theft block. Upon receipt of an identity theft report, the bureau must block fraudulent information within 4 business days.",
  },
  "fcra-607": {
    id: "fcra-607",
    citation: "15 U.S.C. § 1681e",
    short: "FCRA §607",
    description:
      "Compliance procedures. Credit reporting agencies must follow reasonable procedures to assure maximum possible accuracy of the information concerning the individual.",
  },
  "fcra-609": {
    id: "fcra-609",
    citation: "15 U.S.C. § 1681g",
    short: "FCRA §609",
    description:
      "Disclosures to consumers. You have the right to request the 'source' of any disputed information — including the original documents, not just a computer-generated verification.",
  },
  "fcra-609e": {
    id: "fcra-609e",
    citation: "15 U.S.C. § 1681g(e)",
    short: "FCRA §609(e)",
    description:
      "Identity theft records. A business that transacted with an identity thief must provide all relevant application and transaction records to the victim upon request.",
  },
  "fcra-611": {
    id: "fcra-611",
    citation: "15 U.S.C. § 1681i",
    short: "FCRA §611",
    description:
      "Reinvestigation. Bureaus must conduct a reasonable reinvestigation of disputed information within 30 days (45 if additional info is provided during the investigation).",
  },
  "fcra-611-a-5": {
    id: "fcra-611-a-5",
    citation: "15 U.S.C. § 1681i(a)(5)(A)",
    short: "FCRA §611(a)(5)(A)",
    description:
      "Mandatory deletion. If disputed information cannot be verified, the bureau MUST promptly delete it from the consumer's file.",
  },
  "fcra-615": {
    id: "fcra-615",
    citation: "15 U.S.C. § 1681m",
    short: "FCRA §615",
    description:
      "Adverse action. Creditors must provide notice and a copy of the credit report used when they take adverse action based on a credit report.",
  },
  "fcra-616": {
    id: "fcra-616",
    citation: "15 U.S.C. § 1681n",
    short: "FCRA §616",
    description:
      "Willful noncompliance. Any person who willfully fails to comply is liable for actual damages OR statutory damages of $100–$1,000 per violation, punitive damages, costs, and attorney's fees.",
  },
  "fcra-617": {
    id: "fcra-617",
    citation: "15 U.S.C. § 1681o",
    short: "FCRA §617",
    description:
      "Negligent noncompliance. Any person who negligently fails to comply is liable for actual damages, costs, and attorney's fees.",
  },
  "fcra-623-a": {
    id: "fcra-623-a",
    citation: "15 U.S.C. § 1681s-2(a)",
    short: "FCRA §623(a)",
    description:
      "Duty of furnishers to report accurate information. A furnisher shall not report any information relating to a consumer that the furnisher knows or has reasonable cause to believe is inaccurate.",
  },
  "fcra-623-b": {
    id: "fcra-623-b",
    citation: "15 U.S.C. § 1681s-2(b)",
    short: "FCRA §623(b)",
    description:
      "Duty of furnishers after notice of dispute. A furnisher must investigate, review all relevant information, and report the results back to the bureau — and modify, delete, or permanently block any inaccurate item.",
  },
  "fcra-623-a-8": {
    id: "fcra-623-a-8",
    citation: "15 U.S.C. § 1681s-2(a)(8)",
    short: "FCRA §623(a)(8)",
    description:
      "Direct dispute rights. Consumers have the right to dispute inaccurate information directly with the furnisher, who must investigate and respond.",
  },

  // ========== FDCPA ==========
  "fdcpa-805": {
    id: "fdcpa-805",
    citation: "15 U.S.C. § 1692c",
    short: "FDCPA §805",
    description:
      "Communications in connection with debt collection. Prohibits certain communication times, places, and contacts with third parties.",
  },
  "fdcpa-807": {
    id: "fdcpa-807",
    citation: "15 U.S.C. § 1692e",
    short: "FDCPA §807",
    description:
      "False or misleading representations. A debt collector may not use any false, deceptive, or misleading representation in connection with the collection of any debt.",
  },
  "fdcpa-808": {
    id: "fdcpa-808",
    citation: "15 U.S.C. § 1692f",
    short: "FDCPA §808",
    description:
      "Unfair practices. A debt collector may not use unfair or unconscionable means — including collecting amounts not authorized by the agreement or permitted by law.",
  },
  "fdcpa-809": {
    id: "fdcpa-809",
    citation: "15 U.S.C. § 1692g",
    short: "FDCPA §809",
    description:
      "Validation of debts. Within 5 days of first contact, a debt collector must send a written notice informing the consumer of the amount, creditor, and right to dispute.",
  },
  "fdcpa-809b": {
    id: "fdcpa-809b",
    citation: "15 U.S.C. § 1692g(b)",
    short: "FDCPA §809(b)",
    description:
      "Dispute and verification. If the consumer disputes the debt in writing within 30 days, the collector must cease collection until verification is obtained and mailed to the consumer.",
  },
  "fdcpa-811": {
    id: "fdcpa-811",
    citation: "15 U.S.C. § 1692i",
    short: "FDCPA §811",
    description:
      "Legal actions. A debt collector bringing a legal action must sue in the judicial district where the consumer signed the contract or where the consumer resides.",
  },
  "fdcpa-813": {
    id: "fdcpa-813",
    citation: "15 U.S.C. § 1692k",
    short: "FDCPA §813",
    description:
      "Civil liability. Any debt collector who fails to comply is liable for actual damages, statutory damages up to $1,000 per action, costs, and attorney's fees.",
  },

  // ========== FCBA / TILA ==========
  "fcba-161": {
    id: "fcba-161",
    citation: "15 U.S.C. § 1666",
    short: "FCBA §161",
    description:
      "Billing errors. Consumers have 60 days to dispute billing errors in writing. The creditor must acknowledge within 30 days and resolve within 90 days.",
  },
  "tila-1640": {
    id: "tila-1640",
    citation: "15 U.S.C. § 1640",
    short: "TILA §130",
    description:
      "Truth in Lending civil liability. Creditors who fail to disclose accurate terms are liable for actual and statutory damages.",
  },

  // ========== Regulation V ==========
  "reg-v": {
    id: "reg-v",
    citation: "12 C.F.R. § 1022",
    short: "Regulation V",
    description:
      "CFPB's implementing regulation for the FCRA. Governs how bureaus and furnishers handle disputes, accuracy, and direct disputes.",
  },

  // ========== CFPB Medical Debt Rules ==========
  "cfpb-medical-500": {
    id: "cfpb-medical-500",
    citation: "CFPB Final Rule 2023",
    short: "CFPB Medical Debt <$500",
    description:
      "Medical collection debts under $500 are not reported to the credit bureaus.",
  },
  "cfpb-medical-365": {
    id: "cfpb-medical-365",
    citation: "CFPB / NCRA Policy",
    short: "365-Day Waiting Period",
    description:
      "Medical debts cannot be reported until 365 days after the date of first delinquency, giving consumers time to work with insurers and providers.",
  },

  // ========== Metro 2 ==========
  metro2: {
    id: "metro2",
    citation: "CDIA Credit Reporting Resource Guide",
    short: "Metro 2 Format",
    description:
      "The industry-standard data format that furnishers MUST use when reporting to credit bureaus. Any deviation in required fields makes the tradeline non-compliant and unverifiable.",
  },

  // ========== UCC ==========
  "ucc-9-610": {
    id: "ucc-9-610",
    citation: "UCC § 9-610",
    short: "UCC §9-610",
    description:
      "Disposition of collateral. Every aspect of a disposition (sale) of collateral, including method, manner, time, place, and terms, must be commercially reasonable.",
  },
  "ucc-9-611": {
    id: "ucc-9-611",
    citation: "UCC § 9-611",
    short: "UCC §9-611",
    description:
      "Notification before disposition. A secured party must send reasonable authenticated notification of disposition to the debtor before selling repossessed collateral.",
  },
  "ucc-9-614": {
    id: "ucc-9-614",
    citation: "UCC § 9-614",
    short: "UCC §9-614",
    description:
      "Contents of notification. The notification of disposition must include specific information about the debtor's rights, the collateral, and the sale.",
  },
};

/**
 * Required Metro 2 fields that must be accurate for a tradeline to be verifiable.
 * Any missing or inaccurate field = non-compliant = grounds for deletion.
 */
export const METRO2_REQUIRED_FIELDS = [
  { field: "Account Status Code", description: "Current status code matching actual account condition" },
  { field: "Date of First Delinquency (DOFD)", description: "Required on all derogatory accounts — the trigger date for 7-year reporting limit" },
  { field: "Date of Account Opening", description: "Must match the original creditor's records exactly" },
  { field: "Date Closed", description: "If account is closed, the exact date must be reported" },
  { field: "Payment Rating", description: "Must correctly reflect the 24-month payment history" },
  { field: "Current Balance", description: "Must be accurate as of the last reporting date" },
  { field: "Original Amount / High Balance", description: "Must match opening and historical high balance records" },
  { field: "Account Type", description: "Correct code (Revolving, Installment, Mortgage, etc.)" },
  { field: "Terms Frequency", description: "Correct payment frequency code (monthly, quarterly, etc.)" },
  { field: "Terms Duration", description: "Loan term or revolving account indicator" },
  { field: "Compliance Condition Code (CCC)", description: "Required when disputes, forbearance, or special conditions apply" },
  { field: "Consumer Information Indicator (CII)", description: "Flags special consumer statuses (deceased, ID theft, dispute, etc.)" },
  { field: "Special Comment Code", description: "Additional context code required in specific situations" },
  { field: "Portfolio Type", description: "Installment, revolving, mortgage, line of credit, open account" },
  { field: "Creditor Classification", description: "Type of creditor (retail, bank, auto, etc.) — must be accurate" },
  { field: "ECOA Code", description: "Joint, individual, authorized user — Equal Credit Opportunity Act designation" },
] as const;

/**
 * Formatted citation string for inclusion in letter text.
 */
export function citeLaw(id: LawId): string {
  const law = LAWS[id];
  return `${law.short} (${law.citation})`;
}

/**
 * Full formatted reference block for a list of law IDs.
 */
export function lawReferenceBlock(ids: LawId[]): string {
  return ids
    .map((id) => {
      const law = LAWS[id];
      return `• ${law.short} — ${law.citation}\n  ${law.description}`;
    })
    .join("\n\n");
}
