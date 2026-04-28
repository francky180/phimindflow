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
