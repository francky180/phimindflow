import Link from "next/link";

export const metadata = {
  title: "How to Send Dispute Letters — PHIMINDFLOW",
};

export default function HowToSendPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">How to Send Dispute Letters</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          The exact, bureau-approved steps. Skip any of these and your dispute gets thrown out as &quot;frivolous&quot; and the negative item stays.
        </p>
      </header>

      {/* The single most-important section */}
      <section className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">⚠️</div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-red-300">Required in EVERY envelope (or the bureau ignores you)</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Federal law lets credit bureaus mark a dispute as &quot;frivolous&quot; and refuse to investigate if you don&apos;t prove who you are. Include all 3 of these with every letter:
            </p>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-[var(--gold)]">①</span>
                <div>
                  <strong className="text-[var(--text)]">Government photo ID</strong> — driver&apos;s license, state ID, or passport. Black-and-white photocopy is fine. <strong>Cross out everything except your name, photo, address, DOB.</strong>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-[var(--gold)]">②</span>
                <div>
                  <strong className="text-[var(--text)]">Proof of SSN</strong> — Social Security card, W-2, 1099, or recent tax return showing your full SSN. <strong>Cross out everything except your name and the last 4 digits of your SSN.</strong>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-[var(--gold)]">③</span>
                <div>
                  <strong className="text-[var(--text)]">Proof of current address</strong> — utility bill, bank statement, or lease dated within the last 60 days. The address MUST match the address you put in your dispute letter signature.
                </div>
              </li>
            </ul>
            <Link
              href="/credit/dashboard/files"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#0a0a0e] transition hover:shadow-[0_4px_20px_rgba(201,168,78,0.3)]"
            >
              📎 Upload your ID + SSN proof + address proof now →
            </Link>
          </div>
        </div>
      </section>

      {/* Step-by-step */}
      <section className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)] p-6">
        <h2 className="text-lg font-bold text-[var(--gold)]">Step-by-step — first dispute round</h2>
        <ol className="mt-4 flex flex-col gap-5 text-sm leading-relaxed text-[var(--text-secondary)]">
          <li className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--gold-dim)] text-sm font-bold text-[var(--gold)]">1</span>
            <div>
              <strong className="text-[var(--text)]">Pull your credit report</strong> from <a className="text-[var(--gold)] hover:underline" href="https://www.annualcreditreport.com" target="_blank" rel="noreferrer">annualcreditreport.com</a> (free, 1× per bureau per year) or SmartCredit / IdentityIQ ($1 trial). Upload the PDF on <Link href="/credit/dashboard/files" className="text-[var(--gold)] hover:underline">Files</Link>.
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--gold-dim)] text-sm font-bold text-[var(--gold)]">2</span>
            <div>
              <strong className="text-[var(--text)]">Add every negative item</strong> to <Link href="/credit/dashboard/items" className="text-[var(--gold)] hover:underline">Negative Items</Link> — collections, charge-offs, late payments, hard inquiries you didn&apos;t authorize. Note which bureau each one appears on.
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--gold-dim)] text-sm font-bold text-[var(--gold)]">3</span>
            <div>
              <strong className="text-[var(--text)]">Draft a letter per bureau per item</strong> on <Link href="/credit/dashboard/disputes" className="text-[var(--gold)] hover:underline">Dispute Letters</Link>. Use the template and cite the specific FCRA section + Metro 2 violation. <strong>One bureau per letter.</strong> Same item across 3 bureaus = 3 separate letters.
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--gold-dim)] text-sm font-bold text-[var(--gold)]">4</span>
            <div>
              <strong className="text-[var(--text)]">Upload your supporting docs</strong> on <Link href="/credit/dashboard/files" className="text-[var(--gold)] hover:underline">Files</Link>: Photo ID, Proof of SSN, Proof of Address. You only need to upload these once — re-use them for every letter.
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--gold-dim)] text-sm font-bold text-[var(--gold)]">5</span>
            <div>
              <strong className="text-[var(--text)]">Open <Link href="/credit/dashboard/send" className="text-[var(--gold)] hover:underline">📬 Send Letters</Link></strong>. For each letter: click <strong className="text-[var(--gold)]">Copy Letter</strong> + <strong className="text-[var(--gold)]">Copy Address</strong>, then click <strong className="text-[var(--gold)]">Send via LetterStream</strong>. In LetterStream:
              <ul className="mt-2 list-disc pl-5 text-[13px]">
                <li>Choose <strong>Certified Mail with Return Receipt</strong> (≈$7) — gives you legal proof of delivery</li>
                <li>Recipient address: paste the bureau address we copied</li>
                <li>Letter body: paste your letter text</li>
                <li>Attachments: upload your ID, SSN proof, and address proof from your computer (or download them from your Files page first)</li>
              </ul>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--gold-dim)] text-sm font-bold text-[var(--gold)]">6</span>
            <div>
              <strong className="text-[var(--text)]">Mark the letter as &quot;sent&quot;</strong> on the Dispute Letters page and add the date. The 30-day FCRA clock starts when the bureau RECEIVES it (not when you mail it) — your certified-mail tracking will show the receipt date.
            </div>
          </li>
        </ol>
      </section>

      {/* Round 2 / Round 3 */}
      <section className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)] p-6">
        <h2 className="text-lg font-bold text-[var(--gold)]">After 30 days — Round 2 + 3</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          The bureau replies one of three ways:
        </p>
        <ul className="mt-3 flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
          <li>
            <strong className="text-[var(--gold)]">✓ Removed</strong> — mark the item as REMOVED on Negative Items. You&apos;re done with that line.
          </li>
          <li>
            <strong className="text-[var(--gold)]">✓ Updated/corrected</strong> — verify the change is what you asked for. If it&apos;s a partial fix, send a Round 2 letter pointing out what&apos;s still wrong.
          </li>
          <li>
            <strong className="text-amber-400">✗ Verified as accurate</strong> — bureau says it stays. Send a <strong>Round 2 Method of Verification</strong> letter demanding they show you EXACTLY how they verified (which records, which contact at the furnisher, what date). 80% of the time they can&apos;t produce it and the item gets deleted.
          </li>
          <li>
            <strong className="text-red-300">✗ No response in 30 days</strong> — automatic deletion is owed under FCRA §611(a)(1)(A). Send a <strong>Round 2 Statutory Default</strong> letter and file a <Link href="/credit/dashboard/send" className="text-[var(--gold)] hover:underline">CFPB complaint</Link> the same day. Score wins almost every time.
          </li>
        </ul>
      </section>

      {/* Don't do this */}
      <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
        <h2 className="text-lg font-bold text-amber-300">⛔ Do NOT do these</h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
          <li>• <strong>Online disputes</strong> at equifax.com / experian.com / transunion.com — you waive your right to a method-of-verification letter and the bureau gets a weaker investigation standard. Always mail certified.</li>
          <li>• <strong>CPN / SCN / EIN-as-SSN tricks</strong> — federal crime (Identity Theft + Bank Fraud). Don&apos;t. We will not help with any of this.</li>
          <li>• <strong>Lying about accounts being &quot;not yours&quot;</strong> when they are — perjury under FCRA. Always dispute on real grounds: inaccurate balance, wrong date, missing data, Metro 2 violation, re-aging.</li>
          <li>• <strong>Paying collectors before disputing</strong> — paying restarts the 7-year reporting clock on most bureaus. Dispute first, settle second (and only with a written &quot;pay-for-delete&quot; agreement).</li>
          <li>• <strong>Skipping the Round 1 letter and going straight to CFPB</strong> — CFPB will close your complaint as &quot;use the bureau&apos;s process first.&quot;</li>
        </ul>
      </section>

      {/* Quick checklist */}
      <section className="rounded-2xl border border-[var(--gold)]/30 bg-gradient-to-br from-[rgba(201,168,78,0.06)] to-transparent p-6">
        <h2 className="text-lg font-bold text-[var(--gold)]">📋 Pre-mail checklist</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">Before you click Send via LetterStream on any letter, confirm:</p>
        <ul className="mt-4 flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
          <li>☐ Letter cites a specific FCRA section (§611, §623, §605, §609)</li>
          <li>☐ Letter names the creditor + last 4 of the account number</li>
          <li>☐ Letter explains a SPECIFIC inaccuracy (not just &quot;please remove&quot;)</li>
          <li>☐ Your full legal name + current address + signature at the bottom</li>
          <li>☐ Photo ID copy attached</li>
          <li>☐ SSN proof attached (with everything except last 4 redacted)</li>
          <li>☐ Proof of address attached (matches the address in your letter)</li>
          <li>☐ Mailing as Certified with Return Receipt (not regular First-Class)</li>
        </ul>
      </section>
    </div>
  );
}
