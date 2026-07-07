// Backing model for the calculator-style keypad in AddExpenseSheet — digits
// build the value from the smallest currency unit up (like Venmo/Cash App),
// so the displayed amount is always a complete, correctly-formatted number
// after every keystroke instead of a dangling decimal string.
const MAX_DIGITS = 9

export function appendDigit(units: string, digit: string): string {
  const next = units === '0' ? digit : units + digit
  return next.slice(0, MAX_DIGITS)
}

export function backspace(units: string): string {
  return units.slice(0, -1) || '0'
}

export function unitsToAmount(units: string, decimals: number): number {
  return Number(units || '0') / 10 ** decimals
}

export function amountToUnits(amount: number, decimals: number): string {
  return String(Math.round(amount * 10 ** decimals))
}
