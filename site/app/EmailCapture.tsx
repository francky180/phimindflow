"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

const ease = [0.22, 0.9, 0.36, 1] as const;

export default function EmailCapture() {
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("pmf-email-dismissed")) return;

    const handleExit = (e: MouseEvent) => {
      if (e.clientY <= 5 && !submitted) setShow(true);
    };

    const timer = setTimeout(() => {
      document.addEventListener("mouseout", handleExit);
    }, 15000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseout", handleExit);
    };
  }, [submitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: Connect to ConvertKit/Beehiiv API
    setSubmitted(true);
    sessionStorage.setItem("pmf-email-dismissed", "1");
  };

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem("pmf-email-dismissed", "1");
  };

  return (
    <AnimatePresence>
      {show && !submitted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl border border-[#C9A84E]/20 bg-[#0A0A0A] p-8 shadow-2xl"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.4em] text-[#C9A84E]">
              Free Download
            </p>
            <h3 className="text-2xl font-bold text-white leading-tight">
              The Fibonacci<br />Cheat Sheet
            </h3>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">
              The exact entry/exit framework used inside the full system. Get it free — no fluff, no filler.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your best email"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#C9A84E]/50 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-[#C9A84E] px-4 py-3 text-sm font-bold text-[#0A0A0A] tracking-wide transition-all hover:bg-[#d4b65e] hover:shadow-[0_0_20px_rgba(201,168,76,0.3)]"
              >
                Send Me the Cheat Sheet
              </button>
            </form>

            <p className="mt-4 text-[10px] text-white/30 text-center">
              No spam. Unsubscribe anytime.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
