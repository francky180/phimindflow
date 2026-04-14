"use client";

import Navbar from "@/app/Navbar";
import Link from "next/link";
import { useState } from "react";
import { BookOpen, FileText, CreditCard, TrendingUp, Shield, AlertTriangle, ChevronDown, Mail, Upload } from "lucide-react";

const sections = [
  {
    id: "how-scores-work",
    icon: TrendingUp,
    category: "Basics",
    title: "How Credit Scores Work",
    content: [
      {
        heading: "The 5 Factors That Make Up Your Score",
        body: `Your credit score is calculated using five factors, each weighted differently:

**Payment History (35%)** — The most important factor. Every on-time payment helps. Even one late payment can drop your score significantly.

**Credit Utilization (30%)** — How much of your available credit you are using. Keep this below 30%, ideally below 10%. If you have a $1,000 limit, try to keep your balance under $100.

**Length of Credit History (15%)** — How long your accounts have been open. Older accounts help your score. Avoid closing your oldest credit card.

**Credit Mix (10%)** — Having different types of credit (credit cards, auto loans, mortgage) shows lenders you can manage various accounts.

**New Credit Inquiries (10%)** — Each time you apply for credit, a hard inquiry appears on your report. Too many in a short period can lower your score.`,
      },
      {
        heading: "Score Ranges",
        body: `**300–499:** Poor — Will be denied for most credit. Focus on secured cards and dispute any errors.
**500–579:** Fair — Limited options. High interest rates. Credit repair can help significantly here.
**580–669:** Good — More options open up. FHA loans become available at 580+.
**670–739:** Very Good — Competitive rates. Most lenders will approve you.
**740–850:** Excellent — Best rates and terms available. You qualify for everything.`,
      },
    ],
  },
  {
    id: "reading-your-report",
    icon: FileText,
    category: "Basics",
    title: "Understanding Your Credit Report",
    content: [
      {
        heading: "What Is a Credit Report?",
        body: `Your credit report is a detailed record of your credit history, maintained by three bureaus: **Equifax**, **Experian**, and **TransUnion**. Each bureau may have slightly different information, which is why your scores can vary.

You can get a free copy of your report from each bureau once per year at AnnualCreditReport.com.`,
      },
      {
        heading: "Sections of Your Report",
        body: `**Personal Information** — Your name, address, Social Security number, and employment history. Check for errors here — a wrong address or misspelled name could mean mixed files.

**Account History** — Every credit account you have or had. Shows open date, credit limit, balance, payment history, and status. Look for accounts you do not recognize.

**Collections** — Debts that have been sent to collection agencies. These are the most damaging items on your report.

**Public Records** — Bankruptcies, judgments, and tax liens. These have severe impacts on your score.

**Inquiries** — Hard inquiries (from credit applications) and soft inquiries (from pre-approvals or your own checks). Only hard inquiries affect your score.`,
      },
      {
        heading: "What to Look For",
        body: `When reviewing your report, look for:
- Accounts you do not recognize (possible identity theft)
- Late payments that were actually paid on time
- Incorrect balances or credit limits
- Accounts listed as open that you closed
- Collections for debts you already paid
- Duplicate accounts (same debt listed twice)
- Outdated negative items (most must be removed after 7 years)`,
      },
    ],
  },
  {
    id: "dispute-process",
    icon: Shield,
    category: "Repair",
    title: "How to Dispute Negative Items",
    content: [
      {
        heading: "Your Right to Dispute",
        body: `Under the **Fair Credit Reporting Act (FCRA)**, you have the legal right to dispute any information on your credit report that you believe is inaccurate, incomplete, or unverifiable. The credit bureau must investigate within 30 days and remove any item they cannot verify.`,
      },
      {
        heading: "The Dispute Process Step by Step",
        body: `**Step 1:** Get your credit reports from all 3 bureaus.

**Step 2:** Identify every item that is inaccurate, outdated, or unverifiable.

**Step 3:** Write a dispute letter for each item to each bureau that shows it. Our free dispute letter generator can create these for you.

**Step 4:** Send your letters via certified mail with return receipt requested. This creates a paper trail proving the bureau received your dispute.

**Step 5:** Wait for the bureau to investigate (they have 30 days).

**Step 6:** Review the results. If the item is not removed, you can escalate with a follow-up dispute using stronger language.`,
      },
      {
        heading: "What to Include When Sending Dispute Letters",
        body: `When you mail your dispute letters, you need to include supporting documents so the bureau can verify your identity and process the dispute:

- **Your full name and current address**
- **Your Social Security Number** (required for the bureau to locate your file)
- **A copy of your government-issued ID** (driver's license or state ID)
- **Proof of current address** (utility bill, bank statement, or lease dated within 60 days)
- **A copy of your credit report** with the disputed items highlighted or circled

These documents are sent directly to the credit bureau by mail — they are not collected or stored on this website. Keep copies of everything you send for your records.`,
      },
      {
        heading: "Tips for Effective Disputes",
        body: `- Dispute one or two items at a time per bureau — bulk disputes are often flagged as frivolous
- Be specific about why you are disputing each item
- Include any supporting documentation you have
- Always send via certified mail, never online (online disputes limit your rights)
- Keep copies of everything you send and receive
- Follow up within 35 days if you do not hear back`,
      },
    ],
  },
  {
    id: "building-credit",
    icon: CreditCard,
    category: "Build",
    title: "Building Credit From Scratch",
    content: [
      {
        heading: "Starting With No Credit History",
        body: `Building credit from nothing is actually simpler than repairing bad credit. The key is establishing a history of on-time payments with accounts that report to all 3 bureaus.`,
      },
      {
        heading: "Best Tools for Building Credit",
        body: `**Secured Credit Cards** — You put down a deposit (usually $200–$500) that becomes your credit limit. Use it for small purchases, pay the full balance every month, and your score builds over time. After 6–12 months, many issuers upgrade you to an unsecured card and refund your deposit.

**Credit Builder Loans** — A lender holds a small loan amount in a savings account. You make monthly payments, which are reported to the bureaus. Once the loan is paid off, you get the money. You build credit and savings at the same time.

**Authorized User** — Ask a family member with good credit to add you as an authorized user on their credit card. Their account history gets added to your report. You do not even need to use the card.`,
      },
      {
        heading: "The Rules to Follow",
        body: `- **Never miss a payment.** Set up autopay for at least the minimum.
- **Keep utilization low.** Use less than 10% of your limit for the best results.
- **Do not close old accounts.** Length of history matters.
- **Limit new applications.** Only apply when you genuinely need credit.
- **Check your report regularly.** Catch errors early before they do damage.`,
      },
    ],
  },
  {
    id: "credit-card-strategy",
    icon: CreditCard,
    category: "Build",
    title: "Credit Card Strategy for Score Building",
    content: [
      {
        heading: "Using Cards to Your Advantage",
        body: `Credit cards are the fastest way to build a strong score — if used correctly. The key is treating your credit card like a debit card: only spend what you already have, and pay it off every month.`,
      },
      {
        heading: "The Statement Balance Method",
        body: `For the best score impact:
1. Use your card for a small recurring bill (like a subscription)
2. Let the statement close with a small balance (1–9% of your limit)
3. Pay the full statement balance before the due date
4. Repeat every month

This shows the bureaus that you use credit responsibly and always pay on time. Your utilization stays low, and you build a consistent payment history.`,
      },
      {
        heading: "Common Mistakes to Avoid",
        body: `- **Carrying a balance does NOT help your score.** Pay in full every month.
- **Maxing out your card hurts your score** even if you pay it off — the balance is reported before your payment.
- **Closing cards lowers your score** by reducing available credit and shortening history.
- **Applying for too many cards at once** creates multiple hard inquiries.`,
      },
    ],
  },
  {
    id: "collections-guide",
    icon: AlertTriangle,
    category: "Repair",
    title: "Collections Removal Guide",
    content: [
      {
        heading: "How Collections End Up on Your Report",
        body: `When you stop paying a debt, the original creditor eventually sells or transfers it to a collection agency. That agency then reports the collection to the credit bureaus. Collections are one of the most damaging items on your report and can drop your score 50–100 points.`,
      },
      {
        heading: "Can Collections Be Removed?",
        body: `Yes, in many cases. Collections can be disputed and removed if:
- The debt is not yours (identity theft or mixed files)
- The amount is incorrect
- The collection agency cannot provide verification of the debt
- The debt is past the 7-year reporting limit
- The original creditor's records no longer exist
- There are procedural errors in how the debt was reported`,
      },
      {
        heading: "Pay-for-Delete Strategy",
        body: `If you do owe the debt, you can sometimes negotiate a **pay-for-delete** agreement. This means you agree to pay the debt (or a settled amount) in exchange for the collection agency removing the account from your report entirely.

**Important:** Get the agreement in writing before you pay. Verbal promises are not enforceable. Not all agencies will agree to this, but many will — especially for smaller balances.`,
      },
      {
        heading: "Medical Collections",
        body: `Medical debt has special protections. As of recent changes:
- Medical collections under $500 are no longer reported
- Paid medical collections must be removed from your report
- New medical debt has a 1-year waiting period before it can be reported

If you have medical collections on your report, check if they qualify for automatic removal under these rules.`,
      },
    ],
  },
];

