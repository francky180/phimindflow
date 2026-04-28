import { createClient } from "@/lib/supabase/server";
import { uploadFile } from "../actions";
import FileRow from "./FileRow";

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

      <form action={async (fd) => { "use server"; await uploadFile(fd); }} encType="multipart/form-data" className="grid grid-cols-1 gap-4 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.015)] p-6 sm:grid-cols-3">
        <select name="category" className="rounded-xl border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm">
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
        <button type="submit" className="gold-btn rounded-xl bg-[var(--gold)] px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.14em] text-[#0a0a0e]">
          Upload
        </button>
      </form>

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
