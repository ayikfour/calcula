import { useState, useMemo, useEffect } from 'react'
import { toast } from 'sonner'
import { Plus, Receipt, SpinnerGap, CaretDown } from '@phosphor-icons/react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useExpenses } from '../hooks/useExpenses'
import { useCategories } from '../hooks/useCategories'
import { useCoupleMembers } from '../hooks/useCoupleMembers'
import { AddExpenseSheet } from '../components/AddExpenseSheet'
import { FilterDrawer } from '../components/FilterDrawer'
import { MonthDrawer } from '../components/MonthDrawer'
import { ExpenseRow } from '../components/ExpenseRow'
import { formatCurrency, formatDateLabel } from '../lib/format'
import type { Expense } from '../types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'

const TOAST_COPY = { added: 'Expense added', updated: 'Expense updated', deleted: 'Expense deleted' } as const

export function LogPage() {
  const { user, couple } = useAuth()
  const { expenses, loading, refetch } = useExpenses(couple?.couple_id)
  const categories = useCategories()
  const members = useCoupleMembers(couple?.couple_id)

  const [filterCategories, setFilterCategories] = useState<string[]>([])
  const [filterPaidBy, setFilterPaidBy] = useState<string | null>(null)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [openSwipeRowId, setOpenSwipeRowId] = useState<string | null>(null)

  function handleSaved(action: 'added' | 'updated' | 'deleted') {
    refetch()
    toast(TOAST_COPY[action])
  }

  const availableMonths = useMemo(() => {
    const set = new Set(expenses.map(e => e.expense_date.slice(0, 7)))
    return Array.from(set).sort((a, b) => b.localeCompare(a))
  }, [expenses])

  useEffect(() => {
    if (selectedMonth === null && availableMonths.length > 0) {
      setSelectedMonth(availableMonths[0])
    }
  }, [availableMonths, selectedMonth])

  const filtered = useMemo(() => {
    let result = expenses
    if (selectedMonth) result = result.filter(e => e.expense_date.slice(0, 7) === selectedMonth)
    if (filterCategories.length > 0) result = result.filter(e => filterCategories.includes(e.category))
    if (filterPaidBy) result = result.filter(e => e.paid_by === filterPaidBy)
    return result
  }, [expenses, selectedMonth, filterCategories, filterPaidBy])

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

  function openAdd() { setEditingExpense(null); setSheetOpen(true); setOpenSwipeRowId(null) }
  function openEdit(e: Expense) { setEditingExpense(e); setSheetOpen(true) }
  function closeSheet() { setSheetOpen(false); setEditingExpense(null) }

  async function handleConfirmDelete() {
    if (!deletingExpense) return
    setDeleting(true)
    await supabase.from('expenses').delete().eq('id', deletingExpense.id)
    setDeleting(false)
    setDeletingExpense(null)
    handleSaved('deleted')
  }

  const catIcons = Object.fromEntries(categories.map(c => [c.name, c.icon]))
  const activeFilterCount = filterCategories.length + (filterPaidBy ? 1 : 0)
  const hasActiveFilters = activeFilterCount > 0

  return (
    <>
      <div className="pb-24">
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
              {hasActiveFilters ? 'No matching expenses' : 'No expenses yet'}
            </p>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              {hasActiveFilters ? 'Try a different filter.' : 'Tap + to log your first expense.'}
            </p>
            {!hasActiveFilters && (
              <Button onClick={openAdd} className="px-7">
                Add expense →
              </Button>
            )}
          </div>
        ) : (
          /* Expense list grouped by date */
          <div className="pt-2">
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

                    return (
                      <ExpenseRow
                        key={expense.id}
                        expense={expense}
                        categoryIcon={catIcons[expense.category] ?? '📦'}
                        payerLabel={payerLabel}
                        isOpen={openSwipeRowId === expense.id}
                        onOpenChange={open => setOpenSwipeRowId(open ? expense.id : null)}
                        onEdit={() => openEdit(expense)}
                        onDeleteRequest={() => { setDeletingExpense(expense); setOpenSwipeRowId(null) }}
                        showTopBorder={i === 0}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom toolbar: add + filter + month */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between px-5 pt-3"
        style={{ paddingBottom: 'calc(16px + var(--safe-bottom))' }}
      >
        <Button onClick={openAdd} size="icon" className="size-12" aria-label="Add expense">
          <Plus className="size-5" weight="bold" />
        </Button>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => { setFilterDrawerOpen(true); setOpenSwipeRowId(null) }}
            className="h-12 gap-1.5 px-4"
          >
            {hasActiveFilters ? `${activeFilterCount} · Filter` : 'Filter'}
            <CaretDown className="size-3.5" />
          </Button>
          {availableMonths.length > 0 && selectedMonth && (
            <MonthDrawer
              months={availableMonths}
              selectedMonth={selectedMonth}
              onSelect={m => { setSelectedMonth(m); setOpenSwipeRowId(null) }}
            />
          )}
        </div>
      </div>

      <AddExpenseSheet
        isOpen={sheetOpen}
        onClose={closeSheet}
        onSaved={handleSaved}
        expense={editingExpense}
        categories={categories}
        members={members}
      />

      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        categories={categories}
        members={members}
        currentUserId={user?.id}
        selectedCategories={filterCategories}
        selectedPayer={filterPaidBy}
        onApply={(cats, payer) => { setFilterCategories(cats); setFilterPaidBy(payer) }}
      />

      <Dialog open={!!deletingExpense} onOpenChange={open => !open && setDeletingExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this expense?</DialogTitle>
            <DialogDescription>
              {deletingExpense && (
                <>
                  {deletingExpense.description || deletingExpense.category} · {formatCurrency(deletingExpense.amount)}
                  <br />
                  This can't be undone, and removes it from your partner's log too.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
