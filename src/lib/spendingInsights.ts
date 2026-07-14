import { differenceInCalendarMonths } from 'date-fns'
import { parseISODateLocal } from './dates'
import { formatCurrency, formatDateLabel } from './format'
import type { Expense, SpaceMember, Category } from '../types'

export interface Insight {
  id: string
  emoji: string
  title: string
  detail: string
  /** Raw-number version of `detail`, shown only when the user opts in to "reveal real numbers". */
  detailRevealed?: string
  /** Raw-number version of `title`, for the rare title that embeds an amount. */
  titleRevealed?: string
  /**
   * Multi-stat recap rows. When present, the ticket renders this list instead
   * of the single emoji-tile + title + detail body. Every value is relative
   * (percentage / day name / count) — no currency amounts — so there's no
   * revealed variant for these.
   */
  stats?: { label: string; value: string }[]
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

function milestoneInsight(
  monthExpenses: Expense[],
  expensesBeforeThisMonth: Expense[],
  members: SpaceMember[],
): Insight | null {
  const all = [...monthExpenses, ...expensesBeforeThisMonth]
  if (all.length === 0) return null

  let earliestIso = all[0].expense_date
  for (const e of all) if (e.expense_date < earliestIso) earliestIso = e.expense_date

  const months = differenceInCalendarMonths(new Date(), parseISODateLocal(earliestIso))
  // A "0 months" card is pointless — need at least one full month of history.
  if (months < 1) return null

  const distinctDays = new Set(all.map(e => e.expense_date)).size
  const solo = isSolo(members)
  const monthWord = months === 1 ? 'month' : 'months'
  const dayWord = distinctDays === 1 ? 'day' : 'days'

  return {
    id: 'milestone',
    emoji: '📅',
    title: solo ? `${months} ${monthWord} tracking your spending` : `${months} ${monthWord} tracking together`,
    detail: `That's ${distinctDays} separate ${dayWord} you sat down and logged it instead of looking away. Still going.`,
  }
}

const WEEKDAY_PLURAL = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays']

function recapInsight(
  monthExpenses: Expense[],
  members: SpaceMember[],
  // Kept for signature parity with the other generators even though the recap
  // uses a fixed 📊 emoji rather than a per-category icon.
  _iconFor: (name: string) => string,
  daysElapsed: number,
): Insight | null {
  // A recap of a near-empty month is embarrassing — require enough substance
  // to fill the stat rows meaningfully.
  const totals = categoryTotals(monthExpenses)
  if (monthExpenses.length < 5 || totals.size < 2) return null

  const grandTotal = monthExpenses.reduce((s, e) => s + e.amount, 0)
  const stats: { label: string; value: string }[] = []

  // 1. Top category (share of month total).
  const top = topEntry(totals, 'max')
  const topName = top ? top[0] : null
  if (top) {
    const [name, amount] = top
    const pct = grandTotal > 0 ? Math.round((amount / grandTotal) * 100) : 0
    stats.push({ label: 'TOP CATEGORY', value: `${name} · ${pct}%` })
  }

  // 2. Most consistent habit — category logged on the most distinct days.
  // Exclude the top category so this row never duplicates TOP CATEGORY; the
  // ≥2-category guard above guarantees another candidate always remains.
  const daysPerCategory = new Map<string, Set<string>>()
  for (const e of monthExpenses) {
    const set = daysPerCategory.get(e.category) ?? new Set<string>()
    set.add(e.expense_date)
    daysPerCategory.set(e.category, set)
  }
  let consistent: { name: string; days: number } | null = null
  for (const [name, set] of daysPerCategory) {
    if (name === topName) continue
    if (!consistent || set.size > consistent.days) consistent = { name, days: set.size }
  }
  if (consistent) {
    const dayWord = consistent.days === 1 ? 'day' : 'days'
    stats.push({ label: 'MOST CONSISTENT', value: `${consistent.name} · ${consistent.days} ${dayWord}` })
  }

  // 3. Busiest weekday — by total SPEND per day-of-week.
  const weekdaySpend: number[] = Array.from({ length: 7 }, () => 0)
  for (const e of monthExpenses) weekdaySpend[parseISODateLocal(e.expense_date).getDay()] += e.amount
  let busiestDay = 0
  for (let i = 1; i < 7; i++) if (weekdaySpend[i] > weekdaySpend[busiestDay]) busiestDay = i
  stats.push({ label: 'BUSIEST DAY', value: WEEKDAY_PLURAL[busiestDay] })

  // 4. No-spend days (only when there's at least one, else it reads oddly).
  if (daysElapsed > 0) {
    const spendDays = new Set(monthExpenses.map(e => e.expense_date)).size
    const noSpend = daysElapsed - spendDays
    if (noSpend > 0) stats.push({ label: 'NO-SPEND DAYS', value: `${noSpend} of ${daysElapsed}` })
  }

  return {
    id: 'recap',
    emoji: '📊',
    title: isSolo(members) ? 'Your month, wrapped' : 'Your month together, wrapped',
    detail: '',
    stats,
  }
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
    detail: `${pct}% of everything you spent this month went down the ${name.toLowerCase()} drain. No judgment. Okay, a little.`,
    detailRevealed: `${formatCurrency(amount, currencyCode)} down the ${name.toLowerCase()} drain this month — ${pct}% of your total. No judgment. Okay, a little.`,
  }
}

