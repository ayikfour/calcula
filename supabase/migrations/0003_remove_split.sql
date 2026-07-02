-- ============================================================
-- Remove the split/settle-up feature: drop the Balance screen's
-- RPC/view and the expenses.split column
-- Run this in: Supabase Dashboard → SQL Editor → Run
--
-- IMPORTANT: run manually on BOTH Supabase projects, dev first:
--   1. genkin-dev  (nvoevzkqaczhvttfdvqh) — test here first
--   2. genkin      (production, oizxibiwrmpxdleqhllw) — only after
--      verifying dev works correctly
-- There is no automated migration runner in this project; see
-- CLAUDE.md "Environments" section.
--
-- Drop order matters: get_monthly_balance() and monthly_balance
-- depend on expenses.split, and expenses.split depends on the
-- split_type enum — so drop in that dependency order (function,
-- then view, then column, then enum).
-- ============================================================

-- 1. Drop the RPC wrapper first (depends on the view)
drop function if exists get_monthly_balance(date);

-- 2. Drop the view (depends on expenses.split)
drop view if exists monthly_balance;

-- 3. Drop the split column from expenses (depends on split_type enum)
alter table expenses drop column if exists split;

-- 4. Drop the now-unused enum type last
drop type if exists split_type;
