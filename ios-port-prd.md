# Genkin — Native iOS Port PRD

> **Status:** Planning document. The iOS port has not been started. This doc
> extends `expense-tracker-prd.md` (product scope, data model, build
> history) and `DESIGN.md` (visual tokens — partially reusable; interaction
> patterns are **not** carried over, see §4). Treat those two files as the
> source of truth for *what the product does*; this file covers *how it
> becomes a native iOS app*.

## 1. Overview

A native iOS port of Genkin (Swift/SwiftUI), talking to the **same
Supabase project** the web app already uses. Because expenses, budgets,
and recurring expenses are user-owned rather than device- or
client-scoped, existing users' data carries over automatically — same
accounts, same rows, day one, zero migration.

## 2. Goals / Non-Goals

**Goals**
- 1:1 feature parity with the current web app (see `expense-tracker-prd.md`
  for the full list).
- iOS HIG–native interaction patterns throughout — not a visual clone of
  the web UI.
- Keep running on the existing $0/month Supabase backend. The only new
  cost under consideration is the Apple Developer Program fee, which is
  *not* infrastructure cost and is flagged separately in §8.

**Non-Goals**
- No Android.
- No redesign of information architecture beyond what's needed to go
  native (see §5's TabView note — that's the one deliberate IA change).
- No features beyond what's documented in `expense-tracker-prd.md`.
- No offline-first / local persistence in v1.
- No settle-up/balance math — deliberately removed on web already
  (`0003_remove_split.sql`); the "who paid" view stays informational only.
- No AI auto-categorization — deliberately deferred on web already.

## 3. Scope

**Governing principle for this whole document:** this is a **1:1 feature
port** — same data model, same flows, same features as
`expense-tracker-prd.md`. Interaction and visual style are explicitly
**not** copied 1:1 from the web app — use native iOS patterns instead
(native swipe actions, native sheets, SF Symbols instead of Phosphor
icons, tabbed root navigation, etc.). Capabilities the current PWA
structurally can't offer (push notifications, offline-first cache, Face
ID app lock, Sign in with Apple, widgets, share extension) are listed
separately in §9 as *not* part of this scope.

## 4. Technical Architecture

**Pattern: MVVM.** The existing React hooks (`useExpenses`, `useBudgets`,
`useRecurringExpenses`, `useSpaceMembers`, etc.) are already thin,
per-feature data-and-actions modules wrapping Supabase calls and exposing
reactive state — structurally, that's a ViewModel. Each hook ports to an
`@Observable` class (iOS 17 Observation framework, not legacy
`ObservableObject`/`@Published`) of the same name and responsibility:
`ExpensesViewModel`, `BudgetsViewModel`, `SpaceMembersViewModel`, and so
on.

- **Why not TCA:** a large paradigm shift with no corresponding
  investment on the web side to justify it for a 1:1 port. MVVM keeps the
  mental model transferable between the two codebases.
- **Why not UIKit:** no reason to, on a from-scratch native build with no
  legacy UIKit surface to interop with.

Business logic that's pure computation — budget carry-forward
(`src/lib/budgetSummary.ts`), recurring next-occurrence calculation
(`src/lib/recurringExpenses.ts` / `dates.ts`) — ports almost verbatim as
plain Swift structs/services, independent of any ViewModel, exactly as
it's already separated from components today. This is the one layer of
the existing architecture that transfers nearly directly.

**Supabase integration:** the official `supabase-swift` package (`Auth`,
`PostgREST`, `Realtime`, `Storage` clients under one `SupabaseClient`).
Mirrors `@supabase/supabase-js` closely enough that the porting mental
model — same table names, same RPC names, same `.eq()`/`.select()`
chains — holds. One client instance, injected app-wide, singleton-style
like today's `src/lib/supabase.ts`.

**Session/token persistence: Keychain, not UserDefaults.** Non-negotiable
— tokens are credentials, UserDefaults is an unencrypted plist on disk.
Use `supabase-swift`'s pluggable `AuthLocalStorage` with a Keychain-backed
implementation.

**Minimum iOS version: iOS 17.** Enables `@Observable` and a mature
`NavigationStack`. Given this is a 2-person personal app with no App
Store install-base pressure, there's no reason to backport to iOS 15/16
and carry `ObservableObject`/Combine boilerplate for it — a deliberate
"no back-compat tax" choice.

