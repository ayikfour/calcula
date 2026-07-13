# Dimension — Style Reference
> Pre-dawn glassmorphic command deck

**Theme:** dark

Dimension speaks in a near-monochrome dark register: a near-black canvas, glassmorphic surfaces that float above it, and one muted indigo that surfaces only as accent punctuation. Typography is restrained and humanist — DM Sans for body, Geist for display — letting the 72px whisper-weight headlines carry the room without color needing to shout. Components are pill-shaped or soft-rounded; nearly every interactive element (buttons, nav, tags, the floating dock) uses a 9999px radius, while cards settle into 24–40px curves. The page breathes: generous vertical rhythm, thin hairline borders in #e5e5e5 at low opacity, and minimal elevation — depth comes from translucency and blur, not shadow stacks.

> **Status note (2026-06-30):** this file originated as the style reference for an unrelated dark-glassmorphic *marketing landing page* — that's what everything from here through **Quick Start** describes (hero headlines, floating pill nav, 1200px desktop layout, etc.). It was reused as the token source for **Genkin**, a separate mobile PWA, with the colors/type/spacing/glassmorphism kept verbatim. Everything Genkin-specific lives in **App Patterns** below and **Implemented Theme (Genkin)** right after it — those two sections are the authoritative reference for that app; the sections above are historical/landing-page context, not things Genkin screens should match (no hero, no 1200px layout, no floating desktop nav).

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void | `#0a0a0a` | `--color-void` | Page background, deep surface — the canvas everything floats above |
| Char | `#1d1d1d` | `--color-char` | Elevated card surface, modal background |
| Iron | `#3d3d3d` | `--color-iron` | Mid-tier surface, hover state on dark elements |
| Slate | `#505050` | `--color-slate` | Disabled surface, secondary button background |
| Smoke | `#797979` | `--color-smoke` | Inactive surface, placeholder fill |
| Graphite | `#161616` | `--color-graphite` | Deepest UI element fill, icon strokes against light areas |
| Ink | `#282828` | `--color-ink` | Hairline dividers, subtle borders on glass surfaces |
| Fog | `#686868` | `--color-fog` | Muted link text, secondary metadata |
| Mist | `#c2c2c2` | `--color-mist` | Secondary body text, soft captions |
| Ash | `#b2b2b2` | `--color-ash` | Icon color at rest, inactive button label |
| Bone | `#e5e5e5` | `--color-bone` | Primary text, dominant border tone (often at reduced opacity), icon strokes — the workhorse neutral |
| Paper | `#ffffff` | `--color-paper` | Light neutral action fill for buttons on dark surfaces. |
| Onyx | `#000000` | `--color-onyx` | Icon fill on light surfaces, SVG illustration shadow |
| Indigo Haze | `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 40%, rgba(107,98,242,0.565) 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0))` | `--color-indigo-haze` | Sole chromatic accent — used in the hero wash gradient and the radial spotlight behind hero content; restrained indigo, never used for solid buttons |
| Dawn Wash | `linear-gradient(180deg, rgb(72,103,175), rgb(156,175,184), rgb(196,149,119))` | `--color-dawn-wash` | Hero background atmosphere — cool slate-blue band sitting between deeper navy and warm earth tones, suggesting pre-sunrise sky |

## Tokens — Typography

### DM Sans — Primary workhorse — body copy, nav items, buttons, list rows, tags. Weight 500 for nav/button labels, 700 for inline emphasis. At 72px it carries the hero headline; the -0.035em tracking tightens the large display set and gives the geometric letterforms a condensed, editorial posture. · `--font-dm-sans`
- **Substitute:** Inter, Manrope
- **Weights:** 400, 500, 700
- **Sizes:** 14px, 15px, 16px, 18px, 40px, 72px
- **Line height:** 1.00–1.56 (size-dependent)
- **Letter spacing:** -0.035em at 72px; 0.025em at small sizes (all-caps labels)
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** Primary workhorse — body copy, nav items, buttons, list rows, tags. Weight 500 for nav/button labels, 700 for inline emphasis. At 72px it carries the hero headline; the -0.035em tracking tightens the large display set and gives the geometric letterforms a condensed, editorial posture.

### Geist — Secondary face — used for mid-weight subheadings, card titles, and tabular UI text inside the product mockup. Geist's slightly taller x-height and geometric neutrality make it feel like UI-native body type, complementing DM Sans's warmer editorial voice without competing. · `--font-geist`
- **Substitute:** Inter, Satoshi
- **Weights:** 400, 500, 600
- **Sizes:** 14px, 16px, 18px, 24px, 32px, 36px, 48px
- **Line height:** 1.14–1.71
- **Role:** Secondary face — used for mid-weight subheadings, card titles, and tabular UI text inside the product mockup. Geist's slightly taller x-height and geometric neutrality make it feel like UI-native body type, complementing DM Sans's warmer editorial voice without competing.

### system-ui — Fallback for icon-adjacent text and rendered product UI screenshots — never appears in marketing surface · `--font-system-ui`
- **Weights:** 400, 500
- **Sizes:** 18px
- **Line height:** 1.50
- **Role:** Fallback for icon-adjacent text and rendered product UI screenshots — never appears in marketing surface

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.5 | 0.35px | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| body-lg | 18px | 1.43 | — | `--text-body-lg` |
| subheading | 24px | 1.33 | — | `--text-subheading` |
| heading-sm | 32px | 1.25 | — | `--text-heading-sm` |
| heading | 40px | 1.2 | — | `--text-heading` |
| heading-lg | 48px | 1.14 | — | `--text-heading-lg` |
| display | 72px | 1 | -2.52px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| pill | 9999px |
| tags | 9999px |
| cards | 24px |
| inputs | 10px |
| buttons | 9999px |
| iconContainers | 4px |
| largeContainers | 40px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Floating Pill Navigation
**Role:** Primary site navigation

Fixed bottom-center bar, 40px tall, 9999px radius, background #1d1d1d at ~80% opacity with backdrop blur, hairline border 1px #e5e5e5 at 10% opacity. Contains the wordmark, 3–4 nav links in DM Sans 15px weight 500 #e5e5e5, and a white pill CTA flush to the right edge. Floats with 24px margin from the viewport bottom on desktop.

### Primary CTA Button (White Pill)
**Role:** Main conversion action

Pill shape, 9999px radius, height ~40px, horizontal padding 16–20px. Background #ffffff, text #0a0a0a, DM Sans 15px weight 500. No shadow. Includes a trailing arrow glyph (→) in the same color at 14px. Sits flush inside the floating nav or stands alone on hero — never filled with color.

### Hero Display Headline
**Role:** Above-the-fold value proposition

DM Sans 72px weight 400, line-height 1.00, letter-spacing -0.035em (~-2.5px), color #ffffff. The whisper-weight choice at this size is the signature: most dark-mode SaaS sites shout at 700; Dimension speaks. Wraps to two lines, left-aligned, max-width ~520px.

### Glass Product Mockup
**Role:** Hero visual / product showcase

Rounded container, 24px radius, background #1d1d1d with backdrop-filter blur ~20px, 1px border #e5e5e5 at 8% opacity. Contains three stacked pill rows: an app-icon dock (pill 9999px, 64px tall, 5 product icons each in a 40px circular #282828 well, topped with red #ef4444-style notification badges); a status/chat row (pill 9999px, #3d3d3d background, avatar + 'Dimension' label + 'Reviewing team chats…' in #c2c2c2). The glassmorphism — translucency over a warm/cool gradient hero — does the work that shadows would in a conventional system.

### App Icon Dock
**Role:** Integration showcase within product mockup

Inner pill, 9999px radius, height ~64px, background #2a2a2a, 4px gap between icon wells. Each icon sits in a 40px square with 8px radius and #282828 fill. Notification badges are 18px circles, red, top-right, white DM Sans 11px weight 700 numeral.

### Feature List (Numbered)
**Role:** Capability enumeration on hero left column

Vertical stack with 8px row gap. Section header in DM Sans 16px weight 500 #e5e5e5. Each row: 40px tall, two-column grid (label left, ordinal right). Label is DM Sans 16px weight 400 #c2c2c2; ordinal ('01'–'05') is DM Sans 14px weight 500 #686868. Rows separated by 1px #e5e5e5 borders at 6% opacity — not dividers, just hairlines.

### Feature Bullet Row
**Role:** Hero left-column sub-points

Single-line row, 24px tall, 8px column gap between icon and text. Icon 14px stroke #b2b2b2 (unicorn-like glyphs: paw, compass, chat, lock). Text DM Sans 15px weight 400 #c2c2c2. No bullets, no chevrons — the icon is the marker.

### Status Pill
**Role:** Inline status indicator within product UI

9999px radius, height ~36px, padding 8px 16px, background #3d3d3d. Left: 20px circular avatar with 'D' monogram. Center: DM Sans 14px weight 500 #e5e5e5 'Dimension'. Right: DM Sans 14px weight 400 #c2c2c2 status text with trailing ellipsis.

### Hairline Divider
**Role:** Section separator

1px line, full container width, #e5e5e5 at 6–10% opacity. Replaces heavy borders and dividers — the system communicates separation through near-invisible lines, not contrast.

### Gradient Hero Backdrop
**Role:** Above-the-fold atmospheric background

Full-bleed band, approximately 100vh tall, gradient transitions from deep navy-blue at top (rgb(72,103,175)) through cool slate (rgb(156,175,184)) to warm earth tone at bottom (rgb(196,149,119)) — the 'pre-dawn' palette. Sits behind the glass mockup with a radial #6b62f2→#ffffff spotlight bleeding from upper-center. Below the fold, the page returns to solid #0a0a0a.

### Tag / Chip
**Role:** Inline category marker

9999px radius, height 28px, padding 6px 14px, background #1d1d1d, 1px border #e5e5e5 at 10% opacity. DM Sans 13px weight 500 #c2c2c2. Used sparingly — one or two per section, never as decoration.

### Icon Button
**Role:** Compact action trigger (close, menu, etc.)

32px square, 8px radius, background transparent, 1px border #e5e5e5 at 10% opacity on hover. Icon 16px, stroke #e5e5e5 at 60% opacity, 1.5px weight.

## Do's and Don'ts

