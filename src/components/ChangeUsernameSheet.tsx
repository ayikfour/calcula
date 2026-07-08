import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  isOpen: boolean
  onClose: () => void
  currentName: string
}

export function ChangeUsernameSheet({ isOpen, onClose, currentName }: Props) {
  const { couple, user, refreshCouple } = useAuth()
  const [name, setName] = useState(currentName)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleClose() {
    setName(currentName)
    setError('')
    onClose()
  }

  async function handleSave() {
    if (!couple || !user) return
    const trimmed = name.trim()
    if (!trimmed || trimmed === currentName) return
    setSaving(true)
    setError('')
    const { data, error } = await supabase
      .from('couple_members')
      .update({ display_name: trimmed })
      .eq('couple_id', couple.couple_id)
      .eq('user_id', user.id)
      .select()
    setSaving(false)
    if (error || !data?.length) {
      setError(error?.message || 'Could not update name. Try again.')
      return
    }
    await refreshCouple()
    toast('Name updated')
    handleClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={open => !open && handleClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Change your name</SheetTitle>
        </SheetHeader>

        <form onSubmit={e => { e.preventDefault(); handleSave() }} className="space-y-3 px-4 pb-4">
          <div className="space-y-1.5">
            <Label htmlFor="settings-display-name">Your name</Label>
            <Input
              id="settings-display-name"
              type="text"
              placeholder="How your partner sees you"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={32}
              required
              className="h-12"
            />
          </div>

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
            disabled={saving || !name.trim() || name.trim() === currentName}
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
