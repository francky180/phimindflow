"use client";

import { useState, useTransition } from "react";

type Props = {
  disputeId: string;
  className?: string;
};

type SendState =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; trackingId?: string | null; jobId: string }
  | { kind: "error"; message: string };

export function SendCertifiedButton({ disputeId, className }: Props) {
  const [state, setState] = useState<SendState>({ kind: "idle" });
  const [, startTransition] = useTransition();

  const send = () => {
    if (state.kind === "sending" || state.kind === "sent") return;
    setState({ kind: "sending" });
    startTransition(async () => {
      try {
        const res = await fetch(`/api/credit/disputes/${disputeId}/send`, {
          method: "POST",
        });
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          jobId?: string;
          trackingId?: string | null;
          error?: string;
          detail?: string;
        };
        if (!res.ok || !data.ok || !data.jobId) {
          setState({
            kind: "error",
            message: data.error || data.detail || `Failed (${res.status})`,
          });
          return;
        }
        setState({
          kind: "sent",
          jobId: data.jobId,
          trackingId: data.trackingId ?? null,
        });
      } catch (e) {
        setState({ kind: "error", message: String(e) });
      }
    });
  };

  const baseClass =
    className ||
    "rounded-full bg-[var(--gold)] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#0a0a0e] transition hover:shadow-[0_4px_20px_rgba(201,168,78,0.3)] disabled:opacity-60";

  if (state.kind === "sent") {
    return (
      <div className="flex flex-col gap-1">
        <span className="rounded-full border border-[var(--gold)]/40 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--gold)]">
          ✓ Mail submitted
        </span>
        {state.trackingId && (
          <span className="text-[10px] text-[var(--muted)]">
            Tracking: {state.trackingId}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={send}
        disabled={state.kind === "sending"}
        className={baseClass}
      >
        {state.kind === "sending"
          ? "Sending…"
          : "📬 Send via Certified Mail"}
      </button>
      {state.kind === "error" && (
        <span className="text-[10px] text-red-400">{state.message}</span>
      )}
    </div>
  );
}
