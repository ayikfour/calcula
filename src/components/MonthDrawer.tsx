import { useState } from 'react'
import { CaretDown, Check } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

interface Props {
  months: string[] // 'YYYY-MM', most recent first
  selectedMonth: string
  onSelect: (month: string) => void
  triggerClassName?: string
}

function monthLabel(month: string, multiYear: boolean): string {
  const [year, m] = month.split('-')
  const date = new Date(Number(year), Number(m) - 1, 1)
  const label = date.toLocaleDateString('en-US', { month: 'long' })
  return multiYear ? `${label} ${year}` : label
}

export function MonthDrawer({ months, selectedMonth, onSelect, triggerClassName }: Props) {
  const [open, setOpen] = useState(false)
  const multiYear = new Set(months.map(m => m.slice(0, 4))).size > 1

  if (months.length === 0) return null

  return (
    <>
      <Button onClick={() => setOpen(true)} className={`gap-1.5 ${triggerClassName ?? ''}`}>
        {monthLabel(selectedMonth, multiYear)}
        <CaretDown className="size-3.5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto overscroll-contain rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Month</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-4">
            <div className="overflow-hidden rounded-lg border border-border">
              {months.map(month => {
                const selected = selectedMonth === month
                return (
                  <button
                    key={month}
                    onClick={() => { onSelect(month); setOpen(false) }}
                    className="flex w-full items-center justify-between border-b border-border px-4 py-3.5 text-left text-sm font-medium text-foreground last:border-b-0"
                  >
                    {monthLabel(month, multiYear)}
                    {selected && <Check className="size-4" weight="bold" />}
                  </button>
                )
              })}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
