"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/credit/dashboard", label: "Overview" },
  { href: "/credit/dashboard/scores", label: "Scores" },
  { href: "/credit/dashboard/items", label: "Negative Items" },
  { href: "/credit/dashboard/disputes", label: "Dispute Letters" },
  { href: "/credit/dashboard/send", label: "Send Letters", cta: true },
  { href: "/credit/dashboard/files", label: "Files" },
  { href: "/credit/dashboard/profile", label: "Profile" },
];

export default function DashboardNav() {
  const pathname = usePathname();
  return (
    <nav className="lg:w-56 lg:shrink-0">
      <ul className="flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
        {LINKS.map((l) => {
          const active = l.href === "/credit/dashboard" ? pathname === l.href : pathname?.startsWith(l.href);
          if ("cta" in l && l.cta) {
            return (
              <li key={l.href} className="shrink-0 lg:mt-1 lg:mb-1">
                <Link
                  href={l.href}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.14em] transition ${
                    active
                      ? "bg-[var(--gold)] text-[#0a0a0e] shadow-[0_4px_20px_rgba(201,168,78,0.25)]"
                      : "border border-[rgba(201,168,78,0.4)] text-[var(--gold)] hover:border-[var(--gold)] hover:bg-[rgba(201,168,78,0.08)]"
                  }`}
                >
                  <span>📬</span>
                  {l.label}
                </Link>
              </li>
            );
          }
          return (
            <li key={l.href} className="shrink-0">
              <Link
                href={l.href}
                className={`block whitespace-nowrap rounded-lg px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] transition ${
                  active
                    ? "bg-[var(--gold-dim)] text-[var(--gold)]"
                    : "text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--text)]"
                }`}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
