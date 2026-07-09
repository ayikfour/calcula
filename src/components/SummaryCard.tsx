import { CaretRight } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { YOU_COLOR, PARTNER_COLOR } from '@/lib/personColors'
import { AnimatedAmount } from './AnimatedAmount'
import { BudgetProgressBar } from './BudgetProgressBar'

interface Pacing {
  maxSpend: number
  usedPct: number
  overBudget: boolean
}

interface SummaryCardProps {
  compact: boolean
  label: string
  amount: number
  currencyCode?: string
  pacing: Pacing | null
  youAmount: number
  partnerAmount: number
  partnerName?: string
  onClick: () => void
}

// Full-bleed bar, not a Card — same fixed-nav-style translucent blur
// backdrop as TopNav (rather than a card surface color) so it stays
// readable pinned over the scrolling list without looking like a floating
// card at the screen edges. Two structural variants (expanded/compact,
// driven by scroll-pin state in LogPage) and two content modes:
// today-with-pacing and past-date (pacing is always null for past dates —
// "$X left today" has no meaning for a day that isn't today).
export function SummaryCard({
  compact,
  label,
  amount,
  currencyCode,
  pacing,
  youAmount,
  partnerAmount,
  partnerName,
  onClick,
}: SummaryCardProps) {
  return (
    <div role="button" onClick={onClick} className="relative cursor-pointer overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
      <div className={cn('relative px-5 transition-[padding] duration-300 ease-out', compact ? 'py-4' : 'py-3.5')}>
        <div className="flex items-center gap-1">
          <span className="text-xs tracking-wide text-muted-foreground uppercase">{label}</span>
          <CaretRight className="size-3.5 text-muted-foreground" />
        </div>

        <div className="mt-1 flex items-start justify-between">
          <p
            className={cn(
              'font-heading font-medium text-foreground transition-[font-size] duration-300 ease-out',
              compact ? 'text-xl' : 'text-3xl',
            )}
          >
            <AnimatedAmount amount={amount} currencyCode={currencyCode} />
          </p>
          {pacing !== null && (
            <span
              className="mt-1 text-xs font-medium"
              style={{ color: pacing.overBudget ? 'var(--color-danger)' : 'var(--color-success)' }}
            >
              {pacing.overBudget
                ? <>Over by <AnimatedAmount amount={Math.abs(pacing.maxSpend - amount)} currencyCode={currencyCode} /></>
                : <><AnimatedAmount amount={pacing.maxSpend - amount} currencyCode={currencyCode} /> left today</>}
            </span>
          )}
        </div>

        {pacing !== null && (
          <div
            className={cn(
              'grid transition-[grid-template-rows] duration-300 ease-out',
              compact ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]',
            )}
          >
            <div className={cn('overflow-hidden transition-opacity duration-300 ease-out', compact ? 'opacity-0' : 'opacity-100')}>
              <p className="mt-1 mb-1 text-xs text-muted-foreground">
                Max today: <AnimatedAmount amount={pacing.maxSpend} currencyCode={currencyCode} />
              </p>
              <div className="mt-1">
                <BudgetProgressBar usedPct={pacing.usedPct} overBudget={pacing.overBudget} compact />
              </div>
            </div>
          </div>
        )}

        {partnerName && (
          <div
            className={cn(
              'grid transition-[grid-template-rows] duration-300 ease-out',
              compact ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
            )}
          >
            <div className={cn('overflow-hidden transition-opacity duration-300 ease-out', compact ? 'opacity-100' : 'opacity-0')}>
              {/* Who-paid comparison, same continuous two-tone bar as Dashboard's
                  "Who paid" card (YOU_COLOR/PARTNER_COLOR, no gap) — swaps in
                  for the compact bar's collapsed pacing detail, scaled to the
                  compact block height. */}
              <div className="mt-1.5 flex h-1.5">
                <div
                  style={{ width: `${youAmount + partnerAmount > 0 ? (youAmount / (youAmount + partnerAmount)) * 100 : 50}%`, background: YOU_COLOR }}
                />
                <div
                  style={{ width: `${youAmount + partnerAmount > 0 ? (partnerAmount / (youAmount + partnerAmount)) * 100 : 50}%`, background: PARTNER_COLOR }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="font-medium text-foreground">
            You · <AnimatedAmount amount={youAmount} currencyCode={currencyCode} />
          </span>
          {partnerName && (
            <span className="font-medium text-muted-foreground">
              {partnerName} · <AnimatedAmount amount={partnerAmount} currencyCode={currencyCode} />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
