"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function getUserId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");
  return { supabase, userId: user.id };
}

// PROFILE
export async function updateProfile(formData: FormData) {
  const { supabase, userId } = await getUserId();
  const payload = {
    user_id: userId,
    full_name: (formData.get("full_name") as string) || null,
    phone: (formData.get("phone") as string) || null,
    address: (formData.get("address") as string) || null,
    city: (formData.get("city") as string) || null,
    state: (formData.get("state") as string) || null,
    zip: (formData.get("zip") as string) || null,
    dob: (formData.get("dob") as string) || null,
    ssn_last4: (formData.get("ssn_last4") as string) || null,
    goal: (formData.get("goal") as string) || null,
  };
  const { error } = await supabase.from("credit_profiles").upsert(payload, { onConflict: "user_id" });
  if (error) return { error: error.message };
  revalidatePath("/credit/dashboard");
  revalidatePath("/credit/dashboard/profile");
  return { ok: true };
}

// SCORES
export async function addScore(formData: FormData) {
  const { supabase, userId } = await getUserId();
  const { error } = await supabase.from("credit_scores").insert({
    user_id: userId,
    bureau: formData.get("bureau") as string,
    score: parseInt(formData.get("score") as string, 10),
    recorded_at: (formData.get("recorded_at") as string) || new Date().toISOString().slice(0, 10),
    notes: (formData.get("notes") as string) || null,
  });
  if (error) return { error: error.message };
  revalidatePath("/credit/dashboard");
  revalidatePath("/credit/dashboard/scores");
  return { ok: true };
}

export async function deleteScore(id: string) {
  const { supabase } = await getUserId();
  const { error } = await supabase.from("credit_scores").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/credit/dashboard/scores");
  return { ok: true };
}

// ITEMS
export async function addItem(formData: FormData) {
  const { supabase, userId } = await getUserId();
  const { error } = await supabase.from("credit_items").insert({
    user_id: userId,
    creditor: formData.get("creditor") as string,
    account_number: (formData.get("account_number") as string) || null,
    item_type: (formData.get("item_type") as string) || "other",
    bureau: (formData.get("bureau") as string) || "all",
    balance: formData.get("balance") ? Number(formData.get("balance")) : null,
    date_opened: (formData.get("date_opened") as string) || null,
    notes: (formData.get("notes") as string) || null,
  });
  if (error) return { error: error.message };
  revalidatePath("/credit/dashboard/items");
  return { ok: true };
}

export async function updateItemStatus(id: string, status: string) {
  const { supabase } = await getUserId();
  const { error } = await supabase.from("credit_items").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/credit/dashboard/items");
  return { ok: true };
}

export async function deleteItem(id: string) {
  const { supabase } = await getUserId();
  const { error } = await supabase.from("credit_items").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/credit/dashboard/items");
  return { ok: true };
}

// DISPUTES
export async function addDispute(formData: FormData) {
  const { supabase, userId } = await getUserId();
  const { error } = await supabase.from("credit_disputes").insert({
    user_id: userId,
    bureau: formData.get("bureau") as string,
    subject: (formData.get("subject") as string) || null,
    letter_text: formData.get("letter_text") as string,
    status: (formData.get("status") as string) || "draft",
    date_sent: (formData.get("date_sent") as string) || null,
    item_id: (formData.get("item_id") as string) || null,
  });
  if (error) return { error: error.message };
  revalidatePath("/credit/dashboard/disputes");
  return { ok: true };
}

export async function updateDispute(id: string, patch: Record<string, unknown>) {
  const { supabase } = await getUserId();
  const { error } = await supabase.from("credit_disputes").update(patch).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/credit/dashboard/disputes");
  return { ok: true };
}

export async function deleteDispute(id: string) {
  const { supabase } = await getUserId();
  const { error } = await supabase.from("credit_disputes").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/credit/dashboard/disputes");
  return { ok: true };
}

// FILES — client uploads directly to Supabase Storage (bypasses Vercel 4.5MB body limit).
// Server action only records metadata after the upload completes.
export async function recordUploadedFile(meta: {
  file_path: string;
  file_name: string;
  category?: string;
  size_bytes?: number;
  mime_type?: string;
}) {
  const { supabase, userId } = await getUserId();
  // Verify the path is in the user's folder (defense in depth)
  if (!meta.file_path.startsWith(`${userId}/`)) return { error: "Invalid file path." };
  const { error } = await supabase.from("credit_files").insert({
    user_id: userId,
    file_path: meta.file_path,
    file_name: meta.file_name,
    category: meta.category ?? "other",
    size_bytes: meta.size_bytes ?? null,
    mime_type: meta.mime_type ?? null,
  });
  if (error) return { error: error.message };
  revalidatePath("/credit/dashboard/files");
  revalidatePath("/credit/dashboard");
  return { ok: true };
}

export async function deleteFile(id: string, path: string) {
  const { supabase } = await getUserId();
  await supabase.storage.from("credit-files").remove([path]);
  const { error } = await supabase.from("credit_files").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/credit/dashboard/files");
  return { ok: true };
}

export async function getFileSignedUrl(path: string) {
  const { supabase } = await getUserId();
  const { data, error } = await supabase.storage.from("credit-files").createSignedUrl(path, 60 * 10);
  if (error || !data) return { error: error?.message ?? "Failed to sign URL." };
  return { url: data.signedUrl };
}
