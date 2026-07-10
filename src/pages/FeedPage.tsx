import { useEffect, useMemo } from 'react'
import { ClockCounterClockwise, SpinnerGap } from '@phosphor-icons/react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useExpenseActivity } from '../hooks/useExpenseActivity'
import { useSpaceMembers } from '../hooks/useSpaceMembers'
import { useCategories } from '../hooks/useCategories'
import { FeedRow } from '../components/FeedRow'
import { PageSwitcherBar } from '../components/PageSwitcherBar'
import { formatDateLabel } from '../lib/format'
import { toISODateLocal } from '../lib/dates'
import { DEFAULT_CURRENCY_CODE } from '../lib/currencies'
import type { AvatarSubject } from '../lib/avatar'
import type { ExpenseActivity } from '../types'

export function FeedPage() {
  const { user, space } = useAuth()
  const { activity, loading } = useExpenseActivity(space?.space_id)
  const members = useSpaceMembers(space?.space_id)
  const categories = useCategories()
  const catIcons = Object.fromEntries(categories.map(c => [c.name, c.icon]))
  const currencyCode = space?.currency_code ?? DEFAULT_CURRENCY_CODE

  // Marks the feed as seen as of now, so the Log page's unread nudge card
  // clears once the user has actually landed here — not on nudge-card tap,
  // so it doesn't vanish if they back out before this page finishes loading.
  useEffect(() => {
    if (!user?.id) return
    supabase.from('space_members').update({ feed_last_seen_at: new Date().toISOString() }).eq('user_id', user.id).then()
  }, [user?.id])

  function actorName(actorId: string) {
    if (actorId === user?.id) return 'You'
    return members.find(m => m.user_id === actorId)?.display_name ?? 'Partner'
  }

  function resolveActor(actorId: string): AvatarSubject {
    if (actorId === user?.id) {
      return { user_id: actorId, display_name: 'You', avatar_url: space?.avatar_url ?? null }
    }
    const member = members.find(m => m.user_id === actorId)
    return {
      user_id: actorId,
      display_name: member?.display_name ?? 'Partner',
      avatar_url: member?.avatar_url ?? null,
    }
  }

  function getCategoryIcon(category: string) {
    return catIcons[category] ?? '📦'
  }

  // Group by the activity's own day (created_at), not the expense_date
  // embedded in the message — this is "when did this happen", the same axis
  // the per-row timeline connects along.
  const grouped = useMemo(() => {
    const map = new Map<string, ExpenseActivity[]>()
    for (const a of activity) {
      const dayKey = toISODateLocal(new Date(a.created_at))
      const list = map.get(dayKey) ?? []
      list.push(a)
      map.set(dayKey, list)
    }
    return Array.from(map.entries())
  }, [activity])

  if (loading) {
    return (
      <>
        <div className="flex justify-center pt-16">
          <SpinnerGap className="size-6 animate-spin text-muted-foreground" weight="bold" />
        </div>
        <PageSwitcherBar />
      </>
    )
  }

  if (activity.length === 0) {
    return (
      <>
        <div className="px-8 pt-16 pb-8 text-center">
          <ClockCounterClockwise className="mx-auto mb-4 size-10 text-muted-foreground" weight="light" />
          <p className="mb-2 text-base font-medium text-foreground">No activity yet</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Actions you and your space-mate take will show up here.
          </p>
        </div>
        <PageSwitcherBar />
      </>
    )
  }

  return (
    <>
      <div className="pt-2 pb-24">
        {grouped.map(([dayKey, items]) => (
          <div key={dayKey}>
            <div className="px-5 pt-3 pb-1.5">
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {formatDateLabel(dayKey)}
              </span>
            </div>
            {items.map((a, i) => (
              <FeedRow
                key={a.id}
                activity={a}
                actor={resolveActor(a.actor_id)}
                actorName={actorName(a.actor_id)}
                currencyCode={currencyCode}
                getCategoryIcon={getCategoryIcon}
                isFirst={i === 0}
                isLast={i === items.length - 1}
              />
            ))}
          </div>
        ))}
      </div>
      <PageSwitcherBar />
    </>
  )
}
