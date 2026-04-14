"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { brokerLink } from "./constants";

const pillars = [
  { label: "Trade", href: "/" },
  { label: "Credit", href: "/credit" },
  { label: "Learn", href: "/credit/learn" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "navbar-scrolled" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(201,168,78,0.1)] text-[#C9A84E] text-sm font-bold transition-colors duration-300 group-hover:bg-[rgba(201,168,78,0.2)]">
            &phi;
          </span>
          <span className="text-[13px] font-bold uppercase tracking-[0.4em] text-gold">
            PHIMINDFLOW
          </span>
        </Link>

        {/* Desktop pillars */}
        <nav className="hidden items-center gap-9 md:flex">
          {pillars.map((p) => (
            <Link
              key={p.label}
              href={p.href}
              className={`relative text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${
                isActive(p.href)
                  ? "text-[#C9A84E]"
                  : "text-[#A0A0A0] hover:text-[#C9A84E]"
              } after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-[rgba(201,168,78,0.6)] after:transition-all after:duration-300 ${
                isActive(p.href) ? "after:w-full" : "after:w-0 hover:after:w-full"
              }`}
            >
              {p.label}
            </Link>
          ))}
        </nav>

        {/* CTA — adapts to active pillar */}
        {pathname?.startsWith("/credit") ? (
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="hidden md:inline-flex">
            <Link
              href="/credit/analyze"
              className="gold-btn rounded-full bg-[#C9A84E] px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#0a0a0e] transition-shadow duration-300 hover:shadow-[0_4px_20px_rgba(201,168,78,0.3)]"
            >
              Free Analysis
            </Link>
          </motion.div>
        ) : (
          <motion.a
            href={brokerLink}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="gold-btn hidden rounded-full bg-[#C9A84E] px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-shadow duration-300 hover:shadow-[0_4px_20px_rgba(201,168,78,0.3)] md:inline-flex"
          >
            Start Free
          </motion.a>
        )}

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-[5px] md:hidden"
          aria-label="Toggle menu"
        >
          <span className={`block h-[1.5px] w-5 bg-[#F5F5F5] transition-all duration-300 ${open ? "translate-y-[6px] rotate-45" : ""}`} />
          <span className={`block h-[1.5px] w-5 bg-[#F5F5F5] transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block h-[1.5px] w-5 bg-[#F5F5F5] transition-all duration-300 ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
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
            className="overflow-hidden border-t border-[#1E1E1E] bg-[rgba(10,10,10,0.95)] backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-5 px-6 py-8">
              {pillars.map((p) => (
                <Link
                  key={p.label}
                  href={p.href}
                  onClick={() => setOpen(false)}
                  className={`text-sm font-semibold uppercase tracking-[0.15em] transition ${
                    isActive(p.href) ? "text-[#C9A84E]" : "text-[#A0A0A0] hover:text-[#C9A84E]"
                  }`}
                >
                  {p.label}
                </Link>
              ))}
              {pathname?.startsWith("/credit") ? (
                <Link
                  href="/credit/analyze"
                  onClick={() => setOpen(false)}
                  className="gold-btn mt-2 inline-flex w-fit rounded-full bg-[#C9A84E] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#0a0a0e]"
                >
                  Free Credit Analysis
                </Link>
              ) : (
                <a
                  href={brokerLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="gold-btn mt-2 inline-flex w-fit rounded-full bg-[#C9A84E] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white"
                >
                  Start Free — Open Broker
                </a>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