### Do
- Use 9999px radius for every button, nav element, tag, and status pill — pill-shaped is the default interactive form
- Set text color to #e5e5e5 as the primary reading color; reserve pure #ffffff for the wordmark, icon fills, and the primary CTA background
- Use DM Sans 72px weight 400 for the hero headline with -0.035em letter-spacing — whisper-weight at display size is the signature
- Express depth through backdrop-filter blur and translucency on dark surfaces, not through shadow stacks
- Render the indigo accent (#6b62f2) only inside the hero gradient or as a radial glow — never as a solid button fill, badge background, or text color
- Separate content with 1px hairlines in #e5e5e5 at 6–10% opacity rather than contrast or spacing alone
- Anchor every hero with a glassmorphic product artifact (the floating UI mockup pattern) — text should never stand alone on the gradient band

### Don't
- Do not introduce saturated brand colors for buttons, links, or accents — the system is monochromatic by design and the indigo is atmospheric only
- Do not use box-shadows on flat dark surfaces; save the two shadow values for the floating nav and the glass mockup
- Do not use sharp corners (0–4px) on cards or containers — minimum is 10px on inputs, 24px on cards, 40px on hero artifacts
- Do not set body type below 16px or above 18px — DM Sans reads best in that window at weight 400
- Do not use color to convey hierarchy; use weight (400 → 500 → 700) and opacity (#e5e5e5 → #c2c2c2 → #686868)
- Do not place the product mockup on a solid background — it needs the gradient hero or a layered surface to read as glass
- Do not use Geist for the hero headline or DM Sans for the mockup's tabular UI text — the font swap between marketing and product is intentional

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#0a0a0a` | Base canvas — the page sits on near-black |
| 1 | Char | `#1d1d1d` | Card surface, elevated panel |
| 2 | Iron | `#3d3d3d` | Hover state, active surface |
| 3 | Slate | `#505050` | Pressed state, selected surface |

## Elevation

- **Floating Pill Navigation:** `0 8px 32px rgba(0,0,0,0.4)`
- **Glass Product Mockup:** `0 24px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)`

## Imagery

No photography or illustration beyond the product UI mockup itself. The hero atmosphere is created entirely through the dawn-wash gradient and the glassmorphic product container, which shows real rendered UI (app icons, notification badges, status row). The visual language is 'show, don't illustrate' — the product is the hero, framed as a floating glass artifact over a sky gradient. No stock photography, no abstract 3D, no decorative shapes. Iconography is monoline 1.5px stroke in #b2b2b2/#e5e5e5, extremely minimal — paw, compass, chat, lock glyphs suggest capability without being literal.

## Layout

Centered max-width container at 1200px with a two-column hero (text-left ~40%, mockup-right ~60%) on desktop. The hero sits on a full-bleed gradient band that returns to #0a0a0a below the fold. Section rhythm: 80px vertical gaps between bands, alternating full-bleed gradient → solid dark. The floating pill nav is the only persistent navigation — no top bar, no sidebar. Content density is sparse and editorial: each screen presents one idea, one headline, one visual. Card grids are 3-column at desktop, 1-column at mobile, with 24px gap. The product mockup is always the visual anchor on hero/section pages; text never stands alone without a glass artifact to its right.

## Agent Prompt Guide

**Quick Color Reference**
- background: #0a0a0a
- surface (card): #1d1d1d
- border: #e5e5e5 at 8–10% opacity
- text primary: #e5e5e5
- text secondary: #c2c2c2
- accent: #6b62f2 (indigo, gradient-only — never solid)
- primary action: #ffffff (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #ffffff background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. *Hero headline.* DM Sans 72px weight 400, line-height 1.00, letter-spacing -2.5px, color #ffffff, left-aligned, max-width 520px. Sits above a feature list on a 1200px max-width centered column.

3. *Glass product mockup.* 24px radius container, bg #1d1d1d at 85% opacity, backdrop-filter blur(24px), 1px border #e5e5e5 at 8% opacity, padding 24px, shadow 0 24px 48px rgba(0,0,0,0.35). Contains an inner app-icon dock: 9999px radius pill, 64px tall, bg #2a2a2a, 5 circular icon wells (40px, 8px radius, #282828 fill) separated by 4px gap, each topped with an 18px red notification badge.

4. *Numbered feature list.* Vertical stack, 8px row gap. Header DM Sans 16px weight 500 #e5e5e5. Each row: 40px tall, two-column grid (label DM Sans 16px weight 400 #c2c2c2 left, ordinal '01'–'05' in DM Sans 14px weight 500 #686868 right). Rows separated by 1px #e5e5e5 hairlines at 6% opacity.

5. *Gradient hero backdrop.* Full-bleed band, 100vh on hero, linear-gradient(180deg, rgb(72,103,175) 0%, rgb(156,175,184) 50%, rgb(196,149,119) 100%) with an overlaid radial-gradient(50% 50% at 50% 35%, rgba(107,98,242,0.565) 0%, rgba(255,255,255,0) 100%) bleeding from upper-center.

---

## App Patterns (mobile PWA — added as screens are built)

> **Status note (2026-07-01):** Genkin's styling is being migrated onto
> [shadcn/ui](https://ui.shadcn.com), using a specific preset theme
> (`ui.shadcn.com/create?preset=brpK&template=vite`) rather than reskinning
> shadcn to match the dark-glassmorphic identity described below. That
> preset's own colors, radius, and font tokens are the new source of truth —
> see **Implemented Theme (Genkin)** and **shadcn Components (Genkin)**
> further down, which supersede the color/radius/glassmorphism specifics in
> the patterns below. The *role* each pattern plays (what it's for, where it
> appears) still holds; only the visual treatment (colors, pill radii, glass
> blur) is being replaced screen-by-screen as the migration proceeds.

### Avoid rounded chips
**Role:** House rule for any new selection UI (choosing one item from a list of options)

Don't reach for the rounded `Chip` pill (`src/components/ui/chip.tsx`) for
new selection controls — prefer the bordered/divided vertical row-list
pattern already used by the Filter Drawer, Month Drawer, and Category
Picker (`overflow-hidden rounded-lg border border-border` container, rows
`border-b border-border last:border-b-0`, `px-4 py-3.5`, label left, `Check`
icon right when selected). Chips were tried for exactly this — category
selection, filters, months — and dropped every time for the same reason:
rounded pills scan poorly once there's more than a couple of options,
whereas a vertical list reads top-to-bottom like normal text. The `Chip`
component itself has been removed from the codebase since nothing uses it
anymore; if a genuinely chip-shaped need comes up (e.g. a small always-
visible multi-select tag row with very few options), re-add it deliberately
rather than resurrecting the deleted file, and document why the row-list
didn't fit here first.

### Expense List Row
**Role:** Single item in the shared expense log

Full-width row, 64px min-height, horizontal padding 20px, vertical padding 14px. Layout: icon well (36px circle, #282828 fill, 8px radius, emoji centered at 18px) | text stack (category name in #e5e5e5 16px weight 500 on line one; meta line in #686868 14px on line two: description + " · " + payer ("You" or partner's display name), or just the payer if no description) | amount (#e5e5e5 Geist 16px weight 500, tabular-nums, right-aligned). Rows separated by 1px #e5e5e5 hairlines at 6% opacity. The row itself is not a tap target for editing — a plain tap only closes an already-open swipe reveal (see below); editing is reached exclusively through the revealed Edit button.

**Swipe-to-reveal actions (`ExpenseRow.tsx`):** no persistent edit/delete affordance on the row — swiping left reveals two fixed-width (76px each, `ACTION_WIDTH`) action buttons stacked side by side underneath, both positioned via `absolute inset-y-0`: Edit (`bg-secondary text-secondary-foreground`, `PencilSimple` icon) sits immediately left of Delete (`bg-destructive/15 text-destructive`, `TrashSimple` icon, `right-0`), Edit anchored at `right: ACTION_WIDTH` so there's no gap between them. The row's own content slides left via `transform: translateX()` to expose both, clamped to the combined reveal width (`SWIPE_WIDTH = ACTION_WIDTH * 2`). Implemented with the same manual pointer-event pattern as the bottom sheet's drag-to-dismiss (see below): `onPointerDown`/`onPointerMove`/`onPointerUp`, committing to a horizontal drag only once movement exceeds an 8px threshold *and* is more horizontal than vertical (so vertical list scrolling is never hijacked). Releasing past 50% of the reveal width snaps open; short of that, snaps closed. A tap with no committed drag only closes an already-open row — it never opens the edit sheet; there is no tap-to-edit. This is deliberate beyond just the affordance change: on PWA, a vertical scroll gesture that starts on a row bails out of the drag mid-move (`dragRef.current = null`, since the motion read as more vertical than horizontal), and the old tap-to-edit branch couldn't distinguish that bail-out from a genuine plain tap on `pointerup` — so scrolling the list would intermittently pop the edit sheet open. Removing tap-to-edit entirely removes that code path, and with it the bug. Only one row can be swiped open at a time, tracked by `LogPage` (`openSwipeRowId`), so opening another row, the Filter drawer, the month dropdown, or the Add sheet all close whichever row is open first. Tapping the revealed Edit button opens the edit sheet directly (bypassing the drag/tap gesture logic — a plain `onClick`) and closes the swipe reveal. Tapping the revealed Delete button still opens the shared confirmation `Dialog` (page-level, not one per row) before calling delete — never a silent swipe-and-delete, since this may be a shared log.

**Edit mode (multi-select delete):** entered by long-pressing any row (`useLongPress`, `src/hooks/useLongPress.ts`) from its resting, fully-closed position — holding still for ~500ms enters edit mode with that row pre-selected; there is no toolbar button for this anymore. The long-press timer is armed on `pointerDown` and cancelled the moment movement exceeds the same 8px commit threshold used by the swipe gesture below, so a swipe reliably wins over a long-press and vice versa — the two gestures can never both fire for the same press. While edit mode is active, the row abandons the swipe/drag gesture entirely — no transform, no revealed trash panel — and renders statically with a shadcn `Checkbox` (`checked`, `pointer-events-none`, purely visual) prepended before the icon well. The whole row is a single tap target (`role="button"`) that toggles that row's id in and out of `LogPage`'s `selectedIds` array, the same `string[]` toggle shape as the Filter Drawer's category multi-select. No per-row delete action in this mode — selection only feeds the toolbar's bulk "Delete" button (see Bottom Toolbar below). The swipe-reveal Edit (pencil) button is unaffected by any of this — it still opens the single-expense edit sheet exactly as described above.

### Amount Display
**Role:** Numeric money values throughout the app

Always Geist font, `font-variant-numeric: tabular-nums`, weight 500. List row amounts: 16px. Form input amounts: 32px centered. Neutral expense amounts: `--color-bone` (#e5e5e5).

Every amount is prefixed with the space's selected currency symbol (`Rp`, `$`, `€`, …), set via the Currency Drawer on Settings (see below) and defaulting to Indonesian Rupiah. Formatting (decimal places, thousands/decimal separator) is per-currency, not a single global style — e.g. Rupiah renders with no decimals and a period thousands-separator (`Rp 150.000`), while USD/EUR render with 2 decimals and a comma thousands-separator (`$ 150.00`). See `src/lib/currencies.ts` for the per-currency formatting table and `formatCurrency()` in `src/lib/format.ts` for the formatter.

**Rolling animation (`AnimatedAmount.tsx`):** on surfaces where the number can change while on screen — the Dashboard/Log headline totals, remaining/over-budget amounts, daily pace, projected total, and per-person You/Partner spend — amounts roll their digits via [`@number-flow/react`](https://number-flow.barvian.me/) instead of snapping to the new value, matching the app's live/shared-log nature (a partner's edit can update your screen through Realtime). Same Geist/tabular-nums/weight-500 look; the currency symbol stays static text (NumberFlow only wraps the numeric part). NumberFlow formats via `Intl.NumberFormat` rather than the hand-rolled separators above, so each `Currency` in `currencies.ts` carries a `locale` (`id-ID` for Rupiah, `en-US` for the rest) chosen specifically because its grouping/decimal separators match this app's convention exactly. `formatCurrency()` remains the plain-string formatter for every other surface (category breakdown, "who paid" split, list-row amounts, CSV export, aria-labels) — not every amount needs to animate, only the ones likely to change in place.

The Add/Edit form's amount display (`AddExpenseSheet.tsx`) uses the same
`NumberFlow` with its library-default timing (no per-instance overrides). This
form's entry model is cents-first (see Amount Keypad below): every keystroke
shifts *every* digit position over by one place, so NumberFlow's diffing sees
all digits as "changed" and rolls the whole number at once — there's no
NumberFlow prop to isolate "only the newest digit animates" the way SwiftUI's
`contentTransition(.numericText())` does per-character (`digits` only
reserves width, it doesn't gate animation per position). A faster,
`ease-out`-tuned `transformTiming`/`spinTiming`/`opacityTiming` (200-300ms,
vs. the ~900ms spring default) was tried to make the whole-number roll feel
less busy, but was reverted — it read as worse than the default, not better,
so this instance is back to the same untuned timing as every other
`NumberFlow` usage in the app rather than a bespoke override.

### Amount Keypad
**Role:** Amount entry in the Add/Edit Expense sheet (`NumericKeypad.tsx`), replacing a free-text input

A calculator-style on-screen keypad, part of the sheet's pinned action
footer below the Category/Save row (see Bottom Sheet below) rather than
directly under the amount display it edits — 3-column grid, `1 2 3 / 4 5 6 / 7 8 9 / 000 0 ⌫` (Phosphor `Backspace` icon), each key a 56px (`h-14`) tap target — above the app's 48px minimum — `font-heading` digits, `hover:bg-muted`/`active:bg-muted` feedback, no borders between keys (the grid gaps alone separate them). Digits enter cents-first (Venmo/Cash App style): each tap shifts the value up from the smallest currency unit, so the display is always a complete, correctly-formatted number and every keystroke is a clean `NumberFlow` transition rather than editing a raw decimal string (see `src/lib/amountUnits.ts`). The bottom-left key is `000` rather than a decimal point — decimal placement is automatic, so a `.` key would have no function — giving a fast-entry shortcut for round amounts instead of an inert placeholder. It routes through `appendDigits(units, '000')`, a small helper in `amountUnits.ts` that folds the multi-character tap through the existing single-digit `appendDigit` one character at a time, so leading-zero collapse still applies the same way it would for three individual `0` taps rather than a raw string concat.

### Bottom Toolbar (Logs, Stats)
**Role:** Add action + page switching, fixed to the bottom of the Logs and Stats screens

Fixed full-width row at the viewport bottom, `justify-between`, 20px horizontal padding, respecting `env(safe-area-inset-bottom)`. All controls share one height — 48px (`h-12`) — so they read as a single action group despite the Add button being icon-only and the switcher carrying text: Left: the Add button, `size="icon"` shadcn `Button` sized to 48×48 (`size-12`) — **square, not pill**, since the implemented theme's `--radius: 0` makes the default `rounded-lg` render as sharp corners; this is the current square button style, superseding the old pill-shaped FAB. Right: the Page Switcher trigger (see below) — current page name + trailing `CaretDown`, `h-12 px-4`, same `bg-primary`/`text-primary-foreground` white-on-dark treatment as the Add button. Filter and Month have moved to the Top Nav (see Mobile Top Nav below) and no longer live here; the Filter button's old "1 · Filter" active-count label convention is retired along with it — the Top Nav's filter icon shows a small dot instead. No background/blur behind the row — the buttons float directly over the scrolling list, which carries `pb-24` so the last row always clears them.

**Edit mode:** entered by long-pressing a log row (see Expense List Row above) rather than a toolbar tap. Once active, the toolbar swaps into a two-control layout — left: the Add button becomes an `X` (`size="icon"`, same 48×48 square) that exits edit mode and clears the selection; right: the Page Switcher is replaced by a single `variant="destructive"` `Button`, label "Delete" (or `` `Delete (${n})` `` once rows are selected), `disabled` while nothing is selected. Tapping it opens a confirmation `Dialog` (same pattern as the single-expense delete dialog, pluralized copy), and on confirm exits edit mode, clears selection, and refetches the list. This is the only place a red/destructive-tinted button appears in the toolbar; every other toolbar control stays on the primary white-on-dark treatment described above. Edit mode itself, and this Delete control, are Logs-only — Stats never shows it.

**Solid toolbar buttons only (scoped override):** the toolbar floats with no background behind it (see above), so the shared `Button` component's default opacity-based states — `destructive`'s `bg-destructive/10`, its base `disabled:opacity-50`, and `default`'s `hover:bg-primary/80` — read as washed-out/transparent here, even though they look fine elsewhere (e.g. inside the opaque confirmation dialogs). Toolbar buttons override all three to stay solid: the `Delete` button forces `bg-destructive text-white` instead of the soft/tinted default; its disabled state (nothing selected) overrides `disabled:opacity-50` with `disabled:opacity-100 disabled:brightness-75 disabled:saturate-50` — a muted, desaturated solid rather than a see-through one (note: a `color-mix`-based disabled background, mirroring the `secondary` variant's hover treatment below, was tried first but the browser didn't resolve the doubly-nested `:disabled` + `@supports` rule, so this uses flat `filter` utilities instead, same technique as the hover fix); every `default`-variant toolbar button (Add/X, Page Switcher) overrides hover from `hover:bg-primary/80` to `hover:bg-primary hover:brightness-90` — full-opacity background plus a `brightness` filter, which darkens the already-opaque button instead of blending with whatever's behind it. This is a toolbar-only override (`BottomActionBar.tsx`'s `TOOLBAR_SOLID_HOVER` constant, threaded into the Page Switcher trigger via a `triggerClassName` prop) — the shared variants in `button.tsx` are unchanged, so the confirmation dialogs' `destructive` buttons keep their existing soft-red treatment.

### Page Switcher Bar (Settings, Activity)
**Role:** Reach the other 3 first-level screens from Settings or Activity, which have no Add/Filter/Month actions of their own

A slim version of the Bottom Toolbar above containing only the Page Switcher trigger, right-aligned (`justify-end`) instead of `justify-between` since there's nothing on the left. Same fixed positioning, height, and safe-area padding as the full toolbar, so the switcher sits at the same screen position on every first-level page. `PageSwitcherBar.tsx`; page content underneath carries `pb-24` the same way the Logs/Stats lists do.

### Page Switcher (popup menu)
**Role:** Jump directly between the 4 first-level screens (Logs, Activity, Stats, Settings) from any of them

Trigger: current page's name + trailing `CaretDown`, styled identically to the old Month Drawer trigger it replaced in the Bottom Toolbar's right slot (`gap-1.5`, `h-12 px-4`, `triggerClassName` override for the toolbar's solid-hover treatment). Tapping it opens a `DropdownMenu` (`src/components/ui/dropdown-menu.tsx`, a shadcn-style wrapper around radix-ui's `DropdownMenu`) rendered as a **stacked popup**, not a single flat list surface: each of the 4 pages is its own row, right-aligned, in fixed order (Logs, Activity, Stats, Settings) regardless of which page is current — rows sit flush against each other with **no gap between them** (reads as one contiguous stack, not a set of separate floating cards); the gap only appears once, between the bottom of the stack and the trigger button below it (`sideOffset={12}` on the content). Every row shares the same solid `bg-popover ring-1 ring-foreground/10 shadow-md` treatment and **sharp corners** (`rounded-none` — this popup follows the app's `--radius: 0` theme like everything else; it does not get a rounded-corner exception) — no per-row fade or width step, since a decreasing-opacity/decreasing-width cascade was tried and reads as a cheap "stack of cards" effect rather than a clean menu. Each row's width hugs its own label (`w-fit`) rather than a shared fixed width, so "Settings" is wider than "Logs" purely because the word is longer. The current page's row is marked with a small `size-2 rounded-[3px]` dot in `--color-success` plus bold `text-foreground`; every other row is plain `text-muted-foreground` — the dot follows whichever page is active, independent of the row's fixed stack position. Selecting a row plays `'tab-switch'` and navigates.

**Sound on open, not on click:** the trigger does *not* use an `onClick` sound handler — Radix's `DropdownMenuTrigger` opens on `onPointerDown` and calls `event.preventDefault()` when it does, which suppresses the browser's synthesized `click` event that would normally follow on touch/pointer input, so an `onClick`-based sound would silently never fire on the exact gesture that opens the menu. Instead `PageSwitcher` holds `open` as controlled state and plays `'tap'` from its `onOpenChange` handler whenever `next` is `true` — reliable regardless of input type, and it doesn't double-fire on close.

**Blur backdrop:** opening the menu blurs the page content and the Top Nav behind it, but **not** the Bottom Toolbar / Page Switcher Bar the trigger itself lives in — that stays sharp on top, matching the reference (the Add button and the trigger are never blurred). Implemented as a full-viewport `fixed inset-0` overlay (`bg-background/20 backdrop-blur-md`), portaled to `document.body` at `z-[55]` — above Top Nav's `z-50` (so Top Nav blurs), below the popup content's own `z-[60]`. `PageSwitcher` accepts an `onOpenChange` prop that `BottomActionBar`/`PageSwitcherBar` use to lift their own `z-30` to `z-[56]` **only while the switcher is open** — a permanent bump was tried first but put the toolbar above every other `z-50` surface in the app (Sheet, Dialog) even when the switcher wasn't in use, so an in-progress Add Expense sheet rendered underneath the toolbar's Add/switcher buttons instead of the reverse. Tapping the overlay closes the menu the same as tapping outside the popup normally would. `PageSwitcher.tsx`, mounted in the Bottom Toolbar (Logs/Stats) and the Page Switcher Bar (Settings/Activity).

### Bottom Sheet
**Role:** Add/edit expense form, slides up from bottom

Full-width panel anchored to viewport bottom. Top corners 24px radius, bottom 0. Glass surface (#1d1d1d at 92% opacity, backdrop blur 24px, 1px #e5e5e5 at 8% top border). Max-height 90vh, scrollable. Handle bar: 36×4px pill, #3d3d3d, centered 12px from top. Header row: title (DM Sans 18px weight 500 #e5e5e5) left, close button (ghost icon, 32px) right. Dark backdrop behind: rgba(0,0,0,0.6). Slide-up animation: 280ms ease transform.

**Drag-to-dismiss (implemented in `sheet.tsx`):** the whole sheet is
draggable, not just the handle — matching native bottom-sheet apps where you
can grab anywhere on the sheet body. A press-and-drag down commits to
dragging the sheet only once movement exceeds a 6px threshold *and* the
sheet's own scrollable body is at `scrollTop <= 0`; otherwise the same
downward motion scrolls the form as normal. Most sheets scroll via
`overflow-y-auto` on `SheetContent` itself, so this check reads
`SheetContent`'s own `scrollTop`. A consumer that instead splits its content
into an independently-scrolling region plus a non-scrolling pinned section
(see the Add/Edit form's pinned action footer below) tags its scrollable
descendant with `data-sheet-scroll`; if present, `sheet.tsx` checks *that*
element's `scrollTop` instead, since the outer `SheetContent` in that layout
never scrolls itself and would otherwise always read `0`. This means a drag
started mid-scroll naturally hands off to dismiss-dragging the moment the
content reaches its top edge, and a plain tap/scroll never gets hijacked. Once
committed, the sheet translates via `transform: translateY()`, released
either on distance (25% of sheet height, clamped 80–200px) or on flick
velocity (>0.5px/ms). The 36×4px handle pill (`bg-muted-foreground/30`,
shadcn token, not the raw `#3d3d3d` hex above) is a purely visual affordance
inside this same draggable area, with its own `touch-action: none` for an
immediate, guaranteed grab right where the affordance is drawn. Only
`side="bottom"` sheets get this; `left`/`right`/`top` sheets are unaffected.
Dismissal fires through a hidden `SheetPrimitive.Close` ref (`.click()`),
called synchronously (no `setTimeout`) so it reuses the same `onOpenChange`
path as the visible close button — no new prop needed on `<Sheet>` consumers.
A deferred click was tried first and caused a real bug: it left a window
where the sheet was still "open" from Radix's perspective (just visually
dragged off-screen), so reopening inside that window would get silently
closed again moments later when the stale timeout finally fired.

**Reopen-after-dismiss reset:** Radix mounts/unmounts the sheet's DOM node on
its own internal Presence timing — a commit that doesn't necessarily coincide
with *this* component re-rendering. A `useEffect`/`useLayoutEffect` watching
`data-state` can therefore miss the actual open transition entirely, leaving
the previous dismissal's drag offset applied to a sheet that looks freshly
reopened (it renders pre-dragged-away, or appears to "auto-dismiss" itself).
The fix is a `MutationObserver` on `data-state`, attached via the content
element's ref callback — tied directly to the real DOM mutation regardless of
which component's render triggered it, so it reliably resets drag state the
moment the sheet is genuinely open again.

**PWA pull-to-refresh conflict:** since Genkin runs installed as a standalone
PWA, an unguarded swipe down from the top of the page invokes the OS/browser
pull-to-refresh gesture, which competes with any downward drag gesture in-app.
Two guards, both required:
- `overscroll-behavior-y: contain` on `html, body` ([index.css](src/index.css))
  stops the refresh/rubber-band chrome gesture from firing app-wide, not just
  inside the sheet.
- The sheet's scrollable body additionally sets `overscroll-contain`
  (Tailwind's `overscroll-behavior: contain`) so scrolling the form to its top
  edge doesn't chain into a page-level bounce. Radix's own scroll lock
  (`react-remove-scroll`, applied automatically while the sheet is open)
  handles the rest by blocking touchmove outside the sheet's scrollable area.
  In the Add/Edit form, this lives on the inner `data-sheet-scroll` region
  rather than `SheetContent` itself (see the pinned action footer below).

**Add/edit form layout (`AddExpenseSheet.tsx`):** no visible sheet chrome at
the top — `showCloseButton={false}` drops the `X`, and `SheetTitle` is kept
only as a `sr-only` node (Radix requires an accessible title for
`aria-labelledby`; it just isn't rendered visually). The drag handle plus
drag-to-dismiss (see below) and tapping the overlay/pressing Escape are the
only ways to close it — there's no dedicated close affordance, mirroring the
Filter/Month drawers' full-bleed content. In place of the old header sits a
**Date/Payer/Recurring Segmented Row**: one bordered rectangle (`rounded-lg
border border-border`, `overflow-hidden`) split into segments by internal
`border-r` dividers — first segment opens the date `Popover`/`Calendar`
(trailing `CaretDown`), second toggles who paid on tap (trailing
`CaretRight`, disabled with no partner), and a third — present only when the
expense isn't already part of a recurring series — opens the Recurring
dropdown (see below). The container is `inline-flex` and the segments size
to their own content (no `flex-1`) — the row is meant to read as a compact
control sitting in the corner, not a full-width bar, matching the
Filter/Month toolbar buttons' proportions rather than stretching edge to
edge. No segment uses `Chip` — chips read as filter/selection pills
elsewhere in the app, and this row is a direct-action control, not a
selection, so it gets the same bordered rectangle language as buttons
instead. Below that, the amount and description are grouped in their own
`space-y-2` (8px) wrapper rather than relying on the scrollable region's
outer `space-y-4` (16px) rhythm — Tailwind's `space-y-*` applies `margin-top`
to later siblings via a `:not([hidden]) ~ :not([hidden])` selector, which
outranks a plain utility class on the child, so getting a tighter gap for
just this one pair meant nesting them in their own spacing scope rather than
fighting that specificity with `!important`. Inside the wrapper: the amount,
given `pt-6` (24px) of breathing room above so it doesn't feel squeezed
against the segmented row (no bottom padding — the wrapper's own `space-y-2`
supplies the gap down to the description field), and a tight `gap-1` (4px)
between the currency symbol and the figure so they read as one unit rather
than two separate elements; a borderless, center-aligned `Input` for
description (`border-transparent bg-transparent text-center
dark:bg-transparent`, `h-12`/48px height retained — a taller `h-[72px]` was
tried and looked oversized/disproportionate for a single-line field, so it
stayed at the default) so it reads as an extension of the amount display
rather than a separate boxed field, sitting directly beneath it — no
`Label` above it, the placeholder carries the meaning, though an
`aria-label="Description"` keeps it named for screen readers. The focus-visible
ring is deliberately suppressed here too (`focus-visible:border-transparent
focus-visible:ring-0`, overriding the base `Input` component's default focus
treatment) — tapping into the field stays visually identical to its resting
state, matching the "reads as an extension of the amount display" intent
rather than a distinct form field. This is a one-off override scoped to this
input instance; the shared `Input` component's default focus-visible styling
is unchanged for every other consumer. The "Split" feature (the old evenly-split-expense toggle, its
`expenses.split` column, and the Balance screen that read it) has been
removed entirely — not just hidden from the UI. There is no split state to
track in this form anymore.

**Scrollable region + pinned action footer:** the form's body is split into
two flex children of `SheetContent` (which is given `flex flex-col
overflow-hidden` instead of scrolling itself): an upper region (segmented
row, amount, description, the already-linked recurring note) with `flex-1
min-h-0 overflow-y-auto overscroll-contain` and a `data-sheet-scroll`
attribute (see Drag-to-dismiss above), and a lower `shrink-0` footer —
`border-t border-border` above it for separation — holding the Category
button + Save `Button` row, the error message, `NumericKeypad`, and (edit
mode) the Delete button. The footer is a normal flex sibling sized to its
own content, not `position: sticky`/`fixed` — CSS sticky doesn't actually
keep a bottom-anchored element visible from initial scroll position when
it's the last item in a scrolling container (it only pins once you've
scrolled *past* it), so a plain flex layout with the scrollable region
alone taking `flex-1` is what guarantees the footer — Category/Save and the
keypad in particular — is always fully visible with zero scrolling,
regardless of device height or whether the on-screen keyboard is open
(shrinking the visible viewport while Description is focused). Only the
upper region (segmented row/amount/description) ever needs its own internal
scroll on very short viewports; the category trigger used to be a `Chip`
too, now it's a bordered `Button` so it visually reads as the same weight of
control as "Add expense"/"Save changes" beside it, just secondary instead of
primary.

**Recurring dropdown:** the third segment of the row above, labeled "🔁
Recurring" while off, current frequency label ("🔁 Monthly") while on — same
`bg-secondary text-secondary-foreground` treatment `Chip`'s selected state
uses elsewhere, plus a trailing `CaretDown` (matching the date segment) since
tapping it opens a `Popover` rather than toggling in place. The `PopoverContent`
(`align="end"`, `w-auto p-0`) holds the same bordered/divided row-list pattern
as the Filter Drawer (`rounded-lg border border-border`, rows with `border-b
border-border last:border-b-0`, `px-4 py-3.5`, trailing `Check` when
selected) with **four** rows — "None", "Weekly", "Monthly", "Yearly" —
merging the old on/off toggle and the frequency choice into one control:
picking "None" sets `isRecurring` false, picking a frequency sets
`isRecurring` true and the chosen value, and either selection closes the
popover. This replaced an earlier version where the segment was a plain
toggle and the Weekly/Monthly/Yearly list rendered inline below the
Description field whenever recurring was on — that inline list permanently
pushed the rest of the form down any time recurring was active, whereas the
popover keeps the row-list visible only while open, reusing the date field's
existing `Popover` primitive rather than introducing shadcn's unused
`Select` or a native `<select>` (both were already tried and dropped
elsewhere in the app for the Month Drawer, for the same "reads poorly"
reason chips were dropped). If the expense being edited is already linked to
an active series, the third segment doesn't render at all (row goes back to
two segments) and a static muted line takes its place below the description
field instead ("🔁 Recurring · Monthly — manage this from Upcoming on the Log
page") — editing or stopping an existing series only happens from the
Upcoming list, not from an individual generated expense, to avoid
this-vs-all-future edit ambiguity.

**Date picker:** the date segment opens a `Popover` + `Calendar` (shadcn
primitives, added via `shadcn add popover calendar` — pulls in `react-day-picker`
and `date-fns` as new dependencies, both free/client-side, no cost concern).
An earlier version tried a `<label htmlFor="date">` wrapping a visually-hidden
native `<input type="date">`, relying on label→input association to trigger
the OS picker — this didn't reliably open on tap, hence the switch to a real
calendar UI. `expense_date` is stored as a plain `YYYY-MM-DD` string;
conversion to/from the `Calendar`'s `Date` object is done via local
year/month/day getters (`toISODateLocal`/`parseISODateLocal` in
`AddExpenseSheet.tsx`), not `toISOString()`/direct date-string parsing —
both of those are UTC-based and can silently shift the date by one day
depending on the viewer's timezone offset.

**Nested-overlay dismissal:** the category picker (a second, sibling `Sheet`)
and the date picker (a `Popover`) both stack on top of the add/edit sheet
without being JSX descendants of it — so Radix's dismissable-layer doesn't
recognize either as "inside" the outer sheet, and a tap inside them reads as
an outside-click that would otherwise close the outer sheet too. The fix is
an `onPointerDownOutside` handler on the outer `SheetContent` that inspects
the event's actual target — `target.closest('[role="dialog"]')` for the
nested sheet, `target.closest('[data-slot="popover-content"]')` for the
popover — and calls `event.preventDefault()` if the "outside" click actually
landed inside either. Checking local state (e.g. a `categoryPickerOpen`
boolean) instead of the DOM doesn't work here: selecting a category flushes
its own "now closed" state before the outer sheet's outside-click handler
runs, so a state read at that point is already stale.

### Category Picker
**Role:** Category selector, opened from the add/edit form's category button as
its own nested bottom `Sheet` (a second, independent `Sheet`/`SheetContent`
instance, not inline in the form)

Same bordered/divided vertical row-list as the Filter Drawer below — one
`overflow-hidden rounded-lg border border-border` container, each row
`border-b border-border last:border-b-0`, `px-4 py-3.5`, icon + name left, a
`Check` icon right when selected. Single-select, direct-action (no
Reset/Apply footer) — tapping a row sets the category and closes the sheet
immediately, same as the Month Drawer. This used to be a 2-row scrollable
strip of rounded `Chip` pills; switched to match the Filter/Month row-list
for the same reason those two dropped chips — vertical lists scan better
once there are more than a couple of options, and it keeps every selection
surface in the app using one consistent pattern. See **Avoid rounded chips**
below.

A final row, "+ Add category" (`Plus` icon, `text-muted-foreground` instead
of the selectable rows' `text-foreground` so it reads as a secondary
utility action rather than another option), sits after the last category
at the bottom of the same bordered list — same padding/border/tap-target,
just a different text color. Tapping it closes the Category Picker and
opens the Add Category Sheet below.

### Add Category Sheet
**Role:** Add a custom category, opened via the "+ Add category" row at
the bottom of the Category Picker above — `AddCategorySheet.tsx`

Same shape as the Change Password / Change Username sheets: bottom `Sheet`,
`SheetHeader`/`SheetTitle` ("Add category"), a `Cancel`/`Save`
`SheetFooter`. Two fields in the form body: a standard Form Field `Input`
for the name (required, 24-char max, same `h-12` sizing as Change
Username's name field), and a bordered trigger row below it — same `h-12`,
`rounded-[10px] border border-border`, Form-Field-matching background
(`#1d1d1d`) — showing the currently chosen emoji plus "Choose an emoji" /
"Change emoji", that expands the Emoji Picker (below) directly beneath it
when tapped, rather than opening a further nested sheet. Save is disabled
until both a non-empty trimmed name and an emoji are set; a
case-insensitive duplicate-name check against every category currently
visible to the user (bootstrap + the space's own custom categories) blocks
Save with an inline error, matching the destructive-text inline-error
convention used by the Add/Edit Expense form. On save, the new category is
immediately selected in the Add/Edit Expense form and both the Add
Category sheet and the Category Picker sheet close, returning the user
straight to the expense form.

Custom categories are visible to, and usable by, both members of a
space — not private to their creator — since both people log expenses
against the same category set (see `is_space_mate()` in
`supabase/migrations/0014_spaces_ownership_model.sql`, applied to
`categories` in `0018_custom_categories.sql`). This is add-only: there is
no edit or delete UI for any category (bootstrap or custom) in this pass.

### Emoji Picker
**Role:** Emoji selection inside the Add Category Sheet —
`emoji-picker-react`, dynamically imported (`React.lazy`) only once the
picker trigger is tapped, so it never adds to the initial bundle

Third-party grid widget, not a Genkin-built component, so the "Avoid
rounded chips" row-list rule doesn't govern its internal layout (a grid of
emoji tiles with its own search/category-tab UI is a fundamentally
different, non-text-list interaction). What *is* Genkin-styled is its
container: wrapped in the same `overflow-hidden rounded-lg border
border-border` frame used for other embedded dropdown content in the app
(e.g. the Recurring frequency dropdown in `AddExpenseSheet.tsx`), rendered
with `theme="dark"`, `previewConfig={{ showPreview: false }}` (no bottom
preview strip, to keep the footprint compact inside the sheet), and
`width="100%"` so it fills the sheet's content width rather than the
package's default fixed pixel width. No skin-tone or emoji-style options
are exposed — defaults are used as-is, since Genkin's own icon set
elsewhere in the app is single-style native emoji with no skin-tone
variation.

### Filter Drawer
**Role:** Category and payer filter on the Log screen, opened from a "Filter" button in the toolbar row

Bottom `Sheet` (same primitive/pattern as the Add/Edit Expense sheet — a sibling `Sheet` instance, not nested inline). Contains a "Paid by" list and a "Category" list, each under a small uppercase label — **vertical selectable lists, not `Chip`/pill rows**: chips were tried first but read poorly for scanning multiple options, so both groups render as a bordered, divided stack of full-width rows (`rounded-lg border border-border`, each row `border-b border-border last:border-b-0`, `px-4 py-3.5`), label left, a `Check` icon right when selected. "Paid by" is single-select (tapping the already-selected row clears it back to no filter). "Category" is **multi-select** — tapping toggles that category in/out of a `string[]`, any number can be active at once. Selections are staged locally and only committed on tap. Follows the same scrollable-region-plus-pinned-footer layout as the Add/Edit form (see **Scrollable region + pinned action footer** under Bottom Sheet above): `SheetContent` is `flex flex-col overflow-hidden` rather than scrolling itself, `SheetHeader` stays `shrink-0` at the top, the Paid-by/Category lists live in a `flex-1 min-h-0 overflow-y-auto overscroll-contain` region tagged `data-sheet-scroll`, and the two-button footer (`SheetFooter`, row layout, `shrink-0`, `border-t border-border` above it for separation) holds "Reset" (secondary `Button`, clears both filters and closes) and "Filter" (primary `Button`, applies the staged selections and closes) — always visible without scrolling, regardless of how many categories/members there are. The "Filter" toolbar button reflects active-filter count in its own label ("1 · Filter", "2 · Filter" — category selections and the payer selection each count toward the total) rather than a separate dot indicator.

### Month Drawer
**Role:** Filter the Log screen to a single month, shown next to the Filter button

Same `Sheet` + vertical list pattern as the Filter Drawer above (not a native `Select`, and not `Chip`/pill rows either — both were tried and dropped for the same readability reason). The trigger is a plain `Button` (`h-12 px-4`, trailing `CaretDown`) showing the current month; tapping it opens a bottom `Sheet` titled "Month" containing the same bordered/divided row-list component as the Filter Drawer, one row per available month — tapping a row selects it and closes the sheet immediately (single-select, no Reset/Apply footer — picking a month is a direct action, not a staged one). Options are generated dynamically from the distinct months present in the space's `expense_date` values (not a static calendar list) — sorted most-recent-first, defaulting to the most recent month with data. Label shows just the month name ("October"), or "Month Year" if the space's history spans more than one calendar year.

### Settings Screen
**Role:** Account, currency, budget, space-invite, leave/switch, and import entry points, all on one screen (`SettingsPage.tsx`)

Restyled from six separate `Card`s (one per section) to a single iOS-Settings-style grouped list — one `overflow-hidden rounded-lg border border-border` container holding every row, divided by `border-b border-border last:border-b-0` hairlines, each row `px-4 py-3.5` — the exact same container/row classes as the Filter Drawer, Month Drawer, and Category Picker row-lists above, reused here instead of introducing a new "settings row" pattern. No section headers or sub-grouping; it's one flat list, top to bottom: Account, Profile photo, Your name, Change password, Currency, Monthly budget, Sound effects, Volume, Invite code, Import expenses, Join a different space, Leave this space (conditional). Sign out stays outside the list as a full-width `secondary` `Button` below it, unchanged from before the relayout.

Six row variants share the list:
- **Navigable/editable row** (Your name, Change password, Currency, Monthly budget, Import expenses, Join a different space): the whole row is a `<button>`, label left (`text-base text-foreground`), and — when there's a current value worth surfacing (Currency's `{symbol} {name}`, Monthly budget's formatted amount) — that value in `text-muted-foreground text-sm` immediately before a trailing `CaretRight`. Change password, Import expenses, and Join a different space have no value, just the chevron. Tapping opens the corresponding sheet/drawer (Change Password Sheet, Monthly Budget Sheet, Currency Drawer, Switch Space Sheet) or navigates (`/import`).
- **Inline toggle row** (Sound effects): same `<button>` shape as the navigable row, but tapping flips a boolean immediately in place instead of opening a sheet — no `CaretRight`, just an "On"/"Off" label in `text-muted-foreground text-sm` that updates on tap. Used for the one setting (see "Sound & Feedback" above) that's a single persisted flag with no further sub-options, so a whole drawer would be overkill.
- **Inline slider row** (Volume): a plain `<div>` (not a button — the interactive element is the slider itself), label left, a `Slider` (`src/components/ui/slider.tsx`, wrapping `radix-ui`'s Slider primitive — track `bg-muted`, filled range and thumb `bg-primary`) capped to `w-32` on the right rather than stretching the full row. Disabled (dimmed, non-interactive) whenever the Sound effects toggle above it is off, since there's nothing to scale.
- **Static row** (Account): a plain `<div>`, no chevron, two-line stack — email on line one, "Signed in as {display_name}" in muted text on line two (only when a space exists).
- **Static row with inline action** (Invite code): a plain `<div>`, no chevron, monospace code (`font-heading`, `tracking-[0.15em]`) on the right paired with an inline Copy/Check text button — same `copyCode` affordance as before the relayout, just without its own card.
- **Confirm-dialog row** (Leave this space): same navigable-row shape, but the label is `text-destructive` instead of `text-foreground`, and tapping opens a confirm `Dialog` (same "Delete this expense?" pattern as the Log page — `DialogHeader`/`DialogDescription`/`DialogFooter` with a secondary Cancel and a `destructive` confirm button) rather than a sheet or navigation. Only rendered when the current space has more than one member — leaving a solo space would be a no-op.

Currency, Monthly budget, Your name, Invite code, and Import expenses only render when a space exists (`space &&`), same conditional as before; Account, Change password, Sound effects, and Volume always render. Join a different space always renders (solo or not — switching spaces is available regardless of current membership); Leave this space additionally requires more than one member.

### Avatar
**Role:** Visual identity for the current user and their space-mate — Settings' "Profile photo" row and the Feed's per-activity actor avatar (`src/components/ui/avatar.tsx`, `src/lib/avatar.tsx`)

Every user has a default avatar: a deterministic `beam`-variant identicon from the `boring-avatars` package, seeded with the user's `user_id` (stable across display-name changes) and colored from a fixed 5-stop palette — the existing Identity Color Pair (`#8ec98a` sage / `#d992ae` rose) extended with two reused Category Color Palette hues (`#6ba3d6` muted blue, `#9b8cd9` muted violet) and one dark neutral (`#3d3d3d`, `--color-iron`) to ground it on the dark canvas. No new hues were introduced. Users may optionally upload a custom photo, which fully replaces the identicon; removing it reverts to the same deterministic identicon (never regenerated with new colors, since the seed is fixed).

Rendered through the existing `Avatar`/`AvatarImage`/`AvatarFallback` primitives: `AvatarImage` is used only when a custom photo URL is set, and the boring-avatars SVG renders inside `AvatarFallback`'s children (Radix mounts `Fallback` automatically whenever `Image` has no `src` or fails to load) — see `src/lib/avatar.tsx`'s `MemberAvatar` component, the single shared resolver both Settings and Feed use.

Sizes used: `lg` (40px) for Settings' Profile photo row (a deliberately larger tap target since it's the primary way to change it), `default` (32px) for Feed's per-row actor avatar.

Uploaded photos are compressed client-side before upload (`src/lib/image.ts`'s `compressImage`) — resized so the longest edge is 512px, re-encoded as JPEG at 0.82 quality, targeting ~50-150KB per file to keep Supabase Storage usage negligible under the free tier. Stored at `avatars/{user_id}/avatar.jpg` in a public-read Storage bucket, one object per user (`upsert: true` on every re-upload); the `avatar_url` persisted to `space_members` carries a `?v={timestamp}` cache-busting query param so browsers/CDN don't keep serving a stale image after a change.

Out of scope for now (stay text-only): Filter Drawer, Add Expense's "who paid" dropdown, Dashboard's "Who paid" chart.

### Change Password Sheet
**Role:** Change-password form, opened by tapping "Change password" on the Settings screen

Bottom `Sheet`, same shape as the Filter Drawer: `SheetHeader`/`SheetTitle` ("Change password"), a `PasswordInput` field, and a `flex-row` `SheetFooter` with `Cancel` (`secondary`, `flex-1`) and `Save` (`flex-1`, disabled while saving or while the password is under 6 characters). Previously this was an inline form that expanded in place below the "Change password" row inside its `Card`; moved to a sheet so every Settings row stays a plain label(+value)+chevron, matching how Currency already opens a sheet rather than expanding in place.

### Monthly Budget Sheet
**Role:** Set-your-own-budget form, opened by tapping "Monthly budget" on the Settings screen

Same shape as the Change Password Sheet: `SheetTitle` "Monthly budget", a number `Input` (`min="0"`, `step="1"`, `inputMode="decimal"`), `Cancel`/`Save` footer. Prefilled with the signed-in user's current `monthly_amount` when opened. Previously an inline form expanding in place below the "Monthly budget" row; moved to a sheet for the same reason as Change Password above.

### Currency Drawer
**Role:** Currency picker on the Settings screen, changes the space-level currency used to format every amount in the app

Same `Sheet` + vertical list pattern as the Month Drawer above — single-select, no Reset/Apply footer, tapping a row applies it and closes the sheet immediately (a space-level setting change, not a staged/local one). The trigger is the Settings screen's "Currency" list row (see Settings Screen above) showing the current currency as `{symbol} {name}`, with a trailing `CaretRight`. The list itself shows `{symbol} · {name}` per row (e.g. "Rp · Indonesian Rupiah") for a fixed set of currencies (see `src/lib/currencies.ts`), defaulting to Indonesian Rupiah. Selecting a currency updates `spaces.currency_code` and is immediately visible to everyone in the space.

### Upcoming Recurring List
**Role:** Shows active recurring expenses and their next occurrence, above the grouped expense list on the Log screen

Only renders when at least one recurring expense is active (nothing shown otherwise). Same bordered/divided row-list pattern as the Filter Drawer, under the same small uppercase label style ("UPCOMING") used for date-group headers in the log below it. Each row: category icon + description/category name on the left, amount and "{Weekly/Monthly/Yearly} · next {date}" (via the same `formatDateLabel` used throughout) stacked on the right. There is no recurring-specific badge system elsewhere in the app — an expense generated from a series looks identical to a manually logged one in the grouped list below. Tapping a row opens the same confirmation `Dialog` pattern as deleting an expense (`LogPage.tsx`'s delete dialog) — "Stop this recurring expense?" / Cancel / destructive "Stop" — which sets the series inactive; it does not delete or affect any expenses already logged from it. There's no edit action here in v1 — changing amount/frequency means stopping the series and starting a new one.

### Empty State
**Role:** Log screen when no expenses exist yet

Centered column, 48px icon (stroke, #3d3d3d), heading DM Sans 18px weight 500 #e5e5e5, subtext 14px #686868. Button to add first expense (white pill, same as primary CTA). No illustration — the icon and copy do the work.

### Form Field / Input
**Role:** Text input in auth, add-expense form, and Settings sheets

Full-width, height 48px, background #1d1d1d, border 1px #e5e5e5 at 10% opacity, radius 10px (`--radius-input`). Padding 12px 16px. DM Sans 16px weight 400, color #e5e5e5 placeholder color #686868. Focus state: border color #e5e5e5 at 30% opacity, no glow/shadow. Never use a colored focus ring — depth is expressed through opacity shift only.

### Primary Button (White Pill)
**Role:** Main submit/CTA in app screens

Full-width, height 48px, radius 9999px, background #ffffff, text #000000, DM Sans 16px weight 500. Loading state: reduced opacity (60%), disabled pointer-events. Same as the marketing CTA pill but full-width in a mobile context.

### Secondary Button (Glass Pill)
**Role:** Less prominent action (e.g. "Join instead", "Back")

Full-width, height 48px, radius 9999px, glass treatment (background #1d1d1d 80%, backdrop blur 20px, 1px #e5e5e5 at 10% border). Text #e5e5e5, DM Sans 16px weight 500.

### Mobile Top Nav (App Shell)
**Role:** Primary navigation chrome across all first-level screens (Logs, Stats, Activity, Settings) plus the one remaining sub-page (Import expenses)

Full-width fixed bar at top, left-aligned content only — no more back arrow or Settings gear on any of the 4 first-level screens now that they're peers reachable via the Page Switcher (see Bottom Toolbar / Page Switcher Bar above) rather than a back-arrow hierarchy into Logs. Two content modes, chosen per route:
- **Month + Filter mode** (Logs, Stats): replaces the title entirely with the current month as plain text + trailing `CaretDown` (tap opens the Month Drawer sheet, reusing its existing trigger+sheet via a `triggerClassName` override that strips it down to text — no background, no padding, same `font-heading text-lg font-medium tracking-tight` look as a title) followed by a Phosphor `FunnelSimple` icon button (ghost, `icon-sm`) that opens the Filter Drawer directly. Active filters show as a small `size-1.5 rounded-full bg-primary` dot on the icon's top-right corner, replacing the old bottom-toolbar "1 · Filter" text-count convention. `TopNavMonthFilter.tsx`.
- **Plain title mode** (Activity, Settings, Import expenses): the screen's name in `font-heading` 18px weight 500 (`text-lg font-medium tracking-tight`), always `--foreground` — unchanged from the original single-title treatment.

Import expenses (`/import`, a sub-page of Settings, not one of the 4 first-level screens) is the sole surviving exception with a back arrow: an optional back arrow (ghost icon `Button`, `size="icon-sm"`, 28px — same compact icon-button convention used by the Password Input's visibility toggle) precedes its title, returning to `/settings`. No other route renders one. Padding respects `env(safe-area-inset-top)` instead of the bottom inset.

At rest (scrolled to top), the bar is fully transparent and floats directly over whatever scrolls beneath it. Once the page scrolls (`window.scrollY > 0`), a glass surface fades in behind the bar — `bg-background/80`, `backdrop-blur-md`, `border-b border-border` — so the title/icons stop overlapping list content scrolling underneath. The surface is a separate absolutely-positioned layer (`absolute inset-0` behind the title/icon row) whose `opacity` toggles between `0` and `100` on a `transition-opacity duration-300`, rather than animating the blur/background itself, which keeps the fade smooth across browsers.

Per-screen behavior:
- **Logs** (`/log`): Month + Filter mode. The app's home/entry screen.
- **Stats** (`/dashboard`): Month + Filter mode. Reached via the tappable summary card at the top of Logs (see This Month + Budget Card) or the Page Switcher, as a peer screen rather than a sub-page.
- **Activity** (`/feed`): plain title "Activity". The underlying route/file are still `/feed`/`FeedPage.tsx` — only the displayed name changed.
- **Settings** (`/settings`): plain title "Settings".
- **Import expenses** (`/import`, a sub-page of Settings): title "Import expenses" with a back arrow returning to `/settings`. This replaces the page's former bespoke in-content "← Settings" back button.

Since Logs/Stats/Activity/Settings each fully own the Top Nav's content row (either the Month+Filter controls or the title), none of them render a duplicate `<h1>` in this style — content starts directly with the first card/row. (Import's own larger in-content heading, "Import expenses" + subtitle, is a distinct, pre-existing element and is not a duplicate of the nav title.)

### Success/Danger Semantic Tones
**Role:** Form error states, Dashboard/Stats month-over-month delta indicator

Success: `#4ade80` (muted green — readable on dark surfaces without being neon). Danger: `#f87171` (muted red). Outside the indigo accent, these are the only chromatic colors used in UI chrome (buttons, backgrounds, borders) — the one further exception is the Category Color Palette below, scoped strictly to chart data.

### Toast / Snackbar
**Role:** Brief confirmation after an action (expense added/updated/deleted) — feedback that doesn't require dismissal

Fixed, bottom-centered above the FAB/nav, glass pill (background #1d1d1d 90%, backdrop blur 20px, 1px #e5e5e5 at 10% border), radius 9999px, padding 12px 20px. DM Sans 14px weight 500, color #e5e5e5. Optional leading checkmark in `--color-success`. Slides up + fades in (200ms), auto-dismisses after 2.5s, no manual close control — keep it out of the way of the next action.

### Sound & Feedback
**Role:** Playful audio feedback across nearly every interactive surface — entry, saves/deletes, toggles, pickers, list actions, and navigation

Built on `@web-kits/audio`'s "playful" preset (bouncy, cartoon-like pitch
sweeps — `public/patches/playful.json`, fetched from
[audio.raphaelsalaja.com/library/playful](https://audio.raphaelsalaja.com/library/playful)),
wired through a single `AppSoundProvider` (`src/contexts/SoundContext.tsx`)
that wraps the whole app in `App.tsx`, between `AuthProvider` and
`ExpenseFiltersProvider`. Components never call the library's `usePatch`
directly — they call `useAppSound()`, a thin wrapper that no-ops until the
patch has loaded. Seventeen of the preset's 26 sounds are wired, grouped by
what they signal:

- **Entry & outcomes** — `key-press` on every Amount Keypad digit/backspace
  tap (`NumericKeypad.tsx`); `success` after an expense is added/updated
  (`LogPage.tsx`/`DashboardPage.tsx`'s `handleSaved`); `error` on inline
  validation/Supabase failures in the Add Expense save flow
  (`AddExpenseSheet.tsx`'s `handleSave`); `delete` on any confirmed expense
  deletion, single or bulk (`handleSaved`/`handleConfirmBulkDelete`).
- **Toggles & pickers** — `toggle-on`/`toggle-off` for the Recurring
  on/off switch (`AddExpenseSheet.tsx`); `select` for the You/Partner payer
  swap, category picker, date picker, Month Drawer, Currency Drawer, and
  the Filter Drawer's own "Filter" apply button; `select`/`deselect` for
  Filter Drawer category and payer chips as they toggle; `undo` for the
  Filter Drawer's "Reset" and for confirming "Stop" on a recurring series
  (`UpcomingRecurring.tsx`).
- **List interactions** — `checkbox` for row selection in Log's bulk-edit
  mode (`LogPage.tsx`'s `toggleSelect`); `slide` when a row's swipe-to-reveal
  actions open (`ExpenseRow.tsx`, only on open, not on dismiss); `tap` for
  opening an Upcoming-recurring row's stop confirmation and for tapping the
  swipe-revealed Edit button on a log row (a direct `onClick`, not the
  drag/tap gesture handler — there is no tap-to-edit on the row itself, see
  Expense List Row above).
- **Navigation & mode switches** — `click` for TopNav's back/settings
  buttons and the LogPage "Today" card; `tap` for the Bottom Action Bar's
  Add and Filter triggers; `tab-switch` for entering/exiting Log's
  bulk-edit mode.
- **Settings utility** — `copy` on a successful invite-code copy; `warning`
  on a failed currency update.
- **Onboarding** (`OnboardingPage.tsx`) — reuses the existing vocabulary
  rather than inventing new sound-to-action mappings: `tap` on the
  Name/Budget steps' "Continue" (matching the Bottom Action Bar's
  Add/Filter triggers above); `key-press` on the Budget step's keypad,
  free via `NumericKeypad`; `click` on the Import step's "Import from
  CSV" and skip link (matching Settings' identical "Import expenses" row
  and back-nav convention); `copy` on the invite step's code copy
  (identical to Settings); `success`/`error` on the invite step's Join
  outcome (matching Add Expense's save semantics — a real mutation with a
  real failure mode); `success` on the bottom "Finish" button. First
  screen to combine `tap`/`click`/`success`/`error` together across one
  flow — no new sound names.
- **Sheet/drawer dismissal** — `swoosh`, wired once in `sheet.tsx`'s
  `Sheet` root wrapper rather than per-consumer: it intercepts
  `onOpenChange` and plays on any transition to closed, before forwarding
  to the consumer's own handler. Radix only calls `onOpenChange` for
  dismissals *it* recognizes (X button, Escape, backdrop tap, or a
  drag-past-threshold, since drag-to-dismiss triggers a synthetic click on
  the real Radix close button) — a picker closing itself after a selection
  changes its `open` state directly instead, so this never doubles up with
  that action's own `select`/`toggle`/`undo` sound.

**Mute preference & volume:** a "Sound effects" row and a "Volume" row on
the Settings screen (see below), backed by `localStorage` only
(`genkin:sound-enabled`, `genkin:sound-volume`) — device-level, not synced
across a space's accounts or devices, since these are $0-cost UX
preferences, not shared expense data. Both feed straight into
`@web-kits/audio`'s own `SoundProvider` (`enabled`/`volume` props), which
gates/scales playback for every sound in one place — `useAppSound()`
doesn't duplicate either check. The mute toggle row itself stays silent
(asymmetric otherwise: muting plays a sound but un-muting can't, since the
provider's `enabled` is already false at the moment of the click that
turns it back on); the volume slider is disabled (not hidden) whenever
sound is muted.

**Still not wired (intentional):** `page-enter`/`page-exit`, and the
unused `notification`/`info`/`send`/`pop`/`expand`/`collapse` — no current
UI pattern maps cleanly to these yet. `hover` is skipped permanently —
this is a touch-first mobile PWA, so hover has no meaningful state
on-device.

### OTP Code Input
**Role:** Code-entry step wherever email ownership needs verifying — the magic-link form's sign-in/sign-up (fallback to tapping the magic link itself) and the password form's recovery flow, on the Auth screen

Built on shadcn's `InputOTP`, two groups of 4 boxes separated by a divider (`InputOTPSeparator`). **8 digits, not 6** — this project's `genkin-dev` Supabase instance issues 8-digit email OTPs for the Magic Link template (re-check the prod project if this ever changes, and re-check the Reset Password template too if its digit count ever diverges from the Magic Link one). On the magic-link form, sits below the "Check your email" copy as a secondary path, separated by a hairline divider with "or enter the code" label. Verify action reuses the primary `Button`.

Tapping the emailed magic link always opens the OS default browser, never an installed PWA — and on iOS the installed PWA's storage is sandboxed separately from Safari, so a sign-in completed in the browser tab can't hand off a session to the home-screen app anyway. [MagicLinkAuthForm.tsx](src/components/MagicLinkAuthForm.tsx) and [PasswordAuthForm.tsx](src/components/PasswordAuthForm.tsx) both detect standalone display mode (`isStandalonePwa()` in [utils.ts](src/lib/utils.ts)) and swap the "check your email" copy to lead with the code (and drop the "or") when running installed, since the code path is the only one that reliably works there. The manifest also sets `capture_links: 'existing-client-navigate'`, which lets Chromium/Android PWAs capture the link back into the existing app window — no iOS equivalent exists, so the code path stays the primary fix.

For local testing where the magic link can't reach the environment (e.g. a preview pane with its own browser context, separate from your inbox), `scripts/dev-otp.mjs` generates a real OTP via the Supabase admin API for any of the three flows (`magiclink`/`signup`/`recovery`) — no email round-trip needed. See the script's header comment for usage.

### Password Input
**Role:** Password entry on the Auth screen's password form (sign-in, recovery) and Settings' Change Password action

Wraps the standard Form Field/Input pattern above (same 48px height, `#1d1d1d` background, 10px radius — no new tokens) with a visibility toggle: a ghost icon `Button` (`size="icon-sm"`, 28px, the compact size reserved for secondary chrome) absolutely positioned inside the input's trailing edge, swapping Phosphor `Eye`/`EyeSlash` to switch the field between `type="password"` and `type="text"`.

### Auth Screen — magic link as primary flow (`AuthPage.tsx`)
**Role:** Sign-in/sign-up entry point (`/auth`)

Magic link + OTP ([MagicLinkAuthForm.tsx](src/components/MagicLinkAuthForm.tsx)) is the sole default flow — there's no Password/Email code tab switcher anymore (the old **Mode Switcher (Segmented Pill)** pattern is retired along with it). `signInWithOtp`'s default `shouldCreateUser: true` means this one form already covers both sign-up and sign-in, so there's no separate "Create account" step. Password sign-in ([PasswordAuthForm.tsx](src/components/PasswordAuthForm.tsx)) is now an opt-in secondary path, trimmed to sign-in + recovery only (no account creation there either) and reached only from a "Use password" text link below the magic-link form's Verify code button; its own signin view carries a symmetric "Use email code instead" link back to the magic-link form. Both links carry the typed email across the switch (`AuthPage` lifts a single `email` string between the two forms). No button label in either form uses a trailing arrow glyph — plain text only ("Send magic link", "Verify code", "Sign in", etc.).

The page's content column anchors to the bottom of the viewport
(`items-center justify-end` instead of `justify-center`) rather than
vertical-centering, so the animated background below has room to read as a
full poster above the form. See **Auth Background** next for what fills
that space.

### Auth Background
**Role:** Full-viewport animated backdrop behind the Auth screen and Onboarding walkthrough — first-impression surface for a brand-new visitor

A WebGL shader field (`AuthBackground.tsx`), built on [`@paper-design/shaders-react`](https://shaders.paper.design)'s `Dithering` component — this reverses the project's earlier "pure Canvas2D, no shader/WebGL" decision for this one surface; the tradeoff (a ~400KB unpacked npm dependency, Apache-2.0, statically imported like every other dependency in this app — no `React.lazy` boundary exists anywhere yet, so this doesn't introduce a new loading pattern; measured bundle delta is +27KB minified / +8KB gzipped, since tree-shaking drops every unused shader export) was accepted deliberately to get a shader-native "warp + noise + dither in one WebGL draw call" effect, which is what `Dithering`'s `shape="warp"` mode is: a turbulent warp/noise field quantized through a Bayer dithering matrix. An `ImageDithering` variant (dithering a real photo, `public/heroimage.jpg`, instead of procedural turbulence) was tried and reverted — the fully static halftone-print result lost the "living background" motion the auth screen is meant to have, so the procedural, continuously-animated `warp` shape is what's shipped. Rendered on a `fixed inset-0 -z-10` element behind the page content — the wrapping page container still needs `isolate` (`isolation: isolate`) alongside `relative`, the same stacking-context requirement as before (without it, a negative-z-index fixed descendant paints *behind* `<body>`'s own `background-color` instead of in front of it). Tuned props: `colorBack="#0a0a0a"` (void) / `colorFront="#e5e5e5"` (bone), `shape="warp"`, `type="4x4"` (Bayer matrix — softer than 8x8, avoids a busy moiré texture), `size={1.5}` (small dithering grid — finer, less blocky grain than the original `size={5}` tuning), `scale={1.8}` (zooms the warp field so fewer, larger organic bands are visible instead of full-bleed fine marbling), `speed={0.3}`, and the whole layer at `opacity-40` — full-opacity dithering read as a stark, overwhelming black/white graphic that drowned the form, so the layer is dimmed to sit as atmospheric texture behind the card rather than competing with it. `Dithering` is strictly 2-color (no gradient ramp, no third accent slot), so it can't reproduce the old fog→mist→bone gradient or carry the indigo accent itself — the indigo sparkle lives in a separate sibling `<div>`, a static `radial-gradient` using `--color-indigo` at low opacity, pulsing via a dedicated `@keyframes indigo-glow-pulse` (`index.css`, 8s ease-in-out) rather than the old per-cell hash-picked sparkle; still matches the "indigo is atmospheric only, never a solid fill" rule elsewhere in this doc, just as a single soft glow instead of scattered points. Motion handling: `prefersReducedMotion()` (`utils.ts`) is read once per render and drives both `speed={0}` on the shader (freezes it on its current frame — a stopped shader still renders, satisfying "single static frame, no motion") and `animation: 'none'` on the indigo glow. No explicit `document.visibilitychange` pause — background tabs get their WebGL rAF throttled by the browser natively, so a hand-rolled pause added no measurable benefit and was dropped; revisit if a future profiling pass shows otherwise. No WebGL-unavailable fallback beyond the page's own solid `--color-void` body background already showing through if the shader fails to mount — no resurrected Canvas2D path. Mounted on both `AuthPage.tsx` and `OnboardingPage.tsx` — the two are already documented as sharing "full-bleed, no AppShell" treatment, so they share this background too; `OnboardingPage.tsx` keeps its own existing centered wizard layout, only the background layer is added behind it.

### Dashboard Sections (Stats screen)
**Role:** Container pattern shared by every section on `/dashboard` — This Month + Budget, Avg. Daily Spend chart, Category breakdown, Who paid

Same full-bleed, no-`Card` treatment as the Log screen's Sticky Summary Card below, minus the sticky/blur parts (these sections sit in normal page flow, never pinned over scrolling content, so there's nothing to keep legible underneath them): edge-to-edge width (`px-5` internal padding on each section instead of an outer page margin), no rounded corners, no `bg-card` surface, just a `border-b border-border` separating one section from the next (`last:border-b-0` on the final one, so the page doesn't end on a stray line). The outer page wrapper (`flex flex-col pb-24`) carries no padding or gap of its own — every section supplies its own `py-5` and the border does the separating, the same "hairline-divided rows" language used for the expense list and Filter Drawer rather than a card-stack with gaps between floating surfaces.

### This Month + Budget Section
**Role:** First section on the Dashboard/Stats screen and, in a compact form, the tappable overview bar at the top of the Log screen — this calendar month's total spend plus per-person budget vs. spend

Not two sections, one: the top part is the plain monthly total (title "This month", big Geist number, right-aligned MoM delta badge — `--color-danger` if spending increased, `--color-success` if it decreased, same binary tones used throughout). A `border-t border-border pt-3` divider separates that from the budget part below it — budget context is a continuation of "this month," not a competing metric, so it doesn't get its own section or its own big number.

Budget header row: title ("Budget") left, a right-aligned remaining/over-budget badge (`text-xs font-medium`, `--color-success`/`--color-danger`, no third/warning tone). Below that, the **Segmented Progress Bar** (see below) instead of a continuous bar. A three-column stat row (`grid-cols-3`, 12px labels + Geist tabular-nums values) shows Remaining · Days left · Daily pace (the budget-safe amount left to spend per remaining day; renders `—` once over budget or on the month's last day). An optional single line projects month-end total at the current daily pace (only once `dayOfMonth > 2`, to avoid a wild projection from a day or two of data), colored `--color-danger` if the projection exceeds the budget. A second hairline-divided footer (`border-t border-border pt-3`) lists each partner's name with `spent / budget` as plain text, no per-person bar.

**Empty state:** if neither partner has set a budget yet (`budgetTotal === 0`), the divider still separates the sections, but the budget half collapses to a single sentence ("Set a monthly budget in Settings to track it here") plus a text link to `/settings` — never a zeroed-out bar or `Rp 0 left`.

**Log screen variant (`LogPage.tsx`):** superseded by **Sticky Summary Card (Log screen)** below — the Log screen's overview is no longer a `Card` at all, and is no longer frozen to "Today." See that section for the current treatment.

### Avg. Daily Spend Chart
**Role:** Recharts bar chart of daily spend for the selected month, on the Dashboard

Same Dashboard Sections container as the rest of the page (see above). Title + big Geist average-per-day number up top, chart fills the remaining width at a fixed `h-40`. Axis labels and gridlines stay muted (`var(--muted-foreground)`/`var(--border)`, never full white) so the data itself — not chrome — carries the color. Tooltip reuses the app's popover treatment (`bg-popover`, hairline border) rather than a bespoke style.

### Category Breakdown
**Role:** Proportional bar + legend showing spend by category for the selected month, on the Dashboard — uses the Category Color Palette below

Same Dashboard Sections container. A continuous proportional bar (`flex h-1.5 gap-1`, each segment `flexGrow` set to its category total so widths are proportional without manual percentage math, filled with `categoryColor(name)`), matching the height of the Log screen's compact bars rather than the taller `h-6` it used before. Hovering a segment reveals a popover tooltip (name + formatted amount) positioned above the bar. A legend list below repeats each category as a colored dot + name + amount, sorted by spend descending.

### Who Paid
**Role:** Proportional two-tone bar comparing You vs. partner spend for the selected month, on the Dashboard — monochrome fill (`bg-foreground`/`bg-muted-foreground/50`), same component/treatment as the Log screen's compact who-paid comparison bar

Same Dashboard Sections container. Labels row above the bar ("You · amount" / "Partner · amount", plain `text-foreground`/`text-muted-foreground`, no color), then a `flex h-1.5 bg-muted` bar with two monochrome segments sized to each side's percentage of the total.

### Sticky Summary Card (Log screen)
**Role:** The Log screen's tappable overview bar (replacing the old Log-screen variant of This Month + Budget Card, above) — `SummaryCard.tsx`, rendered from `LogPage.tsx`. As the user scrolls through the date-grouped expense list, the bar mirrors whichever day's section is currently in view, Google-Photos-date-bar style, instead of staying frozen to "Today."

**Not a `Card`** — a full-bleed bar, edge to edge (`px-5` internal padding instead of the page's usual `px-5` outer margin, no rounded corners, no ring border), with the same translucent blurred backdrop `TopNav` uses (`bg-background/80 backdrop-blur-md`) instead of the opaque `bg-card` surface, plus a `border-b border-border` for separation — this keeps text legible over the scrolling list beneath it without looking like a floating card pinned at the screen edges. Header row: date label (small caps, muted) on the left, a trailing `CaretRight` chevron on the right signaling the whole bar is tappable — replacing the old "View all stats →" caption line entirely, matching the chevron convention on Settings' navigable rows and the Budget Reminder Card.

**Two states**, swapped by pin state (see below), both the same `SummaryCard` component, same full-bleed/blur/chevron treatment — only size and pacing detail differ. Every property that changes between them (padding, amount font size) transitions over `duration-300 ease-out` rather than snapping, so the pin/unpin moment reads as one bar morphing rather than two different bars swapping — see "Shared-element transition" below.
- **Expanded** — the bar's natural, unscrolled position at the top of the page. Bigger Geist amount (`text-3xl`), `py-3.5`, pacing badge + "Max today" caption + Segmented Progress Bar (`compact` height variant — see below), You/Partner split row.
- **Compact** — engaged once the bar has scrolled under `TopNav` and pinned there. Smaller amount (`text-xl`), `py-4`, tighter vertical rhythm throughout, the pacing badge collapsed to just its numeric text (no Segmented Progress Bar, no "Max today" caption). In the space that detail collapses out of, a **Who-paid comparison bar** grows in — see below.

**Who-paid comparison bar (compact only):** the same continuous two-tone bar as the Dashboard's "Who paid" card (monochrome `bg-foreground`/`bg-muted-foreground/50` fill, proportional widths, no gap, no radius), scaled to `h-1.5` to match the compact block height. Swaps in for the pacing detail's collapsed space specifically because pacing is meaningless for a past date but the You/Partner split is always available, so the compact bar always has something proportional to show regardless of which date is active. Renders only when a partner exists (`partnerName`); at $0/$0 both segments default to a 50/50 split rather than a zero-width bar. Segment widths carry `transition-[width] duration-300 ease-out`, matching the rest of the bar's shared-element transitions, so a shift in the You/Partner split (switching date, live update from a partner) eases smoothly rather than snapping — deliberately in step with the adjacent amounts' `AnimatedAmount` rolling-number transitions rather than looking disconnected from them.

**Segmented Progress Bar `compact` prop:** `BudgetProgressBar.tsx` takes an optional `compact?: boolean` that shrinks its block height from `h-6` to `h-1.5` and its max block width from 12px to 8px (denser blocks at the smaller scale) — originally added for this bar's tighter vertical rhythm, now also used by the Dashboard's own usage of the same component so every proportional bar on the app (budget, category, who-paid) reads at the same visual scale. See Segmented Progress Bar below for the non-compact sizing this replaced.

**Sticky offset:** `position: sticky`, `top: calc(56px + var(--safe-top))` — 56px is `TopNav`'s actual rendered content height (`py-3.5` padding + an `icon-sm` button, 28px + 28px), not the 64px `AppShell`'s `<main>` assumes for its own padding-top. That 64px figure is stale there too, but harmlessly — it only leaves 8px of invisible extra whitespace at the top of every page. Reusing it here instead of the real 56px would leave an 8px seam between the nav and this bar with scrolled list content visible through it, so this bar intentionally uses its own correct constant (`NAV_HEIGHT` in `LogPage.tsx`) rather than matching `AppShell`'s. **z-index `40`** — between `TopNav`'s `50` and `BottomActionBar`'s `30`, so the nav always wins if they ever overlap during the scroll transition, and the bar always sits above the scrolling list content beneath it (implicit `z-0`).

**Pin detection:** a zero-height sentinel `div` renders immediately above the sticky bar; an `IntersectionObserver` watches it (`rootMargin: '-1px 0px 0px 0px'`). Once the sentinel scrolls above the viewport top, `position: sticky` has engaged and the bar switches to compact — this is deliberately not scrollY-position math, since the bar's natural offset shifts depending on whether the Budget Reminder Card above it is rendered. While unpinned (resting at the top), the bar always shows "Today" unconditionally — active-date tracking (below) only takes over once pinned, so nothing changes before the user actually starts scrolling.

**Active-date content:** a single `IntersectionObserver` watches every date-group header in the list *and* a sentinel just past the end of the list together, with its `rootMargin` top edge set to the live-measured bottom of the sticky bar (tracked via `ResizeObserver`, same pattern as Segmented Progress Bar's own width tracking). Both are observed by the same instance deliberately — with two separate observers, a single big scroll jump can fire them in either order and let the header logic overwrite the bottom-of-list fallback right after it runs. On every crossing, one callback recomputes everything directly from live positions rather than trusting which entry triggered it: if the end-of-list sentinel is on screen, the oldest date group is forced active (it can be too short to ever push its own header past the line, since there's no more content below it to scroll through); otherwise the header that most recently scrolled past the line is picked — more robust than a thin trigger-band check, which a fast/flick scroll can jump clean over without ever registering. Two content modes result:
- **Today** — full pacing content as described above (Expanded) or its compact equivalent, whether or not anything's been spent today.
- **Any past date** — pacing never applies (budget pacing is inherently "today"-relative), so the bar shows only that day's total plus the You/Partner split, no badge/bar/caption, in both Expanded and Compact layouts.

**Scroll-anchoring fix:** resizing the bar exactly at the moment it pins (expanded → compact) fights with the browser's default scroll-anchoring — the anchor compensates for a resize on an element it's tracking near the top of the viewport by nudging scroll position, which itself changes the pinned state, producing an infinite snap-back loop right at the pin boundary. Fixed with a single `overflow-anchor: none` on `body` in `index.css`, scoped there rather than globally since nothing else in the app currently relies on scroll anchoring.

**Shared-element transition:** expanded and compact are the same DOM elements with different classes, not two conditionally-mounted trees, so plain CSS transitions on the properties that change (`transition-[padding]` on the bar's padding, `transition-[font-size]` on the amount) animate the pin/unpin moment instead of snapping. The pacing detail block and the who-paid comparison bar both stay mounted at all times (never conditionally rendered on `compact`) and cross-fade via the CSS grid-rows collapse trick — an outer `grid` container animates `grid-template-rows` between `0fr`/`1fr` on `transition-[grid-template-rows]`, wrapping an `overflow-hidden` inner element that also carries a `transition-opacity` — so as one block collapses to zero height the other grows in, rather than either popping in/out instantly. All transitions share `duration-300 ease-out`, matching `TopNav`'s own fade-in timing.

No new radii are introduced by this pattern — the blurred backdrop and bottom hairline reuse `TopNav`'s exact treatment, the pacing badge reuses `--color-success`/`--color-danger`, and the who-paid bar is monochrome (`bg-foreground`/`bg-muted-foreground/50`), shared with the Dashboard's own "Who paid" card rather than a one-off treatment scoped to just this bar. The compact Segmented Progress Bar height (`h-1.5`) and its 8px max block width are the only new size values, added as an explicit `compact` variant on the shared component rather than a one-off override.

**Active-filter bar (Log screen):** when a category and/or payer filter is applied (`TopNavMonthFilter`'s Filter drawer), a plain-text strip — `border-b border-border bg-background/80 px-5 py-2 backdrop-blur-md` (same translucent-blur language as the bar below it, `text-xs font-medium text-muted-foreground`, single `truncate` line) — renders directly above the summary card, reading e.g. "Viewing only 🥬 groceries, 🧺 laundry, ☕ coffee, +3 more" (category names capped at 3, collapsing the rest into "+N more"; a payer filter appends "paid by you"/"paid by {name}"). Deliberately **not** a separate sticky element with its own measured height threaded into the summary card's offset — an earlier version tried that and the two could drift out of sync (state update lag between measuring the bar's height and applying it to the card's `top` let them render superimposed for a frame). Instead it's nested *inside* the summary card's existing sticky wrapper (`LogPage.tsx`'s `cardRef`), stacked above `SummaryCard` in normal flow — one sticky box, one `top` offset, so the two can never overlap or drift, and the existing `cardHeight` measurement (used by the date-header trigger line) picks up the combined height for free. That wrapper also carries `-mt-2`, canceling the 8px gap between `TopNav`'s real 56px height and `AppShell`'s stale 64px padding-top assumption (see Sticky Summary Card's own Sticky-offset note above) — previously invisible against the summary card's blurred backdrop, but visible as a seam once this bar's top border sat inside that gap.

### Budget Reminder Card
**Role:** Nudges someone who hasn't set a budget yet to go do so, on the Log screen — `LogPage.tsx`, inline JSX (not its own component file; a single simple card used in exactly one place, so extracting it would be premature abstraction — revisit if the Dashboard ever wants the same nudge)

Renders only when `summary.budgetTotal === 0` (the same "no budget set" signal used by the Today card's empty state above and the Dashboard's This Month + Budget Card empty state), directly below the Today card and above Upcoming Recurring. A `Card` (`p-5`, `flex flex-row items-center gap-3` — the explicit `flex-row` matters here, since the shared `Card` component's own base class already sets `flex-col` and Tailwind's class-merge keeps both non-conflicting flex utilities, so omitting it stacks the icon/text/chevron vertically instead of laying them out in a row), whole-card tappable (`role="button"`, `cursor-pointer`, plays `click` and navigates to `/settings` on tap) — same target as the Dashboard empty state's "Go to Settings" link and the same "whole card is one tap target" convention as the Today card above it and Settings' Currency/Invite/Import rows. Content: a `PiggyBank` icon (Phosphor, `weight="light"`, `size-8`, `text-muted-foreground` — the first money/budget-themed icon in the app's icon set) on the left, a two-line text stack (heading "Set a monthly budget" in `text-sm font-medium text-foreground`, subtext "Track spending against a shared goal for you and your partner." in `text-xs text-muted-foreground`) in the middle, and a trailing `CaretRight` (`size-3.5`, `text-muted-foreground`) signaling it's tappable, matching the chevron convention on Settings' navigable rows.

### Segmented Progress Bar
**Role:** The budget-usage indicator on the This Month + Budget section (both the Dashboard and Log screen variants) — `BudgetProgressBar.tsx`

A row of evenly-sized blocks (`flex gap-1`), not a single continuous fill — visually distinct from the Who Paid and Category Breakdown bars, which stay continuous/proportional. Segment count and block width aren't fixed props — `computeLayout()` solves both together from the container's own measured width via `ResizeObserver`, so the row always fills exactly with no leftover gap or missing trailing block, capped at a max block width (12px default, 8px with the `compact` prop — see Sticky Summary Card above) below which a block shrinks rather than the row overflowing. Filled-block count = `round(usedPct / 100 * segments)`; filled blocks are `--color-success` or `--color-danger` (matching the remaining/over-budget badge next to it), unfilled blocks are `bg-muted`. No new color — same binary success/danger convention used everywhere else on this section. Both the Dashboard and Log screen now render this with `compact` set, so the block height (`h-1.5`) and max width (8px) match everywhere the bar appears.

### Onboarding Step Indicator
**Role:** Progress marker at the top of the Onboarding walkthrough — `OnboardingStepIndicator.tsx`

Same `flex gap-1` row-of-blocks language as the Segmented Progress Bar above, but a fixed 4-segment count (no responsive block-width math, since the segment count never changes) — each block `flex-1 h-1.5`. Filled (current step and every step already passed) is `bg-foreground`; upcoming steps are `bg-muted`. Deliberately does **not** reuse `--color-success`/`--color-danger` — those stay reserved for the budget-usage semantic on the Segmented Progress Bar and This Month + Budget Card; a plain neutral fill correctly signals "progress," not "good/bad."

### Onboarding Walkthrough
**Role:** First-run flow for a brand-new signup — `OnboardingPage.tsx`, a full-bleed page (no `AppShell`/`TopNav`, same treatment as `/auth`) reached via `/onboarding`

Four steps in order — name, budget, import, invite/join/solo — each rendered inline in one file (matching Import's own 4-step-inline convention) below the Onboarding Step Indicator. **Skippable at every step, never a forced gate**: this directly replaces nothing removed by the solo-by-default reframe (`0b04650`) — a user who taps straight through ends up exactly where a to-do-nothing signup already lands (a solo space, no budget, no import), just having seen what's available. Reuses existing components/logic rather than re-implementing them:

- **Name**: the same `Label`+`Input` (maxLength 32) as Change Password/Change Username Sheet's own name field, prefilled from the auto-derived `space.display_name`. Always has a valid default, so "Continue" is never blocked.
- **Budget**: the same `NumberFlow` + Amount Keypad + `amountUnits.ts` pattern as the Monthly Budget Sheet, inline instead of in a `Sheet`. Only upserts a `budgets` row if the entered amount is above zero — leaving it at 0 and continuing is the skip path, consistent with the rest of the app's "budget 0 means unset" convention (Budget Reminder Card, This Month + Budget Card empty states).
- **Import**: a springboard `Card`, not a re-implementation of the CSV pipeline — "Import from CSV" hands off to the existing `/import` page (passing router state so its `done` step returns to `/onboarding?step=invite` instead of `/log`), or a plain-text skip link advances straight to the last step.
- **Invite/Join/Solo**: not three equal-weight choices — solo is the implicit default (nothing to tap), matching "solo by default." Two `Card`s sit above a single bottom-pinned "Finish" button: the invite-code display (identical to Settings' Invite Code row) and a join card (invite-code + display-name inputs, prefilled reactively from the current `space.display_name`, "Join" button disabled until both fields are non-empty — same validation as the Settings "Join a different space" sheet, sharing its `join_space` error-message mapping via `src/lib/spaceErrors.ts`). "Finish" is the true primary CTA of the step; the two cards above it are optional detours.

Current step lives in the `?step=` URL query param (`useSearchParams`), not component state or `sessionStorage` — it survives a hard refresh and needs no explicit clear-on-completion step, since navigating to `/log` on finish naturally drops it. Gated by `AuthContext`'s `needsOnboarding` (`user.user_metadata.onboarding_completed !== true`) via `ProtectedRoute`, which redirects a brand-new signup to `/onboarding` and redirects a completed user away from it — the page itself carries no gating logic of its own.

### Category Color Palette
**Role:** Distinguishing categories in the Dashboard's category breakdown bar — the only place beyond Success/Danger where multiple chromatic colors appear together

A fixed, muted 10-color set — one per seeded category, desaturated enough to sit comfortably on the dark canvas without competing with indigo:

| Category | Color |
|---|---|
| Groceries | `#f0a868` (muted amber) |
| Snack | `#e0a8d8` (muted pink) |
| Food | `#e8847c` (muted coral) |
| Services | `#9b8cd9` (muted violet) |
| Drink | `#c9976b` (muted tan) |
| Commute | `#6ba3d6` (muted blue) |
| Pet | `#d6c178` (muted gold) |
| Lend | `#7bc9a8` (muted teal) |
| Health | `#8fd3c7` (muted mint) |
| Laundry | `#a8b8c9` (muted blue-gray) |

Used only for chart fills/legends (category bar segments, legend dots) — never for buttons, badges, or backgrounds elsewhere in the app.

### Identity Color Pair (You / Partner)
**Role:** Seeding the two space members' default avatar identicons (`src/lib/avatar.tsx`, `src/lib/personColors.ts`) — **not** used by comparison bars. The who-paid comparison bar (Sticky Summary Card compact state, Dashboard's "Who paid" card) was originally colored with this pair but was switched to a monochrome `foreground`/`muted-foreground` fill after it read as too visually loud/distracting sitting inside the mostly-monochrome sticky bar; see those sections above.

A second, small chromatic exception alongside the Category Color Palette above, but scoped to avatars only now — a fixed **pair** rather than a per-item set, since a space caps at 2 members and colors are assigned by role (`You` vs the other member), not per-person hashing:

| Role | Color |
|---|---|
| You | `#8ec98a` (muted sage green) |
| Partner | `#d992ae` (muted rose) |

Deliberately distinct hues from every Category Color Palette entry above, so the two palettes never coincide if they ever appear together. Same usage restriction as the category palette: never for buttons/badges/backgrounds elsewhere in the app.

### Border Beam Pulse
**Role:** Signals "tap to share" on a shareable Insight ticket (Stats screen's Insights carousel — `InsightTicket.tsx`, `size="card"` only). Renders on the ~9 of 11 monthly insights that don't name/compare the partner (see privacy denylist in `src/lib/shareableInsights.ts`); absent on the rest, which stay static.

Two layers, animated together (`src/index.css`): `.insight-beam-ring` is a 1.5px gradient ring drawn with the padding + dual-mask-exclude trick (`-webkit-mask-composite: xor` / `mask-composite: exclude`), and `.insight-beam-glow` is a soft inset bloom (`box-shadow: inset`) bleeding the same colors inward. Both share a `@keyframes insight-beam-pulse` opacity breathe (`0.4` → `1` → `0.4`, `2.4s ease-in-out infinite`) plus a `@keyframes insight-beam-hue` slow `hue-rotate(0deg → 360deg)` drift (`8s linear infinite`), so the ring's colors continuously cycle while the whole thing pulses brighter/dimmer.

**Colorful, deliberately built from the existing Category Color Palette** (`categoryColors.ts`'s 10 muted hues, arranged as a `conic-gradient`) rather than an arbitrary new rainbow — an explicit product decision to make this one accent colorful (superseding an earlier monochrome-only pass), but sourced from hues already approved elsewhere in the design system instead of introducing brand-new ones. This remains the **only** place besides the Category Color Palette and Identity Color Pair where multiple chromatic colors appear together — still never on buttons/badges/backgrounds elsewhere. Respects `prefers-reduced-motion: reduce` via a plain CSS media query (animation disabled, held at a fixed `0.6` opacity) — reactive to a live OS-setting change, unlike the one-shot JS `prefersReducedMotion()` check used by the Auth Background shader.

Applied as two absolutely-positioned `inset-0` overlay `span`s inside the ticket, only when the ticket is tappable. The whole ticket (not just a small icon) is the tap target when shareable — `role="button"`, `cursor-pointer`, `onClick` opens the Share Insight sheet (see **Insight Ticket** below) — with a small static `Export` icon (Phosphor, non-interactive) in the ticket's header row as a secondary legibility hint, since the pulse alone may not read clearly in a screenshot or to a screen reader user.

### Insight Ticket
**Role:** Each card in the Stats screen's monthly Insights carousel (`InsightTicket.tsx`, shared between the in-app `size="card"` carousel and the `size="export"` shareable-image template — see PRD/feature history for the share-to-social-media feature). Receipt/ticket-styled: giant faint background kanji glyph, corner brackets, mono "INSIGHT" header, emoji badge + title + detail, and a footer with a deterministic fake barcode + a short label + "Verified ✓" stamp. Card size is `h-64` (256px, bumped from an original `h-56`/224px — the shorter height clipped the footer on longer insights). Shareable tickets additionally get the **Border Beam Pulse** above and are whole-card tappable, opening `InsightSharePreviewSheet` (a bottom `Sheet` that always previews the exact 1080×1920 export image before offering Share/Save — never shares directly without a preview, since one insight (`biggest-expense`) can include free-typed expense text that a user should see before it leaves the app).

**Footer label:** shows a short, human-readable label (`INSIGHT_SHORT_LABEL` in `InsightTicket.tsx`, e.g. "VS PARTNER", "PEAK DAY", "BIG SPEND") instead of the raw `insight.id` — the full id (e.g. `partner-category-comparison`) wrapped to two lines and crowded the "Verified ✓" stamp at the card's small footer width. Falls back to the raw id for any future insight id not yet given a short label.

**Carousel track:** the horizontal scroller (`SpendingInsightsCard.tsx`) uses `gap-3` (12px) between cards — plain `w-full shrink-0` snap children with no gap by default — plus `overflow-y-visible` and a `py-1` vertical inset on the track so the Border Beam Pulse's ring/glow isn't clipped flush against the scroll container's edge. `activeIndex` (the pagination dots) accounts for the gap explicitly (`scrollLeft / (clientWidth + 12)`), since the naive `scrollLeft / clientWidth` used before the gap was added drifts once cards are no longer exactly `clientWidth` apart.

---

## Implemented Theme (Genkin)

> **Superseded 2026-07-01** — Genkin now runs on shadcn/ui's `brpK` preset
> (`radix-nova` style, `neutral` base color, `phosphor` icon library, `0`
> base radius — sharp corners, not the pill/24px system below). The old
> `--color-void`/`--color-char`/pill-radius/glassmorphism tokens in this
> section are historical: they describe the pre-shadcn look, kept below only
> until every screen finishes migrating (some pages still reference `.glass`
> until their turn in the rewrite). The **live** theme is the shadcn
> `oklch(...)` variable block actually wired into `src/index.css` — read that
> file directly for the current values, since shadcn owns and can rewrite
> this block on future `shadcn add`/`shadcn init` runs. Summary of what
> changed:
> - Background/foreground/card/popover/primary/secondary/muted/accent/
>   destructive/border/input/ring/chart-1..5/sidebar-* — all defined as
>   `oklch()` values, light set under `:root`, dark overrides under `.dark`.
>   The `brpK` preset defaults to **light** mode; since Genkin has always
>   been dark-only (PWA `theme-color`/manifest background is `#0a0a0a`, no
>   light/dark toggle exists), `<html>` now carries a hardcoded `class="dark"`
>   in [index.html](index.html) to force the dark variable set everywhere —
>   revisit only if a light-mode toggle becomes an actual feature request.
> - `--radius: 0` at the root; component-level radii (`--radius-sm/md/lg/xl`)
>   are derived from it via `calc()` in the `@theme inline` block
> - `--font-sans` is now `'Geist Variable'` (via `@fontsource-variable/geist`),
>   with the old DM Sans value preserved under a new `--font-heading` token
>   in case a heading ever wants the original typeface back
> - The original custom color tokens (`--color-void`, `--color-bone`, etc.)
>   and radii (`--radius-input`/`-card`/`-container`/`-pill`) are left in
>   place alongside the new shadcn tokens — they don't collide (different
>   CSS variable names) and `--color-success`/`--color-danger` specifically
>   are kept as real, still-used semantic tokens for form errors and the
>   Stats screen's month-over-month delta, since the `brpK` preset doesn't
>   define its own success color
> - **The original custom `--spacing-4` … `--spacing-64` block was deleted
>   outright** (not just left alongside) — Tailwind v4 resolves numeric
>   utilities like `h-8`/`p-4`/`gap-8` by looking up a literal
>   `--spacing-<N>` theme key first, so those legacy px-named tokens were
>   silently hijacking every shadcn component's spacing utilities (e.g. a
>   `Button`'s `h-8` resolved to `8px` tall instead of the intended `32px`).
>   Nothing in the codebase referenced `var(--spacing-N)` directly, so
>   removal was safe; Tailwind's default spacing scale now applies uniformly.
> - `Button`'s default and `icon` sizes were bumped from `h-8`/`size-8` (32px)
>   to `h-12`/`size-12` (48px) — 32px was too small a tap target on mobile.
>   48px is now the app's minimum button height everywhere the default size
>   applies (nearly every `Button` in the app, since most call sites don't
>   override `size`); the compact `xs`/`sm`/`icon-xs`/`icon-sm` sizes are
>   unchanged and stay reserved for secondary chrome like sheet/dialog close
>   buttons, not primary tap targets. `lg`/`icon-lg` moved from 36px to 56px
>   to stay a step above the new default.
> - `.glass` (glassmorphism recipe) is being retired — drop it once
>   [TopNav.tsx](src/components/TopNav.tsx),
>   [SettingsPage.tsx](src/pages/SettingsPage.tsx), and
>   [AuthPage.tsx](src/pages/AuthPage.tsx) (its last remaining users) are
>   rewritten on shadcn components
> - `.amount` (Geist + tabular-nums for money figures) was unused dead code
>   pre-migration — every screen applied `font-family: var(--font-geist)`
>   inline instead. Fold these into shared `Amount`-style formatting as
>   screens get rewritten, rather than reintroducing the unused utility class.

The section below (the original trimmed `@theme` block) is kept for
historical reference only — it no longer matches `src/index.css`.

```css
@theme {
  /* Colors */
  --color-void: #0a0a0a;
  --color-char: #1d1d1d;
  --color-iron: #3d3d3d;
  --color-slate: #505050;
  --color-smoke: #797979;
  --color-graphite: #161616;
  --color-ink: #282828;
  --color-fog: #686868;
  --color-mist: #c2c2c2;
  --color-ash: #b2b2b2;
  --color-bone: #e5e5e5;
  --color-paper: #ffffff;
  --color-onyx: #000000;
  --color-indigo: #6b62f2;

  /* Semantic — success/danger for balance screen, form errors */
  --color-success: #4ade80;
  --color-danger: #f87171;

  /* Fonts */
  --font-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, sans-serif;

  /* Type scale */
  --text-caption: 14px;
  --text-body: 16px;
  --text-body-lg: 18px;
  --text-subheading: 24px;
  --text-heading-sm: 32px;
  --text-heading: 40px;
  --text-heading-lg: 48px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;

  /* Border radius */
  --radius-input: 10px;
  --radius-card: 24px;
  --radius-container: 40px;
  --radius-pill: 9999px;
}
```

Indigo (`--color-indigo`) is defined but **not yet used anywhere in Genkin**
— every screen so far has only needed the monochrome palette plus success/
danger. It stays reserved for the same "glow accent only, never a fill"
role as the original system if a future screen calls for it. (Historical —
predates the shadcn migration; the indigo token is untouched by it.)

---

## shadcn Components (Genkin)

Genkin is built on [shadcn/ui](https://ui.shadcn.com) (`components.json`:
style `radix-nova`, base color `neutral`, icon library `phosphor`), themed
via the `brpK` preset rather than a from-scratch reskin. Components live in
`src/components/ui/` (shadcn-owned — re-run `shadcn add`/`diff` to update
rather than hand-editing where possible) and `src/components/` (app-owned
compositions). Mapping from the App Patterns above to what actually backs
them:

| App Pattern | shadcn primitive |
|---|---|
| Primary/Secondary Button | `Button` (`default`/`secondary`/`ghost`/`outline` variants) |
| Bottom Toolbar (Add / Page Switcher / Page Switcher Bar) | `Button` (`size="icon"` + default variant, default square radius), positioned by an app-owned fixed wrapper |
| Page Switcher (popup menu) | `DropdownMenu` (`src/components/ui/dropdown-menu.tsx`), trigger styled as a `Button` matching the old Month Drawer trigger; content re-styled per-row as sharp-cornered, content-hugging rows (not the shared `PopoverContent` surface), plus an app-owned blur overlay portaled to `document.body` |
| Form Field / Input | `Input` + `Label` |
| OTP Code Input | `InputOTP` |
| Bottom Sheet (add/edit expense), Filter Drawer, Month Drawer | `Sheet` (`side="bottom"`) |
| Category Picker, Filter Drawer, Month Drawer row lists | app-owned bordered/divided `<button>` rows, no shadcn equivalent — chips were tried and dropped for all three (worse scanning across many options; see **Avoid rounded chips**) |
| Delete confirmation (expense row) | `Dialog` |
| Auth Background | app-owned `AuthBackground.tsx`, no shadcn equivalent — backed by `@paper-design/shaders-react`'s `Dithering` component (WebGL, procedural `shape="warp"`), unrelated to shadcn/Radix |
| Toast/Snackbar | `Sonner` (`<Toaster />` mounted once at the app root) |
| Chart Card (Dashboard) | `Card` wrapping the existing Recharts charts |
| Segmented Progress Bar (budget usage) | app-owned `BudgetProgressBar.tsx`, no shadcn equivalent (plain flex row of divs, not the shadcn `Progress` primitive, to match the blocky reference style rather than a continuous fill) |
| Password Input | `Input` + icon `Button` (`variant="ghost" size="icon-sm"`) with Phosphor `Eye`/`EyeSlash`, composed inside the input |
| Empty State | `Card` + `Button`, composed manually |
| Top Nav | app-owned (no shadcn equivalent); title or Month+Filter mode composed with shadcn `Button` (`variant="ghost" size="icon-sm"` for the filter icon; Import's back arrow uses the same) |
| Loading spinner (`ProtectedRoute`) | `Skeleton`, or a Phosphor spinner icon + `animate-spin` |

New color/spacing/component additions going forward still follow the
project's hard rule: don't introduce one without documenting it here first.
For shadcn primitives, that means recording *which variant* backs a new
pattern (not re-deriving raw hex/px values, since shadcn owns those tokens).

---

## Gradient System

Gradients are atmospheric, never decorative chrome. Three uses only: (1) the full-bleed hero 'dawn wash' — cool blue fading to warm earth, evoking pre-sunrise sky; (2) a centered indigo radial spotlight behind hero content, the only place the brand accent appears and only as a glow, never as fill; (3) thin horizontal indigo hairlines (linear-gradient with transparent stops on either side of a central rgba(107,98,242,0.565) band) used as section dividers or accent strokes — always transparent→indigo→transparent, never solid. No gradient should ever appear on a button, card, or interactive surface.

## Glassmorphism Recipe

The signature surface treatment. Combine: background #1d1d1d or #282828 at 70–85% opacity, backdrop-filter blur(16–24px), 1px border #e5e5e5 at 6–10% opacity, optional inset top highlight (inset 0 1px 0 rgba(255,255,255,0.06)). Radius 24px for cards, 40px for large containers, 9999px for pills. Always float over the gradient hero or a layered dark surface — glassmorphism on flat #0a0a0a looks dead; it needs something colorful or lit behind it to read as glass.

## Similar Brands

- **Linear** — Same dark-mode near-monochrome aesthetic with one restrained accent, whisper-weight display type, and pill-shaped interactive elements
- **Vercel** — Shares the Geist typeface lineage and the black-canvas-plus-glassmorphism product-mockup pattern in hero sections
- **Raycast** — Dark glassmorphic product UI floating over gradient hero, monoline iconography, pill-shaped dock components
- **Arc Browser** — Soft dark surfaces, heavy use of 9999px pill radii, and atmospheric color washes that do the work of solid accents
- **Cron** — Same near-black canvas, muted indigo accent used only as gradient/glow, and editorial whisper-weight headlines

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void: #0a0a0a;
  --color-char: #1d1d1d;
  --color-iron: #3d3d3d;
  --color-slate: #505050;
  --color-smoke: #797979;
  --color-graphite: #161616;
  --color-ink: #282828;
  --color-fog: #686868;
  --color-mist: #c2c2c2;
  --color-ash: #b2b2b2;
  --color-bone: #e5e5e5;
  --color-paper: #ffffff;
  --color-onyx: #000000;
  --color-indigo-haze: #6b62f2;
  --gradient-indigo-haze: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 40%, rgba(107,98,242,0.565) 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0));
  --color-dawn-wash: #9cafb8;
  --gradient-dawn-wash: linear-gradient(180deg, rgb(72,103,175), rgb(156,175,184), rgb(196,149,119));

  /* Typography — Font Families */
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: 0.35px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.43;
  --text-subheading: 24px;
  --leading-subheading: 1.33;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.25;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.14;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -2.52px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 19px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 64px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-pill: 9999px;
  --radius-tags: 9999px;
  --radius-cards: 24px;
  --radius-inputs: 10px;
  --radius-buttons: 9999px;
  --radius-iconcontainers: 4px;
  --radius-largecontainers: 40px;

  /* Surfaces */
  --surface-void: #0a0a0a;
  --surface-char: #1d1d1d;
  --surface-iron: #3d3d3d;
  --surface-slate: #505050;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void: #0a0a0a;
  --color-char: #1d1d1d;
  --color-iron: #3d3d3d;
  --color-slate: #505050;
  --color-smoke: #797979;
  --color-graphite: #161616;
  --color-ink: #282828;
  --color-fog: #686868;
  --color-mist: #c2c2c2;
  --color-ash: #b2b2b2;
  --color-bone: #e5e5e5;
  --color-paper: #ffffff;
  --color-onyx: #000000;
  --color-indigo-haze: #6b62f2;
  --color-dawn-wash: #9cafb8;

  /* Typography */
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: 0.35px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.43;
  --text-subheading: 24px;
  --leading-subheading: 1.33;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.25;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.14;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -2.52px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 19px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 64px;
  --radius-full-2: 9999px;
}
```
