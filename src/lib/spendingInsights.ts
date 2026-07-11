import { parseISODateLocal } from './dates'
import { formatCurrency, formatDateLabel } from './format'
import type { Expense, SpaceMember, Category } from '../types'

export interface Insight {
  id: string
  emoji: string
  title: string
  detail: string
}

interface GenerateInsightsArgs {
  monthExpenses: Expense[]
  lastMonthExpenses: Expense[]
  expensesBeforeThisMonth: Expense[]
  categories: Category[]
  members: SpaceMember[]
  userId: string | undefined
  currencyCode: string
  daysElapsed: number
}

function categoryTotals(expenses: Expense[]): Map<string, number> {
  const map = new Map<string, number>()
  for (const e of expenses) map.set(e.category, (map.get(e.category) ?? 0) + e.amount)
  return map
}

function dayTotals(expenses: Expense[]): Map<string, number> {
  const map = new Map<string, number>()
  for (const e of expenses) map.set(e.expense_date, (map.get(e.expense_date) ?? 0) + e.amount)
  return map
}

function topEntry(map: Map<string, number>, dir: 'max' | 'min'): [string, number] | null {
  const entries = [...map.entries()]
  if (entries.length === 0) return null
  return entries.sort((a, b) => (dir === 'max' ? b[1] - a[1] : a[1] - b[1]))[0]
}

function topCategoryInsight(monthExpenses: Expense[], iconFor: (name: string) => string, currencyCode: string): Insight | null {
  if (monthExpenses.length === 0) return null
  const top = topEntry(categoryTotals(monthExpenses), 'max')
  if (!top) return null
  const [name, amount] = top
  const grandTotal = monthExpenses.reduce((s, e) => s + e.amount, 0)
  const pct = grandTotal > 0 ? Math.round((amount / grandTotal) * 100) : 0
  return {
    id: 'top-category',
    emoji: iconFor(name),
    title: `You have a ${name} problem`,
    detail: `${formatCurrency(amount, currencyCode)} down the ${name.toLowerCase()} drain this month — ${pct}% of your total. No judgment. Okay, a little.`,
  }
}

function partnerCategoryComparisonInsight(
  monthExpenses: Expense[],
  members: SpaceMember[],
  userId: string | undefined,
  iconFor: (name: string) => string,
  currencyCode: string,
): Insight | null {
  const partner = members.find(m => m.user_id !== userId)
  if (!partner || !userId) return null
  const youTotals = categoryTotals(monthExpenses.filter(e => e.paid_by === userId))
  const partnerTotals = categoryTotals(monthExpenses.filter(e => e.paid_by === partner.user_id))
  const names = new Set([...youTotals.keys(), ...partnerTotals.keys()])

  let best: { name: string; you: number; partner: number; gap: number } | null = null
  for (const name of names) {
    const you = youTotals.get(name) ?? 0
    const partnerAmt = partnerTotals.get(name) ?? 0
    const gap = Math.abs(you - partnerAmt)
    if (!best || gap > best.gap) best = { name, you, partner: partnerAmt, gap }
  }
  if (!best || best.gap <= 0) return null

  const partnerSpentMore = best.partner > best.you
  return {
    id: 'partner-category-comparison',
    emoji: iconFor(best.name),
    title: partnerSpentMore
      ? `${partner.display_name} really went off on ${best.name}`
      : `You went feral on ${best.name}`,
    detail: partnerSpentMore
      ? `${formatCurrency(best.you, currencyCode)} (you) vs. ${formatCurrency(best.partner, currencyCode)} (${partner.display_name}). Someone's compensating for something.`
      : `${formatCurrency(best.you, currencyCode)} (you) vs. ${formatCurrency(best.partner, currencyCode)} (${partner.display_name}). Hope it was worth it.`,
  }
}

function highestSpendingDayInsight(monthExpenses: Expense[], currencyCode: string): Insight | null {
  if (monthExpenses.length === 0) return null
  const top = topEntry(dayTotals(monthExpenses), 'max')
  if (!top) return null
  const [date, amount] = top
  const dayCategoryTotals = categoryTotals(monthExpenses.filter(e => e.expense_date === date))
  const topCat = topEntry(dayCategoryTotals, 'max')
  return {
    id: 'highest-day',
    emoji: '💥',
    title: `${formatDateLabel(date)} wrecked your wallet`,
    detail: topCat
      ? `${formatCurrency(amount, currencyCode)} gone in a single day, mostly on ${topCat[0]}. Bold strategy.`
      : `${formatCurrency(amount, currencyCode)} gone in a single day. Bold strategy.`,
  }
}

