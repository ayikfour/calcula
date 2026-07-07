import NumberFlow from '@number-flow/react'
import { getCurrency, DEFAULT_CURRENCY_CODE } from '../lib/currencies'

interface Props {
  amount: number
  currencyCode?: string
  className?: string
}

// Drop-in replacement for formatCurrency() on surfaces where the amount can
// change while on screen — rolls the digits via NumberFlow instead of
// snapping to the new value. See design.md's "Amount Display" pattern for
// which currency uses which locale to match its separator style exactly.
export function AnimatedAmount({ amount, currencyCode = DEFAULT_CURRENCY_CODE, className }: Props) {
  const currency = getCurrency(currencyCode)
  return (
    <span className={className}>
      {currency.symbol}{' '}
      <NumberFlow
        value={amount}
        locales={currency.locale}
        format={{ minimumFractionDigits: currency.decimals, maximumFractionDigits: currency.decimals }}
      />
    </span>
  )
}
