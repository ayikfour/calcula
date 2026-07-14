import { Export } from '@phosphor-icons/react'
import type { Insight } from '../lib/spendingInsights'

interface Props {
  insight: Insight
  size: 'card' | 'export'
  /** 1-based position within the carousel — card size only. */
  index?: number
  /** Total insight count — card size only. */
  total?: number
  /** e.g. "JUL 2026" — export size only, replaces the "NN / NN" counter since the image is self-contained once shared. */
  monthLabel?: string
  /** Makes the whole card a tap target that opens the share sheet — card size only. Also shows the export icon hint and the border beam pulse. */
  onTap?: () => void
  /** Shows `titleRevealed`/`detailRevealed` (raw currency amounts) instead of the default relative framing. Defaults to false. */
  revealed?: boolean
}

// Single kanji per insight, chosen for its literal meaning (expense, peak,
// bottom, pay, rest, new, average, week...) — a decorative background
// glyph, not a translation of the copy.
const INSIGHT_KANJI: Record<string, string> = {
  milestone: '続',
  recap: '総',
  'spending-persona': '型',
  'top-category': '費',
  'partner-category-comparison': '対',
  'highest-day': '山',
  'lowest-day': '底',
  'biggest-expense': '大',
  'category-mom-change': '増',
  'category-mom-drop': '減',
  'who-paid-more': '払',
  'no-spend-streak': '禅',
  'no-spend-days': '休',
  'logging-streak': '連',
  'new-category': '新',
  'avg-transaction': '均',
  'weekday-weekend': '週',
}

// Short footer labels — the raw insight.id (e.g. "partner-category-comparison")
// wraps to two lines and crowds the "Verified ✓" stamp at the card's small
// footer width. These stay under ~10 characters so the footer always fits
// on one line at both the card and export sizes.
const INSIGHT_SHORT_LABEL: Record<string, string> = {
  milestone: 'MILESTONE',
  recap: 'WRAPPED',
  'spending-persona': 'PERSONA',
  'top-category': 'TOP CAT',
  'partner-category-comparison': 'VS PARTNER',
  'highest-day': 'PEAK DAY',
  'lowest-day': 'QUIET DAY',
  'biggest-expense': 'BIG SPEND',
  'category-mom-change': 'TREND',
  'category-mom-drop': 'COOLDOWN',
  'who-paid-more': 'WHO PAID',
  'no-spend-streak': 'DRY SPELL',
  'no-spend-days': 'NO SPEND',
  'logging-streak': 'STREAK',
  'new-category': 'NEW CAT',
  'avg-transaction': 'AVG SPEND',
  'weekday-weekend': 'WEEKDAY',
}

const CORNER_POSITIONS = [
  'left-0 top-0 border-t border-l',
  'right-0 top-0 border-t border-r',
  'left-0 bottom-0 border-b border-l',
  'right-0 bottom-0 border-b border-r',
]

function CornerBrackets({ size }: { size: 'card' | 'export' }) {
  const dim = size === 'export' ? 'size-10 border-[3px]' : 'size-2.5'
  return (
    <>
      {CORNER_POSITIONS.map(pos => (
        <span key={pos} aria-hidden className={`pointer-events-none absolute border-muted-foreground/40 ${dim} ${pos}`} />
      ))}
    </>
  )
}

function DiamondGlyph({ size = 9 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 9 9" fill="none" aria-hidden className="shrink-0">
      <path d="M4.5 0.5L8.5 4.5L4.5 8.5L0.5 4.5L4.5 0.5Z" stroke="currentColor" strokeWidth="0.75" />
      <circle cx="4.5" cy="4.5" r="0.75" fill="currentColor" />
    </svg>
  )
}

// Deterministic fake barcode — bar widths derived from the insight id so it
// stays stable across renders, purely decorative.
function Barcode({ seed, scale = 1 }: { seed: string; scale?: number }) {
  const widths = Array.from(seed).map(c => ((c.charCodeAt(0) % 2) + 1) * scale)
  return (
    <div className="flex shrink-0 items-stretch gap-px" style={{ height: 10 * scale }} aria-hidden>
      {widths.map((w, i) => (
        <span key={i} className="bg-current" style={{ width: w }} />
      ))}
    </div>
  )
}

