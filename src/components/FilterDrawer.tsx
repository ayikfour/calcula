import { useState, useEffect } from 'react'
import type { Category, CoupleMember } from '../types'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'

interface Props {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  members: CoupleMember[]
  currentUserId: string | undefined
  selectedCategory: string | null
  selectedPayer: string | null
  onApply: (category: string | null, payer: string | null) => void
}

export function FilterDrawer({
  isOpen,
  onClose,
  categories,
  members,
  currentUserId,
  selectedCategory,
  selectedPayer,
  onApply,
}: Props) {
  const [pendingCategory, setPendingCategory] = useState<string | null>(selectedCategory)
  const [pendingPayer, setPendingPayer] = useState<string | null>(selectedPayer)

  useEffect(() => {
    if (!isOpen) return
    setPendingCategory(selectedCategory)
    setPendingPayer(selectedPayer)
  }, [isOpen, selectedCategory, selectedPayer])

  const payerOptions = members.map(m => ({
    label: m.user_id === currentUserId ? 'You' : m.display_name,
    value: m.user_id,
  }))

  function handleReset() {
    setPendingCategory(null)
    setPendingPayer(null)
    onApply(null, null)
    onClose()
  }

  function handleFilter() {
    onApply(pendingCategory, pendingPayer)
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
      <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto overscroll-contain rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Filter</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-4">
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Paid by
            </p>
            <div className="flex flex-wrap gap-2">
              {payerOptions.map(opt => (
                <Chip
                  key={opt.value}
                  pressed={pendingPayer === opt.value}
                  onPressedChange={() => setPendingPayer(pendingPayer === opt.value ? null : opt.value)}
                >
                  {opt.label}
                </Chip>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Category
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <Chip
                  key={cat.id}
                  pressed={pendingCategory === cat.name}
                  onPressedChange={() => setPendingCategory(pendingCategory === cat.name ? null : cat.name)}
                >
                  <span>{cat.icon}</span> {cat.name}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter className="flex-row">
          <Button variant="secondary" onClick={handleReset} className="flex-1">
            Reset
          </Button>
          <Button onClick={handleFilter} className="flex-1">
            Filter
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