function SectionAccordion({ section }: { section: typeof sections[0] }) {
  const [open, setOpen] = useState(false);

  return (
    <div id={section.id} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden hover:border-[var(--accent)]/20 transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 sm:p-6 text-left"
      >
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[var(--accent-dim)] flex items-center justify-center shrink-0">
          <section.icon size={18} className="text-[var(--accent)]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg)] text-[var(--muted)] font-semibold uppercase tracking-wider">
              {section.category}
            </span>
          </div>
          <h3 className="font-bold text-[var(--text)] text-sm sm:text-base">{section.title}</h3>
        </div>
        <ChevronDown
          size={18}
          className={`text-[var(--muted)] shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-5 sm:px-6 pb-6 space-y-6 border-t border-[var(--border)]">
          {section.content.map((block, i) => (
            <div key={i} className="pt-5">
              <h4 className="text-sm font-bold text-[var(--text)] mb-3">{block.heading}</h4>
              <div className="text-sm text-[var(--muted)] leading-relaxed whitespace-pre-line">
                {block.body.split(/\*\*(.*?)\*\*/g).map((part, j) =>
                  j % 2 === 1 ? (
                    <strong key={j} className="font-semibold text-[var(--text)]">{part}</strong>
                  ) : (
                    <span key={j}>{part}</span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


export default function LearnPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6" style={{ background: "var(--bg)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] text-xs font-semibold tracking-widest uppercase mb-4">
              <BookOpen size={14} /> Free Education
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-[var(--text)] mb-3">
              Credit Education Hub
            </h1>
            <p className="text-sm sm:text-base text-[var(--muted)] max-w-lg mx-auto">
              Everything you need to understand, repair, and build your credit. Free, no sign-up required.
            </p>
          </div>

          {/* Quick Jump */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {[
              { label: "Basics", color: "var(--accent)" },
              { label: "Repair", color: "#EF4444" },
              { label: "Build", color: "var(--success)" },
            ].map((cat) => (
              <span
                key={cat.label}
                className="text-[10px] px-3 py-1.5 rounded-full font-semibold uppercase tracking-wider"
                style={{ background: `${cat.color}10`, color: cat.color }}
              >
                {cat.label}
              </span>
            ))}
          </div>

          {/* Important Notice */}
          <div className="flex items-start gap-3 p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-6">
            <Mail size={18} className="text-amber-300 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-200 mb-1">Sending Dispute Letters by Mail?</p>
              <p className="text-xs text-amber-300 leading-relaxed">
                When mailing disputes to the credit bureaus, always include a copy of your government-issued ID, your Social Security Number, and proof of your current address (utility bill or bank statement). These are sent directly to the bureau — never share them on any website.
              </p>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            {sections.map((section) => (
              <SectionAccordion key={section.id} section={section} />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 sm:mt-16 text-center p-8 sm:p-10 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text)] mb-3">
              Want us to handle it for you?
            </h2>
            <p className="text-sm text-[var(--muted)] mb-6 max-w-md mx-auto">
              Upload your credit report and get an accurate AI analysis.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/credit/analyze"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-light)] transition-all text-sm"
              >
                Upload Credit Report
              </Link>
              <Link
                href="/credit/disputes"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-[var(--border)] text-[var(--muted)] font-semibold hover:border-[var(--accent)]/40 hover:text-[var(--accent)] transition-all text-sm"
              >
                DIY Dispute Letters
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
