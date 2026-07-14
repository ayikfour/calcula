# Shareable Insights — Feature PRD

**Status:** brainstormed, not yet spec'd for build.
**Parent product:** Calcula (couple's/solo expense tracker). See
`expense-tracker-prd.md` for the core app; this feature is intentionally
scoped as its own document since it's independently buildable and has a
different goal (growth/acquisition) than the rest of the app (utility).

## 1. Problem / opportunity

Expense trackers are typically private, invisible tools — nobody
screenshots their budget app. That makes organic growth hard. The
opportunity is to have the app *generate* content worth sharing, rather
than relying on users to manually create something shareable themselves.
The hard part isn't the share mechanism — it's finding what's actually
worth showing off from private financial data.

## 2. Goals

- Give users a reason to share something from the app to social media
  (Instagram/WhatsApp Stories, TikTok) — driving organic awareness/growth.
- Make sharing feel natural and low-effort: generated, previewable,
  one-tap to share.
- Work for both solo users and multi-member rooms (see §5), since the app
  now treats solo as a first-class state, not a fallback.
- Stay within the project's existing $0/month infrastructure constraint —
  no new paid services required.

## 3. Non-goals (for this iteration)

- Not building a full social feed, in-app comments, or any social graph
  between users — this is one-way, out-to-external-platforms sharing only.
- Not building custom card design/editing tools — templates are fixed,
  system-generated.
- Not solving analytics/attribution tracking for shared content in this
  pass (e.g. tracking how many app installs came from a shared card) —
  worth a future pass once the core feature exists.

## 4. Core principle: relative framing, not raw numbers

This data is private finances — a couple's or an individual's. Every
generated insight defaults to **proportional or relative framing rather
than absolute dollar amounts**: percentages, rankings, streaks,
comparisons — not raw totals or specific transaction amounts. Users may
opt into revealing real numbers on a given card, but that must never be
the default. No auto-posting under any circumstance; every card is
previewed before any share action is available. This principle applies to
every content idea in §5 — not repeated per item below.

## 5. Content set

Calcula rooms can have 1 member (solo) or 2+ members (collaborative) — see
`expense-tracker-prd.md`'s solo-by-default reframe. Each idea below is
tagged for which room sizes it applies to, since a couple-oriented card
must not appear broken or misworded on a solo room, and vice versa.

### 5.1 Milestone card — "X months tracking [together / your spending]"
**Applies to:** both (framing changes by member count)

Same visual template; copy swaps between relational framing (2+ members,
"together") and personal framing (solo, "your spending"). **Recommended
first build** — milestone/relationship content tends to get shared more
readily than a raw spending stat, and the solo version (consistent
logging as a personal-discipline story) stands on its own rather than
reading as a downgrade from the couple version.

### 5.2 Periodic recap ("Wrapped"-style)
**Applies to:** both (framing changes by member count)

Monthly or year-end summary: top category, most consistent habit, a
quirky pattern (e.g. "most of your spending happens on Fridays").
Recurring by design — gives users a reason to open the app and share
again on a schedule, not just once. Strongest long-term growth mechanic
of the set, but also the most involved to build (§8).

### 5.3 Single-stat meme card
**Applies to:** solo only (see §5.4 for the 2+ member equivalent)

One dominant category rendered as a bold, low-information-density card
(e.g. "You're in your Coffee era"). For rooms with 2+ members, this
collapses into the pairing card (§5.4) instead — don't build these as two
separate features; one behavior branches by member count.

### 5.4 Pairing card
**Applies to:** 2+ members only

A head-to-head framing of each member's dominant category (e.g. "The
Coffee One" vs. "The Grocery Planner"). Needs careful copywriting so it
reads as playful, not passive-aggressive about money — worth a copy
review pass specifically for tone before shipping. Word the underlying
logic generically as "compare N members' dominant categories," not
hardcoded to exactly two, so it stays forward-compatible if the
"uncapped room size" direction (a separate, not-yet-decided product
direction) ever ships.

### 5.5 Self-comparison ("progress against your own past")
**Applies to:** solo only

E.g. "You spent 18% less on takeout than last month," or a longest
no-spend streak. Has no clean multi-member equivalent, since a shared
room's card is naturally about the group rather than one member's
individual trend. Worth building as its own idea rather than treating
solo purely as a downgrade of couple-oriented content.

## 6. Member-count branching — implementation note

Every card except §5.5 must read the room's **current** member count at
generation time, not something decided once and cached — membership can
change (someone leaves, someone joins), and a stale "couple" framing on a
now-solo room would look broken. Don't hardcode "couple"/"partner"
language anywhere in generation logic or templates; branch on member
count generically (1 vs. 2+, extensible to 1 vs. 2 vs. N later). This
only requires reading `couple_members` count at generation time — it
doesn't need to block on, or be blocked by, the separate solo-room/leave-
flow rework happening elsewhere in the app.

## 7. Format & tech approach ($0 stack)

Vertical (9:16, Story-shaped) image cards — the native shape for
Instagram/TikTok/WhatsApp Status. Fully buildable free:
- Render the card as a styled component client-side, convert to an image
  with `html-to-image` or `html2canvas` (both free, npm packages).
- Hand off to the OS share sheet via the Web Share API
  (`navigator.share()` with a file attachment) so it drops straight into
  Instagram Stories, WhatsApp, etc., without a manual save-then-upload
  step.

**Flag before designing around this:** current iOS Safari support for
sharing image *files* (not just text/links) via `navigator.share()`
inside a PWA specifically is something I'm not fully confident about —
this has been a moving target on iOS in the past. Verify against current
MDN/caniuse data before committing to this as the only share path. Keep a
"save image, share manually" fallback regardless of what that check
turns up, since it costs little to include and removes the risk entirely.

Visual templates should be built entirely within the existing
`design.md` token set (colors, type, spacing, glassmorphism patterns
already established for the core app) — no new design tokens should be
needed; if one is, document it there first per the project's existing
rule, don't introduce it ad hoc inside this feature.

## 8. Growth mechanic (separate from the content itself)

Generating a shareable insight and getting it to actually drive growth
are two different problems:
- Include subtle branding on every card (small logo/wordmark, optionally
  a short link or QR code back to a landing page) — this is what turns a
  repost into awareness, not the insight content alone.
- Bias every idea toward an emotional hook over a raw data point — a
  category breakdown is information; "8 months tracking together and
  never missed a week" is a story. Recap and milestone content should
  lean on this consistently in copywriting.

## 9. Data model implications (rough, not final)

Not yet designed in schema detail — flagging the shape of what's likely
needed so it's not a surprise at build time:
- Generation is likely read-only against existing tables (`expenses`,
  `couple_members`) for most cards — no new tables needed for §5.1–5.5
  themselves.
- If recap cards are meant to be regenerable/consistent on repeat views
  within the same period (rather than randomized each time), some
  lightweight caching of "this month's generated recap" per room may be
  worth considering — open question, not decided (see §10).
- If per-member opt-out (§10) is adopted, that needs a flag somewhere —
  likely on `couple_members`, mirroring how `avatar_type`/`avatar_value`
  were added directly to that table in Iteration 2 rather than a new
  table.

## 10. Open questions (not yet decided)

- **Trigger model**: are recap cards user-triggered (a "generate my
  recap" button) or proactively surfaced (e.g. a prompt at month-end)?
  The latter is stronger for growth but adds complexity — push
  notifications are already flagged elsewhere as limited/unreliable on
  iOS PWA.
- **Per-member opt-out**: should any member of a 2+ person room be able
  to exclude themselves from appearing in a pairing/recap card? Money can
  stay a sensitive topic even between people already sharing a log —
  worth deciding deliberately rather than assuming consent by default.
- **Caching/consistency**: should a recap regenerate fresh each time it's
  viewed, or be computed once and stored for the period it covers? Affects
  whether users can get a different-looking card on a second look, which
  may or may not be desirable.
- **Attribution/tracking**: out of scope for this pass (§3), but worth
  flagging as a natural follow-up once this ships — knowing whether shared
  cards actually convert to installs would meaningfully inform which of
  §5's content ideas to invest further in.

## 11. Suggested build priority

1. Milestone card (§5.1) — simplest, no new aggregation logic, strong
   shareability, works cleanly for both solo and multi-member.
2. Self-comparison (§5.5) — solo-specific, reuses trend data the
   dashboard likely already computes.
3. Single-stat / pairing card (§5.3–5.4) — needs the member-count
   branching logic (§6) built once, reused by future cards too.
4. Periodic recap (§5.2) — most valuable long-term (recurring engagement
   loop) but most involved; do this after the simpler cards validate that
   people actually share this kind of content at all.
