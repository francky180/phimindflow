import { createClient } from "@/lib/supabase/server";
import FileRow from "./FileRow";
import UploadForm from "./UploadForm";

export const dynamic = "force-dynamic";

export default async function FilesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: files } = await supabase
    .from("credit_files")
    .select("id,file_path,file_name,category,size_bytes,mime_type,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Files</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">Upload credit reports, IDs, proof of address, dispute responses. Stored privately — only you see them.</p>
      </header>

      <section className="rounded-2xl border border-[var(--gold)]/30 bg-gradient-to-br from-[rgba(201,168,78,0.06)] to-transparent p-5">
        <h3 className="text-sm font-bold text-[var(--gold)]">📎 Required for every dispute letter you send</h3>
        <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
          Upload these once and reuse them on every letter. Without them, bureaus mark disputes as &quot;frivolous&quot; and refuse to investigate.
        </p>
        <ul className="mt-3 grid grid-cols-1 gap-2 text-[12px] text-[var(--text-secondary)] sm:grid-cols-3">
          <li className="rounded-lg border border-[var(--border)] bg-[rgba(0,0,0,0.2)] p-3">
            <strong className="block text-[var(--gold)]">① Photo ID</strong>
            Driver&apos;s license, state ID, or passport — black-and-white photocopy is fine.
          </li>
          <li className="rounded-lg border border-[var(--border)] bg-[rgba(0,0,0,0.2)] p-3">
            <strong className="block text-[var(--gold)]">② Proof of SSN</strong>
            SSN card, W-2, or tax return. Redact everything except your name + last 4 of SSN.
          </li>
          <li className="rounded-lg border border-[var(--border)] bg-[rgba(0,0,0,0.2)] p-3">
            <strong className="block text-[var(--gold)]">③ Proof of Address</strong>
            Utility bill, bank statement, or lease — dated within the last 60 days.
          </li>
        </ul>
        <a
          href="/credit/dashboard/how-to-send"
          className="mt-3 inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--gold)] hover:underline"
        >
          📖 Read full instructions →
        </a>
      </section>

      <UploadForm />

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)]">
        {(files ?? []).length === 0 ? (
          <p className="p-6 text-sm text-[var(--text-secondary)]">No files uploaded yet.</p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {files!.map((f) => (
              <FileRow key={f.id} file={f} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
