-- ============================================================
-- Add missing UPDATE policy on couple_members
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- Must be run on BOTH genkin-dev and genkin (production) projects.
--
-- couple_members had RLS enabled with only SELECT/INSERT policies
-- (0001_init.sql) — the new "change username" Settings feature updates
-- display_name and would otherwise silently affect zero rows, since RLS
-- defaults to deny per-command when no policy exists for that command
-- (same issue fixed for couples in 0005_couples_update_policy.sql).
-- ============================================================

create policy "members can update own membership"
  on couple_members for update
  using (user_id = auth.uid() and couple_id = get_my_couple_id())
  with check (user_id = auth.uid() and couple_id = get_my_couple_id());
