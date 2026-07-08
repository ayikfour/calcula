import { useState, useEffect } from 'react'
import NumberFlow from '@number-flow/react'
import { toast } from 'sonner'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { getCurrency, DEFAULT_CURRENCY_CODE } from '../lib/currencies'
import { appendDigits, backspace, unitsToAmount, amountToUnits } from '../lib/amountUnits'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { NumericKeypad } from '@/components/NumericKeypad'

interface Props {
  isOpen: boolean
  onClose: () => void
  currentAmount: number
  effectiveMonth: string
  refetchBudgets: () => void
}

export function MonthlyBudgetSheet({ isOpen, onClose, currentAmount, effectiveMonth, refetchBudgets }: Props) {
  const { user, couple } = useAuth()
  const currency = getCurrency(couple?.currency_code ?? DEFAULT_CURRENCY_CODE)

  const [amountUnits, setAmountUnits] = useState('0')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setAmountUnits(amountToUnits(currentAmount, currency.decimals))
  }, [isOpen, currentAmount, currency.decimals])

  async function handleSave() {
    const amount = unitsToAmount(amountUnits, currency.decimals)
    setSaving(true)
    const { error } = await supabase
      .from('budgets')
      .upsert(
        { couple_id: couple!.couple_id, user_id: user!.id, monthly_amount: amount, effective_month: `${effectiveMonth}-01` },
        { onConflict: 'couple_id,user_id,effective_month' },
      )
    setSaving(false)
    if (error) {
      toast('Could not update budget')
      return
    }
    toast('Budget updated')
    refetchBudgets()
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Monthly budget</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-4">
          <div className="flex items-center justify-center gap-1">
            <span className="font-heading text-2xl font-medium text-muted-foreground">
              {currency.symbol}
            </span>
            <span className="font-heading text-5xl font-medium text-foreground">
              <NumberFlow
                value={unitsToAmount(amountUnits, currency.decimals)}
                locales={currency.locale}
                format={{ minimumFractionDigits: currency.decimals, maximumFractionDigits: currency.decimals }}
              />
            </span>
          </div>

          <NumericKeypad
            onDigit={d => setAmountUnits(u => appendDigits(u, d))}
            onBackspace={() => setAmountUnits(u => backspace(u))}
          />
        </div>

        <SheetFooter className="flex-row">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} className="flex-1" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
