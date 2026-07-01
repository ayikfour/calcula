import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Copy } from '@phosphor-icons/react'

export function SettingsPage() {
  const { user, couple, signOut } = useAuth()
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

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

  return (
    <div className="space-y-5 p-6">
      <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground">
        Settings
      </h1>

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

      {/* Sign out */}
      <Button onClick={signOut} variant="secondary" className="w-full">
        Sign out
      </Button>
    </div>
  )
}
