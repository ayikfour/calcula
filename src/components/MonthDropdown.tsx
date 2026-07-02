import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Props {
  months: string[] // 'YYYY-MM', most recent first
  selectedMonth: string
  onSelect: (month: string) => void
}

function monthLabel(month: string, multiYear: boolean): string {
  const [year, m] = month.split('-')
  const date = new Date(Number(year), Number(m) - 1, 1)
  const label = date.toLocaleDateString('en-US', { month: 'long' })
  return multiYear ? `${label} ${year}` : label
}

export function MonthDropdown({ months, selectedMonth, onSelect }: Props) {
  const multiYear = new Set(months.map(m => m.slice(0, 4))).size > 1

  if (months.length === 0) return null

  return (
    <Select value={selectedMonth} onValueChange={onSelect}>
      <SelectTrigger>
        <SelectValue>{monthLabel(selectedMonth, multiYear)}</SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        {months.map(month => (
          <SelectItem key={month} value={month}>
            {monthLabel(month, multiYear)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
