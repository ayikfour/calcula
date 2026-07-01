import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import type { Expense, Category, CoupleMember } from '../types'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSaved: (action: 'added' | 'updated' | 'deleted') => void
  expense?: Expense | null
  categories: Category[]
  members: CoupleMember[]
}

function formatAmount(raw: string): string {
  if (!raw) return ''
  const [intPart, decPart] = raw.split('.')
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decPart !== undefined ? `${grouped}.${decPart}` : grouped
}

export function AddExpenseSheet({ isOpen, onClose, onSaved, expense, categories, members }: Props) {
  const { user, couple } = useAuth()
  const isEdit = !!expense

  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [paidBy, setPaidBy] = useState(user?.id ?? '')
  const [split, setSplit] = useState<'even' | 'payer_only'>('payer_only')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) return
    if (expense) {
      setAmount(String(expense.amount))
      setCategory(expense.category)
      setDescription(expense.description)
      setDate(expense.expense_date)
      setPaidBy(expense.paid_by)
      setSplit(expense.split)
    } else {
      setAmount('')
      setCategory(categories[0]?.name ?? '')
      setDescription('')
      setDate(new Date().toISOString().split('T')[0])
      setPaidBy(user?.id ?? '')
      setSplit('payer_only')
    }
    setError('')
    setSaving(false)
    setDeleting(false)
  }, [isOpen, expense?.id])

  async function handleSave() {
    const amt = parseFloat(amount)
    if (!amount || isNaN(amt) || amt <= 0) { setError('Enter a valid amount'); return }
    if (!category) { setError('Select a category'); return }
    setSaving(true); setError('')

    const payload = {
      couple_id: couple!.couple_id,
      paid_by: paidBy,
      logged_by: user!.id,
      amount: amt,
      category,
      description: description.trim(),
      expense_date: date,
      split,
    }

    const { error: err } = isEdit
      ? await supabase.from('expenses').update(payload).eq('id', expense!.id)
      : await supabase.from('expenses').insert(payload)

    if (err) { setError(err.message); setSaving(false) }
    else { onSaved(isEdit ? 'updated' : 'added'); onClose() }
  }

  async function handleDelete() {
    if (!expense) return
    setDeleting(true)
    await supabase.from('expenses').delete().eq('id', expense.id)
    onSaved('deleted')
    onClose()
  }

  const partner = members.find(m => m.user_id !== user?.id)
  const payerOptions = [
    { id: user?.id, label: 'You' },
    { id: partner?.user_id, label: partner?.display_name ?? 'Partner' },
  ]

  return (
    <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
      <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>{isEdit ? 'Edit expense' : 'Add expense'}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-4">
          {/* Amount */}
          <div className="pb-1 text-center">
            <input
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={formatAmount(amount)}
              onChange={e => {
                const raw = e.target.value.replace(/,/g, '')
                if (/^\d*\.?\d*$/.test(raw)) setAmount(raw)
              }}
              className="font-heading w-full border-none bg-transparent text-center text-5xl font-medium text-foreground outline-none"
            />
          </div>

          {/* Categories */}
          <div>
            <Label className="mb-2.5 text-xs tracking-wide text-muted-foreground uppercase">
              Category
            </Label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <Chip
                  key={cat.id}
                  pressed={category === cat.name}
                  onPressedChange={() => setCategory(cat.name)}
                >
                  <span>{cat.icon}</span> {cat.name}
                </Chip>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              placeholder="e.g. Grab, Indomaret…"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="h-12"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          {/* Who paid */}
          <div className="space-y-2">
            <Label>Who paid</Label>
            <ToggleGroup
              type="single"
              value={paidBy}
              onValueChange={v => v && setPaidBy(v)}
              className="w-full rounded-full bg-muted p-1"
            >
              {payerOptions.map(opt => (
                <ToggleGroupItem
                  key={opt.label}
                  value={opt.id ?? ''}
                  disabled={!opt.id}
                  className="flex-1 rounded-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  {opt.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* Split */}
          <div className="space-y-2">
            <Label>Split</Label>
            <ToggleGroup
              type="single"
              value={split}
              onValueChange={v => v && setSplit(v as 'even' | 'payer_only')}
              className="w-full rounded-full bg-muted p-1"
            >
              <ToggleGroupItem value="payer_only" className="flex-1 rounded-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                Paid alone
              </ToggleGroupItem>
              <ToggleGroupItem value="even" className="flex-1 rounded-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                Split evenly
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add expense'}
          </Button>

          {isEdit && (
            <Button
              onClick={handleDelete}
              disabled={deleting}
              variant="ghost"
              className="w-full text-destructive hover:text-destructive"
            >
              {deleting ? 'Deleting…' : 'Delete expense'}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
