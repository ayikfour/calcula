import { useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'
import { useAuth } from '../hooks/useAuth'
import { useExpenses } from '../hooks/useExpenses'
import { useCoupleMembers } from '../hooks/useCoupleMembers'
import { formatCurrency } from '../lib/format'
import { categoryColor } from '../lib/categoryColors'
import { Card } from '@/components/ui/card'

function dateKey(d: Date) {
  return d.toISOString().split('T')[0]
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function TooltipBox({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm text-popover-foreground">
      <div className="mb-0.5 text-muted-foreground">{label}</div>
      <div className="font-heading">{formatCurrency(payload[0].value)}</div>
    </div>
  )
}

export function DashboardPage() {
  const { user, couple } = useAuth()
  const { expenses } = useExpenses(couple?.couple_id)
  const members = useCoupleMembers(couple?.couple_id)

  const now = useMemo(() => new Date(), [])

  const { monthlyTotal, lastMonthTotal, dailySpend, categoryBreakdown, paidByTotals } = useMemo(() => {
    const thisMonthStart = startOfMonth(now)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    let monthlyTotal = 0
    let lastMonthTotal = 0
    const categoryMap = new Map<string, number>()
    const paidByMap = new Map<string, number>()

    for (const e of expenses) {
      const d = new Date(e.expense_date + 'T12:00:00')
      if (d >= thisMonthStart) {
        monthlyTotal += e.amount
        categoryMap.set(e.category, (categoryMap.get(e.category) ?? 0) + e.amount)
        paidByMap.set(e.paid_by, (paidByMap.get(e.paid_by) ?? 0) + e.amount)
      } else if (d >= lastMonthStart && d <= lastMonthEnd) {
        lastMonthTotal += e.amount
      }
    }

    // Trailing 30 days, oldest to newest
    const dayTotals = new Map<string, number>()
    for (const e of expenses) dayTotals.set(e.expense_date, (dayTotals.get(e.expense_date) ?? 0) + e.amount)
    const dailySpend = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(now)
      d.setDate(d.getDate() - (29 - i))
      const key = dateKey(d)
      return {
        date: key,
        label: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        total: dayTotals.get(key) ?? 0,
      }
    })

    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    return { monthlyTotal, lastMonthTotal, dailySpend, categoryBreakdown, paidByTotals: paidByMap }
  }, [expenses, now])

  const momDelta = monthlyTotal - lastMonthTotal
  const momPercent = lastMonthTotal > 0 ? (momDelta / lastMonthTotal) * 100 : null

  const partner = members.find(m => m.user_id !== user?.id)
  const youTotal = paidByTotals.get(user?.id ?? '') ?? 0
  const partnerTotal = partner ? (paidByTotals.get(partner.user_id) ?? 0) : 0
  const splitTotal = youTotal + partnerTotal
  const youPct = splitTotal > 0 ? (youTotal / splitTotal) * 100 : 50

  return (
    <div className="flex flex-col gap-4 px-5 pt-2 pb-6">
      <h1 className="font-heading mb-1 text-[28px] font-medium tracking-tight text-foreground">
        Stats
      </h1>

      {/* Monthly total */}
      <Card className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="mb-1.5 text-xs tracking-wide text-muted-foreground uppercase">
              This month
            </p>
            <p className="font-heading text-3xl font-medium text-foreground">
              {formatCurrency(monthlyTotal)}
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
      </Card>

      {/* Daily spend, trailing 30 days */}
      <Card className="p-5">
        <p className="text-sm font-medium text-foreground">Daily spend — last 30 days</p>
        <div className="mt-3 -ml-3 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailySpend}>
              <XAxis
                dataKey="label"
                interval={Math.ceil(dailySpend.length / 6)}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
              />
              <Tooltip content={<TooltipBox />} cursor={{ fill: 'var(--muted)' }} />
              <Bar dataKey="total" fill="var(--muted-foreground)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Category breakdown */}
      <Card className="p-5">
        <p className="text-sm font-medium text-foreground">By category — this month</p>
        {categoryBreakdown.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No expenses logged this month yet.</p>
        ) : (
          <div className="mt-2 flex items-center gap-5">
            <div className="h-[140px] w-[140px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryBreakdown} dataKey="value" nameKey="name" innerRadius={42} outerRadius={64} paddingAngle={2} stroke="none">
                    {categoryBreakdown.map(c => <Cell key={c.name} fill={categoryColor(c.name)} />)}
                  </Pie>
                  <Tooltip content={<TooltipBox />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              {categoryBreakdown.map(c => (
                <div key={c.name} className="flex items-center gap-2 text-xs">
                  <span className="size-2 shrink-0 rounded-full" style={{ background: categoryColor(c.name) }} />
                  <span className="flex-1 truncate text-muted-foreground">{c.name}</span>
                  <span className="font-heading text-foreground">{formatCurrency(c.value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Who paid more */}
      <Card className="p-5">
        <p className="text-sm font-medium text-foreground">Who paid — this month</p>
        {splitTotal === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No expenses logged this month yet.</p>
        ) : (
          <div className="mt-3.5">
            <div className="mb-2 flex justify-between text-xs">
              <span className="font-medium text-foreground">You · {formatCurrency(youTotal)}</span>
              <span className="font-medium text-muted-foreground">{partner?.display_name ?? 'Partner'} · {formatCurrency(partnerTotal)}</span>
            </div>
            <div className="flex h-2 overflow-hidden rounded-full bg-muted">
              <div className="bg-foreground" style={{ width: `${youPct}%` }} />
              <div className="bg-muted-foreground" style={{ width: `${100 - youPct}%` }} />
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
