import { createClient } from "@/lib/supabase/server";
import { addDispute, deleteDispute } from "../actions";

export const dynamic = "force-dynamic";

const TEMPLATE = `Date: [DATE]

To: [Bureau Name]
[Bureau Address]

Subject: Formal dispute under FCRA §611 — request for investigation

Dear [Bureau],

I am writing to dispute the following information that appears on my credit report:

• Creditor: [Creditor Name]
• Account #: [Account Number]
• Reason: This account is reporting inaccurately. Specifically, [explain — e.g. balance is incorrect / never late / not my account / Metro 2 violation].

Pursuant to the Fair Credit Reporting Act, please investigate this matter and remove or correct the inaccurate information within 30 days. Provide me with a copy of the updated report and any documentation used to verify this account.

Sincerely,
[Your Full Name]
[Your Address]
[Last 4 of SSN]
[Date of Birth]
`;

export default async function DisputesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: disputes } = await supabase
    .from("credit_disputes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Dispute letters</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">Save every letter you send. Track responses. Run rounds 1 → 2 → 3.</p>
      </header>

      <form action={async (fd) => { "use server"; await addDispute(fd); }} className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)] p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <select name="bureau" required className="rounded-xl border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm capitalize">
            <option value="equifax">Equifax</option>
            <option value="experian">Experian</option>
            <option value="transunion">TransUnion</option>
          </select>
          <input name="subject" placeholder="Subject (e.g. Round 1 — Capital One)" className="rounded-xl border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm sm:col-span-2" />
        </div>
        <textarea
          name="letter_text"
          required
          rows={14}
          defaultValue={TEMPLATE}
          className="rounded-xl border border-[var(--border)] bg-[rgba(0,0,0,0.3)] px-4 py-3 font-mono text-[12px] leading-relaxed text-[var(--text)] outline-none focus:border-[var(--gold)]/60"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <select name="status" defaultValue="draft" className="rounded-xl border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm capitalize">
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="responded">Responded</option>
            <option value="resolved">Resolved</option>
          </select>
          <input type="date" name="date_sent" placeholder="Date sent" className="rounded-xl border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm" />
          <button type="submit" className="gold-btn rounded-xl bg-[var(--gold)] px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.14em] text-[#0a0a0e]">
            + Save letter
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-3">
        {(disputes ?? []).length === 0 ? (
          <p className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)] p-6 text-sm text-[var(--text-secondary)]">No letters saved yet.</p>
        ) : (
          disputes!.map((d) => (
            <details key={d.id} className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)] p-5">
              <summary className="flex cursor-pointer items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold capitalize text-[var(--text)]">{d.subject || `${d.bureau} dispute`}</div>
                  <div className="mt-1 text-[11px] text-[var(--muted)]">
                    <span className="capitalize">{d.bureau}</span> · {d.date_sent ? `sent ${d.date_sent}` : "draft"} · <span className="capitalize">{d.status}</span>
                  </div>
                </div>
                <form action={async () => { "use server"; await deleteDispute(d.id); }}>
                  <button type="submit" className="text-[11px] text-[var(--muted)] hover:text-red-400">Delete</button>
                </form>
              </summary>
              <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-[rgba(0,0,0,0.4)] p-4 font-mono text-[11px] leading-relaxed text-[var(--text-secondary)]">{d.letter_text}</pre>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href="https://www.letterstream.com/ls/newjob?action=start"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[var(--gold)] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#0a0a0e] transition hover:shadow-[0_4px_20px_rgba(201,168,78,0.3)]"
                >
                  📬 Send via LetterStream ↗
                </a>
                <a
                  href="https://www.consumerfinance.gov/complaint/"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-[var(--border)] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)] transition hover:border-[var(--gold)]/40 hover:text-[var(--gold)]"
                >
                  ⚖️ File CFPB Complaint ↗
                </a>
                <span className="text-[10px] text-[var(--muted)]">Use CFPB if a bureau ignores your dispute past 30 days.</span>
              </div>
            </details>
          ))
        )}
      </div>
    </div>
  );
}
