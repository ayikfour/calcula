import { useMemo, useRef, useState } from 'react'
import { generateInsights } from '../lib/spendingInsights'
import type { Expense, Category, SpaceMember } from '../types'

interface Props {
  monthExpenses: Expense[]
  lastMonthExpenses: Expense[]
  expensesBeforeThisMonth: Expense[]
  categories: Category[]
  members: SpaceMember[]
  userId: string | undefined
  currencyCode: string
  daysElapsed: number
}

// Single kanji per insight, chosen for its literal meaning (expense, peak,
// bottom, pay, rest, new, average, week...) — a decorative background
// glyph, not a translation of the copy.
const INSIGHT_KANJI: Record<string, string> = {
  'top-category': '費',
  'partner-category-comparison': '対',
  'highest-day': '山',
  'lowest-day': '底',
  'biggest-expense': '大',
  'category-mom-change': '増',
  'who-paid-more': '払',
  'no-spend-days': '休',
  'logging-streak': '連',
  'new-category': '新',
  'avg-transaction': '均',
  'weekday-weekend': '週',
}

const CORNER_POSITIONS = [
  'left-0 top-0 border-t border-l',
  'right-0 top-0 border-t border-r',
  'left-0 bottom-0 border-b border-l',
  'right-0 bottom-0 border-b border-r',
]

function CornerBrackets() {
  return (
    <>
      {CORNER_POSITIONS.map(pos => (
        <span key={pos} aria-hidden className={`pointer-events-none absolute size-2.5 border-muted-foreground/40 ${pos}`} />
      ))}
    </>
  )
}

function DiamondGlyph() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden className="shrink-0">
      <path d="M4.5 0.5L8.5 4.5L4.5 8.5L0.5 4.5L4.5 0.5Z" stroke="currentColor" strokeWidth="0.75" />
      <circle cx="4.5" cy="4.5" r="0.75" fill="currentColor" />
    </svg>
  )
}

// Deterministic fake barcode — bar widths derived from the insight id so it
// stays stable across renders, purely decorative.
function Barcode({ seed }: { seed: string }) {
  const widths = Array.from(seed).map(c => (c.charCodeAt(0) % 2) + 1)
  return (
    <div className="flex h-2.5 shrink-0 items-stretch gap-px" aria-hidden>
      {widths.map((w, i) => (
        <span key={i} className="bg-current" style={{ width: w }} />
      ))}
    </div>
  )
}

export function SpendingInsightsCard({
  monthExpenses,
  lastMonthExpenses,
  expensesBeforeThisMonth,
  categories,
  members,
  userId,
  currencyCode,
  daysElapsed,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const insights = useMemo(
    () =>
      generateInsights({
        monthExpenses,
        lastMonthExpenses,
        expensesBeforeThisMonth,
        categories,
        members,
        userId,
        currencyCode,
        daysElapsed,
      }),
    [monthExpenses, lastMonthExpenses, expensesBeforeThisMonth, categories, members, userId, currencyCode, daysElapsed],
  )

  function handleScroll() {
    const track = trackRef.current
    if (!track || track.clientWidth === 0) return
    setActiveIndex(Math.round(track.scrollLeft / track.clientWidth))
  }

  if (insights.length === 0) {
    return (
      <div className="border-b border-border px-5 py-5 last:border-b-0">
        <p className="text-sm text-muted-foreground">Nothing to roast yet — log a few expenses first.</p>
      </div>
    )
  }

  return (
    <div className="border-b border-border px-5 py-5 last:border-b-0">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [overflow-anchor:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {insights.map((insight, i) => (
          <div
            key={insight.id}
            className="relative isolate h-56 w-full shrink-0 snap-center overflow-hidden"
            aria-label={`${insight.title}. ${insight.detail}`}
          >
            <span aria-hidden className="pointer-events-none absolute -top-5 -right-3 -z-10 font-heading text-9xl font-bold opacity-[0.06]">
              {INSIGHT_KANJI[insight.id] ?? '銭'}
            </span>

            <CornerBrackets />

            <div className="flex h-full flex-col px-3.5 py-3">
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <DiamondGlyph />
                  Insight
                </span>
                <span>
                  {String(i + 1).padStart(2, '0')} / {String(insights.length).padStart(2, '0')}
                </span>
              </div>

              <div className="mt-2 border-t border-border" />

              <div className="mt-4">
                <div className="flex size-11 items-center justify-center rounded-lg bg-muted text-2xl">{insight.emoji}</div>
                <p className="mt-3 font-heading text-sm font-medium text-foreground">{insight.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{insight.detail}</p>
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-border pt-2 text-muted-foreground/60">
                <div className="flex items-center gap-1.5">
                  <Barcode seed={insight.id} />
                  <span className="font-mono text-[9px] tracking-[0.15em] uppercase">{insight.id}</span>
                </div>
                <span className="font-mono text-[9px] tracking-[0.15em] uppercase">Verified ✓</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {insights.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
          {insights.map((insight, i) => (
            <span key={insight.id} className={`h-0.5 w-1.5 ${i === activeIndex ? 'bg-foreground' : 'bg-muted'}`} />
          ))}
        </div>
      )}
    </div>
  )
}
