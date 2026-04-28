import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardNav from "./DashboardNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/credit/login?next=/credit/dashboard");

  const { data: profile } = await supabase
    .from("credit_profiles")
    .select("full_name")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[rgba(10,10,14,0.85)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/credit/dashboard" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(201,168,78,0.1)] text-[var(--gold)] text-sm font-bold">&phi;</span>
            <span className="text-[12px] font-bold uppercase tracking-[0.32em] text-[var(--gold)]">Credit Dashboard</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/credit" className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)] transition hover:text-[var(--gold)] sm:inline-flex">
              ← Marketing site
            </Link>
            <span className="hidden text-[11px] text-[var(--muted)] sm:inline">{profile?.full_name || user.email}</span>
            <form action="/credit/auth/signout" method="post">
              <button type="submit" className="rounded-full border border-[var(--border)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)] transition hover:border-[var(--gold)]/40 hover:text-[var(--gold)]">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row">
        <DashboardNav />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
