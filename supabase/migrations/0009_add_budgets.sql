-- ============================================================
-- Per-person monthly budgets, tracked on the Stats page
-- Run this in: Supabase Dashboard → SQL Editor → Run
--
-- IMPORTANT: run manually on BOTH Supabase projects, dev first:
--   1. genkin-dev  (nvoevzkqaczhvttfdvqh) — test here first
--   2. genkin      (production, oizxibiwrmpxdleqhllw) — only after
--      verifying dev works correctly
-- There is no automated migration runner in this project; see
-- CLAUDE.md "Environments" section.
--
-- One row per couple member holding their current monthly budget
-- (not a per-month history — same "single current value" shape as
-- couples.currency_code). Budget cadence is the calendar month,
-- matching the existing "This month" total on the Stats page.
-- ============================================================

create table budgets (
  couple_id      uuid          not null references couples(id) on delete cascade,
  user_id        uuid          not null references auth.users(id) on delete cascade,
  monthly_amount numeric(12,2) not null default 0,
  updated_at     timestamptz   not null default now(),
  primary key (couple_id, user_id)
);

-- ── RLS ──────────────────────────────────────────────────────
alter table budgets enable row level security;

create policy "members can view own couple budgets"
  on budgets for select
  using (couple_id = get_my_couple_id());

create policy "user can insert their own budget"
  on budgets for insert
  with check (couple_id = get_my_couple_id() and user_id = auth.uid());

create policy "user can update their own budget"
  on budgets for update
  using (couple_id = get_my_couple_id() and user_id = auth.uid())
  with check (couple_id = get_my_couple_id() and user_id = auth.uid());