export function InsightTicket({ insight, size, index, total, monthLabel, onTap, revealed = false }: Props) {
  const kanji = INSIGHT_KANJI[insight.id] ?? '銭'
  const shortLabel = INSIGHT_SHORT_LABEL[insight.id] ?? insight.id
  const title = revealed ? (insight.titleRevealed ?? insight.title) : insight.title
  const detail = revealed ? (insight.detailRevealed ?? insight.detail) : insight.detail
  // Spoken description for screen readers: prefer the detail line, but for
  // stat-list cards (recap) the detail is empty, so read the stats instead of
  // leaving a bare title.
  const spokenBody = detail || insight.stats?.map(s => `${s.label}: ${s.value}`).join('. ') || ''
  const spoken = spokenBody ? `${title}. ${spokenBody}` : title

  if (size === 'export') {
    return (
      <div className="relative isolate h-[1920px] w-[1080px] overflow-hidden bg-background">
        <span aria-hidden className="pointer-events-none absolute -top-16 -right-10 -z-10 font-heading text-[420px] font-bold opacity-[0.06]">
          {kanji}
        </span>

        <CornerBrackets size="export" />

        <div className="flex h-full flex-col px-16 py-14">
          <div className="flex items-center justify-between font-mono text-[22px] tracking-[0.2em] text-muted-foreground/70 uppercase">
            <span className="flex items-center gap-3 text-muted-foreground">
              <DiamondGlyph size={22} />
              Insight
            </span>
            <span>{monthLabel}</span>
          </div>

          <div className="mt-6 border-t border-border" />

          {/* normal-case guards against a modern-screenshot rasterization quirk
              where the header row's `uppercase` bleeds into this sibling block
              in the captured PNG, even though it doesn't in the live DOM. */}
          <div className="flex flex-1 flex-col justify-center normal-case">
            {insight.stats ? (
              <>
                <div className="flex items-center gap-6">
                  <div className="flex size-24 items-center justify-center rounded-2xl bg-muted text-6xl">{insight.emoji}</div>
                  <p className="font-heading text-[52px] leading-[1.15] font-medium text-foreground">{title}</p>
                </div>
                <dl className="mt-12 flex flex-col">
                  {insight.stats.map(stat => (
                    <div key={stat.label} className="flex items-baseline justify-between gap-6 border-t border-border py-6 last:border-b">
                      <dt className="font-mono text-[24px] tracking-[0.15em] text-muted-foreground uppercase">{stat.label}</dt>
                      <dd className="font-heading text-[40px] font-medium text-foreground">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : (
              <>
                <div className="flex size-32 items-center justify-center rounded-2xl bg-muted text-7xl">{insight.emoji}</div>
                <p className="mt-10 font-heading text-[52px] leading-[1.15] font-medium text-foreground">{title}</p>
                <p className="mt-6 text-[32px] leading-relaxed text-muted-foreground">{detail}</p>
              </>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border pt-6 text-muted-foreground/60">
            <div className="flex items-center gap-4">
              <Barcode seed={insight.id} scale={4} />
              <span className="font-mono text-[20px] tracking-[0.15em] uppercase">{shortLabel}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[20px] tracking-[0.15em] uppercase">Genkin</span>
              <span className="font-mono text-[20px] tracking-[0.15em] uppercase">Verified ✓</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative isolate h-64 w-full shrink-0 snap-center overflow-hidden ${onTap ? 'cursor-pointer' : ''}`}
      aria-label={onTap ? `${spoken}. Tap to share.` : spoken}
      role={onTap ? 'button' : undefined}
      onClick={onTap}
    >
      {onTap && (
        <>
          <span aria-hidden className="insight-beam-glow pointer-events-none absolute inset-0 z-20" />
          <span aria-hidden className="insight-beam-ring pointer-events-none absolute inset-0 z-20" />
        </>
      )}

      <span aria-hidden className="pointer-events-none absolute -top-5 -right-3 -z-10 font-heading text-9xl font-bold opacity-[0.06]">
        {kanji}
      </span>

      <CornerBrackets size="card" />

      <div className="flex h-full flex-col px-3.5 py-3">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <DiamondGlyph />
            Insight
          </span>
          <span className="flex items-center gap-2">
            {onTap && <Export aria-hidden className="size-3 text-muted-foreground" />}
            <span>
              {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </span>
        </div>

        <div className="mt-2 border-t border-border" />

        {insight.stats ? (
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-md bg-muted text-lg">{insight.emoji}</div>
              <p className="font-heading text-sm font-medium text-foreground">{title}</p>
            </div>
            <dl className="mt-3 flex flex-col">
              {insight.stats.map(stat => (
                <div key={stat.label} className="flex items-baseline justify-between gap-2 border-t border-border py-1.5 last:border-b">
                  <dt className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">{stat.label}</dt>
                  <dd className="font-heading text-xs font-medium text-foreground">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : (
          <div className="mt-4">
            <div className="flex size-11 items-center justify-center rounded-lg bg-muted text-2xl">{insight.emoji}</div>
            <p className="mt-3 font-heading text-sm font-medium text-foreground">{title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{detail}</p>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-border pt-2 text-muted-foreground/60">
          <div className="flex items-center gap-1.5">
            <Barcode seed={insight.id} />
            <span className="font-mono text-[9px] tracking-[0.15em] uppercase">{shortLabel}</span>
          </div>
          <span className="font-mono text-[9px] tracking-[0.15em] uppercase">Verified ✓</span>
        </div>
      </div>
    </div>
  )
}
