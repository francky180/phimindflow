"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { recordUploadedFile } from "../actions";

const MAX_BYTES = 25 * 1024 * 1024;

export default function UploadForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("file") as File | null;
    const category = (fd.get("category") as string) || "other";
    if (!file || !file.size) { setError("Pick a file first."); return; }
    if (file.size > MAX_BYTES) { setError(`File too large (max ${MAX_BYTES / 1024 / 1024} MB).`); return; }

    setProgress(`Uploading ${file.name}…`);
    const supabase = createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) { setError("Session expired. Refresh and try again."); setProgress(null); return; }

    const safeName = file.name.replace(/[^\w.\-]+/g, "_");
    const path = `${user.id}/${Date.now()}-${safeName}`;

    const { error: upErr } = await supabase.storage
      .from("credit-files")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (upErr) { setError(upErr.message); setProgress(null); return; }

    const res = await recordUploadedFile({
      file_path: path,
      file_name: file.name,
      category,
      size_bytes: file.size,
      mime_type: file.type,
    });
    if ("error" in res) { setError(res.error ?? "Saved file but couldn't record it."); setProgress(null); return; }

    setProgress(null);
    form.reset();
    startTransition(() => router.refresh());
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)] p-6 sm:grid-cols-3">
      <select name="category" defaultValue="credit_report" className="rounded-xl border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm">
        <option value="credit_report">Credit Report</option>
        <option value="id">Photo ID</option>
        <option value="proof_of_address">Proof of Address</option>
        <option value="dispute_response">Dispute Response</option>
        <option value="letter">Letter</option>
        <option value="other">Other</option>
      </select>
      <input
        name="file"
        type="file"
        required
        accept=".pdf,image/*,.doc,.docx,.txt"
        className="rounded-xl border border-[var(--border)] bg-transparent px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[var(--gold-dim)] file:px-3 file:py-1.5 file:text-[11px] file:font-semibold file:uppercase file:tracking-[0.14em] file:text-[var(--gold)]"
      />
      <button
        type="submit"
        disabled={pending || !!progress}
        className="gold-btn rounded-xl bg-[var(--gold)] px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.14em] text-[#0a0a0e] disabled:opacity-50"
      >
        {progress ? "…" : "Upload"}
      </button>
      {(error || progress) && (
        <p className={`sm:col-span-3 text-[11px] ${error ? "text-red-300" : "text-[var(--gold)]"}`}>{error || progress}</p>
      )}
    </form>
  );
}
