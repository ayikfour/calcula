import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const tabs = [
  { to: '/log', label: 'Logs' },
  { to: '/dashboard', label: 'Stats' },
  { to: '/settings', label: 'Settings' },
]

export function TopNav() {
  return (
    <nav
      className="fixed top-0 right-0 left-0 z-50"
      style={{ paddingTop: 'var(--safe-top)' }}
    >
      <div className="mx-auto flex max-w-lg items-center gap-5 px-5 py-3.5">
        {tabs.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'font-heading text-lg font-medium tracking-tight transition-colors duration-150',
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
