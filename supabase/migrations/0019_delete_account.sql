-- ============================================================
-- Delete account: adds delete_own_account(), the first RPC in this
-- project that removes a row from auth.users. Unlike leave_space()
-- (reversible — lands you in a fresh solo space with your data
-- untouched), this is permanent and destroys the caller's own
-- expenses/budgets/recurring expenses.
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
-- Unproven risk: whether the postgres role (this function's owner)
-- has DELETE privilege on auth.users, not just the SELECT that
-- user_has_password() (0012) relies on. Verify the final `delete
-- from auth.users` below actually succeeds in genkin-dev before
-- trusting this in production.
-- ============================================================

create or replace function delete_own_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_space_id uuid;
  v_remaining int;
begin
  if v_uid is null then
    raise exception 'not_authenticated';
  end if;

  -- Rows I actually own (coalesce(paid_by, logged_by) / paid_by):
  -- delete outright.
  delete from expenses where coalesce(paid_by, logged_by) = v_uid;
  delete from recurring_expenses where paid_by = v_uid;

  -- Rows I merely logged/created for a space-mate (paid_by set to
  -- them, not me — see AddExpenseSheet's payer selector): repoint the
  -- actor column to the real owner instead of deleting, since it's
  -- their data, not mine. Otherwise the FK on logged_by/created_by
  -- would block deleting auth.users below.
  update expenses set logged_by = paid_by
    where logged_by = v_uid and paid_by is not null and paid_by <> v_uid;
  update recurring_expenses set created_by = paid_by
    where created_by = v_uid and paid_by <> v_uid;

  -- Purge my audit trail last — the deletes/updates above just
  -- re-triggered log_expense_activity() with actor_id = v_uid, on top
  -- of any pre-existing history, so this has to run after them.
  delete from expense_activity where actor_id = v_uid;

  -- Mirror leave_space()'s empty-space cleanup (0014): space_members
  -- rows cascade off auth.users automatically, but the parent spaces
  -- row does not, so an emptied space would otherwise linger forever.
  select space_id into v_space_id from space_members where user_id = v_uid;
  if v_space_id is not null then
    delete from space_members where space_id = v_space_id and user_id = v_uid;

    select count(*) into v_remaining from space_members where space_id = v_space_id;
    if v_remaining = 0 then
      delete from spaces where id = v_space_id;
    end if;
  end if;

  -- budgets.user_id and categories.created_by both have "on delete
  -- cascade" to auth.users already — nothing to do for them here.
  delete from auth.users where id = v_uid;
end;
$$;

grant execute on function delete_own_account() to authenticated;
