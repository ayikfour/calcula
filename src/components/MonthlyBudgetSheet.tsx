import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { supabase } from '../lib/supabase'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  isOpen: boolean
  onClose: () => void
  userId: string
  coupleId: string
  currentAmount: number
  effectiveMonth: string
  refetchBudgets: () => void
}

export function MonthlyBudgetSheet({ isOpen, onClose, userId, coupleId, currentAmount, effectiveMonth, refetchBudgets }: Props) {
  const [amountInput, setAmountInput] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setAmountInput(currentAmount > 0 ? String(currentAmount) : '')
  }, [isOpen, currentAmount])

  async function handleSave() {
    const amount = Number(amountInput)
    if (!Number.isFinite(amount) || amount < 0) return
    setSaving(true)
    const { error } = await supabase
      .from('budgets')
      .upsert(
        { couple_id: coupleId, user_id: userId, monthly_amount: amount, effective_month: `${effectiveMonth}-01` },
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

        <form onSubmit={e => { e.preventDefault(); handleSave() }} className="space-y-3 px-4 pb-4">
          <div className="space-y-1.5">
            <Label htmlFor="settings-budget">Your monthly budget</Label>
            <Input
              id="settings-budget"
              type="number"
              min="0"
              step="1"
              inputMode="decimal"
              placeholder="0"
              value={amountInput}
              onChange={e => setAmountInput(e.target.value)}
              required
            />
          </div>
        </form>

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
