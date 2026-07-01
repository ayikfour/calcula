import { NavLink } from 'react-router-dom'
import { ListBullets, ChartBar, ArrowsLeftRight, Gear } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

const tabs = [
  { to: '/log', label: 'Log', Icon: ListBullets },
  { to: '/dashboard', label: 'Dashboard', Icon: ChartBar },
  { to: '/balance', label: 'Balance', Icon: ArrowsLeftRight },
  { to: '/settings', label: 'Settings', Icon: Gear },
]

export function BottomNav() {
  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-50 border-t border-border bg-card"
      style={{ paddingBottom: 'calc(12px + var(--safe-bottom))' }}
    >
      <div className="mx-auto flex max-w-sm items-center justify-around px-4 pt-3">
        {tabs.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 rounded-full px-3 py-1 transition-colors duration-150',
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <Icon className="size-5" weight="regular" />
            <span className="text-[11px] font-medium tracking-wide">
              {label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
