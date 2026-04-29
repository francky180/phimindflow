-- LetterStream integration columns for credit_disputes
-- Paste into Supabase SQL Editor: https://supabase.com/dashboard/project/ogfmozqfphcwgnjllltr/sql/new
-- Safe to re-run (idempotent — uses ADD COLUMN IF NOT EXISTS).

alter table credit_disputes
  add column if not exists letterstream_job_id      text,
  add column if not exists letterstream_tracking_id text,
  add column if not exists letterstream_status      text,
  add column if not exists letterstream_last_scan   timestamptz,
  add column if not exists sent_via_letterstream_at timestamptz;

create index if not exists credit_disputes_ls_job_idx
  on credit_disputes(letterstream_job_id)
  where letterstream_job_id is not null;