**Navigation: `TabView` root with 3 tabs — Log, Stats, Settings**, each
holding its own `NavigationStack`. This is a deliberate, worthwhile
deviation from the web IA, not a 1:1 carry-over: the web app's top-nav +
settings-gear pattern exists only because a PWA has no persistent native
tab chrome to lean on. iOS does — a `TabView` at the bottom is the
idiomatic HIG home for this app's 2–3 top-level destinations, and
Settings-as-a-tab is the native pattern, not a gear icon glued into a
custom top bar. Per-tab `NavigationStack`s mean drilling into Import (from
Settings) or a stats detail doesn't disturb the other tabs' navigation
state. This also eliminates the manual `NAV_CONFIG`/back-button
bookkeeping `TopNav.tsx` needs today.

## 5. Backend (unchanged)

**No backend changes are required.** The iOS app talks to the exact same
Supabase project(s) as the web app, using the same schema, RLS, RPCs, and
Realtime publications:

- **Tables:** `spaces`, `space_members`, `expenses`, `budgets`,
  `recurring_expenses`, `categories` — see `expense-tracker-prd.md` §5 and
  `supabase/migrations/0014_spaces_ownership_model.sql` for the canonical
  schema.
- **RLS:** `get_my_space_id()` and `is_space_mate()` helper functions
  gate access; `expenses`/`budgets`/`recurring_expenses` have **no
  `space_id` column** — ownership is per-user (`paid_by`/`logged_by`,
  `user_id`, `paid_by` respectively), and visibility is computed from
  current space membership.
- **RPCs:** `create_space(space_name, display_name)`,
  `join_space(code, display_name)`, `leave_space()`, `user_has_password()`
  — called identically from Swift via `supabase-swift`'s `rpc()`.
- **Realtime:** `expenses` and `recurring_expenses` are published;
  clients receive only what RLS allows them to see.

Because expenses/budgets/recurring expenses are owned by the user and not
scoped to a space, switching or leaving spaces needs no data migration on
iOS either — same invariant, same RPCs, same zero-copy guarantee that
makes this model work on web.

## 6. Feature-Area Port Notes

