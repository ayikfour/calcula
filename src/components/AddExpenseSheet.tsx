import { useState, useEffect } from 'react'
import { CaretRight, CaretDown, Check } from '@phosphor-icons/react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { formatDateLabel } from '../lib/format'
import { getCurrency, DEFAULT_CURRENCY_CODE } from '../lib/currencies'
import { parseISODateLocal, toISODateLocal, nextOccurrence } from '../lib/dates'
import type { Expense, Category, CoupleMember, RecurrenceFrequency, RecurringExpense } from '../types'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSaved: (action: 'added' | 'updated' | 'deleted') => void
  expense?: Expense | null
  categories: Category[]
  members: CoupleMember[]
  recurringExpenses: RecurringExpense[]
}

// Shared look for the segments of the combined date/payer/recurring control
// below — a bordered rectangle split into segments, per design.md's
// "Date/Payer/Recurring Segmented Row" pattern.
const SEGMENT_CLASS =
  'flex items-center justify-between gap-1.5 px-4 py-3.5 text-left text-sm font-medium text-foreground outline-none transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50'

function formatAmount(raw: string): string {
  if (!raw) return ''
  const [intPart, decPart] = raw.split('.')
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decPart !== undefined ? `${grouped}.${decPart}` : grouped
}

const FREQUENCY_OPTIONS: { value: RecurrenceFrequency; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
]

export function AddExpenseSheet({ isOpen, onClose, onSaved, expense, categories, members, recurringExpenses }: Props) {
  const { user, couple } = useAuth()
  const isEdit = !!expense

  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [paidBy, setPaidBy] = useState(user?.id ?? '')
  const [isRecurring, setIsRecurring] = useState(false)
  const [frequency, setFrequency] = useState<RecurrenceFrequency>('monthly')
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  // Once an expense is linked to a recurring series, editing the frequency
  // or turning it off happens from the Upcoming list on the Log page, not
  // here — avoids building this-vs-all-future edit semantics for the series.
  const alreadyLinked = !!expense?.recurring_expense_id
  const linkedTemplate = recurringExpenses.find(r => r.id === expense?.recurring_expense_id)

  useEffect(() => {
    if (!isOpen) return
    if (expense) {
      setAmount(String(expense.amount))
      setCategory(expense.category)
      setDescription(expense.description)
      setDate(expense.expense_date)
      setPaidBy(expense.paid_by)
    } else {
      setAmount('')
      setCategory(categories[0]?.name ?? '')
      setDescription('')
      setDate(new Date().toISOString().split('T')[0])
      setPaidBy(user?.id ?? '')
    }
    setIsRecurring(false)
    setFrequency('monthly')
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

    let recurringExpenseId = expense?.recurring_expense_id ?? null

    if (isRecurring && !alreadyLinked) {
      const { data: template, error: templateErr } = await supabase
        .from('recurring_expenses')
        .insert({
          couple_id: couple!.couple_id,
          paid_by: paidBy,
          created_by: user!.id,
          amount: amt,
          category,
          description: description.trim(),
          frequency,
          start_date: date,
          next_due_date: nextOccurrence(date, frequency),
        })
        .select()
        .single()

      if (templateErr) { setError(templateErr.message); setSaving(false); return }
      recurringExpenseId = template.id
    }

    const payload = {
      couple_id: couple!.couple_id,
      paid_by: paidBy,
      logged_by: user!.id,
      amount: amt,
      category,
      description: description.trim(),
      expense_date: date,
      recurring_expense_id: recurringExpenseId,
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
          showCloseButton={false}
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
          <SheetTitle className="sr-only">{isEdit ? 'Edit expense' : 'Add expense'}</SheetTitle>

          <div className="space-y-4 px-4 pb-4">
            {/* Date + who paid + recurring, combined into one bordered rectangle */}
            <div className="inline-flex items-stretch overflow-hidden rounded-lg border border-border">
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <button type="button" className={`${SEGMENT_CLASS} border-r border-border`}>
                    {formatDateLabel(date)}
                    <CaretDown className="size-3.5 text-muted-foreground" />
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
              <button
                type="button"
                onClick={togglePaidBy}
                disabled={!partner?.user_id}
                className={alreadyLinked ? SEGMENT_CLASS : `${SEGMENT_CLASS} border-r border-border`}
              >
                {currentPayerLabel}
                <CaretRight className="size-3.5 text-muted-foreground" />
              </button>
              {!alreadyLinked && (
                <button
                  type="button"
                  onClick={() => setIsRecurring(v => !v)}
                  className={`${SEGMENT_CLASS} ${isRecurring ? 'bg-secondary text-secondary-foreground' : ''}`}
                >
                  {isRecurring ? FREQUENCY_OPTIONS.find(f => f.value === frequency)?.label : 'Recurring'}
                  {isRecurring && <Check className="size-3.5" weight="bold" />}
                </button>
              )}
            </div>

            {/* Amount */}
            <div className="flex items-center justify-center gap-1 py-6">
              <span className="font-heading text-2xl font-medium text-muted-foreground">
                {getCurrency(couple?.currency_code ?? DEFAULT_CURRENCY_CODE).symbol}
              </span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={formatAmount(amount)}
                onChange={e => {
                  const raw = e.target.value.replace(/,/g, '')
                  if (/^\d*\.?\d*$/.test(raw)) setAmount(raw)
                }}
                size={Math.max(formatAmount(amount).length, 4)}
                className="font-heading max-w-full flex-none border-none bg-transparent text-center text-5xl font-medium text-foreground outline-none"
              />
            </div>

            {/* Description */}
            <Input
              id="description"
              type="text"
              placeholder="e.g. Grab, Indomaret…"
              aria-label="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="h-12"
            />

            {/* Recurring */}
            {alreadyLinked ? (
              <p className="text-xs text-muted-foreground">
                🔁 {linkedTemplate ? `Recurring · ${FREQUENCY_OPTIONS.find(f => f.value === linkedTemplate.frequency)?.label}` : 'Part of a recurring series'}
                {' — manage this from Upcoming on the Log page.'}
              </p>
            ) : isRecurring ? (
              <div className="overflow-hidden rounded-lg border border-border">
                {FREQUENCY_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFrequency(opt.value)}
                    className="flex w-full items-center justify-between border-b border-border px-4 py-3.5 text-left text-sm font-medium text-foreground last:border-b-0"
                  >
                    {opt.label}
                    {frequency === opt.value && <Check className="size-4" weight="bold" />}
                  </button>
                ))}
              </div>
            ) : null}

            {/* Category + Save */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCategoryPickerOpen(true)}
                className="shrink-0 gap-1.5"
              >
                <span>{selectedCategory?.icon}</span> {selectedCategory?.name ?? 'Category'}
                <CaretRight className="size-3.5" />
              </Button>
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
          <div className="px-4 pb-4">
            <div className="overflow-hidden rounded-lg border border-border">
              {categories.map(cat => {
                const selected = category === cat.name
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategory(cat.name)
                      setCategoryPickerOpen(false)
                    }}
                    className="flex w-full items-center justify-between border-b border-border px-4 py-3.5 text-left text-sm font-medium text-foreground last:border-b-0"
                  >
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span> {cat.name}
                    </span>
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
