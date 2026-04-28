-- PHIMINDFLOW Credit Dashboard schema
-- Paste into Supabase SQL Editor: https://supabase.com/dashboard/project/ogfmozqfphcwgnjllltr/sql/new
-- Safe to re-run (idempotent).

-- 1. Profile (one row per user)
create table if not exists credit_profiles (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  address     text,
  city        text,
  state       text,
  zip         text,
  dob         date,
  ssn_last4   text,
  goal        text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 2. Score history (3 bureaus)
create table if not exists credit_scores (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  bureau      text not null check (bureau in ('equifax','experian','transunion')),
  score       int  not null check (score between 300 and 850),
  recorded_at date not null default current_date,
  notes       text,
  created_at  timestamptz default now()
);
create index if not exists credit_scores_user_idx on credit_scores(user_id, recorded_at desc);

-- 3. Negative items (collections, late payments, etc.)
create table if not exists credit_items (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  creditor        text not null,
  account_number  text,
  item_type       text check (item_type in ('collection','late_payment','charge_off','inquiry','public_record','other')),
  bureau          text check (bureau in ('equifax','experian','transunion','all')),
  balance         numeric(10,2),
  date_opened     date,
  status          text default 'pending' check (status in ('pending','disputing','removed','verified','paid')),
  notes           text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create index if not exists credit_items_user_idx on credit_items(user_id, status);

-- 4. Dispute letters (saved per-user, optionally tied to an item)
create table if not exists credit_disputes (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  item_id         uuid references credit_items(id) on delete set null,
  bureau          text not null check (bureau in ('equifax','experian','transunion')),
  subject         text,
  letter_text     text not null,
  status          text default 'draft' check (status in ('draft','sent','responded','resolved')),
  date_sent       date,
  response_at     date,
  response_notes  text,
  file_path       text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create index if not exists credit_disputes_user_idx on credit_disputes(user_id, status);

-- 5. File uploads (metadata; binary lives in Storage bucket "credit-files")
create table if not exists credit_files (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  file_path   text not null,
  file_name   text not null,
  category    text check (category in ('credit_report','id','proof_of_address','dispute_response','letter','other')),
  size_bytes  bigint,
  mime_type   text,
  notes       text,
  created_at  timestamptz default now()
);
create index if not exists credit_files_user_idx on credit_files(user_id, created_at desc);

-- ============================================================
-- Row Level Security — each user can only touch their own rows
-- ============================================================

alter table credit_profiles enable row level security;
alter table credit_scores   enable row level security;
alter table credit_items    enable row level security;
alter table credit_disputes enable row level security;
alter table credit_files    enable row level security;

-- profile
drop policy if exists "own profile read"   on credit_profiles;
drop policy if exists "own profile write"  on credit_profiles;
create policy "own profile read"  on credit_profiles for select using (auth.uid() = user_id);
create policy "own profile write" on credit_profiles for all    using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- scores
drop policy if exists "own scores read"   on credit_scores;
drop policy if exists "own scores write"  on credit_scores;
create policy "own scores read"  on credit_scores for select using (auth.uid() = user_id);
create policy "own scores write" on credit_scores for all    using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- items
drop policy if exists "own items read"   on credit_items;
drop policy if exists "own items write"  on credit_items;
create policy "own items read"  on credit_items for select using (auth.uid() = user_id);
create policy "own items write" on credit_items for all    using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- disputes
drop policy if exists "own disputes read"   on credit_disputes;
drop policy if exists "own disputes write"  on credit_disputes;
create policy "own disputes read"  on credit_disputes for select using (auth.uid() = user_id);
create policy "own disputes write" on credit_disputes for all    using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- files (metadata)
drop policy if exists "own files read"   on credit_files;
drop policy if exists "own files write"  on credit_files;
create policy "own files read"  on credit_files for select using (auth.uid() = user_id);
create policy "own files write" on credit_files for all    using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Auto-create profile row when a new user signs up
-- ============================================================
create or replace function handle_new_credit_user()
returns trigger language plpgsql security definer as $$
begin
  insert into credit_profiles (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end; $$;

drop trigger if exists on_credit_user_created on auth.users;
create trigger on_credit_user_created
  after insert on auth.users
  for each row execute procedure handle_new_credit_user();

-- ============================================================
-- updated_at auto-bump
-- ============================================================
create or replace function bump_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists bump_credit_profiles on credit_profiles;
create trigger bump_credit_profiles before update on credit_profiles for each row execute procedure bump_updated_at();
drop trigger if exists bump_credit_items on credit_items;
create trigger bump_credit_items before update on credit_items for each row execute procedure bump_updated_at();
drop trigger if exists bump_credit_disputes on credit_disputes;
create trigger bump_credit_disputes before update on credit_disputes for each row execute procedure bump_updated_at();
