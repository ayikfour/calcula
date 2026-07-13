import { useState, useMemo, useEffect, useLayoutEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { CaretRight, ClockCounterClockwise, PiggyBank, Receipt, SpinnerGap } from '@phosphor-icons/react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useExpenses } from '../hooks/useExpenses'
import { useExpenseActivity } from '../hooks/useExpenseActivity'
import { useCategories } from '../hooks/useCategories'
import { useSpaceMembers } from '../hooks/useSpaceMembers'
import { useRecurringExpenses } from '../hooks/useRecurringExpenses'
import { useBudgets } from '../hooks/useBudgets'
import { useExpenseFilters } from '../contexts/ExpenseFiltersContext'
import { useAppSound } from '../hooks/useAppSound'
import { computeBudgetSummary } from '../lib/budgetSummary'
import { toISODateLocal } from '../lib/dates'
import { AddExpenseSheet } from '../components/AddExpenseSheet'
import { BottomActionBar } from '../components/BottomActionBar'
import { ExpenseRow } from '../components/ExpenseRow'
import { UpcomingRecurring } from '../components/UpcomingRecurring'
import { SummaryCard } from '../components/SummaryCard'
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

// TopNav's actual rendered height (py-3.5 padding + icon-sm button, 28px +
// 28px) — not the 64px AppShell assumes for its own <main> padding-top,
// which only leaves an invisible extra gap there but would show scrolled
// list content peeking through above this sticky bar if reused here.
const NAV_HEIGHT = 56

// Max categories spelled out in the active-filter bar before collapsing the
// rest into "+N more" — matches the count used in its design spec example.
const MAX_CATEGORIES_SHOWN = 3

export function LogPage() {
  const navigate = useNavigate()
  const { user, space } = useAuth()
  const { expenses, loading, refetch } = useExpenses(space?.space_id)
  const { activity: recentActivity } = useExpenseActivity(space?.space_id)
  const [categories, addCategory] = useCategories()
  const members = useSpaceMembers(space?.space_id)
  const { recurringExpenses, refetch: refetchRecurring } = useRecurringExpenses(space?.space_id)
  const { budgets, loading: budgetsLoading } = useBudgets(space?.space_id)
  const playSound = useAppSound()

  const now = useMemo(() => new Date(), [])
  const todayKey = useMemo(() => toISODateLocal(now), [now])
  const summary = useMemo(
    () => computeBudgetSummary({ expenses, budgets, members, userId: user?.id, now }),
    [expenses, budgets, members, user?.id, now],
  )

  const myFeedLastSeenAt = members.find(m => m.user_id === user?.id)?.feed_last_seen_at ?? null
  const hasUnreadActivity = useMemo(
    () => recentActivity.some(a => a.actor_id !== user?.id && (!myFeedLastSeenAt || a.created_at > myFeedLastSeenAt)),
    [recentActivity, user?.id, myFeedLastSeenAt],
  )

  const sentinelRef = useRef<HTMLDivElement>(null)
  const bottomSentinelRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const dateHeaderRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const [isPinned, setIsPinned] = useState(false)
  const [cardHeight, setCardHeight] = useState(0)
  const [safeTop, setSafeTop] = useState(0)
  const [activeDate, setActiveDate] = useState(todayKey)

  const { selectedMonth, setSelectedMonth, filterCategories, filterPaidBy, activeFilterCount } = useExpenseFilters()
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
    playSound(action === 'deleted' ? 'delete' : 'success')
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

  const dateKeys = useMemo(() => grouped.map(([date]) => date).join(','), [grouped])

  // Reads --safe-top once (env(safe-area-inset-top), 0 on non-notched devices).
  useEffect(() => {
    const value = getComputedStyle(document.documentElement).getPropertyValue('--safe-top')
    const parsed = parseFloat(value)
    if (!Number.isNaN(parsed)) setSafeTop(parsed)
  }, [])

  // Sentinel just above the sticky card: once it scrolls above the viewport
  // top, the card has engaged position:sticky and is now pinned/compact.
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setIsPinned(!entry.isIntersecting), {
      rootMargin: '-1px 0px 0px 0px',
      threshold: 0,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Tracks the card's live rendered height (expanded vs. compact) so the
  // date-header trigger band below can sit flush under it.
  useLayoutEffect(() => {
    const el = cardRef.current
    if (!el) return
    setCardHeight(el.getBoundingClientRect().height)
    const observer = new ResizeObserver(([entry]) => setCardHeight(entry.contentRect.height))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // While resting at the top (not pinned), the card always shows "Today" —
  // matching pre-scroll-aware behavior. Active-date tracking only takes
  // over once the card has pinned, so nothing changes before the user
  // actually starts scrolling.
  useEffect(() => {
    if (!isPinned) setActiveDate(todayKey)
  }, [isPinned, todayKey])

  // Watches every date-group header, plus a sentinel just past the end of
  // the list, against a line just below the pinned card. Both are observed
  // by the same instance so one callback resolves them together — with two
  // separate observers, a single big scroll jump can fire both in either
  // order and the header logic (below) can overwrite the bottom-of-list
  // fallback right after it runs. On every crossing, recompute directly
  // from live positions (rather than trusting which entry triggered the
  // callback): if the bottom sentinel is on screen, the oldest group is
  // forced active (it can be too short to ever push its own header past
  // the line, since there's no more content below it to scroll through);
  // otherwise pick the header that most recently scrolled past the line —
  // robust against fast/flick scrolls that could otherwise jump clean over
  // a thin trigger band.
  useEffect(() => {
    if (!isPinned) return
    const headers = Array.from(dateHeaderRefs.current.entries())
    const bottomEl = bottomSentinelRef.current
    const lastDate = dateKeys.split(',').pop()
    if (headers.length === 0 || !bottomEl || !lastDate) return
    const topOffset = NAV_HEIGHT + safeTop + cardHeight
    const observer = new IntersectionObserver(
      () => {
        if (bottomEl.getBoundingClientRect().top < window.innerHeight) {
          setActiveDate(lastDate)
          return
        }
        let candidateDate: string | null = null
        let candidateTop = -Infinity
        for (const [date, el] of headers) {
          const top = el.getBoundingClientRect().top
          if (top <= topOffset && top > candidateTop) {
            candidateDate = date
            candidateTop = top
          }
        }
        if (candidateDate) setActiveDate(candidateDate)
      },
      { rootMargin: `-${topOffset}px 0px 0px 0px`, threshold: [0, 1] },
    )
    for (const [, el] of headers) observer.observe(el)
    observer.observe(bottomEl)
    return () => observer.disconnect()
  }, [isPinned, dateKeys, cardHeight, safeTop])

  const activeDateData = useMemo(() => {
    if (activeDate === todayKey) {
      return {
        label: 'Today',
        amount: summary.todaySpent,
        pacing: summary.maxSpendToday !== null
          ? { maxSpend: summary.maxSpendToday, usedPct: summary.todayUsedPct, overBudget: summary.todayOverBudget }
          : null,
        youAmount: summary.youTodaySpent,
        partnerAmount: summary.partnerTodaySpent,
      }
    }
    const items = grouped.find(([date]) => date === activeDate)?.[1] ?? []
    let youAmount = 0
    let partnerAmount = 0
    for (const e of items) {
      if (e.paid_by === user?.id) youAmount += e.amount
      else partnerAmount += e.amount
    }
    return {
      label: formatDateLabel(activeDate),
      amount: items.reduce((s, e) => s + e.amount, 0),
      pacing: null as { maxSpend: number; usedPct: number; overBudget: boolean } | null,
      youAmount,
      partnerAmount,
    }
  }, [activeDate, todayKey, summary, grouped, user?.id])

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
    playSound('tab-switch')
    setEditMode(true)
    setOpenSwipeRowId(null)
  }

  function enterEditModeWithSelection(id: string) {
    enterEditMode()
    setSelectedIds([id])
  }

  function exitEditMode() {
    playSound('tab-switch')
    setEditMode(false)
    setSelectedIds([])
  }

  function toggleSelect(id: string) {
    playSound('checkbox')
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
    playSound('delete')
    toast(count === 1 ? 'Expense deleted' : `${count} expenses deleted`)
  }

  const catIcons = Object.fromEntries(categories.map(c => [c.name, c.icon]))
  const hasActiveFilters = activeFilterCount > 0

  const filterSummaryText = (() => {
    if (!hasActiveFilters) return null
    const segments: string[] = []
    if (filterCategories.length > 0) {
      const shown = filterCategories.slice(0, MAX_CATEGORIES_SHOWN)
      const shownText = shown.map(name => `${catIcons[name] ?? '📦'} ${name}`).join(', ')
      const remaining = filterCategories.length - shown.length
      segments.push(remaining > 0 ? `${shownText}, +${remaining} more` : shownText)
    }
    if (filterPaidBy) {
      const payerLabel = filterPaidBy === user?.id
        ? 'you'
        : (members.find(m => m.user_id === filterPaidBy)?.display_name ?? 'partner')
      segments.push(`paid by ${payerLabel}`)
    }
    return `Viewing only ${segments.join(' · ')}`
  })()

  return (
    <>
      <div className="pb-24">
        <div ref={sentinelRef} className="h-px" aria-hidden />
        <div
          ref={cardRef}
          // -mt-2 cancels AppShell's stale 64px top padding (real NAV_HEIGHT
          // is 56px — see NAV_HEIGHT comment above) so this block's resting
          // position sits flush under the nav with no seam, matching its own
          // `top` offset once scrolled.
          className="sticky z-40 -mt-2"
          style={{ top: `calc(${NAV_HEIGHT}px + var(--safe-top))` }}
        >
          {filterSummaryText && (
            <div className="border-b border-border bg-background/80 px-5 py-2 backdrop-blur-md">
              <p className="truncate text-xs font-medium text-muted-foreground">
                {filterSummaryText}
              </p>
            </div>
          )}
          <SummaryCard
            compact={isPinned}
            label={activeDateData.label}
            amount={activeDateData.amount}
            currencyCode={space?.currency_code}
            pacing={activeDateData.pacing}
            youAmount={activeDateData.youAmount}
            partnerAmount={activeDateData.partnerAmount}
            partnerName={summary.partner?.display_name}
            onClick={() => { playSound('click'); navigate('/dashboard') }}
          />
        </div>

        {!budgetsLoading && summary.youBudget === 0 && (
          <div className="px-5 pt-3">
            <Card
              className="flex flex-row cursor-pointer items-center gap-3 p-5"
              role="button"
              onClick={() => { playSound('click'); navigate('/settings') }}
            >
              <PiggyBank className="size-8 shrink-0 text-muted-foreground" weight="light" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">Set a monthly budget</p>
                <p className="text-xs text-muted-foreground">
                  Track spending against a monthly goal.
                </p>
              </div>
              <CaretRight className="size-3.5 shrink-0 text-muted-foreground" />
            </Card>
          </div>
        )}

        {hasUnreadActivity && (
          <div className="px-5 pt-3">
            <Card
              className="flex flex-row cursor-pointer items-center gap-3 p-5"
              role="button"
              onClick={() => { playSound('click'); navigate('/feed') }}
            >
              <ClockCounterClockwise className="size-8 shrink-0 text-muted-foreground" weight="light" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">New activity in your space</p>
                <p className="text-xs text-muted-foreground">See what's changed recently.</p>
              </div>
              <CaretRight className="size-3.5 shrink-0 text-muted-foreground" />
            </Card>
          </div>
        )}

        <UpcomingRecurring
          recurringExpenses={recurringExpenses}
          categories={categories}
          currencyCode={space?.currency_code}
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
                <div
                  ref={el => {
                    if (el) dateHeaderRefs.current.set(date, el)
                    else dateHeaderRefs.current.delete(date)
                  }}
                  data-date={date}
                  className="flex items-baseline justify-between px-5 pt-3 pb-1.5"
                >
                  <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    {formatDateLabel(date)}
                  </span>
                  <span className="font-heading text-xs text-muted-foreground">
                    {formatCurrency(items.reduce((s, e) => s + e.amount, 0), space?.currency_code)}
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
                        : 'Partner'

                    return (
                      <ExpenseRow
                        key={expense.id}
                        expense={expense}
                        categoryIcon={catIcons[expense.category] ?? '📦'}
                        payerLabel={payerLabel}
                        currencyCode={space?.currency_code ?? DEFAULT_CURRENCY_CODE}
                        isOpen={openSwipeRowId === expense.id}
                        onOpenChange={open => setOpenSwipeRowId(open ? expense.id : null)}
                        onEdit={() => openEdit(expense)}
                        onDeleteRequest={() => { setDeletingExpense(expense); setOpenSwipeRowId(null) }}
                        onLongPress={() => enterEditModeWithSelection(expense.id)}
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
            <div ref={bottomSentinelRef} className="h-px" aria-hidden />
          </div>
        )}
      </div>

      <BottomActionBar
        mode="logs"
        onAdd={openAdd}
        editMode={editMode}
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
        addCategory={addCategory}
        members={members}
        recurringExpenses={recurringExpenses}
      />

      <Dialog open={!!deletingExpense} onOpenChange={open => !open && setDeletingExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this expense?</DialogTitle>
            <DialogDescription>
              {deletingExpense && (
                <>
                  {deletingExpense.description || deletingExpense.category} · {formatCurrency(deletingExpense.amount, space?.currency_code)}
                  <br />
                  This can't be undone, and removes it from your space's log too.
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
              This can't be undone, and removes them from your space's log too.
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
