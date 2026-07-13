import { useState } from 'react'
import { FunnelSimple } from '@phosphor-icons/react'
import { useAuth } from '@/hooks/useAuth'
import { useAppSound } from '@/hooks/useAppSound'
import { useAvailableMonths } from '@/hooks/useAvailableMonths'
import { useCategories } from '@/hooks/useCategories'
import { useSpaceMembers } from '@/hooks/useSpaceMembers'
import { useExpenseFilters } from '@/contexts/ExpenseFiltersContext'
import { MonthDrawer } from './MonthDrawer'
import { FilterDrawer } from './FilterDrawer'
import { Button } from '@/components/ui/button'

// Reuses MonthDrawer's own trigger + sheet (via triggerClassName) rather than
// forking a second month-picker, stripped down to plain text + chevron to
// read as a nav title instead of a floating toolbar button.
const MONTH_TRIGGER_CLASSNAME =
  'h-auto rounded-none bg-transparent p-0 font-heading text-lg font-medium tracking-tight text-foreground hover:bg-transparent'

export function TopNavMonthFilter() {
  const { user, space } = useAuth()
  const playSound = useAppSound()
  const availableMonths = useAvailableMonths(space?.space_id)
  const [categories] = useCategories()
  const members = useSpaceMembers(space?.space_id)
  const {
    selectedMonth, setSelectedMonth, filterCategories, filterPaidBy, setFilters, activeFilterCount,
  } = useExpenseFilters()
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

  const hasActiveFilters = activeFilterCount > 0

  return (
    <div className="flex items-center gap-2">
      {availableMonths.length > 0 && selectedMonth && (
        <MonthDrawer
          months={availableMonths}
          selectedMonth={selectedMonth}
          onSelect={setSelectedMonth}
          triggerClassName={MONTH_TRIGGER_CLASSNAME}
        />
      )}

      <span className="h-4 w-px bg-border" aria-hidden />

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Filter"
        className="relative"
        onClick={() => { playSound('tap'); setFilterDrawerOpen(true) }}
      >
        <FunnelSimple />
        {hasActiveFilters && (
          <span className="absolute top-1 right-1 size-1.5 rounded-full bg-primary" />
        )}
      </Button>

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
    </div>
  )
}
