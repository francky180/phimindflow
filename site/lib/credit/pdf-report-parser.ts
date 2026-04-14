/**
 * Universal Credit Report Parser
 *
 * Handles SmartCredit 3-Bureau, Equifax, Experian, TransUnion,
 * Credit Karma, AnnualCreditReport.com, and generic text reports.
 */

export interface ParsedAccount {
  creditorName: string;
  accountNumber: string;
  accountType: string;
  status: string;
  balance: number;
  creditLimit: number;
  dateOpened: string;
  lastReported: string;
  isNegative: boolean;
  negativeReason: string;
  isDisputable: boolean;
  disputeReason: string;
  bureaus: string[];
}

export interface ParsedReport {
  bureau: string;
  scores: { bureau: string; score: number }[];
  totalAccounts: number;
  openAccounts: number;
  closedAccounts: number;
  delinquent: number;
  derogatory: number;
  negativeAccounts: ParsedAccount[];
  positiveAccounts: ParsedAccount[];
  collections: ParsedAccount[];
  inquiries: { creditor: string; date: string; type: string }[];
  publicRecords: { type: string; date: string; amount: string }[];
  estimatedScore: number | null;
  rawTextLength: number;
}

// Words that are section headers, NOT creditor names
const IGNORE_NAMES = new Set([
  "account history", "account information", "account #", "account rating",
  "account description", "account status", "account type", "account not disputed",
  "account disputed", "balance owed", "balances", "closed date", "closed accounts",
  "collection chargeoff", "consumer statement", "credit limit", "credit report date",
  "current address", "date of birth", "date of last activity", "date opened",
  "date reported", "days late", "delinquent", "derogatory", "dispute status",
  "employer", "end of report", "equifax", "experian", "hard inquiry",
  "high balance", "individual", "information", "inquiries", "last payment",
  "last verified", "name", "none reported", "open accounts", "past due amount",
  "payment amount", "payment frequency", "payment history", "payment plan",
  "payment status", "payments", "personal information", "previous address",
  "public records", "repossession foreclosure", "revolving accounts",
  "score", "smartcredit", "summary", "term length", "total accounts",
  "transunion", "two-year payment history", "unknown", "vantage score",
  "your 3b report", "also known as", "creditor remarks", "creditor type",
  "subscriber reports", "consumer disputes", "amount in h/c",
]);

function isIgnoredName(name: string): boolean {
  const lower = name.toLowerCase().trim();
  if (lower.length < 3 || lower.length > 60) return true;
  if (IGNORE_NAMES.has(lower)) return true;
  // Filter pure numbers, dates, URLs
  if (/^\d+$/.test(lower)) return true;
  if (/^\d{1,2}\/\d{1,2}\/\d{2,4}/.test(lower)) return true;
  if (lower.includes("http") || lower.includes("smartcredit.com") || lower.includes("vantage score") || lower.includes("®")) return true;
  if (/^(ok|current|open|closed|paid|--|\$)/.test(lower)) return true;
  // Filter single common words
  if (/^(the|and|for|with|from|this|that|not|are|was|has|had|but|all|can|her|his|our|its)$/i.test(lower)) return true;
  return false;
}

