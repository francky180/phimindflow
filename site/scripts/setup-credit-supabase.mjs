// Setup script: creates the credit-files Storage bucket + Franc's owner account.
// Run AFTER pasting site/supabase/credit-schema.sql into the Supabase SQL editor.
// Usage:  node scripts/setup-credit-supabase.mjs <franc-password>

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load env vars from .env.local manually
const envPath = join(__dirname, "..", ".env.local");
const envText = readFileSync(envPath, "utf8");
function envGet(key) {
  const m = envText.match(new RegExp(`^${key}=(.+)$`, "m"));
  return m ? m[1].trim().replace(/^"|"$/g, "") : null;
}

const SUPABASE_URL = envGet("NEXT_PUBLIC_SUPABASE_URL");
const SERVICE_ROLE = envGet("SUPABASE_SERVICE_ROLE_KEY");
if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const FRANC_EMAIL = "franckydelissaint@gmail.com";
const FRANC_PW = process.argv[2];
if (!FRANC_PW || FRANC_PW.length < 8) {
  console.error("Usage: node scripts/setup-credit-supabase.mjs <password-min-8-chars>");
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// 1. Create storage bucket (private)
console.log("→ Creating storage bucket 'credit-files'...");
{
  const { data: existing } = await sb.storage.getBucket("credit-files");
  if (existing) {
    console.log("  already exists ✓");
  } else {
    const { error } = await sb.storage.createBucket("credit-files", {
      public: false,
      fileSizeLimit: 25 * 1024 * 1024, // 25 MB per file
    });
    if (error) {
      console.error("  FAILED:", error.message);
      process.exit(1);
    }
    console.log("  created ✓");
  }
}

// 2. Create Franc's owner account
console.log(`→ Creating owner account ${FRANC_EMAIL}...`);
{
  const { data, error } = await sb.auth.admin.createUser({
    email: FRANC_EMAIL,
    password: FRANC_PW,
    email_confirm: true,
    user_metadata: { full_name: "Francky Delissaint" },
  });
  if (error && !error.message.toLowerCase().includes("already")) {
    console.error("  FAILED:", error.message);
    process.exit(1);
  }
  if (data?.user) {
    console.log("  created ✓ (id:", data.user.id, ")");
    await sb.from("credit_profiles").upsert(
      { user_id: data.user.id, full_name: "Francky Delissaint" },
      { onConflict: "user_id" },
    );
  } else {
    console.log("  already exists ✓ (password unchanged)");
  }
}

// 3. Verify schema applied
console.log("→ Verifying schema...");
{
  const { error } = await sb.from("credit_profiles").select("user_id").limit(1);
  if (error) {
    console.error("  ✗ Schema NOT applied. Paste site/supabase/credit-schema.sql into:");
    console.error("    https://supabase.com/dashboard/project/ogfmozqfphcwgnjllltr/sql/new");
    process.exit(1);
  }
  console.log("  schema OK ✓");
}

console.log("\n✅ DONE. Sign in at https://phimindflow.com/credit/login");
console.log(`   Email:    ${FRANC_EMAIL}`);
console.log(`   Password: (the one you just set)\n`);
