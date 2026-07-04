import { useRef, useState, useEffect } from 'react'
import { TrashSimple } from '@phosphor-icons/react'
import { Checkbox } from '@/components/ui/checkbox'
import { formatCurrency } from '../lib/format'
import type { Expense } from '../types'

const SWIPE_WIDTH = 76
const SWIPE_COMMIT_THRESHOLD = 8

interface Props {
  expense: Expense
  categoryIcon: string
  payerLabel: string
  currencyCode: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onEdit: () => void
  onDeleteRequest: () => void
  showTopBorder?: boolean
  editMode?: boolean
  selected?: boolean
  onToggleSelect?: () => void
}

type DragState = {
  startX: number
  startY: number
  base: number
  committed: boolean
}

export function ExpenseRow({
  expense,
  categoryIcon,
  payerLabel,
  currencyCode,
  isOpen,
  onOpenChange,
  onEdit,
  onDeleteRequest,
  showTopBorder,
  editMode = false,
  selected = false,
  onToggleSelect,
}: Props) {
  const [dragX, setDragX] = useState(isOpen ? -SWIPE_WIDTH : 0)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<DragState | null>(null)

  useEffect(() => {
    if (!dragRef.current) setDragX(isOpen ? -SWIPE_WIDTH : 0)
  }, [isOpen])

  function handlePointerDown(e: React.PointerEvent) {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    dragRef.current = { startX: e.clientX, startY: e.clientY, base: dragX, committed: false }
  }

  function handlePointerMove(e: React.PointerEvent) {
    const drag = dragRef.current
    if (!drag) return
    const deltaX = e.clientX - drag.startX
    const deltaY = e.clientY - drag.startY

    if (!drag.committed) {
      if (Math.abs(deltaX) < SWIPE_COMMIT_THRESHOLD && Math.abs(deltaY) < SWIPE_COMMIT_THRESHOLD) return
      if (Math.abs(deltaY) > Math.abs(deltaX)) { dragRef.current = null; return }
      drag.committed = true
      setIsDragging(true)
      try { e.currentTarget.setPointerCapture(e.pointerId) } catch {
        // Capture can fail if the pointer was already released — the drag
        // still works via bubbled move/up events, just without the guarantee.
      }
    }

    e.preventDefault()
    setDragX(Math.min(0, Math.max(-SWIPE_WIDTH, drag.base + deltaX)))
  }

  function handlePointerUp() {
    const drag = dragRef.current
    dragRef.current = null
    setIsDragging(false)

    if (!drag?.committed) {
      if (isOpen) onOpenChange(false)
      else onEdit()
      return
    }

    const shouldOpen = dragX < -SWIPE_WIDTH / 2
    setDragX(shouldOpen ? -SWIPE_WIDTH : 0)
    onOpenChange(shouldOpen)
  }

  if (editMode) {
    return (
      <div
        className="relative border-b border-border"
        style={showTopBorder ? { borderTop: '1px solid var(--border)' } : undefined}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={onToggleSelect}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggleSelect?.() } }}
          className="flex w-full items-center gap-3 bg-background px-5 py-3.5 text-left"
        >
          <Checkbox checked={selected} className="pointer-events-none" tabIndex={-1} />

          {/* Category icon */}
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-lg">
            {categoryIcon}
          </div>

          {/* Text */}
          <div className="min-w-0 flex-1">
            <p className="mb-0.5 truncate text-base font-medium text-foreground">
              {expense.category}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {expense.description ? `${expense.description} · ${payerLabel}` : payerLabel}
            </p>
          </div>

          {/* Amount */}
          <span className="font-heading shrink-0 text-base font-medium text-foreground">
            {formatCurrency(expense.amount, currencyCode)}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative overflow-hidden border-b border-border"
      style={showTopBorder ? { borderTop: '1px solid var(--border)' } : undefined}
    >
      <button
        onClick={onDeleteRequest}
        className="absolute inset-y-0 right-0 flex items-center justify-center bg-destructive/15 text-destructive"
        style={{ width: SWIPE_WIDTH }}
        aria-label="Delete expense"
      >
        <TrashSimple className="size-5" />
      </button>

      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative flex touch-pan-y items-center gap-3 bg-background px-5 py-3.5"
        style={{
          transform: `translateX(${dragX}px)`,
          transition: isDragging ? 'none' : 'transform 150ms ease-out',
        }}
      >
        {/* Category icon */}
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-lg">
          {categoryIcon}
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className="mb-0.5 truncate text-base font-medium text-foreground">
            {expense.category}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {expense.description ? `${expense.description} · ${payerLabel}` : payerLabel}
          </p>
        </div>

        {/* Amount */}
        <span className="font-heading shrink-0 text-base font-medium text-foreground">
          {formatCurrency(expense.amount, currencyCode)}
        </span>
      </div>
    </div>
  )
}
