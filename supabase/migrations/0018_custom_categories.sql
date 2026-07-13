-- ============================================================
-- Extensible categories: users can add their own custom category
-- (name + emoji), visible to their whole space, alongside the 10
-- seeded bootstrap categories. Also renames two bootstrap
-- categories (data-only, no schema change): Cat -> Pet, Coffee ->
-- Drink.
--
-- Run this in: Supabase Dashboard → SQL Editor → Run
--
-- IMPORTANT: run manually on BOTH Supabase projects, dev first:
--   1. genkin-dev  (nvoevzkqaczhvttfdvqh) — test here first
--   2. genkin      (production, oizxibiwrmpxdleqhllw) — only after
--      verifying dev works correctly
-- There is no automated migration runner in this project; see
-- CLAUDE.md "Environments" section.
--
-- expenses.category / recurring_expenses.category remain plain
-- free-text columns (see 0001_init.sql, 0007_update_categories.sql)
-- — categories stays a "menu" table, never a foreign key target.
-- Add-only in this pass: no edit/delete UI or policy for existing
-- rows beyond the two renames below.
-- ============================================================

-- ── 1. Add created_by: null = bootstrap/global, non-null = user-added ──
alter table categories add column created_by uuid references auth.users(id) on delete cascade;

-- ── 2. Enable RLS, matching the budgets-style "own row, space-visible" shape ──
-- Bootstrap rows (created_by is null) must stay visible/selectable to
-- everyone, including anon, matching the existing
-- "grant select on categories to anon, authenticated". Custom rows are
-- visible to their creator and their creator's current space-mate via
-- is_space_mate(), the same predicate expenses/budgets already use.
alter table categories enable row level security;

create policy "everyone can view bootstrap categories"
  on categories for select
  to anon, authenticated
  using (created_by is null);

create policy "space members can view visible custom categories"
  on categories for select
  to authenticated
  using (created_by is not null and is_space_mate(created_by));

create policy "user can insert their own custom category"
  on categories for insert
  to authenticated
  with check (created_by = auth.uid());

-- No update/delete policy: add-only in this pass, and RLS defaults to
-- deny with no matching policy, so this is already fully locked down.

grant select, insert on categories to authenticated;
grant select on categories to anon;

-- ── 3. Rename two bootstrap categories (data-only, icon + name) ──
update categories set name = 'Pet',   icon = '🐕' where name = 'Cat'    and created_by is null;
update categories set name = 'Drink', icon = '🍺' where name = 'Coffee' and created_by is null;
