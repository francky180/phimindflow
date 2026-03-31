"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const brokerLink =
  "https://dashboard.genesisfxmarkets.com/auth/register?ref=FRADEL185";

const links = [
  ["Process", "#process"],
  ["Course", "#course"],
  ["Management", "#management"],
  ["FAQ", "#faq"],
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "navbar-scrolled"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#top" className="group flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--gold)]/10 text-[var(--gold)] text-sm font-bold transition-colors duration-300 group-hover:bg-[var(--gold)]/20">
            &phi;
          </span>
          <span className="text-[13px] font-bold uppercase tracking-[0.4em] text-gold">
            PHIMINDFLOW
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-9 md:flex">
          {links.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="relative text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)] transition-colors duration-300 hover:text-[var(--gold)] after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-[var(--gold)]/40 after:transition-all after:duration-300 hover:after:w-full"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <motion.a
          href={brokerLink}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="gold-btn hidden rounded-full bg-[var(--gold)] px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-shadow duration-300 hover:shadow-[0_4px_20px_rgba(201,168,78,0.3)] md:inline-flex"
        >
          Open Broker Account
        </motion.a>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-[5px] md:hidden"
          aria-label="Toggle menu"
        >
          <span className={`block h-[1.5px] w-5 bg-[var(--text)] transition-all duration-300 ${open ? "translate-y-[6px] rotate-45" : ""}`} />
          <span className={`block h-[1.5px] w-5 bg-[var(--text)] transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block h-[1.5px] w-5 bg-[var(--text)] transition-all duration-300 ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-[var(--border)] bg-white/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-5 px-6 py-8">
              {links.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--text-secondary)] transition hover:text-[var(--gold)]"
                >
                  {label}
                </a>
              ))}
              <a
                href={brokerLink}
                target="_blank"
                rel="noreferrer"
                className="gold-btn mt-2 inline-flex w-fit rounded-full bg-[var(--gold)] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white"
              >
                Open Broker Account
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
