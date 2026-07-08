import { getDaysInMonth } from 'date-fns'
import { toISODateLocal } from './dates'
import type { Budget, CoupleMember, Expense } from '../types'

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

// Most recent budget row for `userId` with effective_month <= monthBasis
// (carry-forward: a month with no explicit row inherits the last one set).
export function effectiveBudgetFor(budgets: Budget[], userId: string | undefined, monthBasis: Date): number {
  const targetKey = startOfMonth(monthBasis).getTime()
  let best: Budget | null = null
  for (const b of budgets) {
    if (b.user_id !== userId) continue
    const rowKey = new Date(b.effective_month + 'T00:00:00').getTime()
    if (rowKey > targetKey) continue
    if (!best || rowKey > new Date(best.effective_month + 'T00:00:00').getTime()) best = b
  }
  return best?.monthly_amount ?? 0
}

export interface BudgetSummary {
  monthlyTotal: number
  lastMonthTotal: number
  momDelta: number
  momPercent: number | null
  daysInMonth: number
  dayOfMonth: number
  daysLeft: number
  avgDailySpend: number
  projectedTotal: number
  budgetTotal: number
  remaining: number
  dailyPace: number | null
  budgetUsedPct: number
  overBudget: boolean
  partner: CoupleMember | undefined
  youTotal: number
  partnerTotal: number
  youBudget: number
  partnerBudget: number
  todaySpent: number
  youTodaySpent: number
  partnerTodaySpent: number
  maxSpendToday: number | null
  todayUsedPct: number
  todayOverBudget: boolean
}

export function computeBudgetSummary({
  expenses,
  budgets,
  members,
  userId,
  now,
  summaryMonth,
}: {
  expenses: Expense[]
  budgets: Budget[]
  members: CoupleMember[]
  userId: string | undefined
  now: Date
  summaryMonth?: Date
}): BudgetSummary {
  const monthBasis = summaryMonth ?? now
  const thisMonthStart = startOfMonth(monthBasis)
  const nextMonthStart = new Date(monthBasis.getFullYear(), monthBasis.getMonth() + 1, 1)
  const lastMonthStart = new Date(monthBasis.getFullYear(), monthBasis.getMonth() - 1, 1)
  const isCurrentMonth = monthBasis.getFullYear() === now.getFullYear() && monthBasis.getMonth() === now.getMonth()

  const todayKey = toISODateLocal(now)

  let monthlyTotal = 0
  let lastMonthTotal = 0
  let todaySpent = 0
  const paidByMap = new Map<string, number>()
  const paidByTodayMap = new Map<string, number>()

  for (const e of expenses) {
    const d = new Date(e.expense_date + 'T12:00:00')
    if (d >= thisMonthStart && d < nextMonthStart) {
      monthlyTotal += e.amount
      if (e.paid_by) {
        paidByMap.set(e.paid_by, (paidByMap.get(e.paid_by) ?? 0) + e.amount)
      }
      if (e.expense_date === todayKey) {
        todaySpent += e.amount
        if (e.paid_by) {
          paidByTodayMap.set(e.paid_by, (paidByTodayMap.get(e.paid_by) ?? 0) + e.amount)
        }
      }
    } else if (d >= lastMonthStart && d < thisMonthStart) {
      lastMonthTotal += e.amount
    }
  }

  const momDelta = monthlyTotal - lastMonthTotal
  const momPercent = lastMonthTotal > 0 ? (momDelta / lastMonthTotal) * 100 : null

  const partner = members.find(m => m.user_id !== userId)
  const youTotal = paidByMap.get(userId ?? '') ?? 0
  const partnerTotal = partner ? (paidByMap.get(partner.user_id) ?? 0) : 0
  const youTodaySpent = paidByTodayMap.get(userId ?? '') ?? 0
  const partnerTodaySpent = partner ? (paidByTodayMap.get(partner.user_id) ?? 0) : 0

  const youBudget = effectiveBudgetFor(budgets, userId, monthBasis)
  const partnerBudget = partner ? effectiveBudgetFor(budgets, partner.user_id, monthBasis) : 0
  const budgetTotal = youBudget + partnerBudget

  const daysInMonth = getDaysInMonth(monthBasis)
  const dayOfMonth = isCurrentMonth ? now.getDate() : daysInMonth
  const daysLeft = daysInMonth - dayOfMonth
  const avgDailySpend = monthlyTotal / dayOfMonth
  const projectedTotal = avgDailySpend * daysInMonth
  const remaining = budgetTotal - monthlyTotal
  const dailyPace = daysLeft > 0 ? remaining / daysLeft : null
  const budgetUsedPct = budgetTotal > 0 ? Math.min((monthlyTotal / budgetTotal) * 100, 100) : 0
  const overBudget = remaining < 0

  const daysLeftInclusiveToday = daysLeft + 1
  const spentOtherDays = monthlyTotal - todaySpent
  const maxSpendToday = budgetTotal > 0 ? (budgetTotal - spentOtherDays) / daysLeftInclusiveToday : null
  const todayUsedPct = maxSpendToday !== null && maxSpendToday > 0 ? Math.min((todaySpent / maxSpendToday) * 100, 100) : 0
  const todayOverBudget = maxSpendToday !== null && todaySpent > maxSpendToday

  return {
    monthlyTotal,
    lastMonthTotal,
    momDelta,
    momPercent,
    daysInMonth,
    dayOfMonth,
    daysLeft,
    avgDailySpend,
    projectedTotal,
    budgetTotal,
    remaining,
    dailyPace,
    budgetUsedPct,
    overBudget,
    partner,
    youTotal,
    partnerTotal,
    youBudget,
    partnerBudget,
    todaySpent,
    youTodaySpent,
    partnerTodaySpent,
    maxSpendToday,
    todayUsedPct,
    todayOverBudget,
  }
}
