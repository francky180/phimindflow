"use client";

import { useState, useTransition } from "react";
import { deleteFile, getFileSignedUrl } from "../actions";

type FileItem = {
  id: string;
  file_path: string;
  file_name: string;
  category: string | null;
  size_bytes: number | null;
  mime_type: string | null;
  created_at: string;
};

function formatSize(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileRow({ file }: { file: FileItem }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function open() {
    setError(null);
    const res = await getFileSignedUrl(file.file_path);
    if ("error" in res) {
      setError(res.error ?? "Could not open file.");
      return;
    }
    window.open(res.url, "_blank", "noopener,noreferrer");
  }

  function onDelete() {
    if (!confirm(`Delete ${file.file_name}?`)) return;
    startTransition(async () => {
      const res = await deleteFile(file.id, file.file_path);
      if (res && "error" in res) setError(res.error ?? "Delete failed.");
    });
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-[var(--text)]">{file.file_name}</div>
        <div className="mt-1 text-[11px] text-[var(--muted)]">
          <span className="capitalize">{file.category?.replace("_", " ") ?? "other"}</span>
          {" · "}{formatSize(file.size_bytes)}
          {" · "}{new Date(file.created_at).toLocaleDateString()}
        </div>
        {error && <div className="mt-1 text-[11px] text-red-400">{error}</div>}
      </div>
      <div className="flex items-center gap-3">
        <button onClick={open} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--gold)] hover:underline">
          Open
        </button>
        <button onClick={onDelete} disabled={pending} className="text-[11px] text-[var(--muted)] hover:text-red-400 disabled:opacity-50">
          {pending ? "…" : "Delete"}
        </button>
      </div>
    </li>
  );
}
