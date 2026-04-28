import { createClient } from "@/lib/supabase/server";
import { addItem, deleteItem, updateItemStatus } from "../actions";

export const dynamic = "force-dynamic";

const STATUSES = ["pending", "disputing", "removed", "verified", "paid"] as const;

export default async function ItemsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: items } = await supabase
    .from("credit_items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Negative items</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">Track every collection, late, charge-off, and inquiry hurting your score.</p>
      </header>

      <form action={async (fd) => { "use server"; await addItem(fd); }} className="grid grid-cols-1 gap-4 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)] p-6 sm:grid-cols-2 lg:grid-cols-3">
        <input name="creditor" required placeholder="Creditor" className="rounded-xl border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm" />
        <input name="account_number" placeholder="Account # (last 4)" className="rounded-xl border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm" />
        <select name="item_type" className="rounded-xl border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm capitalize">
          <option value="collection">Collection</option>
          <option value="late_payment">Late Payment</option>
          <option value="charge_off">Charge-off</option>
          <option value="inquiry">Inquiry</option>
          <option value="public_record">Public Record</option>
          <option value="other">Other</option>
        </select>
        <select name="bureau" className="rounded-xl border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm capitalize">
          <option value="all">All Bureaus</option>
          <option value="equifax">Equifax</option>
          <option value="experian">Experian</option>
          <option value="transunion">TransUnion</option>
        </select>
        <input name="balance" type="number" step="0.01" placeholder="Balance ($)" className="rounded-xl border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm" />
        <button type="submit" className="gold-btn rounded-xl bg-[var(--gold)] px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.14em] text-[#0a0a0e]">
          + Add item
        </button>
      </form>

      <div className="flex flex-col gap-3">
        {(items ?? []).length === 0 ? (
          <p className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)] p-6 text-sm text-[var(--text-secondary)]">
            No items yet. Pull your reports from <a className="text-[var(--gold)] hover:underline" href="https://www.annualcreditreport.com" target="_blank" rel="noreferrer">annualcreditreport.com</a> and add the negatives here.
          </p>
        ) : (
          items!.map((i) => (
            <div key={i.id} className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-[var(--text)]">{i.creditor}</div>
                  <div className="mt-1 text-[11px] text-[var(--muted)]">
                    <span className="capitalize">{i.item_type?.replace("_", " ")}</span>
                    {i.bureau && <> · <span className="capitalize">{i.bureau}</span></>}
                    {i.balance != null && <> · ${Number(i.balance).toLocaleString()}</>}
                    {i.account_number && <> · #{i.account_number}</>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <form action={async (fd) => { "use server"; await updateItemStatus(i.id, fd.get("status") as string); }}>
                    <select name="status" defaultValue={i.status} className="rounded-full border border-[var(--border)] bg-transparent px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] capitalize">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button type="submit" className="ml-1 text-[11px] text-[var(--gold)] hover:underline">save</button>
                  </form>
                  <form action={async () => { "use server"; await deleteItem(i.id); }}>
                    <button type="submit" className="text-[11px] text-[var(--muted)] hover:text-red-400">Delete</button>
                  </form>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
