import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts'
import { useAuth } from '../hooks/useAuth'
import { useExpenses } from '../hooks/useExpenses'
import { useCategories } from '../hooks/useCategories'
import { useCoupleMembers } from '../hooks/useCoupleMembers'
import { useRecurringExpenses } from '../hooks/useRecurringExpenses'
import { useBudgets } from '../hooks/useBudgets'
import { useExpenseFilters } from '../contexts/ExpenseFiltersContext'
import { computeBudgetSummary } from '../lib/budgetSummary'
import { formatCurrency } from '../lib/format'
import { toISODateLocal } from '../lib/dates'
import { DEFAULT_CURRENCY_CODE } from '../lib/currencies'
import { categoryColor } from '../lib/categoryColors'
import { AddExpenseSheet } from '../components/AddExpenseSheet'
import { FilterDrawer } from '../components/FilterDrawer'
import { BottomActionBar } from '../components/BottomActionBar'
import { Card } from '@/components/ui/card'
import { BudgetProgressBar } from '@/components/BudgetProgressBar'
import { AnimatedAmount } from '@/components/AnimatedAmount'

const TOAST_COPY = { added: 'Expense added', updated: 'Expense updated', deleted: 'Expense deleted' } as const

function TooltipBox({ active, payload, label, currencyCode }: { active?: boolean; payload?: Array<{ value: number }>; label?: string; currencyCode: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm text-popover-foreground">
      <div className="mb-0.5 text-muted-foreground">{label}</div>
      <div className="font-heading">{formatCurrency(payload[0].value, currencyCode)}</div>
    </div>
  )
}

