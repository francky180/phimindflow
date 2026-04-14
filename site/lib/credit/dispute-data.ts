/**
 * Common creditors, collection agencies, and dispute reasons
 * Users pick from these lists instead of typing
 */

export const COMMON_COLLECTION_AGENCIES = [
  "Midland Credit Management",
  "Portfolio Recovery Associates",
  "LVNV Funding",
  "Encore Capital Group",
  "Cavalry SPV",
  "Credit Corp Solutions",
  "Unifin Inc",
  "Enhanced Recovery Company",
  "IC System",
  "GC Services",
  "Convergent Outsourcing",
  "National Credit Systems",
  "Allied Interstate",
  "CBE Group",
  "Transworld Systems",
  "Penn Credit Corporation",
  "Professional Finance Company",
  "Credit Collection Services",
  "Asset Acceptance Capital",
  "Asta Funding",
] as const;

export const COMMON_CREDITORS = [
  "Capital One",
  "Chase / JPMorgan",
  "Bank of America",
  "Citi / Citibank",
  "Wells Fargo",
  "Discover",
  "American Express",
  "Synchrony Bank",
  "Barclays",
  "US Bank",
  "TD Bank",
  "PNC Bank",
  "Navy Federal Credit Union",
  "USAA",
  "Goldman Sachs (Apple Card / Marcus)",
  "Ally Financial",
  "Toyota Financial Services",
  "Ford Motor Credit",
  "Sallie Mae",
  "Navient",
  "Nelnet",
  "MOHELA",
  "Great Lakes (Nelnet)",
  "FedLoan Servicing",
  "T-Mobile",
  "AT&T",
  "Verizon",
  "Comcast / Xfinity",
  "Spectrum",
] as const;

export const COMMON_MEDICAL = [
  "Hospital / Medical Center",
  "Emergency Room / ER Visit",
  "Physician / Doctor's Office",
  "Dental Office",
  "Laboratory / Lab Services",
  "Ambulance Services",
  "Urgent Care",
  "Radiology / Imaging",
  "Physical Therapy",
  "Mental Health / Counseling",
] as const;

export const DISPUTE_REASONS: Record<string, { label: string; reasons: string[] }> = {
  collection: {
    label: "Collection Account",
    reasons: [
      "This debt is not mine. I have no record of this account.",
      "This debt has been paid in full. The balance should be $0.",
      "This debt is past the statute of limitations in my state.",
      "I was never notified of this debt before it was sent to collections.",
      "The balance reported is incorrect and does not match my records.",
      "This is a duplicate entry. The same debt appears multiple times.",
      "This collection was the result of identity theft.",
      "I dispute the validity of this debt. Please provide verification.",
      "The original creditor agreed to remove this upon payment, but it still appears.",
      "This medical debt should have been covered by my insurance.",
    ],
  },
  "late-payment": {
    label: "Late Payment",
    reasons: [
      "I was never late on this account. My records show on-time payments.",
      "The late payment was reported incorrectly. The payment was made within the grace period.",
      "I had a payment arrangement with the creditor that was not reflected.",
      "The late payment was caused by a billing error on the creditor's end.",
      "I was affected by a natural disaster and qualified for forbearance.",
      "The account was in forbearance or deferment during the reported late period.",
      "The creditor failed to send statements to my correct address.",
      "The autopay system failed and I was not notified of the missed payment.",
      "This late payment is older than 7 years and should be removed.",
    ],
  },
  "charge-off": {
    label: "Charge-Off",
    reasons: [
      "This charge-off has been paid. The status should reflect $0 balance.",
      "The charge-off amount is incorrect. My records show a different balance.",
      "This account was included in a settlement agreement that was completed.",
      "I dispute the validity of this charge-off. I do not recognize this account.",
      "The date of first delinquency is reported incorrectly.",
      "This charge-off is a duplicate of another account on my report.",
      "This charge-off is older than 7 years and should be removed.",
      "The creditor agreed to remove this upon payment but it still appears.",
    ],
  },
  inquiry: {
    label: "Unauthorized Hard Inquiry",
    reasons: [
      "I did not authorize this inquiry. I never applied for credit with this company.",
      "This inquiry was the result of identity theft.",
      "I was told this would be a soft pull, not a hard inquiry.",
      "This inquiry is a duplicate. The same company pulled my report multiple times.",
      "I withdrew my application before any credit decision was made.",
      "This inquiry is older than 2 years and should be removed.",
    ],
  },
  "identity-theft": {
    label: "Identity Theft / Fraud",
    reasons: [
      "This account was opened fraudulently without my knowledge or consent.",
      "I am a victim of identity theft. I have filed a police report.",
      "Someone used my personal information to open this account.",
      "I have never had a relationship with this creditor.",
      "This account was opened at an address I have never lived at.",
    ],
  },
  "inaccurate-balance": {
    label: "Inaccurate Balance / Info",
    reasons: [
      "The reported balance is incorrect. My actual balance is different.",
      "The credit limit is reported incorrectly, inflating my utilization.",
      "The account status is wrong. This account is open, not closed (or vice versa).",
      "The payment history contains errors for specific months.",
      "My personal information (name, address, SSN) is reported incorrectly.",
      "The date opened is incorrect.",
      "The account type is misreported.",
    ],
  },
  "student-loan": {
    label: "Student Loan Dispute",
    reasons: [
      "This loan was in forbearance during the reported delinquent period.",
      "This loan qualifies for discharge due to school closure or fraud.",
      "The servicer failed to process my income-driven repayment application.",
      "The balance does not reflect payments I have made.",
      "I consolidated this loan. The old account should show $0.",
      "The servicer transferred my loan and reported inaccurately during transition.",
    ],
  },
  "medical-debt": {
    label: "Medical Debt",
    reasons: [
      "This medical debt should have been covered by my insurance.",
      "I was never billed at my correct address for this medical service.",
      "The amount is incorrect. My insurance paid a portion that is not reflected.",
      "This medical debt is under $500 and should not appear per new FCRA rules.",
      "I have a payment plan in place that is not reflected.",
      "I dispute the charges. I was overbilled for this medical service.",
      "I never received the medical service associated with this debt.",
    ],
  },
  "repossession": {
    label: "Repossession",
    reasons: [
      "The deficiency balance after sale is incorrect.",
      "I was not given proper notice before the repossession.",
      "The vehicle was sold for significantly below market value.",
      "I voluntarily surrendered the vehicle under different terms than reported.",
      "The repossession occurred because of a payment processing error.",
    ],
  },
  "obsolete": {
    label: "Obsolete (Past 7-Year Limit)",
    reasons: [
      "This account is past the 7-year reporting limit under FCRA §605.",
      "The Date of First Delinquency shows this should have been removed already.",
      "This debt was re-aged to extend reporting. The original DOFD is accurate.",
      "This bankruptcy is older than 10 years and must be removed.",
      "The original creditor confirmed the DOFD is past the reporting window.",
    ],
  },
  "mixed-file": {
    label: "Mixed File (Not My Account)",
    reasons: [
      "This account does not belong to me. I have never had a relationship with this creditor.",
      "This appears to be another consumer's account mixed into my file.",
      "The name, SSN, or date of birth on file do not match my actual records.",
      "This account was opened in a state I have never lived in.",
      "I have documentation proving this account belongs to a different person.",
    ],
  },
};

export type DisputeTypeKey = keyof typeof DISPUTE_REASONS;

export const ALL_BUREAUS = ["Equifax", "Experian", "TransUnion"] as const;
export type Bureau = (typeof ALL_BUREAUS)[number];