// Tiny flavor map for the pairing archetype labels — a few common categories
// get a personality; everything else falls back to `The ${category} One`.
const PERSONA_FLAVOR: Record<string, string> = {
  Coffee: 'The Caffeine Fiend',
  Drink: 'The Caffeine Fiend',
  Groceries: 'The Grocery Planner',
  Dining: 'The Foodie',
  Food: 'The Foodie',
  Transport: 'The Commuter',
}

function spendingPersonaInsight(
  monthExpenses: Expense[],
  members: SpaceMember[],
  iconFor: (name: string) => string,
): Insight | null {
  if (monthExpenses.length === 0) return null

  // Solo: the "era" meme card — dominant category as identity.
  if (isSolo(members)) {
    const top = topEntry(categoryTotals(monthExpenses), 'max')
    if (!top) return null
    const [name] = top
    return {
      id: 'spending-persona',
      emoji: iconFor(name),
      title: `You're in your ${name} era`,
      detail: `More ${name.toLowerCase()} than anything else this month. It's a whole personality now.`,
    }
  }

  // 2+: each member's OWN dominant category, worded generically for N members.
  // Ordered categories per member (desc by spend).
  const memberCategories: string[][] = []
  for (const m of members) {
    const totals = categoryTotals(monthExpenses.filter(e => e.paid_by === m.user_id))
    if (totals.size === 0) return null // a one-sided pairing looks broken
    const ordered = [...totals.entries()].sort((a, b) => b[1] - a[1]).map(e => e[0])
    memberCategories.push(ordered)
  }

  // Assign each member a category, preferring one not already used so the
  // labels differ; fall back to their own top if all their categories are taken.
  const assigned: string[] = []
  const used = new Set<string>()
  for (const ordered of memberCategories) {
    const pick = ordered.find(c => !used.has(c)) ?? ordered[0]
    assigned.push(pick)
    used.add(pick)
  }

  const labelFor = (category: string) => PERSONA_FLAVOR[category] ?? `The ${category} One`

  // Collision: couldn't differentiate (shared dominant category, no distinct
  // second). Warm "same brain" single-label variant instead of "X vs. X".
  const dupe = assigned.find((c, i) => assigned.indexOf(c) !== i)
  if (dupe) {
    return {
      id: 'spending-persona',
      emoji: iconFor(dupe),
      title: `Two ${dupe} people, one household`,
      detail: `Same brain, same cart. Two peas, one pod.`,
    }
  }

  return {
    id: 'spending-persona',
    emoji: iconFor(assigned[0]),
    title: assigned.map(labelFor).join(' vs. '),
    detail: `Every household is just two spending personalities in a trench coat.`,
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
  const grandTotal = monthExpenses.reduce((s, e) => s + e.amount, 0)
  const pct = grandTotal > 0 ? Math.round((amount / grandTotal) * 100) : 0
  return {
    id: 'highest-day',
    emoji: '💥',
    title: `${formatDateLabel(date)} wrecked your wallet`,
    detail: topCat
      ? `${pct}% of this month's spending happened in a single day, mostly on ${topCat[0]}. Bold strategy.`
      : `${pct}% of this month's spending happened in a single day. Bold strategy.`,
    detailRevealed: topCat
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
  const grandTotal = monthExpenses.reduce((s, e) => s + e.amount, 0)
  const pct = grandTotal > 0 ? Math.round((amount / grandTotal) * 100) : 0
  return {
    id: 'lowest-day',
    emoji: '😇',
    title: `${formatDateLabel(date)}, you actual saint`,
    detail: `Only ${pct}% of your month's spending happened that day. Who even are you?`,
    detailRevealed: `Only ${formatCurrency(amount, currencyCode)} spent that day. Who even are you?`,
  }
}

function biggestExpenseInsight(monthExpenses: Expense[], iconFor: (name: string) => string, currencyCode: string): Insight | null {
  if (monthExpenses.length < 2) return null
  const biggest = [...monthExpenses].sort((a, b) => b.amount - a.amount)[0]
  const grandTotal = monthExpenses.reduce((s, e) => s + e.amount, 0)
  const pct = grandTotal > 0 ? Math.round((biggest.amount / grandTotal) * 100) : 0
  return {
    id: 'biggest-expense',
    emoji: iconFor(biggest.category),
    title: `Your biggest yolo purchase: ${pct}% of your whole month`,
    titleRevealed: `Your biggest yolo purchase: ${formatCurrency(biggest.amount, currencyCode)}`,
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
    detail: `Up ${Math.round(best.pctChange)}% from last month. It's giving "no self-control."`,
    detailRevealed: `Up ${Math.round(best.pctChange)}% from last month — ${formatCurrency(best.thisAmt, currencyCode)} vs. ${formatCurrency(best.lastAmt, currencyCode)}. It's giving "no self-control."`,
  }
}

function categoryMoMDropInsight(
  monthExpenses: Expense[],
  lastMonthExpenses: Expense[],
  iconFor: (name: string) => string,
  currencyCode: string,
): Insight | null {
  const thisTotals = categoryTotals(monthExpenses)
  const lastTotals = categoryTotals(lastMonthExpenses)

  // Biggest percentage DROP for a category that had meaningful spend last
  // month — the encouraging mirror of categoryMoMChangeInsight. Independent
  // of the up-trend card: both, either, or neither may fire.
  let best: { name: string; thisAmt: number; lastAmt: number; pctChange: number } | null = null
  for (const [name, lastAmt] of lastTotals) {
    if (lastAmt <= 0) continue
    const thisAmt = thisTotals.get(name) ?? 0
    const pctChange = ((thisAmt - lastAmt) / lastAmt) * 100
    if (pctChange > -20) continue // only a real drop (down >20%)
    if (!best || pctChange < best.pctChange) best = { name, thisAmt, lastAmt, pctChange }
  }
  if (!best) return null

  const pct = Math.round(Math.abs(best.pctChange))
  return {
    id: 'category-mom-drop',
    emoji: iconFor(best.name),
    title: `You reeled in your ${best.name} spending`,
    detail: `Down ${pct}% from last month. Character development.`,
    detailRevealed: `Down ${pct}% from last month — ${formatCurrency(best.thisAmt, currencyCode)} vs. ${formatCurrency(best.lastAmt, currencyCode)}. Character development.`,
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

function noSpendStreakInsight(monthExpenses: Expense[], daysElapsed: number): Insight | null {
  if (monthExpenses.length === 0 || daysElapsed <= 0) return null

  // All monthExpenses fall in the summary month, so any expense's YYYY-MM
  // prefix gives the month/year to iterate. Walk day 1..daysElapsed and find
  // the longest run of consecutive days with no logged expense.
  const monthPrefix = monthExpenses[0].expense_date.slice(0, 7)
  const spendDays = new Set(monthExpenses.map(e => e.expense_date))

  let longest = 0
  let current = 0
  for (let d = 1; d <= daysElapsed; d++) {
    const iso = `${monthPrefix}-${String(d).padStart(2, '0')}`
    if (spendDays.has(iso)) {
      current = 0
    } else {
      current += 1
      longest = Math.max(longest, current)
    }
  }
  if (longest < 3) return null

  return {
    id: 'no-spend-streak',
    emoji: '🧘',
    title: `${longest} days straight without spending a thing`,
    detail: `Your longest no-spend streak this month. Monk mode, briefly.`,
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
  const pct = total > 0 ? Math.round((avg / total) * 100) : 0
  return {
    id: 'avg-transaction',
    emoji: '🧾',
    title: `${monthExpenses.length} separate decisions to spend money`,
    detail: `Each one chips away roughly ${pct}% of this month's total, on average. Death by a thousand cuts.`,
    detailRevealed: `Averaging ${formatCurrency(avg, currencyCode)} per expense. Death by a thousand cuts.`,
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
      ? `Weekends cost ${Math.round(Math.abs(pctDiff))}% more per day than weekdays. Living your best, priciest life.`
      : `Weekdays cost ${Math.round(Math.abs(pctDiff))}% more per day than weekends. Weirdly responsible of you.`,
    detailRevealed: weekendMore
      ? `${formatCurrency(higherAvg, currencyCode)}/day on weekends vs. ${formatCurrency(lowerAvg, currencyCode)}/day on weekdays. Living your best, priciest life.`
      : `${formatCurrency(higherAvg, currencyCode)}/day on weekdays vs. ${formatCurrency(lowerAvg, currencyCode)}/day on weekends. Weirdly responsible of you.`,
  }
}

/** True when the current space has no partner yet — later generators branch 1-person vs 2+-person copy on this. */
export function isSolo(members: SpaceMember[]): boolean {
  return members.length <= 1
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
    () => milestoneInsight(monthExpenses, expensesBeforeThisMonth, members),
    () => recapInsight(monthExpenses, members, iconFor, daysElapsed),
    () => spendingPersonaInsight(monthExpenses, members, iconFor),
    () => topCategoryInsight(monthExpenses, iconFor, currencyCode),
    () => partnerCategoryComparisonInsight(monthExpenses, members, userId, iconFor, currencyCode),
    () => highestSpendingDayInsight(monthExpenses, currencyCode),
    () => lowestSpendingDayInsight(monthExpenses, currencyCode),
    () => biggestExpenseInsight(monthExpenses, iconFor, currencyCode),
    () => categoryMoMChangeInsight(monthExpenses, lastMonthExpenses, iconFor, currencyCode),
    () => categoryMoMDropInsight(monthExpenses, lastMonthExpenses, iconFor, currencyCode),
    () => whoPaidMoreInsight(monthExpenses, members, userId),
    () => noSpendDaysInsight(monthExpenses, daysElapsed),
    () => noSpendStreakInsight(monthExpenses, daysElapsed),
    () => loggingStreakInsight(monthExpenses),
    () => newCategoryInsight(monthExpenses, expensesBeforeThisMonth, iconFor),
    () => avgTransactionInsight(monthExpenses, currencyCode),
    () => weekdayWeekendInsight(monthExpenses, currencyCode),
  ]

  return generators.map(g => g()).filter((i): i is Insight => i !== null)
}