| Area | Web pattern | iOS-native equivalent |
|---|---|---|
| **Auth** | `PasswordAuthForm` / `EmailCodeAuthForm`, OTP-primary (PWA can't capture redirect URIs in standalone mode) | Native `SecureField`/`TextField` with `.textContentType(.password)` / `.oneTimeCode` (auto-fill from Messages — no web equivalent). **Invert the bias: make magic-link primary**, keep OTP as fallback — universal links / `ASWebAuthenticationSession` handle redirects properly on native, so the constraint that forced OTP-first on web doesn't exist here. Genuine simplification, not just a restyle. |
| **Onboarding** | 4-step skippable wizard (Name → Budget → Import → Invite/Join/Solo), progress dots | Ports close to 1:1 as a custom paged flow, restyled per step with native controls (native currency picker, `.fileImporter` for the import step, native list for invite/join/solo). No strong native primitive replaces a custom onboarding wizard, so this stays custom. |
| **Expense log + add/edit** | Hand-rolled swipe-to-reveal (`ExpenseRow` custom pointer-drag math); custom drag-to-dismiss sheet (`AddExpenseSheet`) | `List` + `.swipeActions(edge: .trailing)` for Edit/Delete — eliminates the entire custom gesture-conflict subsystem the web app needs to disambiguate scroll vs. swipe. `.sheet()` + `.presentationDetents()` for add/edit — native sheets already have drag-to-dismiss and safe-area handling built in. `NumericKeypad` stays custom (no system component matches calculator-style amount entry) but gains `UIImpactFeedbackGenerator` haptics per keypress. Category/payer pickers → native `List`/`Menu`/`Picker`. Date picker → native `DatePicker`. |
| **Dashboard/Stats** | Recharts (bar, donut, stacked bar) | **Swift Charts** (`Chart`, `BarMark`, `SectorMark` for the category donut). Segmented budget progress bar stays a simple custom `Capsule` row — low risk, genuinely portable as-is. |
| **Budgets** | `MonthlyBudgetSheet`, numeric keypad, carry-forward | Native sheet + a custom prev/next month stepper (native `DatePicker` doesn't cleanly do month-only granularity pre-17.5, so don't fight it) + the same numeric keypad component. |
| **Recurring expenses** | Frequency dropdown (None/Weekly/Monthly/Yearly) | Native `Picker` (segmented or menu style). No UI-pattern risk here — the real risk is behavioral, see §8. |
| **CSV import** | 4-step wizard (upload → configure → preview → commit), PapaParse, header aliasing, duplicate flagging | Logic ports conceptually as-is; only the file picker changes (`.fileImporter(allowedContentTypes: [.commaSeparatedText])`). No Swift equivalent of PapaParse to just import — a small real CSV parser is a genuine (small) build task, not a trivial swap. |
| **Spaces/Settings** | iOS-Settings-style grouped list (`rounded-lg border`, chevron rows, sheets for sub-actions) | Native grouped `List` (`.listStyle(.insetGrouped)`) with `NavigationLink` rows — this is already the closest 1:1 conceptual match in the whole app, since the web version was explicitly styled to *look* iOS-native. `SwitchSpaceSheet`/`ChangeUsernameSheet`/`PasswordSheet`/`CurrencyDrawer` → `.sheet()` + `Form`. Leave-space (destructive) → `.confirmationDialog` / `Button(role: .destructive)`. |
| **Sound feedback** | `@web-kits/audio`, 17 named UI events, volume/mute in Settings | Small `SoundPlayer` service wrapping pooled `AVAudioPlayer` instances (avoids reload latency per tap), same 17 events as a Swift `enum SoundEvent`, volume/mute persisted via `UserDefaults` (legitimate non-sensitive-preference use, same as today's localStorage). Pair with native haptics (`UIImpactFeedbackGenerator`/`UINotificationFeedbackGenerator`) on the same events — near-zero incremental cost since sound-event wiring is happening anyway, so this rides along in core scope rather than being deferred. |

## 7. Design Tokens

`DESIGN.md`'s color palette, type scale, and spacing rhythm are a
reasonable starting point (the neutrals, semantic success/danger colors,
and category chart palette all transfer as raw values), but its
**component patterns section does not apply** — those describe web/PWA
implementations (bottom sheets with custom drag physics, Tailwind
utility patterns, shadcn primitives) being explicitly replaced per §6. A
separate `design-ios.md` should be created once actual SwiftUI screen
work begins, mirroring how `DESIGN.md` itself grew incrementally
per-screen — not attempted speculatively in this PRD.

## 8. Risks & Open Questions

### Apple Developer Program fee ($99/year) — unresolved, flagged prominently

`CLAUDE.md` states the $0/month infrastructure constraint is a hard
requirement. Apple requires a paid Developer Program membership to
distribute an iOS app at all, including via TestFlight — there's no free
tier for this. The tradeoff, left open here rather than decided:

- **Free 7-day local sideloading** (Xcode "Personal Team", no paid
  account): true $0, but the provisioning profile expires every 7 days,
  requiring a re-install. For a 2-user couple's app, this means the
  non-developer partner needs the developer's Mac and a fresh Xcode
  install roughly weekly — a real usability wall, not just an abstract
  fee.
- **Paid Developer Program**: unlocks TestFlight (90-day builds, easy
  install for the partner) or full App Store distribution, at $99/year —
  a one-time-per-year identity/distribution cost, not recurring
  infrastructure in the Supabase sense, but still a cost this project has
  not historically incurred.

This should be decided before implementation begins, not during it.

### Recurring-expense lazy materialization — deliberate non-change

The current design assumes someone opens the app reasonably often;
`materializeDueRecurringExpenses()` runs client-side on foreground/launch,
capped at 500 iterations/template. Going native does **not** improve this
— `BGAppRefreshTask` is opportunistic and system-throttled, not a
reliable scheduler, and a real fix requires paid infra (a cron-triggered
Edge Function), which is out of scope per the $0/month constraint.
**Materialization stays foreground/launch-triggered, identical to web.**
Background materialization belongs in §9 (Future), contingent on
revisiting the cost constraint.

### Realtime subscription lifecycle across backgrounding — required handling

iOS suspends network sockets when the app backgrounds. The Realtime
channel subscribed for `expenses`/`recurring_expenses` will silently die
on backgrounding and needs explicit reconnect-on-foreground handling —
watch `scenePhase` and resubscribe + refetch on `.active`. The existing
web dedupe-by-id merge logic in `useExpenses.ts` ports directly for the
reconciliation step once reconnected. This is required, not optional —
without it, the log/dashboard silently goes stale after any
backgrounding.

### Supabase Swift SDK maturity

`supabase-swift` is officially maintained with a stable core
(Auth/PostgREST/Realtime/Storage all present) but trails the JS SDK in
community size and edge-case coverage. Budget verification time for: the
4 custom RPCs' Codable request/response ergonomics, and Realtime's Swift
filter-option parity with the JS `.on('postgres_changes', {...})` API.

### RLS/session handling — low risk

RLS is enforced entirely in Postgres regardless of client. Native
inherits identical authorization behavior automatically, as long as the
Swift Auth client attaches JWTs to PostgREST/Realtime requests the same
way the JS client does — that's the SDK's responsibility, not custom
code.

### Email OTP/magic-link on native — gets simpler, not harder

The web app's OTP-primary bias exists specifically because iOS Safari PWA
standalone mode can't capture magic-link redirect URIs. A native app has
no such limitation — a registered universal link (or
`ASWebAuthenticationSession`) completes the session directly. Worth
calling out as a genuine simplification unlocked by going native (see
§6's Auth row).

### Sign in with Apple — confidence check, not a requirement

App Store guideline 4.8 requires Sign in with Apple only when an app
offers *other* third-party/social login (Google, Facebook, etc.) as a
sign-in option. Plain email+password and email OTP are first-party auth,
not third-party social login, so this app should **not** trigger the
requirement. Re-verify against the current App Store Review Guidelines at
submission time — enforcement judgment has shifted before. Do not add
Sign in with Apple preemptively (stays in §9, Future).

### CSV import file access

`.fileImporter` returns a security-scoped URL requiring
`startAccessingSecurityScopedResource()` /
`stopAccessingSecurityScopedResource()` bracketing before reading — an
easy-to-miss gotcha that shows up as "works in simulator, fails on device
with real Files app picks." Files here are personal expense histories,
realistically well under a few MB, so reading the whole file into memory
inside that bracket is fine — no streaming parse needed.

### Dev/prod environment config

Mirror the existing two-Supabase-project setup (`genkin-dev` / `genkin`)
via Xcode build configurations + schemes — Debug → `genkin-dev`, Release
→ `genkin` — with keys injected per configuration via a gitignored
`.xcconfig` file, the direct native equivalent of the `.env`/Vercel-env
split. TestFlight/Release builds point at prod the same way Vercel
deploys do; local simulator/device debug builds point at dev, preserving
the existing "never point local dev at prod data" rule from `CLAUDE.md`.

### App Transport Security — non-issue

Supabase URLs are HTTPS/WSS by default; ATS's default policy (TLS 1.2+)
is already satisfied. No `NSAppTransportSecurity` exceptions expected in
`Info.plist`.

## 9. Future / Not in v1

These are native-only opportunities the current PWA structurally can't
offer. They're listed here deliberately separate from the core plan —
none are committed to v1 scope:

- **Push notifications** (budget threshold alerts, recurring expense
  reminders) — requires APNs + a trigger source; no server-side
  scheduler exists today (see §8's materialization note), so this is
  gated on either paid infra or a client-side local-notification
  approximation, which is its own design question.
- **Offline-first local cache (SwiftData)** — the web app is
  online-only by design (network-first caching, no offline mutations).
  A native app could do better, but it's a genuinely separate scope of
  work (conflict resolution, sync queue) not undertaken here.
- **Face ID / Touch ID app lock** — cheap to add later, no dependency
  on anything else in this PRD.
- **Sign in with Apple** — not required (see §8), but could be added
  as a convenience option later.
- **Home-screen widgets** — e.g. today's spend or budget remaining at
  a glance.
- **Share extension** — log an expense directly from a Messages/Safari
  share sheet (e.g. sharing a receipt photo or forwarded amount).

## 10. Proposed Build Order

Mirrors the original web build order (`expense-tracker-prd.md` §8) —
core loop proven first, settings/import last:

1. Project scaffold + Supabase Swift client + Keychain-backed auth
2. Log + Add/Edit (the core loop, same priority as the original web build)
3. Dashboard/Stats (Swift Charts)
4. Budgets + Recurring Expenses
5. CSV Import
6. Spaces/Settings (invite/join/leave, currency, password, username)
7. Sound + Haptics
8. TestFlight distribution setup (contingent on §8's Apple Developer
   Program decision)

## Reference files

- `expense-tracker-prd.md` — product scope, data model, build history
- `DESIGN.md` — visual tokens (partially reusable per §7); "App Patterns"
  section describes the web patterns being replaced per §6
- `CLAUDE.md` — $0/month rule, environments, architecture invariants
- `supabase/migrations/0014_spaces_ownership_model.sql` — canonical
  ownership-model migration
- `src/contexts/AuthContext.tsx`, `src/lib/recurringExpenses.ts`,
  `src/hooks/useExpenses.ts` — web behavior this PRD describes porting
  (referenced for accuracy, not modified by this document)
