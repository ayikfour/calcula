import { Plus, X, CaretDown } from '@phosphor-icons/react'
import { MonthDrawer } from './MonthDrawer'
import { Button } from '@/components/ui/button'

// The bottom toolbar floats with no background behind it, so the default
// variant's opacity-based hover (`hover:bg-primary/80`) lets the page show
// through and reads as washed-out/transparent. `brightness` darkens the
// already-opaque button instead of blending with whatever's behind it.
const TOOLBAR_SOLID_HOVER = 'hover:bg-primary hover:brightness-90'

interface BottomActionBarProps {
  mode: 'logs' | 'stats'
  onAdd: () => void
  activeFilterCount: number
  onOpenFilter: () => void
  availableMonths: string[]
  selectedMonth: string | null
  onSelectMonth: (month: string) => void
  // logs-only
  editMode?: boolean
  onEnterEditMode?: () => void
  onExitEditMode?: () => void
  selectedCount?: number
  onRequestBulkDelete?: () => void
}

export function BottomActionBar({
  mode,
  onAdd,
  activeFilterCount,
  onOpenFilter,
  availableMonths,
  selectedMonth,
  onSelectMonth,
  editMode = false,
  onEnterEditMode,
  onExitEditMode,
  selectedCount = 0,
  onRequestBulkDelete,
}: BottomActionBarProps) {
  const hasActiveFilters = activeFilterCount > 0
  const inEditMode = mode === 'logs' && editMode

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between px-5 pt-3"
      style={{ paddingBottom: 'calc(16px + var(--safe-bottom))' }}
    >
      {inEditMode ? (
        <Button
          onClick={onExitEditMode}
          size="icon"
          aria-label="Exit edit mode"
          className={TOOLBAR_SOLID_HOVER}
        >
          <X className="size-5" weight="bold" />
        </Button>
      ) : (
        <Button onClick={onAdd} size="icon" aria-label="Add expense" className={TOOLBAR_SOLID_HOVER}>
          <Plus className="size-5" weight="bold" />
        </Button>
      )}

      {inEditMode ? (
        <Button
          variant="destructive"
          onClick={onRequestBulkDelete}
          disabled={selectedCount === 0}
          className="bg-destructive text-white hover:bg-destructive hover:brightness-90 dark:bg-destructive dark:hover:bg-destructive disabled:opacity-100 disabled:bg-destructive disabled:saturate-50 disabled:brightness-75 disabled:text-white/70"
        >
          {selectedCount > 0 ? `Delete (${selectedCount})` : 'Delete'}
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          {mode === 'logs' && (
            <Button onClick={onEnterEditMode} className={TOOLBAR_SOLID_HOVER}>Edit</Button>
          )}
          <Button onClick={onOpenFilter} className={`gap-1.5 ${TOOLBAR_SOLID_HOVER}`}>
            {hasActiveFilters ? `${activeFilterCount} · Filter` : 'Filter'}
            <CaretDown className="size-3.5" />
          </Button>
          {availableMonths.length > 0 && selectedMonth && (
            <MonthDrawer
              months={availableMonths}
              selectedMonth={selectedMonth}
              onSelect={onSelectMonth}
              triggerClassName={TOOLBAR_SOLID_HOVER}
            />
          )}
        </div>
      )}
    </div>
  )
}
