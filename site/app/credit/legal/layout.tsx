import Link from "next/link";
import Navbar from "@/app/Navbar";

const TABS = [
  { href: "/credit/legal/privacy", label: "Privacy" },
  { href: "/credit/legal/terms", label: "Terms" },
  { href: "/credit/legal/croa", label: "CROA Disclosure" },
];

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--bg)] text-[var(--text)] pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <nav className="mb-10 flex flex-wrap gap-2">
            {TABS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="rounded-full border border-[var(--border)] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)] transition hover:border-[var(--gold)]/40 hover:text-[var(--gold)]"
              >
                {t.label}
              </Link>
            ))}
          </nav>
          <article className="prose-credit space-y-6 text-[15px] leading-relaxed text-[var(--text-secondary)]">
            {children}
          </article>
        </div>
      </main>
      <style>{`
        .prose-credit h1 { color: var(--text); font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
        .prose-credit h2 { color: var(--text); font-size: 1.125rem; font-weight: 700; letter-spacing: 0.01em; margin-top: 2rem; margin-bottom: 0.75rem; }
        .prose-credit p { margin-bottom: 1rem; }
        .prose-credit ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
        .prose-credit li { margin-bottom: 0.4rem; }
        .prose-credit strong { color: var(--gold); font-weight: 700; }
        .prose-credit a { color: var(--gold); text-decoration: underline; }
        .prose-credit .meta { color: var(--muted); font-size: 0.85rem; }
      `}</style>
    </>
  );
}
