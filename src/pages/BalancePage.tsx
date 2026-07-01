import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { formatCurrency } from '../lib/format'
import { Card } from '@/components/ui/card'
import { SpinnerGap } from '@phosphor-icons/react'

interface BalanceRow {
  user_id: string
  display_name: string
  owes: number
  paid: number
  net: number
}

export function BalancePage() {
  const { user, couple } = useAuth()
  const [rows, setRows] = useState<BalanceRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!couple) return
    supabase.rpc('get_monthly_balance').then(({ data }) => {
      setRows(data ?? [])
      setLoading(false)
    })
  }, [couple])

  const you = rows.find(r => r.user_id === user?.id)
  const partner = rows.find(r => r.user_id !== user?.id)
  const net = you?.net ?? 0 // positive = you're owed, negative = you owe

  let headline: string
  let tone: 'success' | 'danger' | 'neutral'
  if (Math.abs(net) < 0.01) {
    headline = "You're all settled up"
    tone = 'neutral'
  } else if (net > 0) {
    headline = `${partner?.display_name ?? 'Your partner'} owes you`
    tone = 'success'
  } else {
    headline = `You owe ${partner?.display_name ?? 'your partner'}`
    tone = 'danger'
  }

  const toneColor = tone === 'success' ? 'var(--color-success)' : tone === 'danger' ? 'var(--color-danger)' : 'var(--foreground)'

  return (
    <div className="flex flex-col gap-4 px-5 pt-2 pb-6">
      <h1 className="font-heading text-[28px] font-medium tracking-tight text-foreground">
        Balance
      </h1>

      {loading ? (
        <div className="flex justify-center pt-16">
          <SpinnerGap className="size-6 animate-spin text-muted-foreground" weight="bold" />
        </div>
      ) : (
        <>
          {/* Headline */}
          <Card className="p-8 text-center">
            <p className="mb-2.5 text-sm text-muted-foreground">{headline}</p>
            {Math.abs(net) >= 0.01 && (
              <p className="font-heading text-4xl font-medium" style={{ color: toneColor }}>
                {formatCurrency(Math.abs(net))}
              </p>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              Based on evenly-split expenses this month
            </p>
          </Card>

          {/* Breakdown */}
          <Card className="p-5">
            <p className="mb-4 text-sm font-medium text-foreground">This month's breakdown</p>
            {[you, partner].filter((r): r is BalanceRow => !!r).map((r, i) => (
              <div
                key={r.user_id}
                className="flex items-center justify-between py-3"
                style={i === 0 ? undefined : { borderTop: '1px solid var(--border)' }}
              >
                <span className="text-sm font-medium text-foreground">
                  {r.user_id === user?.id ? 'You' : r.display_name}
                </span>
                <div className="text-right">
                  <p className="font-heading text-sm text-foreground">
                    Paid {formatCurrency(r.paid)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Share: {formatCurrency(r.owes)}
                  </p>
                </div>
              </div>
            ))}
            {rows.length === 0 && (
              <p className="text-sm text-muted-foreground">No evenly-split expenses logged this month yet.</p>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
