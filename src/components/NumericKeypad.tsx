import { Backspace } from '@phosphor-icons/react'

interface Props {
  onDigit: (digit: string) => void
  onBackspace: () => void
  decimalDisabled: boolean
}

const KEY_CLASS =
  'flex h-14 items-center justify-center rounded-lg font-heading text-2xl font-medium text-foreground transition-colors hover:bg-muted active:bg-muted disabled:pointer-events-none disabled:opacity-30'

// Calculator-style entry pad for the amount field in AddExpenseSheet — see
// design.md's "Amount Keypad" pattern. Decimal placement is automatic (see
// amountUnits.ts), so the "." key is purely a disabled/muted placeholder for
// 0-decimal currencies (IDR, JPY) to keep the 3x4 grid visually consistent.
export function NumericKeypad({ onDigit, onBackspace, decimalDisabled }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => (
        <button key={d} type="button" className={KEY_CLASS} onClick={() => onDigit(d)}>
          {d}
        </button>
      ))}
      <button type="button" className={KEY_CLASS} disabled={decimalDisabled}>
        .
      </button>
      <button type="button" className={KEY_CLASS} onClick={() => onDigit('0')}>
        0
      </button>
      <button
        type="button"
        aria-label="Backspace"
        className={KEY_CLASS}
        onClick={onBackspace}
      >
        <Backspace className="size-6" />
      </button>
    </div>
  )
}