export function DashboardPage() {
  const { user, couple } = useAuth()
  const { expenses, refetch } = useExpenses(couple?.couple_id)
  const categories = useCategories()
  const members = useCoupleMembers(couple?.couple_id)
  const { recurringExpenses, refetch: refetchRecurring } = useRecurringExpenses(couple?.couple_id)
  const { budgets } = useBudgets(couple?.couple_id)
  const { selectedMonth, setSelectedMonth, filterCategories, filterPaidBy, setFilters, activeFilterCount } = useExpenseFilters()

  const [sheetOpen, setSheetOpen] = useState(false)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

  const now = useMemo(() => new Date(), [])
  const currencyCode = couple?.currency_code ?? DEFAULT_CURRENCY_CODE

  const availableMonths = useMemo(() => {
    const set = new Set(expenses.map(e => e.expense_date.slice(0, 7)))
    return Array.from(set).sort((a, b) => b.localeCompare(a))
  }, [expenses])

  useEffect(() => {
    if (selectedMonth === null && availableMonths.length > 0) {
      setSelectedMonth(availableMonths[0])
    }
  }, [availableMonths, selectedMonth, setSelectedMonth])

  const isCurrentMonth = selectedMonth === toISODateLocal(now).slice(0, 7)

  const summaryMonth = useMemo(() => {
    if (!selectedMonth) return now
    const [y, m] = selectedMonth.split('-').map(Number)
    return new Date(y, m - 1, 1)
  }, [selectedMonth, now])

  const monthLabel = useMemo(() => {
    if (!selectedMonth || isCurrentMonth) return 'this month'
    return summaryMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }, [selectedMonth, isCurrentMonth, summaryMonth])

  const filteredExpenses = useMemo(() => {
    let result = expenses
    if (filterCategories.length > 0) result = result.filter(e => filterCategories.includes(e.category))
    if (filterPaidBy) result = result.filter(e => e.paid_by === filterPaidBy)
    return result
  }, [expenses, filterCategories, filterPaidBy])

  const summary = useMemo(
    () => computeBudgetSummary({ expenses: filteredExpenses, budgets, members, userId: user?.id, now, summaryMonth }),
    [filteredExpenses, budgets, members, user?.id, now, summaryMonth],
  )
  const {
    monthlyTotal, momDelta, momPercent, daysInMonth, daysLeft, avgDailySpend, projectedTotal,
    budgetTotal, remaining, dailyPace, budgetUsedPct, overBudget,
    partner, youTotal, partnerTotal, youBudget, partnerBudget,
  } = summary

  const monthFilteredExpenses = useMemo(
    () => filteredExpenses.filter(e => selectedMonth && e.expense_date.slice(0, 7) === selectedMonth),
    [filteredExpenses, selectedMonth],
  )

  const { dailySpend, categoryBreakdown } = useMemo(() => {
    if (!selectedMonth) return { dailySpend: [], categoryBreakdown: [] }
    const [y, m] = selectedMonth.split('-').map(Number)

    const dayTotals = new Map<string, number>()
    for (const e of monthFilteredExpenses) dayTotals.set(e.expense_date, (dayTotals.get(e.expense_date) ?? 0) + e.amount)
    const dailySpend = Array.from({ length: daysInMonth }, (_, i) => {
      const d = new Date(y, m - 1, i + 1)
      const key = toISODateLocal(d)
      return {
        date: key,
        label: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        total: dayTotals.get(key) ?? 0,
      }
    })

    const categoryMap = new Map<string, number>()
    for (const e of monthFilteredExpenses) categoryMap.set(e.category, (categoryMap.get(e.category) ?? 0) + e.amount)
    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    return { dailySpend, categoryBreakdown }
  }, [monthFilteredExpenses, selectedMonth, daysInMonth])

  const splitTotal = youTotal + partnerTotal
  const youPct = splitTotal > 0 ? (youTotal / splitTotal) * 100 : 50

  function handleSaved(action: 'added' | 'updated' | 'deleted') {
    refetch()
    refetchRecurring()
    toast(TOAST_COPY[action])
  }

  return (
    <>
      <div className="flex flex-col gap-4 px-5 pt-2 pb-24">
        {/* This month + Budget */}
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="mb-1.5 text-xs tracking-wide text-muted-foreground uppercase">
                {isCurrentMonth ? 'This month' : monthLabel}
              </p>
              <p className="font-heading text-3xl font-medium text-foreground">
                <AnimatedAmount amount={monthlyTotal} currencyCode={currencyCode} />
              </p>
            </div>
            {momPercent !== null && (
              <span
                className="mt-5 text-xs font-medium"
                style={{
                  color: momDelta > 0 ? 'var(--color-danger)' : momDelta < 0 ? 'var(--color-success)' : 'var(--muted-foreground)',
                }}
              >
                {momDelta > 0 ? '↑' : momDelta < 0 ? '↓' : '–'} {Math.abs(momPercent).toFixed(0)}% vs last month
              </span>
            )}
          </div>

          <div className="mt-4 border-t border-border">
            {budgetTotal === 0 ? (
              <>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Set a monthly budget in Settings to track it here.
                </p>
                <Link
                  to="/settings"
                  className="mt-2 inline-flex items-center text-sm font-medium text-foreground underline underline-offset-2"
                >
                  Go to Settings
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium text-foreground">Budget</p>
                  <span
                    className="text-xs font-medium"
                    style={{ color: overBudget ? 'var(--color-danger)' : 'var(--color-success)' }}
                  >
                    {overBudget
                      ? <>Over by <AnimatedAmount amount={Math.abs(remaining)} currencyCode={currencyCode} /></>
                      : <><AnimatedAmount amount={remaining} currencyCode={currencyCode} /> left</>}
                  </span>
                </div>

                <div className="mt-3">
                  <BudgetProgressBar usedPct={budgetUsedPct} overBudget={overBudget} />
                </div>

                {isCurrentMonth && (
                  <>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Remaining</p>
                        <p className="mt-0.5 font-heading text-foreground">
                          <AnimatedAmount amount={Math.max(remaining, 0)} currencyCode={currencyCode} />
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Days left</p>
                        <p className="mt-0.5 font-heading text-foreground">{daysLeft}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Daily pace</p>
                        <p className="mt-0.5 font-heading text-foreground">
                          {overBudget || dailyPace === null ? '—' : <AnimatedAmount amount={dailyPace} currencyCode={currencyCode} />}
                        </p>
                      </div>
                    </div>

                    {summary.dayOfMonth > 2 && (
                      <p
                        className="mt-3 text-xs"
                        style={{ color: projectedTotal > budgetTotal ? 'var(--color-danger)' : 'var(--muted-foreground)' }}
                      >
                        On track to spend <AnimatedAmount amount={projectedTotal} currencyCode={currencyCode} /> by month end
                      </p>
                    )}
                  </>
                )}

                <div className="mt-4 flex flex-col gap-2 border-t border-border pt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">You</span>
                    <span className="text-muted-foreground">
                      <AnimatedAmount amount={youTotal} currencyCode={currencyCode} /> / {formatCurrency(youBudget, currencyCode)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{partner?.display_name ?? 'Partner'}</span>
                    <span className="text-muted-foreground">
                      <AnimatedAmount amount={partnerTotal} currencyCode={currencyCode} /> / {formatCurrency(partnerBudget, currencyCode)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Daily spend, selected month */}
        <Card className="p-5">
          <p className="mb-1.5 text-xs tracking-wide text-muted-foreground uppercase">
            Avg. daily spend — {monthLabel}
          </p>
          <p className="font-heading text-3xl font-medium text-foreground">
            <AnimatedAmount amount={avgDailySpend} currencyCode={currencyCode} />
          </p>
          <div className="mt-2 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySpend}>
                <XAxis
                  dataKey="label"
                  interval={Math.ceil(dailySpend.length / 6)}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                  axisLine={{ stroke: 'var(--border)' }}
                  tickLine={false}
                />
                <Tooltip content={<TooltipBox currencyCode={currencyCode} />} cursor={{ fill: 'var(--muted)' }} />
                <Bar dataKey="total" fill="var(--muted-foreground)" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category breakdown */}
        <Card className="p-5">
          <p className="text-sm font-medium text-foreground">By category — {monthLabel}</p>
          {categoryBreakdown.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No expenses logged {monthLabel === 'this month' ? 'this month' : 'that month'} yet.</p>
          ) : (
            <>
              <div className="mt-3 flex h-6 gap-1">
                {categoryBreakdown.map(c => (
                  <div key={c.name} className="group relative" style={{ flexGrow: c.value, flexBasis: 0 }}>
                    <div className="h-full" style={{ background: categoryColor(c.name) }} />
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 rounded-lg border border-border bg-popover px-3 py-2 text-sm whitespace-nowrap text-popover-foreground group-hover:block">
                      <div className="mb-0.5 text-muted-foreground">{c.name}</div>
                      <div className="font-heading">{formatCurrency(c.value, currencyCode)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-col gap-2">
                {categoryBreakdown.map(c => (
                  <div key={c.name} className="flex items-center gap-2 text-xs">
                    <span className="size-2 shrink-0 rounded-full" style={{ background: categoryColor(c.name) }} />
                    <span className="flex-1 truncate text-muted-foreground">{c.name}</span>
                    <span className="font-heading text-foreground">{formatCurrency(c.value, currencyCode)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        {/* Who paid more */}
        <Card className="p-5">
          <p className="text-sm font-medium text-foreground">Who paid — {monthLabel}</p>
          {splitTotal === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No expenses logged {monthLabel === 'this month' ? 'this month' : 'that month'} yet.</p>
          ) : (
            <div className="mt-3.5">
              <div className="mb-2 flex justify-between text-xs">
                <span className="font-medium text-foreground">You · {formatCurrency(youTotal, currencyCode)}</span>
                <span className="font-medium text-muted-foreground">{partner?.display_name ?? 'Partner'} · {formatCurrency(partnerTotal, currencyCode)}</span>
              </div>
              <div className="flex h-6 bg-muted">
                <div className="bg-foreground" style={{ width: `${youPct}%` }} />
                <div className="bg-muted-foreground" style={{ width: `${100 - youPct}%` }} />
              </div>
            </div>
          )}
        </Card>
      </div>

      <BottomActionBar
        mode="stats"
        onAdd={() => setSheetOpen(true)}
        activeFilterCount={activeFilterCount}
        onOpenFilter={() => setFilterDrawerOpen(true)}
        availableMonths={availableMonths}
        selectedMonth={selectedMonth}
        onSelectMonth={setSelectedMonth}
      />

      <AddExpenseSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSaved={handleSaved}
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
    </>
  )
}
