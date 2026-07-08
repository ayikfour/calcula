import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../hooks/useAuth'
import { useBudgets } from '../hooks/useBudgets'
import { useSoundPreference } from '../hooks/useSoundPreference'
import { useSoundVolume } from '../hooks/useSoundVolume'
import { useAppSound } from '../hooks/useAppSound'
import { Slider } from '@/components/ui/slider'
import { supabase } from '../lib/supabase'
import { getCurrency, DEFAULT_CURRENCY_CODE } from '../lib/currencies'
import { formatCurrency } from '../lib/format'
import { effectiveBudgetFor } from '../lib/budgetSummary'
import { toISODateLocal } from '../lib/dates'
import { CurrencyDrawer } from '../components/CurrencyDrawer'
import { ChangePasswordSheet } from '../components/ChangePasswordSheet'
import { MonthlyBudgetSheet } from '../components/MonthlyBudgetSheet'
import { Button } from '@/components/ui/button'
import { Check, CaretRight, Copy } from '@phosphor-icons/react'

export function SettingsPage() {
  const navigate = useNavigate()
  const { user, couple, refreshCouple, signOut } = useAuth()
  const { budgets, refetch: refetchBudgets } = useBudgets(couple?.couple_id)
  const { enabled: soundEnabled, setEnabled: setSoundEnabled } = useSoundPreference()
  const { volume, setVolume } = useSoundVolume()
  const playSound = useAppSound()
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [currencyDrawerOpen, setCurrencyDrawerOpen] = useState(false)
  const [passwordSheetOpen, setPasswordSheetOpen] = useState(false)
  const [budgetSheetOpen, setBudgetSheetOpen] = useState(false)

  const currencyCode = couple?.currency_code ?? DEFAULT_CURRENCY_CODE
  const currentMonth = toISODateLocal(new Date()).slice(0, 7)
  const myBudget = effectiveBudgetFor(budgets, user?.id, new Date())

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
    playSound('copy')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function selectCurrency(code: string) {
    if (!couple) return
    const { data, error } = await supabase
      .from('couples')
      .update({ currency_code: code })
      .eq('id', couple.couple_id)
      .select()
    if (error || !data?.length) {
      playSound('warning')
      toast('Could not update currency')
      return
    }
    await refreshCouple()
  }

  return (
    <div className="space-y-5 p-6">
      <div className="overflow-hidden rounded-lg border border-border">
        {/* Account */}
        <div className="border-b border-border px-4 py-3.5 last:border-b-0">
          <p className="text-base text-foreground">{user?.email}</p>
          {couple && (
            <p className="text-sm text-muted-foreground">
              Signed in as <span className="font-medium text-foreground">{couple.display_name}</span>
            </p>
          )}
        </div>

        {/* Change password */}
        <button
          onClick={() => { playSound('click'); setPasswordSheetOpen(true) }}
          className="flex w-full items-center justify-between border-b border-border px-4 py-3.5 text-left last:border-b-0"
        >
          <span className="text-base text-foreground">Change password</span>
          <CaretRight className="size-3.5 text-muted-foreground" />
        </button>

        {/* Currency */}
        {couple && (
          <button
            onClick={() => { playSound('click'); setCurrencyDrawerOpen(true) }}
            className="flex w-full items-center justify-between border-b border-border px-4 py-3.5 text-left last:border-b-0"
          >
            <span className="text-base text-foreground">Currency</span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="text-sm">
                {getCurrency(couple.currency_code).symbol} {getCurrency(couple.currency_code).name}
              </span>
              <CaretRight className="size-3.5" />
            </span>
          </button>
        )}

        {/* Monthly budget */}
        {couple && (
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
        {couple && (
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
        {couple && (
          <button
            onClick={() => { playSound('click'); navigate('/import') }}
            className="flex w-full items-center justify-between border-b border-border px-4 py-3.5 text-left last:border-b-0"
          >
            <span className="text-base text-foreground">Import expenses</span>
            <CaretRight className="size-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Sign out */}
      <Button onClick={signOut} variant="secondary" className="w-full">
        Sign out
      </Button>

      <ChangePasswordSheet
        isOpen={passwordSheetOpen}
        onClose={() => setPasswordSheetOpen(false)}
      />

      {couple && user && (
        <MonthlyBudgetSheet
          isOpen={budgetSheetOpen}
          onClose={() => setBudgetSheetOpen(false)}
          userId={user.id}
          coupleId={couple.couple_id}
          currentAmount={myBudget}
          effectiveMonth={currentMonth}
          refetchBudgets={refetchBudgets}
        />
      )}

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
