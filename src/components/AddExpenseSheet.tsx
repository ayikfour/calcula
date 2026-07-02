import { useState, useEffect } from 'react'
import { CaretRight } from '@phosphor-icons/react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { formatDateLabel } from '../lib/format'
import type { Expense, Category, CoupleMember } from '../types'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSaved: (action: 'added' | 'updated' | 'deleted') => void
  expense?: Expense | null
  categories: Category[]
  members: CoupleMember[]
}

// Matches Chip's own class list (src/components/ui/chip.tsx) so the date
// pill — a plain <button>, not a Chip, since it's wrapped in a PopoverTrigger
// asChild rather than being its own Radix Toggle — looks identical to the
// Chip-based pills next to it.
const DATE_PILL_CLASS =
  'inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-transparent px-3.5 text-xs font-medium text-muted-foreground transition-colors outline-none hover:bg-muted'

function formatAmount(raw: string): string {
  if (!raw) return ''
  const [intPart, decPart] = raw.split('.')
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decPart !== undefined ? `${grouped}.${decPart}` : grouped
}

// expense_date is stored as a plain YYYY-MM-DD string. Parse/format at local
// noon/local Y-M-D (not toISOString, which is UTC-based) so the date can't
// shift by a day depending on the viewer's timezone offset.
function parseISODateLocal(iso: string): Date {
  return new Date(iso + 'T12:00:00')
}
function toISODateLocal(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
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
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
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
    setCategoryPickerOpen(false)
    setDatePickerOpen(false)
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
  const currentPayerLabel = payerOptions.find(opt => opt.id === paidBy)?.label ?? 'You'

  function togglePaidBy() {
    const other = payerOptions.find(opt => opt.id !== paidBy && opt.id)
    if (other?.id) setPaidBy(other.id)
  }

  const selectedCategory = categories.find(cat => cat.name === category)

  return (
    <>
      <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
        <SheetContent
          side="bottom"
          className="max-h-[92vh] overflow-y-auto overscroll-contain rounded-t-2xl"
          onPointerDownOutside={e => {
            // The category picker is a second, sibling <Sheet>, and the date
            // picker is a Popover — neither is a JSX descendant of this
            // sheet, so Radix's dismissable-layer doesn't recognize either as
            // "inside" this sheet, and a tap inside them reads as an
            // outside-click here that would otherwise close this sheet too.
            // Checking state (e.g. `categoryPickerOpen`) doesn't work: by the
            // time this fires, the inner picker's own selection handler has
            // often already flushed its "closed" state, so the read here is
            // already stale. Check the event's actual target against the DOM
            // instead — is it inside another dialog/popover surface at all.
            const target = e.target
            if (
              target instanceof Element &&
              (target.closest('[role="dialog"]') || target.closest('[data-slot="popover-content"]'))
            ) {
              e.preventDefault()
            }
          }}
        >
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

            {/* Date + who paid */}
            <div className="flex items-center gap-2">
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <button type="button" className={DATE_PILL_CLASS}>
                    {formatDateLabel(date)}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date ? parseISODateLocal(date) : undefined}
                    onSelect={d => {
                      if (d) setDate(toISODateLocal(d))
                      setDatePickerOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
              <Chip pressed={false} onPressedChange={togglePaidBy} disabled={!partner?.user_id}>
                {currentPayerLabel}
              </Chip>
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

            {/* Category + Save */}
            <div className="flex items-center gap-2">
              <Chip
                pressed={false}
                onPressedChange={() => setCategoryPickerOpen(true)}
                className="shrink-0"
              >
                <span>{selectedCategory?.icon}</span> {selectedCategory?.name ?? 'Category'}
                <CaretRight className="size-3.5" />
              </Chip>
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add expense'}
              </Button>
            </div>

            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}

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

      {/* Category picker */}
      <Sheet open={categoryPickerOpen} onOpenChange={setCategoryPickerOpen}>
        <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto overscroll-contain rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Category</SheetTitle>
          </SheetHeader>
          <div className="flex flex-wrap gap-2 px-4 pb-4">
            {categories.map(cat => (
              <Chip
                key={cat.id}
                pressed={category === cat.name}
                onPressedChange={() => {
                  setCategory(cat.name)
                  setCategoryPickerOpen(false)
                }}
              >
                <span>{cat.icon}</span> {cat.name}
              </Chip>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