function lowestSpendingDayInsight(monthExpenses: Expense[], currencyCode: string): Insight | null {
  const totals = dayTotals(monthExpenses)
  if (totals.size < 2) return null
  const bottom = topEntry(totals, 'min')
  if (!bottom) return null
  const [date, amount] = bottom
  return {
    id: 'lowest-day',
    emoji: '😇',
    title: `${formatDateLabel(date)}, you actual saint`,
    detail: `Only ${formatCurrency(amount, currencyCode)} spent that day. Who even are you?`,
  }
}

function biggestExpenseInsight(monthExpenses: Expense[], iconFor: (name: string) => string, currencyCode: string): Insight | null {
  if (monthExpenses.length < 2) return null
  const biggest = [...monthExpenses].sort((a, b) => b.amount - a.amount)[0]
  return {
    id: 'biggest-expense',
    emoji: iconFor(biggest.category),
    title: `Your biggest yolo purchase: ${formatCurrency(biggest.amount, currencyCode)}`,
    detail: `${biggest.category}${biggest.description ? ` — ${biggest.description}` : ''}, on ${formatDateLabel(biggest.expense_date)}. No regrets. Probably.`,
  }
}

function categoryMoMChangeInsight(
  monthExpenses: Expense[],
  lastMonthExpenses: Expense[],
  iconFor: (name: string) => string,
  currencyCode: string,
): Insight | null {
  const thisTotals = categoryTotals(monthExpenses)
  const lastTotals = categoryTotals(lastMonthExpenses)

  let best: { name: string; thisAmt: number; lastAmt: number; pctChange: number } | null = null
  for (const [name, lastAmt] of lastTotals) {
    if (lastAmt <= 0) continue
    const thisAmt = thisTotals.get(name) ?? 0
    const pctChange = ((thisAmt - lastAmt) / lastAmt) * 100
    if (pctChange < 20) continue
    if (!best || pctChange > best.pctChange) best = { name, thisAmt, lastAmt, pctChange }
  }
  if (!best) return null

  return {
    id: 'category-mom-change',
    emoji: iconFor(best.name),
    title: `${best.name} spending is spiraling`,
    detail: `Up ${Math.round(best.pctChange)}% from last month — ${formatCurrency(best.thisAmt, currencyCode)} vs. ${formatCurrency(best.lastAmt, currencyCode)}. It's giving "no self-control."`,
  }
}

function whoPaidMoreInsight(monthExpenses: Expense[], members: SpaceMember[], userId: string | undefined): Insight | null {
  const partner = members.find(m => m.user_id !== userId)
  if (!partner || !userId) return null

  let youTotal = 0
  let partnerTotal = 0
  for (const e of monthExpenses) {
    if (e.paid_by === userId) youTotal += e.amount
    else if (e.paid_by === partner.user_id) partnerTotal += e.amount
  }
  const grandTotal = youTotal + partnerTotal
  if (youTotal <= 0 || partnerTotal <= 0 || grandTotal <= 0) return null

  const youPct = Math.round((youTotal / grandTotal) * 100)
  const moreIsYou = youTotal > partnerTotal
  return {
    id: 'who-paid-more',
    emoji: moreIsYou ? '💳' : '🙏',
    title: moreIsYou ? "You're carrying this household" : `${partner.display_name} is carrying this household`,
    detail: moreIsYou
      ? `You paid ${youPct}%, ${partner.display_name} paid ${100 - youPct}%. You're welcome.`
      : `They paid ${100 - youPct}%, you paid ${youPct}%. Maybe send a thank-you.`,
  }
}

function noSpendDaysInsight(monthExpenses: Expense[], daysElapsed: number): Insight | null {
  if (monthExpenses.length === 0 || daysElapsed <= 0) return null
  const spendDays = new Set(monthExpenses.map(e => e.expense_date))
  const noSpendCount = daysElapsed - spendDays.size
  if (noSpendCount < 2) return null
  return {
    id: 'no-spend-days',
    emoji: '🌱',
    title: `You actually showed restraint`,
    detail: `Out of ${daysElapsed} days this month, you didn't spend a thing on ${noSpendCount} of them. Growth.`,
  }
}

function loggingStreakInsight(monthExpenses: Expense[]): Insight | null {
  const days = [...new Set(monthExpenses.map(e => e.expense_date))].sort()
  if (days.length === 0) return null

  let longest = 1
  let current = 1
  for (let i = 1; i < days.length; i++) {
    const prev = parseISODateLocal(days[i - 1])
    const curr = parseISODateLocal(days[i])
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86400000)
    if (diffDays === 1) {
      current += 1
      longest = Math.max(longest, current)
    } else {
      current = 1
    }
  }
  if (longest < 3) return null

  return {
    id: 'logging-streak',
    emoji: '🔥',
    title: `${longest} days of logging in a row`,
    detail: `Your longest streak this month was ${longest} consecutive days. Certified tracker behavior.`,
  }
}

