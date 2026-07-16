import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../hooks/useAuth'
import { useBudgets } from '../hooks/useBudgets'
import { useSpaceMembers } from '../hooks/useSpaceMembers'
import { useSoundPreference } from '../hooks/useSoundPreference'
import { useSoundVolume } from '../hooks/useSoundVolume'
import { useAppSound } from '../hooks/useAppSound'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { supabase } from '../lib/supabase'
import { getCurrency, DEFAULT_CURRENCY_CODE } from '../lib/currencies'
import { formatCurrency } from '../lib/format'
import { effectiveBudgetFor } from '../lib/budgetSummary'
import { toISODateLocal } from '../lib/dates'
import { MemberAvatar, uploadAvatar, removeAvatar } from '../lib/avatar'
import { CurrencyDrawer } from '../components/CurrencyDrawer'
import { PasswordSheet } from '../components/PasswordSheet'
import { ChangeUsernameSheet } from '../components/ChangeUsernameSheet'
import { MonthlyBudgetSheet } from '../components/MonthlyBudgetSheet'
import { SwitchSpaceSheet } from '../components/SwitchSpaceSheet'
import { PageSwitcherBar } from '../components/PageSwitcherBar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Check, CaretRight, Copy, SpinnerGap } from '@phosphor-icons/react'

