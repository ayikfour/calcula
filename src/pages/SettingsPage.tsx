import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../hooks/useAuth'
import { useBudgets } from '../hooks/useBudgets'
import { supabase } from '../lib/supabase'
import { getCurrency, DEFAULT_CURRENCY_CODE } from '../lib/currencies'
import { formatCurrency } from '../lib/format'
import { CurrencyDrawer } from '../components/CurrencyDrawer'
import { PasswordInput } from '../components/PasswordInput'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check, CaretRight, Copy } from '@phosphor-icons/react'

export function SettingsPage() {
  const navigate = useNavigate()
  const { user, couple, refreshCouple, signOut } = useAuth()
  const { budgets, refetch: refetchBudgets } = useBudgets(couple?.couple_id)
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [currencyDrawerOpen, setCurrencyDrawerOpen] = useState(false)
  const [passwordFormOpen, setPasswordFormOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [budgetFormOpen, setBudgetFormOpen] = useState(false)
  const [budgetInput, setBudgetInput] = useState('')
  const [savingBudget, setSavingBudget] = useState(false)

  const currencyCode = couple?.currency_code ?? DEFAULT_CURRENCY_CODE
  const myBudget = budgets.find(b => b.user_id === user?.id)?.monthly_amount ?? 0

  useEffect(() => {
    if (!couple) return
    supabase
      .from('couples')
      .select('invite_code')
      .eq('id', couple.couple_id)
      .single()
      .then(({ data }) => setInviteCode(data?.invite_code ?? null))
  }, [couple?.couple_id])

  async function copyCode() {
    if (!inviteCode) return
    await navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setSavingPassword(true)
    setPasswordError('')
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setSavingPassword(false)
    if (error) {
      setPasswordError(error.message || 'Could not update password. Try again.')
      return
    }
    toast('Password updated')
    setNewPassword('')
    setPasswordFormOpen(false)
  }

  async function selectCurrency(code: string) {
    if (!couple) return
    const { data, error } = await supabase
      .from('couples')
      .update({ currency_code: code })
      .eq('id', couple.couple_id)
      .select()
    if (error || !data?.length) {
      toast('Could not update currency')
      return
    }
    await refreshCouple()
  }

  async function handleSaveBudget(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !couple) return
    const amount = Number(budgetInput)
    if (!Number.isFinite(amount) || amount < 0) return
    setSavingBudget(true)
    const { error } = await supabase
      .from('budgets')
      .upsert(
        { couple_id: couple.couple_id, user_id: user.id, monthly_amount: amount },
        { onConflict: 'couple_id,user_id' },
      )
    setSavingBudget(false)
    if (error) {
      toast('Could not update budget')
      return
    }
    toast('Budget updated')
    await refetchBudgets()
    setBudgetFormOpen(false)
  }

  return (
    <div className="space-y-5 p-6">
      {/* Account */}
      <Card className="space-y-2 p-5">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Account
        </p>
        <p className="text-base text-foreground">{user?.email}</p>
        {couple && (
          <p className="text-sm text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">{couple.display_name}</span>
          </p>
        )}
      </Card>

      {/* Security */}
      <Card className="space-y-3 p-5">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Security
        </p>
        {passwordFormOpen ? (
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="settings-new-password">New password</Label>
              <PasswordInput
                id="settings-new-password"
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={setNewPassword}
                required
              />
            </div>

            {passwordError && (
              <p className="text-xs text-destructive">{passwordError}</p>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => { setPasswordFormOpen(false); setNewPassword(''); setPasswordError('') }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={savingPassword || newPassword.length < 6}
              >
                {savingPassword ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setPasswordFormOpen(true)}
            className="flex w-full items-center justify-between rounded-lg bg-muted px-4 py-3.5 text-left"
          >
            <span className="text-base text-foreground">Change password</span>
            <CaretRight className="size-3.5 text-muted-foreground" />
          </button>
        )}
      </Card>

      {/* Currency */}
      {couple && (
        <Card className="space-y-3 p-5">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Currency
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Amounts across the app are shown in this currency.
          </p>
          <button
            onClick={() => setCurrencyDrawerOpen(true)}
            className="flex w-full items-center justify-between rounded-lg bg-muted px-4 py-3.5 text-left"
          >
            <span className="text-base text-foreground">
              {getCurrency(couple.currency_code).symbol} {getCurrency(couple.currency_code).name}
            </span>
            <CaretRight className="size-3.5 text-muted-foreground" />
          </button>
        </Card>
      )}

      {/* Monthly budget */}
      {couple && (
        <Card className="space-y-3 p-5">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Monthly budget
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Set your own budget — your partner's budget shows on the Stats page.
          </p>
          {budgetFormOpen ? (
            <form onSubmit={handleSaveBudget} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="settings-budget">Your monthly budget</Label>
                <Input
                  id="settings-budget"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="decimal"
                  placeholder="0"
                  value={budgetInput}
                  onChange={e => setBudgetInput(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setBudgetFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={savingBudget}>
                  {savingBudget ? 'Saving…' : 'Save'}
                </Button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => { setBudgetInput(myBudget > 0 ? String(myBudget) : ''); setBudgetFormOpen(true) }}
              className="flex w-full items-center justify-between rounded-lg bg-muted px-4 py-3.5 text-left"
            >
              <span className="text-base text-foreground">{formatCurrency(myBudget, currencyCode)}</span>
              <CaretRight className="size-3.5 text-muted-foreground" />
            </button>
          )}
        </Card>
      )}

      {/* Invite code */}
      {couple && (
        <Card className="space-y-3 p-5">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Couple invite code
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Share this with your partner so they can join your shared log.
          </p>
          <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-3.5">
            <span className="font-heading text-xl font-medium tracking-[0.15em] text-foreground">
              {inviteCode ?? '······'}
            </span>
            <button
              onClick={copyCode}
              disabled={!inviteCode}
              className="flex items-center gap-1 pl-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
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
        </Card>
      )}

      {/* Import */}
      {couple && (
        <Card className="space-y-3 p-5">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Import
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Load expenses in bulk from a CSV export of a spreadsheet.
          </p>
          <button
            onClick={() => navigate('/import')}
            className="flex w-full items-center justify-between rounded-lg bg-muted px-4 py-3.5 text-left"
          >
            <span className="text-base text-foreground">Import expenses</span>
            <CaretRight className="size-3.5 text-muted-foreground" />
          </button>
        </Card>
      )}

      {/* Sign out */}
      <Button onClick={signOut} variant="secondary" className="w-full">
        Sign out
      </Button>

      {couple && (
        <CurrencyDrawer
          isOpen={currencyDrawerOpen}
          onClose={() => setCurrencyDrawerOpen(false)}
          selectedCode={couple.currency_code}
          onSelect={selectCurrency}
        />
      )}
    </div>
  )
}
