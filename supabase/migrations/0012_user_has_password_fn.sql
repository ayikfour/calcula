-- ============================================================
-- Add user_has_password() RPC
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- Must be run on BOTH genkin-dev and genkin (production) projects.
--
-- Both password sign-up and OTP/magic-link sign-in resolve to the same
-- 'email' identity provider, so there's no client-visible flag that
-- distinguishes "has a password" from "OTP-only". This checks
-- auth.users.encrypted_password directly (security definer, same pattern
-- as get_my_couple_id() in 0001_init.sql) so Settings can show
-- "Create a password" vs "Change password" correctly for every user,
-- including ones who already have a password today.
-- ============================================================

create or replace function user_has_password()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select encrypted_password is not null and encrypted_password <> ''
  from auth.users
  where id = auth.uid();
$$;

grant execute on function user_has_password() to authenticated;
