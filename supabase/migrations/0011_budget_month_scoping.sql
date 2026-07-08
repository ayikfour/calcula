-- ============================================================
-- Month-scoped budgets, with carry-forward semantics
-- Run this in: Supabase Dashboard → SQL Editor → Run
--
-- IMPORTANT: run manually on BOTH Supabase projects, dev first:
--   1. genkin-dev  (nvoevzkqaczhvttfdvqh) — test here first
--   2. genkin      (production, oizxibiwrmpxdleqhllw) — only after
--      verifying dev works correctly
-- There is no automated migration runner in this project; see
-- CLAUDE.md "Environments" section.
--
-- Replaces the single "current value per person" shape from
-- 0009_add_budgets.sql with a row per (person, effective month).
-- A month with no explicit row carries forward the most recent
-- prior row for that person (client-side lookup, see
-- src/lib/budgetSummary.ts) — so couples only need to add a new
-- row when the amount actually changes, and it applies from that
-- month forward until changed again.
--
-- Existing rows are backfilled to a sentinel month far in the past
-- so they keep applying to every month (past and future) exactly
-- like today, until someone sets a new month-scoped value.
-- ============================================================

alter table budgets add column effective_month date;
update budgets set effective_month = date '2000-01-01';
alter table budgets alter column effective_month set not null;
alter table budgets alter column effective_month set default date_trunc('month', now())::date;

alter table budgets
  add constraint budgets_effective_month_is_month_start
  check (effective_month = date_trunc('month', effective_month)::date);

alter table budgets drop constraint budgets_pkey;
alter table budgets add primary key (couple_id, user_id, effective_month);

-- Supports "most recent row <= target month" lookups per user.
create index budgets_user_month_idx
  on budgets (couple_id, user_id, effective_month desc);