function newCategoryInsight(monthExpenses: Expense[], expensesBeforeThisMonth: Expense[], iconFor: (name: string) => string): Insight | null {
  if (expensesBeforeThisMonth.length === 0) return null
  const priorCategories = new Set(expensesBeforeThisMonth.map(e => e.category))
  const thisCategories = new Set(monthExpenses.map(e => e.category))
  const newCat = [...thisCategories].find(c => !priorCategories.has(c))
  if (!newCat) return null

  return {
    id: 'new-category',
    emoji: iconFor(newCat),
    title: `New unlocked: ${newCat}`,
    detail: `First time you've logged a ${newCat} expense. Welcome to the club.`,
  }
}

function avgTransactionInsight(monthExpenses: Expense[], currencyCode: string): Insight | null {
  if (monthExpenses.length < 3) return null
  const total = monthExpenses.reduce((s, e) => s + e.amount, 0)
  const avg = total / monthExpenses.length
  return {
    id: 'avg-transaction',
    emoji: '🧾',
    title: `${monthExpenses.length} separate decisions to spend money`,
    detail: `Averaging ${formatCurrency(avg, currencyCode)} per expense. Death by a thousand cuts.`,
  }
}

function weekdayWeekendInsight(monthExpenses: Expense[], currencyCode: string): Insight | null {
  const weekdayDays = new Set<string>()
  const weekendDays = new Set<string>()
  let weekdayTotal = 0
  let weekendTotal = 0
  for (const e of monthExpenses) {
    const isWeekend = [0, 6].includes(parseISODateLocal(e.expense_date).getDay())
    if (isWeekend) {
      weekendTotal += e.amount
      weekendDays.add(e.expense_date)
    } else {
      weekdayTotal += e.amount
      weekdayDays.add(e.expense_date)
    }
  }
  if (weekdayDays.size === 0 || weekendDays.size === 0) return null

  const weekdayAvg = weekdayTotal / weekdayDays.size
  const weekendAvg = weekendTotal / weekendDays.size
  if (weekdayAvg <= 0 || weekendAvg <= 0) return null

  const pctDiff = ((weekendAvg - weekdayAvg) / weekdayAvg) * 100
  if (Math.abs(pctDiff) < 15) return null

  const weekendMore = pctDiff > 0
  const higherAvg = weekendMore ? weekendAvg : weekdayAvg
  const lowerAvg = weekendMore ? weekdayAvg : weekendAvg
  return {
    id: 'weekday-weekend',
    emoji: weekendMore ? '🎉' : '💼',
    title: weekendMore ? 'Weekends hit different (for your wallet)' : 'Your wallet clocks in on weekdays',
    detail: weekendMore
      ? `${formatCurrency(higherAvg, currencyCode)}/day on weekends vs. ${formatCurrency(lowerAvg, currencyCode)}/day on weekdays. Living your best, priciest life.`
      : `${formatCurrency(higherAvg, currencyCode)}/day on weekdays vs. ${formatCurrency(lowerAvg, currencyCode)}/day on weekends. Weirdly responsible of you.`,
  }
}

export function generateInsights({
  monthExpenses,
  lastMonthExpenses,
  expensesBeforeThisMonth,
  categories,
  members,
  userId,
  currencyCode,
  daysElapsed,
}: GenerateInsightsArgs): Insight[] {
  const iconFor = (name: string) => categories.find(c => c.name === name)?.icon ?? '📦'

  const generators: Array<() => Insight | null> = [
    () => topCategoryInsight(monthExpenses, iconFor, currencyCode),
    () => partnerCategoryComparisonInsight(monthExpenses, members, userId, iconFor, currencyCode),
    () => highestSpendingDayInsight(monthExpenses, currencyCode),
    () => lowestSpendingDayInsight(monthExpenses, currencyCode),
    () => biggestExpenseInsight(monthExpenses, iconFor, currencyCode),
    () => categoryMoMChangeInsight(monthExpenses, lastMonthExpenses, iconFor, currencyCode),
    () => whoPaidMoreInsight(monthExpenses, members, userId),
    () => noSpendDaysInsight(monthExpenses, daysElapsed),
    () => loggingStreakInsight(monthExpenses),
    () => newCategoryInsight(monthExpenses, expensesBeforeThisMonth, iconFor),
    () => avgTransactionInsight(monthExpenses, currencyCode),
    () => weekdayWeekendInsight(monthExpenses, currencyCode),
  ]

  return generators.map(g => g()).filter((i): i is Insight => i !== null)
}
