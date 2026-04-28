import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "../actions";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: p } = await supabase.from("credit_profiles").select("*").eq("user_id", user.id).maybeSingle();

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">For dispute letters and DFY service. Visible only to you.</p>
      </header>

      <form action={async (fd) => { "use server"; await updateProfile(fd); }} className="grid grid-cols-1 gap-5 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)] p-6 sm:grid-cols-2">
        <Field label="Full name"><input name="full_name" defaultValue={p?.full_name ?? ""} className="input" /></Field>
        <Field label="Phone"><input name="phone" defaultValue={p?.phone ?? ""} className="input" /></Field>
        <Field label="Address" full><input name="address" defaultValue={p?.address ?? ""} className="input" /></Field>
        <Field label="City"><input name="city" defaultValue={p?.city ?? ""} className="input" /></Field>
        <Field label="State"><input name="state" defaultValue={p?.state ?? ""} className="input" /></Field>
        <Field label="ZIP"><input name="zip" defaultValue={p?.zip ?? ""} className="input" /></Field>
        <Field label="Date of birth"><input type="date" name="dob" defaultValue={p?.dob ?? ""} className="input" /></Field>
        <Field label="Last 4 of SSN"><input name="ssn_last4" maxLength={4} defaultValue={p?.ssn_last4 ?? ""} className="input" /></Field>
        <Field label="Goal" full>
          <textarea name="goal" rows={3} defaultValue={p?.goal ?? ""} className="input" placeholder="e.g. 720+ score in 6 months to qualify for an FHA loan" />
        </Field>
        <div className="sm:col-span-2">
          <button type="submit" className="gold-btn rounded-xl bg-[var(--gold)] px-6 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-[#0a0a0e]">
            Save profile
          </button>
        </div>
      </form>

      <style>{`
        .input { width: 100%; border-radius: 0.75rem; border: 1px solid var(--border); background: transparent; padding: 0.625rem 0.75rem; font-size: 0.875rem; color: var(--text); outline: none; }
        .input:focus { border-color: rgba(201,168,78,0.6); background: rgba(201,168,78,0.04); }
      `}</style>
    </div>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={full ? "sm:col-span-2" : ""}>
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">{label}</span>
      {children}
    </label>
  );
}
