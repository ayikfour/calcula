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

Full-width tappable row, 64px min-height, horizontal padding 20px, vertical padding 14px. Layout: icon well (36px circle, #282828 fill, 8px radius, emoji centered at 18px) | text stack (category name in #e5e5e5 16px weight 500 on line one; meta line in #686868 14px on line two: description + " · " + payer ("You" or partner's display name), or just the payer if no description) | amount (#e5e5e5 Geist 16px weight 500, tabular-nums, right-aligned). Rows separated by 1px #e5e5e5 hairlines at 6% opacity. Tapping anywhere on the row opens the edit sheet.

**Swipe-to-delete (`ExpenseRow.tsx`):** no persistent delete affordance on the row — swiping left reveals a fixed-width (76px) destructive panel (`bg-destructive/15`, `TrashSimple` icon) positioned underneath via `absolute inset-y-0 right-0`, with the row's own content sliding left via `transform: translateX()` to expose it. Implemented with the same manual pointer-event pattern as the bottom sheet's drag-to-dismiss (see below): `onPointerDown`/`onPointerMove`/`onPointerUp`, committing to a horizontal drag only once movement exceeds an 8px threshold *and* is more horizontal than vertical (so vertical list scrolling is never hijacked). Releasing past 50% of the reveal width snaps open; short of that, snaps closed. A tap with no committed drag either opens the edit sheet (row closed) or closes the row (row already open) — it never does both. Only one row can be swiped open at a time, tracked by `LogPage` (`openSwipeRowId`), so opening another row, the Filter drawer, the month dropdown, or the Add sheet all close whichever row is open first. Tapping the revealed delete button still opens the shared confirmation `Dialog` (page-level, not one per row) before calling delete — never a silent swipe-and-delete, since this is a shared couple's log.

### Amount Display
**Role:** Numeric money values throughout the app

Always Geist font, `font-variant-numeric: tabular-nums`, weight 500. List row amounts: 16px. Form input amounts: 32px centered. Neutral expense amounts: `--color-bone` (#e5e5e5).

Every amount is prefixed with the couple's selected currency symbol (`Rp`, `$`, `€`, …), set via the Currency Drawer on Settings (see below) and defaulting to Indonesian Rupiah. Formatting (decimal places, thousands/decimal separator) is per-currency, not a single global style — e.g. Rupiah renders with no decimals and a period thousands-separator (`Rp 150.000`), while USD/EUR render with 2 decimals and a comma thousands-separator (`$ 150.00`). See `src/lib/currencies.ts` for the per-currency formatting table and `formatCurrency()` in `src/lib/format.ts` for the formatter.

### Bottom Toolbar (Log screen)
**Role:** Add action + list filtering, fixed to the bottom of the Log screen

Fixed full-width row at the viewport bottom, `justify-between`, 20px horizontal padding, respecting `env(safe-area-inset-bottom)`. All three controls share one height — 48px (`h-12`) — so they read as a single action group despite the Add button being icon-only and the other two carrying text: Left: the Add button, `size="icon"` shadcn `Button` sized to 48×48 (`size-12`) — **square, not pill**, since the implemented theme's `--radius: 0` makes the default `rounded-lg` render as sharp corners; this is the current square button style, superseding the old pill-shaped FAB. Right: "Filter" button and the Month Drawer trigger (both plain `Button`s, `h-12 px-4`, trailing `CaretDown`), grouped with an 8px gap. Both styled with the same `bg-primary`/`text-primary-foreground` treatment as the Add button (white-on-dark) rather than the muted `secondary` variant. Active-filter state is shown as a leading count in the label itself — "Filter" becomes "1 · Filter" or "2 · Filter" — not a separate dot/badge. No background/blur behind the row — the three buttons float directly over the scrolling list, which carries `pb-24` so the last row always clears them.

### Bottom Sheet
**Role:** Add/edit expense form, slides up from bottom

Full-width panel anchored to viewport bottom. Top corners 24px radius, bottom 0. Glass surface (#1d1d1d at 92% opacity, backdrop blur 24px, 1px #e5e5e5 at 8% top border). Max-height 90vh, scrollable. Handle bar: 36×4px pill, #3d3d3d, centered 12px from top. Header row: title (DM Sans 18px weight 500 #e5e5e5) left, close button (ghost icon, 32px) right. Dark backdrop behind: rgba(0,0,0,0.6). Slide-up animation: 280ms ease transform.

**Drag-to-dismiss (implemented in `sheet.tsx`):** the whole sheet is
draggable, not just the handle — matching native bottom-sheet apps where you
can grab anywhere on the sheet body. A press-and-drag down commits to
dragging the sheet only once movement exceeds a 6px threshold *and* the
sheet's own scrollable body is at `scrollTop <= 0`; otherwise the same
downward motion scrolls the form as normal. This means a drag started
mid-scroll naturally hands off to dismiss-dragging the moment the content
reaches its top edge, and a plain tap/scroll never gets hijacked. Once
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
expense isn't already part of a recurring series — toggles Recurring on/off
directly on tap. The container is `inline-flex` and the segments size to
their own content (no `flex-1`) — the row is meant to read as a compact
control sitting in the corner, not a full-width bar, matching the
Filter/Month toolbar buttons' proportions rather than stretching edge to
edge. No segment uses `Chip` — chips read as filter/selection pills
elsewhere in the app, and this row is a direct-action control, not a
selection, so it gets the same bordered rectangle language as buttons
instead. Below that: the amount, given `py-6` (24px) of breathing room above
and below so it doesn't feel squeezed between the segmented row and the
description field, and a tight `gap-1` (4px) between the currency symbol and
the figure so they read as one unit rather than two separate elements; a
plain `Input` for description at the standard `h-12`
(48px) input height — a taller `h-[72px]` was tried and looked oversized/
disproportionate for a single-line field, so it stayed at the default — with
no `Label` above it — the placeholder carries the meaning,
though an `aria-label="Description"` keeps it named for screen readers; then
a final row pairing a `Button` (`variant="outline"`, icon + name + trailing
`CaretRight`) that opens the category picker with the full-width primary
Save `Button` — the category trigger used to be a `Chip` too, now it's a
bordered `Button` so it visually reads as the same weight of control as
"Add expense"/"Save changes" beside it, just secondary instead of
primary. The "Split" feature (the old evenly-split-expense toggle, its
`expenses.split` column, and the Balance screen that read it) has been
removed entirely — not just hidden from the UI. There is no split state to
track in this form anymore.

**Recurring toggle:** the third segment of the row above, labeled "🔁
Recurring" while off. Tapping it toggles `isRecurring` directly (no popover)
and, once on, swaps its own label to the current frequency ("🔁 Monthly")
with a trailing `Check` and the same `bg-secondary text-secondary-foreground`
treatment `Chip`'s selected state uses elsewhere — so the segment itself
communicates the current value, the same way the date and payer segments do.
Turning it on reveals a Weekly/Monthly/Yearly picker directly below the
description field, using the same bordered/divided row-list pattern as the
Filter Drawer (`rounded-lg border border-border`, rows with `border-b
border-border last:border-b-0`, `px-4 py-3.5`, trailing `Check` when
selected) — single-select, no Reset/Apply footer, since it's local to this
one field. If the expense being edited is already linked to an active
series, the third segment doesn't render at all (row goes back to two
segments) and a static muted line takes its place below the description
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

### Filter Drawer
**Role:** Category and payer filter on the Log screen, opened from a "Filter" button in the toolbar row

Bottom `Sheet` (same primitive/pattern as the Add/Edit Expense sheet — a sibling `Sheet` instance, not nested inline). Contains a "Paid by" list and a "Category" list, each under a small uppercase label — **vertical selectable lists, not `Chip`/pill rows**: chips were tried first but read poorly for scanning multiple options, so both groups render as a bordered, divided stack of full-width rows (`rounded-lg border border-border`, each row `border-b border-border last:border-b-0`, `px-4 py-3.5`), label left, a `Check` icon right when selected. "Paid by" is single-select (tapping the already-selected row clears it back to no filter). "Category" is **multi-select** — tapping toggles that category in/out of a `string[]`, any number can be active at once. Selections are staged locally and only committed on tap; a two-button footer (`SheetFooter`, row layout) holds "Reset" (secondary `Button`, clears both filters and closes) and "Filter" (primary `Button`, applies the staged selections and closes). The "Filter" toolbar button reflects active-filter count in its own label ("1 · Filter", "2 · Filter" — category selections and the payer selection each count toward the total) rather than a separate dot indicator.

### Month Drawer
**Role:** Filter the Log screen to a single month, shown next to the Filter button

Same `Sheet` + vertical list pattern as the Filter Drawer above (not a native `Select`, and not `Chip`/pill rows either — both were tried and dropped for the same readability reason). The trigger is a plain `Button` (`h-12 px-4`, trailing `CaretDown`) showing the current month; tapping it opens a bottom `Sheet` titled "Month" containing the same bordered/divided row-list component as the Filter Drawer, one row per available month — tapping a row selects it and closes the sheet immediately (single-select, no Reset/Apply footer — picking a month is a direct action, not a staged one). Options are generated dynamically from the distinct months present in the couple's `expense_date` values (not a static calendar list) — sorted most-recent-first, defaulting to the most recent month with data. Label shows just the month name ("October"), or "Month Year" if the couple's history spans more than one calendar year.

### Currency Drawer
**Role:** Currency picker on the Settings screen, changes the couple-level currency used to format every amount in the app

Same `Sheet` + vertical list pattern as the Month Drawer above — single-select, no Reset/Apply footer, tapping a row applies it and closes the sheet immediately (a couple-level setting change, not a staged/local one). The trigger is a Settings `Card` row (`rounded-lg bg-muted px-4 py-3.5`, matching the invite-code row style) showing the current currency as `{symbol} {name}`, with a trailing `CaretRight`. The list itself shows `{symbol} · {name}` per row (e.g. "Rp · Indonesian Rupiah") for a fixed set of currencies (see `src/lib/currencies.ts`), defaulting to Indonesian Rupiah. Selecting a currency updates `couples.currency_code` and is immediately visible to both members of the couple.

### Upcoming Recurring List
**Role:** Shows active recurring expenses and their next occurrence, above the grouped expense list on the Log screen

Only renders when at least one recurring expense is active (nothing shown otherwise). Same bordered/divided row-list pattern as the Filter Drawer, under the same small uppercase label style ("UPCOMING") used for date-group headers in the log below it. Each row: category icon + description/category name on the left, amount and "{Weekly/Monthly/Yearly} · next {date}" (via the same `formatDateLabel` used throughout) stacked on the right. There is no recurring-specific badge system elsewhere in the app — an expense generated from a series looks identical to a manually logged one in the grouped list below. Tapping a row opens the same confirmation `Dialog` pattern as deleting an expense (`LogPage.tsx`'s delete dialog) — "Stop this recurring expense?" / Cancel / destructive "Stop" — which sets the series inactive; it does not delete or affect any expenses already logged from it. There's no edit action here in v1 — changing amount/frequency means stopping the series and starting a new one.

### Empty State
**Role:** Log screen when no expenses exist yet

Centered column, 48px icon (stroke, #3d3d3d), heading DM Sans 18px weight 500 #e5e5e5, subtext 14px #686868. Button to add first expense (white pill, same as primary CTA). No illustration — the icon and copy do the work.

### Form Field / Input
**Role:** Text input in auth, onboarding, add-expense form

Full-width, height 48px, background #1d1d1d, border 1px #e5e5e5 at 10% opacity, radius 10px (`--radius-input`). Padding 12px 16px. DM Sans 16px weight 400, color #e5e5e5 placeholder color #686868. Focus state: border color #e5e5e5 at 30% opacity, no glow/shadow. Never use a colored focus ring — depth is expressed through opacity shift only.

### Primary Button (White Pill)
**Role:** Main submit/CTA in app screens

Full-width, height 48px, radius 9999px, background #ffffff, text #000000, DM Sans 16px weight 500. Loading state: reduced opacity (60%), disabled pointer-events. Same as the marketing CTA pill but full-width in a mobile context.

### Secondary Button (Glass Pill)
**Role:** Less prominent action (e.g. "Join instead", "Back")

Full-width, height 48px, radius 9999px, glass treatment (background #1d1d1d 80%, backdrop blur 20px, 1px #e5e5e5 at 10% border). Text #e5e5e5, DM Sans 16px weight 500.

### Mode Switcher (Segmented Pill)
**Role:** Toggle between two mutually exclusive modes (Create/Join on Onboarding; Password/Email code on the Auth screen)

Pill container, radius 9999px, background #1d1d1d, padding 4px. Two equal segments; active segment: background #3d3d3d, radius 9999px, text #e5e5e5 weight 500. Inactive: text #686868 weight 400. DM Sans 15px.

### Invite Code Display
**Role:** Show the invite code after creating a couple

Monospace code block: background #282828 (`--color-ink`), radius 10px, padding 16px 20px. Code text: Geist font, 24px weight 500, letter-spacing 0.1em, color #e5e5e5. Centered. Accompanied by a copy-to-clipboard icon button (32px, icon-only, ghost).

### Mobile Top Nav (App Shell)
**Role:** Primary navigation across the app's 3 screens (Logs, Stats, Settings)

Full-width fixed bar at top, replacing the earlier bottom nav now that the Balance screen (and its 4th tab) has been removed. Plain text-button tabs — no icons — in `font-heading` 18px weight 500, `gap-5` between tabs, `px-5` horizontal padding. Active tab: `--foreground`. Inactive: `--muted-foreground`, hover `--foreground`. No background fill or border — the bar is fully transparent and floats directly over whatever scrolls beneath it, keeping the page's own background as the only surface. Padding respects `env(safe-area-inset-top)` instead of the bottom inset.

Since the active tab already names the screen, none of the three pages (Logs, Stats, Settings) render their own duplicate `<h1>` page heading — content starts directly with the first card/row, relying on the nav label alone for orientation.

### Success/Danger Semantic Tones
**Role:** Form error states, Dashboard/Stats month-over-month delta indicator

Success: `#4ade80` (muted green — readable on dark surfaces without being neon). Danger: `#f87171` (muted red). Outside the indigo accent, these are the only chromatic colors used in UI chrome (buttons, backgrounds, borders) — the one further exception is the Category Color Palette below, scoped strictly to chart data.

### Toast / Snackbar
**Role:** Brief confirmation after an action (expense added/updated/deleted) — feedback that doesn't require dismissal

Fixed, bottom-centered above the FAB/nav, glass pill (background #1d1d1d 90%, backdrop blur 20px, 1px #e5e5e5 at 10% border), radius 9999px, padding 12px 20px. DM Sans 14px weight 500, color #e5e5e5. Optional leading checkmark in `--color-success`. Slides up + fades in (200ms), auto-dismisses after 2.5s, no manual close control — keep it out of the way of the next action.

### OTP Code Input
**Role:** Code-entry step wherever email ownership needs verifying — the Email code tab's sign-in (fallback to tapping the magic link), password sign-up confirmation, and password recovery, on the Auth screen

Built on shadcn's `InputOTP`, two groups of 4 boxes separated by a divider (`InputOTPSeparator`). **8 digits, not 6** — this project's `genkin-dev` Supabase instance issues 8-digit email OTPs for the Magic Link template (re-check the prod project if this ever changes, and re-check the Confirm Signup/Reset Password templates too if their digit count ever diverges from the Magic Link one). In the Email code tab, sits below the "Check your email" copy as a secondary path, separated by a hairline divider with "or enter the code" label. Verify action reuses the primary `Button`.

Tapping the emailed magic link always opens the OS default browser, never an installed PWA — and on iOS the installed PWA's storage is sandboxed separately from Safari, so a sign-in completed in the browser tab can't hand off a session to the home-screen app anyway. [EmailCodeAuthForm.tsx](src/components/EmailCodeAuthForm.tsx) and [PasswordAuthForm.tsx](src/components/PasswordAuthForm.tsx) both detect standalone display mode (`isStandalonePwa()` in [utils.ts](src/lib/utils.ts)) and swap the "check your email" copy to lead with the code (and drop the "or") when running installed, since the code path is the only one that reliably works there. The manifest also sets `capture_links: 'existing-client-navigate'`, which lets Chromium/Android PWAs capture the link back into the existing app window — no iOS equivalent exists, so the code path stays the primary fix.

For local testing where the magic link can't reach the environment (e.g. a preview pane with its own browser context, separate from your inbox), `scripts/dev-otp.mjs` generates a real OTP via the Supabase admin API for any of the three flows (`magiclink`/`signup`/`recovery`) — no email round-trip needed. See the script's header comment for usage.

### Password Input
**Role:** Password entry on the Auth screen's Password tab (sign-in, sign-up, recovery) and Settings' Change Password action

Wraps the standard Form Field/Input pattern above (same 48px height, `#1d1d1d` background, 10px radius — no new tokens) with a visibility toggle: a ghost icon `Button` (`size="icon-sm"`, 28px, the compact size reserved for secondary chrome) absolutely positioned inside the input's trailing edge, swapping Phosphor `Eye`/`EyeSlash` to switch the field between `type="password"` and `type="text"`.

### Chart Card
**Role:** Container for each Recharts visualization on the Dashboard screen

Glass surface (`--color-char` background, 1px hairline border, `--radius-card`), padding 20px. Header row: title (DM Sans 15px weight 500, `--color-bone`) with an optional right-aligned stat or delta badge. Chart fills the remaining width, fixed height (160–220px depending on chart type) so cards stack predictably. Axis labels and gridlines stay muted (`--color-graphite`/`--color-fog`, never full white) so the data itself — not chrome — carries the color. Tooltips reuse the glass treatment (blurred dark pill, hairline border).

### Category Color Palette
**Role:** Distinguishing categories in the Dashboard's category breakdown donut — the only place beyond Success/Danger where multiple chromatic colors appear together

A fixed, muted 8-color set — one per seeded category, desaturated enough to sit comfortably on the dark canvas without competing with indigo:

| Category | Color |
|---|---|
| Groceries | `#f0a868` (muted amber) |
| Food & Drink | `#e8847c` (muted coral) |
| Transport | `#6ba3d6` (muted blue) |
| Rent/Bills | `#9b8cd9` (muted violet) |
| Entertainment | `#e0a8d8` (muted pink) |
| Health | `#7bc9a8` (muted teal) |
| Shopping | `#d6c178` (muted gold) |
| Other | `#8a8a8a` (neutral gray) |

Used only for chart fills/legends (donut segments, legend dots) — never for buttons, badges, or backgrounds elsewhere in the app.

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
>   [SettingsPage.tsx](src/pages/SettingsPage.tsx),
>   [OnboardingPage.tsx](src/pages/OnboardingPage.tsx), and
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
| Bottom Toolbar (Add/Filter/Month) | `Button` (`size="icon"` + default variant, default square radius), positioned by an app-owned fixed wrapper |
| Form Field / Input | `Input` + `Label` |
| OTP Code Input | `InputOTP` |
| Bottom Sheet (add/edit expense), Filter Drawer, Month Drawer | `Sheet` (`side="bottom"`) |
| Category Picker, Filter Drawer, Month Drawer row lists | app-owned bordered/divided `<button>` rows, no shadcn equivalent — chips were tried and dropped for all three (worse scanning across many options; see **Avoid rounded chips**) |
| Delete confirmation (expense row) | `Dialog` |
| Mode Switcher (Create/Join; Password/Email code) | `Tabs`, styled as a segmented control |
| Toast/Snackbar | `Sonner` (`<Toaster />` mounted once at the app root) |
| Chart Card (Dashboard) | `Card` wrapping the existing Recharts charts |
| Invite Code Display | `Input` (readOnly) + icon `Button` (copy), composed manually |
| Password Input | `Input` + icon `Button` (`variant="ghost" size="icon-sm"`) with Phosphor `Eye`/`EyeSlash`, composed inside the input |
| Empty State | `Card` + `Button`, composed manually |
| Top Nav | app-owned (no shadcn equivalent); restyled with shadcn tokens + `cn()` |
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