export function SettingsPage() {
  const navigate = useNavigate()
  const { user, space, hasPassword, refreshSpace, signOut } = useAuth()
  const { budgets, refetch: refetchBudgets } = useBudgets(space?.space_id)
  const members = useSpaceMembers(space?.space_id)
  const { enabled: soundEnabled, setEnabled: setSoundEnabled } = useSoundPreference()
  const { volume, setVolume } = useSoundVolume()
  const playSound = useAppSound()
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [currencyDrawerOpen, setCurrencyDrawerOpen] = useState(false)
  const [passwordSheetOpen, setPasswordSheetOpen] = useState(false)
  const [usernameSheetOpen, setUsernameSheetOpen] = useState(false)
  const [budgetSheetOpen, setBudgetSheetOpen] = useState(false)
  const [switchSpaceSheetOpen, setSwitchSpaceSheetOpen] = useState(false)
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currencyCode = space?.currency_code ?? DEFAULT_CURRENCY_CODE
  const currentMonth = toISODateLocal(new Date()).slice(0, 7)
  const myBudget = effectiveBudgetFor(budgets, user?.id, new Date())

  useEffect(() => {
    if (!space) return
    supabase
      .from('spaces')
      .select('invite_code')
      .eq('id', space.space_id)
      .single()
      .then(({ data }) => setInviteCode(data?.invite_code ?? null))
  }, [space?.space_id])

  async function copyCode() {
    if (!inviteCode) return
    await navigator.clipboard.writeText(inviteCode)
    playSound('copy')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function selectCurrency(code: string) {
    if (!space) return
    const { data, error } = await supabase
      .from('spaces')
      .update({ currency_code: code })
      .eq('id', space.space_id)
      .select()
    if (error || !data?.length) {
      playSound('warning')
      toast('Could not update currency')
      return
    }
    await refreshSpace()
  }

  async function handleAvatarFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file later
    if (!file || !user) return
    setAvatarError('')
    setUploadingAvatar(true)
    try {
      await uploadAvatar(file, user.id)
      await refreshSpace()
      playSound('click')
    } catch {
      setAvatarError('Could not upload photo')
      playSound('warning')
    } finally {
      setUploadingAvatar(false)
    }
  }

  async function handleRemoveAvatar() {
    if (!user) return
    setAvatarError('')
    setUploadingAvatar(true)
    try {
      await removeAvatar(user.id)
      await refreshSpace()
    } catch {
      setAvatarError('Could not remove photo')
      playSound('warning')
    } finally {
      setUploadingAvatar(false)
    }
  }

  async function handleLeave() {
    setLeaving(true)
    const { error } = await supabase.rpc('leave_space')
    setLeaving(false)
    if (error) {
      toast('Could not leave this space')
      return
    }
    await refreshSpace()
    setLeaveDialogOpen(false)
    toast("You've left the space")
  }

  async function handleDeleteAccount() {
    if (!user) return
    setDeleting(true)
    if (space?.avatar_url) {
      // Best-effort — the account gets deleted either way even if this fails.
      await removeAvatar(user.id).catch(() => {})
    }
    const { error } = await supabase.rpc('delete_own_account')
    if (error) {
      setDeleting(false)
      toast('Could not delete your account')
      return
    }
    await supabase.auth.signOut()
  }

  return (
    <div className="space-y-5 px-6 pt-6 pb-24">
      <div className="overflow-hidden rounded-lg border border-border">
        {/* Account */}
        <div className="border-b border-border px-4 py-3.5 last:border-b-0">
          <p className="text-base text-foreground">{user?.email}</p>
          {space && (
            <p className="text-sm text-muted-foreground">
              Signed in as <span className="font-medium text-foreground">{space.display_name}</span>
            </p>
          )}
        </div>

        {/* Profile photo */}
        {space && user && (
          <div className="flex items-center justify-between border-b border-border px-4 py-3.5 last:border-b-0">
            <span className="text-base text-foreground">Profile photo</span>
            <div className="flex items-center gap-3">
              {avatarError && <span className="text-xs text-destructive">{avatarError}</span>}
              {space.avatar_url && !uploadingAvatar && (
                <button
                  onClick={handleRemoveAvatar}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Remove
                </button>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="relative disabled:opacity-60"
                aria-label="Change profile photo"
              >
                <MemberAvatar
                  member={{ user_id: user.id, display_name: space.display_name, avatar_url: space.avatar_url }}
                  size="lg"
                />
                {uploadingAvatar && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-background/60">
                    <SpinnerGap className="size-4 animate-spin text-foreground" weight="bold" />
                  </span>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFileChange}
              />
            </div>
          </div>
        )}

        {/* Your name */}
        {space && (
          <button
            onClick={() => { playSound('click'); setUsernameSheetOpen(true) }}
            className="flex w-full items-center justify-between border-b border-border px-4 py-3.5 text-left last:border-b-0"
          >
            <span className="text-base text-foreground">Your name</span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="text-sm">{space.display_name}</span>
              <CaretRight className="size-3.5" />
            </span>
          </button>
        )}

        {/* Change/create password */}
        <button
          onClick={() => { playSound('click'); setPasswordSheetOpen(true) }}
          className="flex w-full items-center justify-between border-b border-border px-4 py-3.5 text-left last:border-b-0"
        >
          <span className="text-base text-foreground">{hasPassword ? 'Change password' : 'Create a password'}</span>
          <CaretRight className="size-3.5 text-muted-foreground" />
        </button>

        {/* Currency */}
        {space && (
          <button
            onClick={() => { playSound('click'); setCurrencyDrawerOpen(true) }}
            className="flex w-full items-center justify-between border-b border-border px-4 py-3.5 text-left last:border-b-0"
          >
            <span className="text-base text-foreground">Currency</span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="text-sm">
                {getCurrency(space.currency_code).symbol} {getCurrency(space.currency_code).name}
              </span>
              <CaretRight className="size-3.5" />
            </span>
          </button>
        )}

        {/* Monthly budget */}
        {space && (
          <button
            onClick={() => { playSound('click'); setBudgetSheetOpen(true) }}
            className="flex w-full items-center justify-between border-b border-border px-4 py-3.5 text-left last:border-b-0"
          >
            <span className="text-base text-foreground">Monthly budget</span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="text-sm">{formatCurrency(myBudget, currencyCode)}</span>
              <CaretRight className="size-3.5" />
            </span>
          </button>
        )}

        {/* Sound effects */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex w-full items-center justify-between border-b border-border px-4 py-3.5 text-left last:border-b-0"
        >
          <span className="text-base text-foreground">Sound effects</span>
          <span className="text-sm text-muted-foreground">{soundEnabled ? 'On' : 'Off'}</span>
        </button>

        {/* Volume */}
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3.5 last:border-b-0">
          <span className="text-base text-foreground">Volume</span>
          <Slider
            value={[volume]}
            onValueChange={([v]) => setVolume(v)}
            min={0}
            max={1}
            step={0.05}
            disabled={!soundEnabled}
            className="w-32"
            aria-label="Sound effects volume"
          />
        </div>

        {/* Invite code */}
        {space && (
          <div className="flex items-center justify-between border-b border-border px-4 py-3.5 last:border-b-0">
            <span className="text-base text-foreground">Invite code</span>
            <div className="flex items-center gap-3">
              <span className="font-heading text-base font-medium tracking-[0.15em] text-foreground">
                {inviteCode ?? '······'}
              </span>
              <button
                onClick={copyCode}
                disabled={!inviteCode}
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
              >
                {copied ? (
                  <>
                    <Check className="size-3.5" weight="bold" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Import */}
        {space && (
          <button
            onClick={() => { playSound('click'); navigate('/import') }}
            className="flex w-full items-center justify-between border-b border-border px-4 py-3.5 text-left last:border-b-0"
          >
            <span className="text-base text-foreground">Import expenses</span>
            <CaretRight className="size-3.5 text-muted-foreground" />
          </button>
        )}

        {/* Join a different space */}
        <button
          onClick={() => { playSound('click'); setSwitchSpaceSheetOpen(true) }}
          className="flex w-full items-center justify-between border-b border-border px-4 py-3.5 text-left last:border-b-0"
        >
          <span className="text-base text-foreground">Join a different space</span>
          <CaretRight className="size-3.5 text-muted-foreground" />
        </button>

        {/* Leave this space */}
        {members.length > 1 && (
          <button
            onClick={() => { playSound('click'); setLeaveDialogOpen(true) }}
            className="flex w-full items-center justify-between border-b border-border px-4 py-3.5 text-left last:border-b-0"
          >
            <span className="text-base text-destructive">Leave this space</span>
            <CaretRight className="size-3.5 text-muted-foreground" />
          </button>
        )}

        {/* Delete account */}
        <button
          onClick={() => { playSound('click'); setDeleteDialogOpen(true) }}
          className="flex w-full items-center justify-between px-4 py-3.5 text-left"
        >
          <span className="text-base text-destructive">Delete account</span>
          <CaretRight className="size-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Sign out */}
      <Button onClick={signOut} variant="secondary" className="w-full">
        Sign out
      </Button>

      <PasswordSheet
        isOpen={passwordSheetOpen}
        onClose={() => setPasswordSheetOpen(false)}
        mode={hasPassword ? 'change' : 'create'}
      />

      {space && (
        <ChangeUsernameSheet
          isOpen={usernameSheetOpen}
          onClose={() => setUsernameSheetOpen(false)}
          currentName={space.display_name}
        />
      )}

      {space && user && (
        <MonthlyBudgetSheet
          isOpen={budgetSheetOpen}
          onClose={() => setBudgetSheetOpen(false)}
          currentAmount={myBudget}
          effectiveMonth={currentMonth}
          refetchBudgets={refetchBudgets}
        />
      )}

      {space && (
        <CurrencyDrawer
          isOpen={currencyDrawerOpen}
          onClose={() => setCurrencyDrawerOpen(false)}
          selectedCode={space.currency_code}
          onSelect={selectCurrency}
        />
      )}

      <SwitchSpaceSheet
        isOpen={switchSpaceSheetOpen}
        onClose={() => setSwitchSpaceSheetOpen(false)}
      />

      <Dialog open={leaveDialogOpen} onOpenChange={open => !open && setLeaveDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave this space?</DialogTitle>
            <DialogDescription>
              You'll land in a new solo space with your own expenses, budget,
              and recurring expenses still intact. The space you're leaving
              keeps its own history — nothing is deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleLeave} disabled={leaving}>
              {leaving ? 'Leaving…' : 'Leave'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onOpenChange={open => { setDeleteDialogOpen(open); if (!open) setDeleteConfirmText('') }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>
              This permanently deletes your account and all of your expenses,
              budget, and recurring expenses. This can't be undone.
              {members.length > 1 &&
                " Your space-mate's own data is unaffected — only your shared space membership ends."}
            </DialogDescription>
          </DialogHeader>
          <Input
            value={deleteConfirmText}
            onChange={e => setDeleteConfirmText(e.target.value)}
            placeholder="Type DELETE to confirm"
            aria-label="Type DELETE to confirm account deletion"
            autoComplete="off"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleting || deleteConfirmText.trim().toLowerCase() !== 'delete'}
            >
              {deleting ? 'Deleting…' : 'Delete account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PageSwitcherBar />
    </div>
  )
}
