import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white text-[var(--text)]">
      <div className="text-center px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[var(--gold)] mb-5">
          Page Not Found
        </p>
        <h1 className="text-[clamp(4rem,12vw,8rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-[var(--text)]">
          4<span className="text-gold">0</span>4
        </h1>
        <p className="mt-6 max-w-md mx-auto text-[16px] leading-[1.8] text-[var(--text-secondary)]">
          This page does not exist. Head back to the system.
        </p>
        <Link
          href="/"
          className="gold-btn mt-10 inline-flex items-center gap-2.5 rounded-2xl bg-[var(--gold)] px-8 py-4 text-[13px] font-bold uppercase tracking-[0.15em] text-white shadow-[0_2px_12px_rgba(201,168,78,0.25)] transition-shadow duration-300 hover:shadow-[0_4px_24px_rgba(201,168,78,0.35)]"
        >
          Back to PHIMINDFLOW
          <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
            <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </main>
  );
}