export function parseReportText(text: string): ParsedReport {
  const lowerText = text.toLowerCase();

  // Detect bureau / source
  let bureau = "Credit Report";
  if (lowerText.includes("smartcredit")) bureau = "SmartCredit 3-Bureau";
  else if (lowerText.includes("equifax") && lowerText.includes("experian") && lowerText.includes("transunion")) bureau = "3-Bureau Report";
  else if (lowerText.includes("equifax")) bureau = "Equifax";
  else if (lowerText.includes("experian")) bureau = "Experian";
  else if (lowerText.includes("transunion")) bureau = "TransUnion";
  else if (lowerText.includes("credit karma")) bureau = "Credit Karma";
  else if (lowerText.includes("annualcreditreport")) bureau = "AnnualCreditReport.com";

  // Extract ALL scores
  const scores: { bureau: string; score: number }[] = [];
  // SmartCredit format: "Transunion\n639\nExperian\n631\nEquifax\n604"
  const scorePatterns = [
    /transunion\s*\n\s*(\d{3})/i,
    /experian\s*\n\s*(\d{3})/i,
    /equifax\s*\n\s*(\d{3})/i,
  ];
  for (const [i, pattern] of scorePatterns.entries()) {
    const match = text.match(pattern);
    if (match) {
      const score = parseInt(match[1]);
      if (score >= 300 && score <= 850) {
        scores.push({ bureau: ["TransUnion", "Experian", "Equifax"][i], score });
      }
    }
  }
  // Generic score pattern
  if (scores.length === 0) {
    const genericMatch = text.match(/(?:score|FICO|VantageScore)[:\s]*(\d{3})/i);
    if (genericMatch) {
      const score = parseInt(genericMatch[1]);
      if (score >= 300 && score <= 850) scores.push({ bureau: "Score", score });
    }
  }

  const estimatedScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b.score, 0) / scores.length) : null;

  // Extract summary numbers (SmartCredit format)
  let summaryOpen = 0, summaryClosed = 0, summaryDelinquent = 0, summaryDerogatory = 0;
  const summaryMatch = text.match(/Total Accounts[\s\S]{0,200}?Open Accounts:\s*([\s\S]{0,200}?)Derogatory:/i);
  if (summaryMatch) {
    const nums = summaryMatch[1].match(/\d+/g);
    if (nums && nums.length >= 6) {
      // SmartCredit has 3 columns (TU, EX, EQ) for each row
      summaryOpen = Math.max(...nums.slice(0, 3).map(Number));
      summaryClosed = Math.max(...nums.slice(3, 6).map(Number));
    }
  }
  const delinquentMatch = text.match(/Delinquent:\s*([\d\s]+)/i);
  if (delinquentMatch) {
    const nums = delinquentMatch[1].trim().split(/\s+/).map(Number);
    summaryDelinquent = Math.max(...nums.filter(n => !isNaN(n)));
  }
  const derogatoryMatch = text.match(/Derogatory:\s*([\d\s]+)/i);
  if (derogatoryMatch) {
    const nums = derogatoryMatch[1].trim().split(/\s+/).map(Number);
    summaryDerogatory = Math.max(...nums.filter(n => !isNaN(n)));
  }

  // Parse accounts — SmartCredit uses creditor name as header followed by data blocks
  const accounts: ParsedAccount[] = [];
  const seen = new Set<string>();

  // SmartCredit pattern: creditor name in ALL CAPS or Title Case at start of account block
  // followed by "Account #", "High Balance:", etc.
  const accountBlocks = text.split(/(?=\n[A-Z][A-Z\/\s&'.,-]{2,40}\nAccount #)/);

  for (const block of accountBlocks) {
    const lines = block.trim().split("\n").map(l => l.trim()).filter(Boolean);
    if (lines.length < 5) continue;

    const creditorName = lines[0].trim();
    if (isIgnoredName(creditorName)) continue;

    const blockText = block.toLowerCase();
    const key = creditorName.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    // Extract data from block
    const balanceMatch = blockText.match(/balance owed:\s*\$?([\d,]+)/);
    const balance = balanceMatch ? parseInt(balanceMatch[1].replace(/,/g, "")) : 0;

    const limitMatch = blockText.match(/credit limit:\s*\$?([\d,]+)/);
    const creditLimit = limitMatch ? parseInt(limitMatch[1].replace(/,/g, "")) : 0;

    const highBalMatch = blockText.match(/high balance:\s*\$?([\d,]+)/);
    const highBalance = highBalMatch ? parseInt(highBalMatch[1].replace(/,/g, "")) : 0;

    const dateOpenedMatch = blockText.match(/date opened:\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/);
    const dateReportedMatch = blockText.match(/date reported:\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/);

    // Detect account type
    let accountType = "Other";
    if (/revolving|credit card|charge account/i.test(blockText)) accountType = "Credit Card";
    else if (/auto|vehicle|automobile/i.test(blockText)) accountType = "Auto Loan";
    else if (/mortgage|home loan/i.test(blockText)) accountType = "Mortgage";
    else if (/student|education|sallie|navient|nelnet|mohela/i.test(blockText)) accountType = "Student Loan";
    else if (/personal loan|installment/i.test(blockText)) accountType = "Personal Loan";
    else if (/medical|hospital|healthcare/i.test(blockText)) accountType = "Medical";
    else if (/collection/i.test(blockText) || /recovery|receivable/i.test(creditorName.toLowerCase())) accountType = "Collection";

    // Detect which bureaus report this account
    const bureaus: string[] = [];
    if (blockText.includes("transunion")) bureaus.push("TransUnion");
    if (blockText.includes("experian")) bureaus.push("Experian");
    if (blockText.includes("equifax")) bureaus.push("Equifax");

    // Detect negative status
    let isNegative = false;
    let negativeReason = "";

    // Check payment status field specifically (not the legend section)
    const paymentStatus = blockText.match(/payment status:\s*([^\n]+)/);
    const accountRating = blockText.match(/account rating:\s*([^\n]+)/);
    const statusText = (paymentStatus?.[1] || "") + " " + (accountRating?.[1] || "");

    // SmartCredit: "Late 60 Days" in payment status means actually late
    if (/late \d+ days/i.test(statusText)) {
      isNegative = true;
      const lateMatch = statusText.match(/late (\d+) days/i);
      negativeReason = lateMatch ? `${lateMatch[1]} Days Late` : "Late Payment";
    }

    // Check for charge-off in account status/description (not in the legend)
    if (/charge.?off/i.test(statusText) || /charge.?off/i.test(blockText.match(/account description:[^\n]*/)?.[0] || "")) {
      isNegative = true;
      negativeReason = "Charge-Off";
    }

    // Collection account
    if (accountType === "Collection") { isNegative = true; negativeReason = "Collection"; }

    // Past due with actual amount > 0
    const pastDueMatch = blockText.match(/past due amount:\s*\$?([\d,]+)/);
    if (pastDueMatch && parseInt(pastDueMatch[1].replace(/,/g, "")) > 0) {
      isNegative = true;
      negativeReason = negativeReason || "Past Due";
    }

    // Derogatory in status
    if (/derogatory/i.test(statusText)) { isNegative = true; negativeReason = negativeReason || "Derogatory"; }

    // Repossession/foreclosure in account status (not the legend)
    if (/repossession/i.test(statusText)) { isNegative = true; negativeReason = "Repossession"; }
    if (/foreclosure/i.test(statusText)) { isNegative = true; negativeReason = "Foreclosure"; }

    // Settled
    if (/settled/i.test(statusText)) { isNegative = true; negativeReason = negativeReason || "Settled"; }

    // SmartCredit Days Late history — only count if actual late days > 0
    const daysLate30 = blockText.match(/\b30:\s*(\d+)/);
    const daysLate60 = blockText.match(/\b60:\s*(\d+)/);
    const daysLate90 = blockText.match(/\b90:\s*(\d+)/);
    const totalLateDays = (daysLate30 ? parseInt(daysLate30[1]) : 0) +
      (daysLate60 ? parseInt(daysLate60[1]) : 0) +
      (daysLate90 ? parseInt(daysLate90[1]) : 0);
    if (totalLateDays > 0 && !isNegative) {
      isNegative = true;
      negativeReason = `Late Payment (${totalLateDays}x in 7 years)`;
    }

    // Account number
    const acctMatch = block.match(/Account #\s*\n\s*([A-Z0-9*]+)/i);
    const accountNumber = acctMatch ? acctMatch[1].replace(/\*/g, "").slice(-4) || "****" : "****";

    // Status
    let status = "Open";
    if (/closed/i.test(blockText)) status = "Closed";
    if (isNegative) status = negativeReason;

    // Disputable?
    let isDisputable = false;
    let disputeReason = "";
    if (accountType === "Collection") {
      isDisputable = true;
      disputeReason = "Collection accounts can be challenged for debt verification under FDCPA";
    } else if (negativeReason.includes("Late")) {
      isDisputable = true;
      disputeReason = "Late payments can be disputed for accuracy of reported dates";
    } else if (negativeReason === "Charge-Off") {
      isDisputable = true;
      disputeReason = "Charge-offs can be disputed for accuracy of reported balance";
    } else if (negativeReason === "Repossession") {
      isDisputable = true;
      disputeReason = "Repossessions can be disputed for proper UCC notice and sale procedures";
    } else if (isNegative) {
      isDisputable = true;
      disputeReason = "Negative item can be disputed for verification under FCRA Section 611";
    }

    accounts.push({
      creditorName,
      accountNumber,
      accountType,
      status,
      balance: balance || highBalance,
      creditLimit: creditLimit || highBalance,
      dateOpened: dateOpenedMatch?.[1] || "Unknown",
      lastReported: dateReportedMatch?.[1] || "Unknown",
      isNegative,
      negativeReason,
      isDisputable,
      disputeReason,
      bureaus,
    });
  }

  // ALSO parse using the generic "ACCOUNT NAME:" pattern for non-SmartCredit formats
  if (accounts.length < 3) {
    const genericPattern = /(?:account name|original creditor|collection agency|creditor)[:\s]*([^\n]+)/gi;
    let match;
    while ((match = genericPattern.exec(text)) !== null) {
      const name = match[1].trim().replace(/[^\w\s&.,'-]/g, "").trim();
      if (name.length < 3 || name.length > 60 || isIgnoredName(name)) continue;
      if (seen.has(name.toLowerCase())) continue;
      seen.add(name.toLowerCase());

      const idx = match.index;
      const nextMatch = text.slice(idx + name.length).search(/\nACCOUNT NAME:|\nCOLLECTION AGENCY:|\nOriginal Creditor:/i);
      const contextEnd = nextMatch > 0 ? idx + name.length + nextMatch : idx + 400;
      const context = text.slice(idx, contextEnd).toLowerCase();

      let isNegative = false;
      let negativeReason = "";
      let accountType = "Other";
      let isCollection = false;

      if (/collection|recovery|receivable/i.test(context) || /collection|recovery/i.test(name)) {
        isCollection = true; accountType = "Collection"; isNegative = true; negativeReason = "Collection";
      }
      if (/charge.?off/i.test(context)) { isNegative = true; negativeReason = "Charge-Off"; }
      if (/late|past due|delinquent/i.test(context)) { isNegative = true; negativeReason = negativeReason || "Late/Past Due"; }

      const balMatch = context.match(/balance[:\s]*\$?([\d,]+)/);
      const limMatch = context.match(/(?:limit|high balance)[:\s]*\$?([\d,]+)/);

      let isDisputable = false;
      let disputeReason = "";
      if (isCollection) { isDisputable = true; disputeReason = "Collection accounts can be challenged under FDCPA"; }
      else if (isNegative) { isDisputable = true; disputeReason = "Can be disputed under FCRA Section 611"; }

      accounts.push({
        creditorName: name,
        accountNumber: "****",
        accountType: /credit card|revolving/i.test(context) ? "Credit Card" : /auto/i.test(context) ? "Auto Loan" : accountType,
        status: isNegative ? negativeReason : "Open",
        balance: balMatch ? parseInt(balMatch[1].replace(/,/g, "")) : 0,
        creditLimit: limMatch ? parseInt(limMatch[1].replace(/,/g, "")) : 0,
        dateOpened: "Unknown",
        lastReported: "Unknown",
        isNegative,
        negativeReason,
        isDisputable,
        disputeReason,
        bureaus: [],
      });
    }
  }

  // Parse inquiries
  const inquiries: ParsedReport["inquiries"] = [];
  const inquirySection = lowerText.indexOf("inquir");
  if (inquirySection !== -1) {
    const inquiryText = text.slice(inquirySection, inquirySection + 2000);
    const inquiryPattern = /([A-Z][A-Za-z\s&.,/'/-]{3,40})\s+(\d{1,2}\/\d{1,2}\/\d{2,4})/g;
    let iqMatch: RegExpExecArray | null;
    while ((iqMatch = inquiryPattern.exec(inquiryText)) !== null) {
      const name = iqMatch[1].trim();
      if (!isIgnoredName(name) && iqMatch && !inquiries.some(i => i.creditor === name && i.date === iqMatch![2])) {
        inquiries.push({ creditor: name, date: iqMatch![2], type: "Hard Inquiry" });
      }
    }
  }

  // Parse public records
  const publicRecords: ParsedReport["publicRecords"] = [];
  const publicSection = lowerText.indexOf("public record");
  if (publicSection !== -1) {
    const publicText = text.slice(publicSection, publicSection + 1000).toLowerCase();
    if (publicText.includes("bankruptcy")) {
      const dateMatch = publicText.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/);
      publicRecords.push({ type: "Bankruptcy", date: dateMatch?.[1] || "Unknown", amount: "N/A" });
    }
    if (publicText.includes("judgment") || publicText.includes("lien")) {
      const type = publicText.includes("judgment") ? "Judgment" : "Tax Lien";
      publicRecords.push({ type, date: "Unknown", amount: "Unknown" });
    }
  }

  // Separate accounts
  const negativeAccounts = accounts.filter(a => a.isNegative && a.accountType !== "Collection");
  const positiveAccounts = accounts.filter(a => !a.isNegative);
  const collections = accounts.filter(a => a.accountType === "Collection");

  return {
    bureau,
    scores,
    totalAccounts: accounts.length || summaryOpen + summaryClosed,
    openAccounts: positiveAccounts.filter(a => a.status !== "Closed").length || summaryOpen,
    closedAccounts: accounts.filter(a => a.status === "Closed").length || summaryClosed,
    delinquent: summaryDelinquent,
    derogatory: summaryDerogatory,
    negativeAccounts,
    positiveAccounts,
    collections,
    inquiries: inquiries.slice(0, 30),
    publicRecords,
    estimatedScore,
    rawTextLength: text.length,
  };
}
