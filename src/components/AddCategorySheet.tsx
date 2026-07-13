import { lazy, Suspense, useState } from 'react'
import type { EmojiClickData, Theme } from 'emoji-picker-react'
import { useAppSound } from '../hooks/useAppSound'
import type { Category } from '../types'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const LazyEmojiPicker = lazy(() => import('emoji-picker-react'))

interface Props {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  addCategory: (name: string, icon: string) => Promise<{ data: Category | null; error: { message: string } | null }>
  onAdded: (category: Category) => void
}

export function AddCategorySheet({ isOpen, onClose, categories, addCategory, onAdded }: Props) {
  const playSound = useAppSound()
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleClose() {
    setName('')
    setIcon('')
    setEmojiPickerOpen(false)
    setError('')
    onClose()
  }

  function handleEmojiClick(emojiData: EmojiClickData) {
    playSound('select')
    setIcon(emojiData.emoji)
    setEmojiPickerOpen(false)
  }

  async function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) { playSound('error'); setError('Enter a name'); return }
    if (!icon) { playSound('error'); setError('Choose an emoji'); return }
    if (categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      playSound('error')
      setError('A category with this name already exists')
      return
    }

    setSaving(true)
    setError('')
    const { data, error } = await addCategory(trimmed, icon)
    setSaving(false)

    if (error || !data) {
      playSound('error')
      setError(error?.message ?? 'Could not add category. Try again.')
      return
    }

    playSound('success')
    onAdded(data)
    handleClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={open => !open && handleClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Add category</SheetTitle>
        </SheetHeader>

        <form onSubmit={e => { e.preventDefault(); handleSave() }} className="space-y-3 px-4 pb-4">
          <div className="space-y-1.5">
            <Label htmlFor="new-category-name">Name</Label>
            <Input
              id="new-category-name"
              type="text"
              placeholder="e.g. Gym, Gifts…"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={24}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Emoji</Label>
            <button
              type="button"
              onClick={() => { playSound('tap'); setEmojiPickerOpen(o => !o) }}
              className="flex h-12 w-full items-center gap-2 rounded-[10px] border border-border bg-[#1d1d1d] px-4 text-left text-base text-foreground"
            >
              <span className="text-xl">{icon || '🙂'}</span>
              <span className={icon ? 'text-foreground' : 'text-muted-foreground'}>
                {icon ? 'Change emoji' : 'Choose an emoji'}
              </span>
            </button>
          </div>

          {emojiPickerOpen && (
            <div className="overflow-hidden rounded-lg border border-border">
              <Suspense fallback={<div className="p-6 text-center text-sm text-muted-foreground">Loading…</div>}>
                <LazyEmojiPicker
                  onEmojiClick={handleEmojiClick}
                  theme={'dark' as Theme}
                  width="100%"
                  height={350}
                  previewConfig={{ showPreview: false }}
                  searchPlaceHolder="Search emoji"
                />
              </Suspense>
            </div>
          )}

          {error && <p className="text-xs text-destructive">{error}</p>}
        </form>

        <SheetFooter className="flex-row">
          <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="flex-1"
            disabled={saving || !name.trim() || !icon}
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
