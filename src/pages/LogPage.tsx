import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { Plus, Receipt, SpinnerGap } from '@phosphor-icons/react'
import { useAuth } from '../hooks/useAuth'
import { useExpenses } from '../hooks/useExpenses'
import { useCategories } from '../hooks/useCategories'
import { useCoupleMembers } from '../hooks/useCoupleMembers'
import { AddExpenseSheet } from '../components/AddExpenseSheet'
import { formatCurrency, formatDateLabel } from '../lib/format'
import type { Expense } from '../types'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'
import { Separator } from '@/components/ui/separator'

const TOAST_COPY = { added: 'Expense added', updated: 'Expense updated', deleted: 'Expense deleted' } as const

export function LogPage() {
  const { user, couple } = useAuth()
  const { expenses, loading, refetch } = useExpenses(couple?.couple_id)
  const categories = useCategories()
  const members = useCoupleMembers(couple?.couple_id)

  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [filterPaidBy, setFilterPaidBy] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  function handleSaved(action: 'added' | 'updated' | 'deleted') {
    refetch()
    toast(TOAST_COPY[action])
  }

  const partner = members.find(m => m.user_id !== user?.id)

  const filtered = useMemo(() => {
    let result = expenses
    if (filterCategory) result = result.filter(e => e.category === filterCategory)
    if (filterPaidBy) result = result.filter(e => e.paid_by === filterPaidBy)
    return result
  }, [expenses, filterCategory, filterPaidBy])

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, Expense[]>()
    for (const e of filtered) {
      const list = map.get(e.expense_date) ?? []
      list.push(e)
      map.set(e.expense_date, list)
    }
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a))
  }, [filtered])

  function openAdd() { setEditingExpense(null); setSheetOpen(true) }
  function openEdit(e: Expense) { setEditingExpense(e); setSheetOpen(true) }
  function closeSheet() { setSheetOpen(false); setEditingExpense(null) }

  const catIcons = Object.fromEntries(categories.map(c => [c.name, c.icon]))

  const payerOptions = [
    { label: 'All', value: null as string | null },
    { label: 'You', value: user?.id ?? null },
    ...(partner ? [{ label: partner.display_name, value: partner.user_id }] : []),
  ]

  return (
    <>
      <div className="pb-2">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-3">
          <h1 className="font-heading text-[28px] font-medium tracking-tight text-foreground">
            Expenses
          </h1>
          <span className="text-sm text-muted-foreground">
            {expenses.length} total
          </span>
        </div>

        {/* Filter bar */}
        <div
          className="flex gap-2 overflow-x-auto px-4 pb-3 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {payerOptions.map(opt => (
            <Chip
              key={opt.label}
              pressed={filterPaidBy === opt.value}
              onPressedChange={() => setFilterPaidBy(opt.value)}
            >
              {opt.label}
            </Chip>
          ))}

          <Separator orientation="vertical" className="my-1 h-6" />

          {categories.map(cat => (
            <Chip
              key={cat.id}
              pressed={filterCategory === cat.name}
              onPressedChange={() => setFilterCategory(filterCategory === cat.name ? null : cat.name)}
            >
              <span>{cat.icon}</span> {cat.name}
            </Chip>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center pt-16">
            <SpinnerGap className="size-6 animate-spin text-muted-foreground" weight="bold" />
          </div>
        ) : grouped.length === 0 ? (
          /* Empty state */
          <div className="px-8 pt-16 pb-8 text-center">
            <Receipt className="mx-auto mb-4 size-10 text-muted-foreground" weight="light" />
            <p className="mb-2 text-base font-medium text-foreground">
              {filterCategory || filterPaidBy ? 'No matching expenses' : 'No expenses yet'}
            </p>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              {filterCategory || filterPaidBy ? 'Try a different filter.' : 'Tap + to log your first expense.'}
            </p>
            {!filterCategory && !filterPaidBy && (
              <Button onClick={openAdd} className="px-7">
                Add expense →
              </Button>
            )}
          </div>
        ) : (
          /* Expense list grouped by date */
          <div>
            {grouped.map(([date, items]) => (
              <div key={date}>
                {/* Date header */}
                <div className="flex items-baseline justify-between px-5 pt-3 pb-1.5">
                  <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    {formatDateLabel(date)}
                  </span>
                  <span className="font-heading text-xs text-muted-foreground">
                    {formatCurrency(items.reduce((s, e) => s + e.amount, 0))}
                  </span>
                </div>

                {/* Rows */}
                <div className="mb-1">
                  {items.map((expense, i) => {
                    const payer = members.find(m => m.user_id === expense.paid_by)
                    const payerLabel = expense.paid_by === user?.id ? 'You' : (payer?.display_name ?? 'Partner')
                    const splitLabel = expense.split === 'even' ? 'Split' : 'Solo'

                    return (
                      <button
                        key={expense.id}
                        onClick={() => openEdit(expense)}
                        className="flex w-full items-center gap-3 border-b border-border px-5 py-3.5 text-left"
                        style={i === 0 ? { borderTop: '1px solid var(--border)' } : undefined}
                      >
                        {/* Category icon */}
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-lg">
                          {catIcons[expense.category] ?? '📦'}
                        </div>

                        {/* Text */}
                        <div className="min-w-0 flex-1">
                          <p className="mb-0.5 truncate text-base font-medium text-foreground">
                            {expense.description || expense.category}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {payerLabel} · {splitLabel}
                          </p>
                        </div>

                        {/* Amount */}
                        <span className="font-heading shrink-0 text-base font-medium text-foreground">
                          {formatCurrency(expense.amount)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <Button
        onClick={openAdd}
        size="icon"
        className="fixed right-5 z-30 size-14 rounded-full shadow-lg"
        style={{ bottom: 'calc(80px + var(--safe-bottom))' }}
        aria-label="Add expense"
      >
        <Plus className="size-6" weight="bold" />
      </Button>

      <AddExpenseSheet
        isOpen={sheetOpen}
        onClose={closeSheet}
        onSaved={handleSaved}
        expense={editingExpense}
        categories={categories}
        members={members}
      />
    </>
  )
}
