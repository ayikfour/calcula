import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Receipt, SpinnerGap } from '@phosphor-icons/react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useExpenses } from '../hooks/useExpenses'
import { useCategories } from '../hooks/useCategories'
import { useCoupleMembers } from '../hooks/useCoupleMembers'
import { useRecurringExpenses } from '../hooks/useRecurringExpenses'
import { useBudgets } from '../hooks/useBudgets'
import { useExpenseFilters } from '../contexts/ExpenseFiltersContext'
import { computeBudgetSummary } from '../lib/budgetSummary'
import { AddExpenseSheet } from '../components/AddExpenseSheet'
import { FilterDrawer } from '../components/FilterDrawer'
import { BottomActionBar } from '../components/BottomActionBar'
import { ExpenseRow } from '../components/ExpenseRow'
import { UpcomingRecurring } from '../components/UpcomingRecurring'
import { BudgetProgressBar } from '../components/BudgetProgressBar'
import { AnimatedAmount } from '../components/AnimatedAmount'
import { formatCurrency, formatDateLabel } from '../lib/format'
import { DEFAULT_CURRENCY_CODE } from '../lib/currencies'
import type { Expense } from '../types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
  const navigate = useNavigate()
  const { user, couple } = useAuth()
  const { expenses, loading, refetch } = useExpenses(couple?.couple_id)
  const categories = useCategories()
  const members = useCoupleMembers(couple?.couple_id)
  const { recurringExpenses, refetch: refetchRecurring } = useRecurringExpenses(couple?.couple_id)
  const { budgets } = useBudgets(couple?.couple_id)

  const now = useMemo(() => new Date(), [])
  const summary = useMemo(
    () => computeBudgetSummary({ expenses, budgets, members, userId: user?.id, now }),
    [expenses, budgets, members, user?.id, now],
  )

  const { selectedMonth, setSelectedMonth, filterCategories, filterPaidBy, setFilters, activeFilterCount } = useExpenseFilters()
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [openSwipeRowId, setOpenSwipeRowId] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [bulkDeleting, setBulkDeleting] = useState(false)

  function handleSaved(action: 'added' | 'updated' | 'deleted') {
    refetch()
    refetchRecurring()
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

  function enterEditMode() {
    setEditMode(true)
    setOpenSwipeRowId(null)
  }

  function exitEditMode() {
    setEditMode(false)
    setSelectedIds([])
  }

  function toggleSelect(id: string) {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]))
  }

  async function handleConfirmBulkDelete() {
    if (selectedIds.length === 0) return
    setBulkDeleting(true)
    await supabase.from('expenses').delete().in('id', selectedIds)
    setBulkDeleting(false)
    setBulkDeleteOpen(false)
    const count = selectedIds.length
    exitEditMode()
    refetch()
    refetchRecurring()
    toast(count === 1 ? 'Expense deleted' : `${count} expenses deleted`)
  }

  const catIcons = Object.fromEntries(categories.map(c => [c.name, c.icon]))
  const hasActiveFilters = activeFilterCount > 0

  return (
    <>
      <div className="pb-24">
        <div className="px-5 pt-2">
          <Card
            className="cursor-pointer p-5"
            role="button"
            onClick={() => navigate('/dashboard')}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-1.5 text-xs tracking-wide text-muted-foreground uppercase">Today</p>
                <p className="font-heading text-3xl font-medium text-foreground">
                  <AnimatedAmount amount={summary.todaySpent} currencyCode={couple?.currency_code} />
                </p>
              </div>
              {summary.maxSpendToday !== null && (
                <span
                  className="mt-5 text-xs font-medium"
                  style={{ color: summary.todayOverBudget ? 'var(--color-danger)' : 'var(--color-success)' }}
                >
                  {summary.todayOverBudget
                    ? <>Over by <AnimatedAmount amount={Math.abs(summary.maxSpendToday - summary.todaySpent)} currencyCode={couple?.currency_code} /></>
                    : <><AnimatedAmount amount={summary.maxSpendToday - summary.todaySpent} currencyCode={couple?.currency_code} /> left today</>}
                </span>
              )}
            </div>

            {summary.maxSpendToday !== null && (
              <>
                <p className="mt-3 text-xs text-muted-foreground">
                  Max today: <AnimatedAmount amount={summary.maxSpendToday} currencyCode={couple?.currency_code} />
                </p>
                <div className="mt-2">
                  <BudgetProgressBar usedPct={summary.todayUsedPct} overBudget={summary.todayOverBudget} />
                </div>
              </>
            )}

            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">
                You · <AnimatedAmount amount={summary.youTodaySpent} currencyCode={couple?.currency_code} />
              </span>
              <span className="font-medium text-muted-foreground">
                {summary.partner?.display_name ?? 'Partner'} · <AnimatedAmount amount={summary.partnerTodaySpent} currencyCode={couple?.currency_code} />
              </span>
            </div>

            <p className="mt-3 text-xs font-medium text-muted-foreground">View all stats →</p>
          </Card>
        </div>

        <UpcomingRecurring
          recurringExpenses={recurringExpenses}
          categories={categories}
          currencyCode={couple?.currency_code}
          onStopped={refetchRecurring}
        />

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
                    {formatCurrency(items.reduce((s, e) => s + e.amount, 0), couple?.currency_code)}
                  </span>
                </div>

                {/* Rows */}
                <div className="mb-1">
                  {items.map((expense, i) => {
                    const payer = members.find(m => m.user_id === expense.paid_by)
                    const payerLabel = expense.paid_by === user?.id
                      ? 'You'
                      : expense.paid_by
                        ? (payer?.display_name ?? 'Partner')
                        : (expense.paid_by_label ?? 'Partner')

                    return (
                      <ExpenseRow
                        key={expense.id}
                        expense={expense}
                        categoryIcon={catIcons[expense.category] ?? '📦'}
                        payerLabel={payerLabel}
                        currencyCode={couple?.currency_code ?? DEFAULT_CURRENCY_CODE}
                        isOpen={openSwipeRowId === expense.id}
                        onOpenChange={open => setOpenSwipeRowId(open ? expense.id : null)}
                        onEdit={() => openEdit(expense)}
                        onDeleteRequest={() => { setDeletingExpense(expense); setOpenSwipeRowId(null) }}
                        showTopBorder={i === 0}
                        editMode={editMode}
                        selected={selectedIds.includes(expense.id)}
                        onToggleSelect={() => toggleSelect(expense.id)}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomActionBar
        mode="logs"
        onAdd={openAdd}
        activeFilterCount={activeFilterCount}
        onOpenFilter={() => { setFilterDrawerOpen(true); setOpenSwipeRowId(null) }}
        availableMonths={availableMonths}
        selectedMonth={selectedMonth}
        onSelectMonth={m => { setSelectedMonth(m); setOpenSwipeRowId(null) }}
        editMode={editMode}
        onEnterEditMode={enterEditMode}
        onExitEditMode={exitEditMode}
        selectedCount={selectedIds.length}
        onRequestBulkDelete={() => setBulkDeleteOpen(true)}
      />

      <AddExpenseSheet
        isOpen={sheetOpen}
        onClose={closeSheet}
        onSaved={handleSaved}
        expense={editingExpense}
        categories={categories}
        members={members}
        recurringExpenses={recurringExpenses}
      />

      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        categories={categories}
        members={members}
        currentUserId={user?.id}
        selectedCategories={filterCategories}
        selectedPayer={filterPaidBy}
        onApply={setFilters}
      />

      <Dialog open={!!deletingExpense} onOpenChange={open => !open && setDeletingExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this expense?</DialogTitle>
            <DialogDescription>
              {deletingExpense && (
                <>
                  {deletingExpense.description || deletingExpense.category} · {formatCurrency(deletingExpense.amount, couple?.currency_code)}
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

      <Dialog open={bulkDeleteOpen} onOpenChange={open => !open && setBulkDeleteOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedIds.length} expenses?</DialogTitle>
            <DialogDescription>
              This can't be undone, and removes them from your partner's log too.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleConfirmBulkDelete} disabled={bulkDeleting}>
              {bulkDeleting ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
