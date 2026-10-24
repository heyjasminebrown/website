-- Run once in Supabase: SQL Editor → New query → paste → Run.
-- Stores every lead from the website's forms.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null,          -- which form: Calculator, Referral, Loan request, Newsletter, ...
  name text,
  email text,
  phone text,
  message text,
  details jsonb not null default '{}'::jsonb  -- everything else the form collected
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_source_idx on public.leads (source);

-- Lock the table down: with RLS on and no policies, the public API can't read or write it.
-- The website writes with the service role key, which bypasses RLS.
alter table public.leads enable row level security;

-- Newer projects don't always expose new tables to the API automatically; let the website's
-- secret key reach this table. (Safe to run more than once.)
grant usage on schema public to service_role;
grant select, insert on public.leads to service_role;
