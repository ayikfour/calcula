import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Copy } from '@phosphor-icons/react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type Mode = 'create' | 'join'
type State = 'idle' | 'loading' | 'created' | 'error'

export function OnboardingPage() {
  const { session, couple, refreshCouple } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('create')
  const [displayName, setDisplayName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [state, setState] = useState<State>('idle')
  const [error, setError] = useState('')
  const [createdCode, setCreatedCode] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!session) navigate('/auth', { replace: true })
    if (couple) navigate('/log', { replace: true })
  }, [session, couple, navigate])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!displayName.trim()) return
    setState('loading')
    setError('')
    const { data, error: err } = await supabase.rpc('create_couple', {
      couple_name: `${displayName.trim()}'s couple`,
      display_name: displayName.trim(),
    })
    if (err) {
      setError(err.message)
      setState('error')
      return
    }
    // Fetch the invite code for the newly created couple
    const { data: coupleData } = await supabase
      .from('couples')
      .select('invite_code')
      .eq('id', data)
      .single()
    setCreatedCode(coupleData?.invite_code ?? '')
    await refreshCouple()
    setState('created')
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    if (!displayName.trim() || !inviteCode.trim()) return
    setState('loading')
    setError('')
    const { error: err } = await supabase.rpc('join_couple', {
      code: inviteCode.trim().toUpperCase(),
      display_name: displayName.trim(),
    })
    if (err) {
      const msg = err.message.includes('invalid_invite_code')
        ? 'Invite code not found. Double-check it with your partner.'
        : err.message.includes('couple_full')
        ? 'This couple already has two members.'
        : err.message
      setError(msg)
      setState('error')
      return
    }
    await refreshCouple()
    navigate('/log', { replace: true })
  }

  async function copyCode() {
    await navigator.clipboard.writeText(createdCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Created state: show invite code ───────────────────────
  if (state === 'created') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1 text-center">
            <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground">
              You're in!
            </h1>
            <p className="text-sm text-muted-foreground">
              Share this code with your partner
            </p>
          </div>

          <div className="space-y-5 rounded-xl bg-card p-6 ring-1 ring-foreground/10">
            <div className="relative rounded-lg bg-muted p-5 text-center">
              <p className="font-heading text-2xl font-medium tracking-[0.15em] text-foreground">
                {createdCode}
              </p>
              <button
                onClick={copyCode}
                className="absolute top-2 right-2.5 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
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

            <p className="text-center text-sm leading-relaxed text-muted-foreground">
              Your partner opens the app, taps <strong className="text-foreground">Join a couple</strong>, and enters this code.
            </p>

            <Button onClick={() => navigate('/log', { replace: true })} className="w-full">
              Go to the app →
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ── Main onboarding form ───────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground">
            Set up your couple
          </h1>
          <p className="text-sm text-muted-foreground">
            Two people, one shared expense log
          </p>
        </div>

        <div className="space-y-5 rounded-xl bg-card p-6 ring-1 ring-foreground/10">
          <Tabs
            value={mode}
            onValueChange={v => { setMode(v as Mode); setError('') }}
          >
            <TabsList className="w-full">
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="join">Join</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Form */}
          <form onSubmit={mode === 'create' ? handleCreate : handleJoin} className="space-y-4">
            {mode === 'join' && (
              <div className="space-y-1.5">
                <Label htmlFor="inviteCode">Invite code</Label>
                <Input
                  id="inviteCode"
                  type="text"
                  placeholder="ABC123"
                  value={inviteCode}
                  onChange={e => setInviteCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  required
                  className="h-12 font-heading tracking-[0.1em] uppercase"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="displayName">Your name</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="How your partner sees you"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                maxLength={32}
                required
                className="h-12"
              />
            </div>

            {error && (
              <p className="text-xs leading-relaxed text-destructive">{error}</p>
            )}

            <Button type="submit" disabled={state === 'loading'} className="w-full">
              {state === 'loading'
                ? 'Working…'
                : mode === 'create'
                ? 'Create couple →'
                : 'Join couple →'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
