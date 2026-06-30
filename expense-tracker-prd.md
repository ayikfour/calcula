# Couple's Expense Tracker — Product Definition & Tech Stack

*Last drafted: June 2026. Free-tier details for Supabase, Gemini, and Figma change often — re-check official pricing pages before you build and again before you ship.*

## 0. Status — MVP shipped (2026-06-30)

All core features below are built and deployed at
[calcula-azure-five.vercel.app](https://calcula-azure-five.vercel.app/),
running on $0/month infrastructure (Supabase free tier + Vercel free tier +
Resend free tier for auth email). See `CLAUDE.md` §Commands for local dev,
and `supabase/migrations/*.sql` for the as-built schema (the sketch in §5
below predates a few fields added during build — treat the migration files
as canonical). Sections below are kept as the original product brief; where
reality diverged during the build, a note marks it.

## 1. Overview

A shared expense tracker for two people (you + your girlfriend) to log spending into one collaborative log and view simple summaries — installable as a PWA on your phones, running on $0/month infrastructure.

**Assumption:** single currency for now. Say so if you need multi-currency — it's a small schema change, easier to add now than retrofit later.

## 2. Core Features (MVP)

1. **Shared expense log** — either partner adds/edits/deletes entries; both see the same list in (near) real time.
2. **Add expense**: amount, category (manual selection), description/merchant, date, who paid.
3. **Dashboard / summaries**:
   - Daily spend chart (line or bar, trailing 30 days)
   - Category breakdown (donut/pie)
   - Monthly total + month-over-month comparison
   - "Who paid more this month" split
4. **Filters**: by category and payer (date-range filtering was descoped — the date-grouped log scrolls chronologically instead; revisit if the log grows large enough to need it).
5. **Auth**: each partner has their own login, joined into one shared "couple" workspace via invite code (magic-link / email-OTP sign-in, no passwords).
6. **PWA**: installable on phone home screen, works like a native app.
7. **Settle-up / balance tracker** — "who owes whom" running balance for the current month, computed from evenly-split expenses. Originally proposed as optional (see history below); adopted into MVP since it shaped the data model from day one and was cheap to build once `paid_by` + `split` existed.

## 3. Build-time decisions (history)

- **Settle-up was originally a "your call" stretch item** — confirmed early and folded into Core Features (#7) before any schema was written, specifically so `paid_by`/`split` didn't need to be retrofitted later.
- **Split is binary, not itemized**: an expense is either `even` (50/50) or `payer_only` (not shared) — there's no partial/custom-percentage split. The UI defaults to "Paid alone" since most logged expenses turned out to be personal, not shared.
- **Splitting an expense does not duplicate it into two rows.** One expense = one row, `paid_by` = who physically paid. The "Who paid" filter on the Log screen intentionally shows only what each person physically paid for, not who owes what — that question is answered by the Balance screen instead, reading the same rows through `get_monthly_balance()`.

## 4. Other stretch ideas (skip for MVP)

- Auto-categorization via a free-tier AI API (e.g. Gemini) — dropped for now per your call; straightforward to bolt on later via a Supabase Edge Function once the manual-entry flow is solid
- Recurring expense templates (rent, subscriptions)
- CSV export
- Per-category budgets with progress bars
- Push notifications (limited on PWA — would need extra setup, may not be worth it for v1)

## 5. Data model (as built)

This sketch predates the build; the real schema lives in
`supabase/migrations/0001_init.sql` (+ `0002_realtime.sql`). Summary of what
changed from the original sketch:

```
couples
  id, name, invite_code (auto-generated, unique), created_at

couple_members
  couple_id, user_id, display_name, joined_at

expenses
  id, couple_id
  paid_by      -- user_id who actually paid
  logged_by    -- user_id who entered it (may differ from paid_by)
  amount
  category
  description
  expense_date
  split        -- enum: 'even' (50/50) | 'payer_only' (not shared) — added
                  to support the settle-up feature from day one
  created_at

categories
  id, name, icon   -- seeded: Groceries, Food & Drink, Transport,
                       Rent/Bills, Entertainment, Health, Shopping, Other
                       (RLS disabled — read-only reference data, same for
                       all users, no per-couple scoping needed)
```

Beyond the tables, the migration adds:
- `invite_code` on `couples` — what the "join a couple" flow needs (§2.5/§2.7)
- `get_my_couple_id()` — a `security definer` helper RLS policies call to scope every query to the caller's couple without recursive-policy issues
- `create_couple()` / `join_couple()` RPCs — security-definer functions that perform the privileged first insert into `couple_members` (join is capped at 2 members)
- `monthly_balance` view + `get_monthly_balance()` RPC — the settle-up math (sum of even-split expenses vs. what each member actually paid, netted per month), read directly by the Balance screen
- `expenses` added to the `supabase_realtime` publication (migration `0002`) — tables aren't broadcast by default; this is what makes the shared log update live between partners instead of requiring a manual refresh

Row Level Security (RLS) in Postgres scopes every query to rows where `couple_id` matches the logged-in user's couple — this is what makes the shared log secure without a custom backend.

## 6. Tech stack (target: $0/month)

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite + Tailwind CSS | You already know React; Vite is fast and free |
| Installability | `vite-plugin-pwa` | Standard, free, open-source way to make a Vite app installable |
| Charts | Recharts | Free, open-source, plays well with React |
| Backend | Supabase (free tier) | Postgres DB + Auth + Realtime + Edge Functions, bundled, generous free tier |
| Auth email | Resend (free tier, custom SMTP) | Required in practice — see friction points below |
| Hosting (frontend) | Vercel (free tier) | Standard free static hosting for Vite/React apps; what was actually used |
| Version control | GitHub (free) | `github.com/ayikfour/calcula` |

This stack is $0 at your scale (2 users). The realistic friction points, in order of likelihood:
- Supabase's 7-day inactivity pause (only matters if you both stop using the app for a week)
- Supabase's 2-project cap (fine — you only need one project)
- **(Encountered during build) Supabase's built-in auth mailer is rate-limited to ~2 emails/hour** — too strict for active development, where you're testing sign-in repeatedly. Fixed by configuring Resend as custom SMTP (Authentication → SMTP Settings), which also raises Supabase's own internal email rate limit once custom SMTP is detected.
- **(Encountered during build) Resend's free `resend.dev` sender domain can only deliver to the email address the Resend account itself is registered under** — any other recipient gets a 403 "Testing domain restriction" until you verify your own domain in Resend and switch the sender address to it. Fine for solo dev/testing; verify a real domain before the second partner needs to receive their own magic links in production.
- **(Encountered during build) Customizing Supabase auth email templates** (e.g. to show the numeric OTP code instead of just a magic link) is gated behind either a Pro plan **or** having custom SMTP configured — the free built-in mailer can't have its templates edited. Configuring Resend (above) unlocks this for free.

## 7. Figma → Claude Code handoff

**Not the path actually taken for this build.** No Figma file existed for this
project — `design.md` already contained a full token set and component
library from an unrelated dark-glassmorphic marketing-landing-page project.
Rather than starting a Figma file from scratch, that existing system was
reused: original tokens (colors, type, spacing, radii, glassmorphism recipe)
kept as-is, and a new **"App Patterns"** section was appended to `design.md`
incrementally, one pattern at a time, as each mobile screen was built (list
row, bottom sheet, chart card, etc.) — never introducing a new color/spacing/
component without documenting it there first, per the project's hard rule.
That section is now the authoritative reference for anything touching the
Calcula UI; the rest of the original guidance below is kept for future
projects that do start from an actual Figma file.

**Best path: Figma's MCP (Model Context Protocol) server.** It lets Claude Code read your actual Figma file — components, colors, spacing, typography, layout — instead of you describing it in words or Claude Code guessing from a screenshot. Two versions:

- **Remote server** (Figma recommends this for most people): set up once via `claude plugin install figma@claude-plugins-official` inside Claude Code, then authenticate.
- **Desktop server**: runs through the Figma desktop app's Dev Mode toggle, for specific org/enterprise cases.

**The catch for zero-cost:** full MCP access needs a paid Figma "Dev" or "Full" seat. The free Figma plan is reported to cap remote MCP calls at roughly 6/month — enough to pull a handful of key screens once, not enough for back-and-forth iteration.

**Fully-free fallback** (works on any Figma plan):
1. Select a frame → use Figma's Inspect panel to read exact colors, spacing, and font values (no Dev Mode/MCP needed for basic inspection).
2. Export icons as SVG and images as PNG directly from Figma.
3. Take a screenshot of each screen.
4. Feed Claude Code: the screenshot + the specific token values (hex colors, font sizes, spacing) + exported assets, screen by screen.

**Either way:**
- Don't just hand tokens to Claude Code in passing — write them into a `design.md` file at the project root (template below). Point Claude Code at it explicitly ("follow design.md for all styling") at the start of every session — this is what keeps screen 5 consistent with screen 1 instead of drifting as you build over multiple sittings.
- Build one screen/component at a time, not the whole app in one prompt, and update `design.md` immediately if you spot a new pattern (e.g. a specific empty-state style) so it carries forward.
- This chat also has a Figma connector available — once you share the file link here, I can pull design context directly in our conversation too (same free-tier call caveat applies).

### `design.md` — what it should contain

A living reference, not a one-time export. Structure:
- **Colors** — named tokens with hex values (primary, background, surface, text, muted text, success/danger for things like positive/negative balance)
- **Typography** — font families and sizes for each role (headings, body, amounts/numbers, captions), since a numbers-heavy app like this often wants a distinct treatment for amounts
- **Spacing scale** — the actual values your Figma file uses (e.g. 4/8/12/16/24/32px), not a generic scale
- **Corner radius & shadows** — per component type (cards, buttons, inputs)
- **Component patterns** — button states, list item / card layout, input styling, chart colors per category
- **Notes** — anything Figma's Inspect panel or the MCP server surfaces that doesn't fit the categories above

I've put a fillable template in `design.md` alongside this doc — fill it in once you pull the Figma file (or have Claude Code populate it via the Figma MCP server), then keep it updated as you go.

## 8. Build order (as executed)

All phases below are complete and deployed (see §0).

1. ✅ Tooling guardrails — git init, `.gitignore`, npm scripts
2. ✅ Supabase project: schema + RLS policies scoped to `couple_id` (`supabase/migrations/0001_init.sql`)
3. ✅ React + Vite + Tailwind v4 scaffold, wired to `design.md`'s existing token set
4. ✅ Auth (magic-link + OTP-code fallback) + "create or join a couple" flow
5. ✅ Expense list + add/edit form, realtime sync, filters — styled per `design.md`, new patterns appended there first
6. ✅ Dashboard charts (daily spend, category breakdown, who-paid split) — same process
7. ✅ Balance / settle-up screen, reading `get_monthly_balance()`
8. ✅ PWA manifest + icons + service worker, deployed to Vercel, `CLAUDE.md` §Commands filled in

No further build phases are planned; future work would come from §4's stretch ideas or new feature requests.
