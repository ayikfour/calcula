import { useState } from 'react'
import { EnvelopeSimple } from '@phosphor-icons/react'
import { supabase } from '../lib/supabase'
import { isStandalonePwa } from '../lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp'

type State = 'idle' | 'loading' | 'sent' | 'error'

export function EmailCodeAuthForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')
  const [error, setError] = useState('')
  const [code, setCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState('')
  const [standalone] = useState(isStandalonePwa)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setState('loading')
    setError('')
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: window.location.origin },
    })
    if (err) {
      let msg = err.message ?? ''
      try { const p = JSON.parse(msg); msg = p.message ?? p.error ?? '' } catch { /* not JSON */ }
      setError(msg || 'Failed to send email. Check your address and try again.')
      setState('error')
    } else {
      setState('sent')
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setVerifying(true)
    setVerifyError('')
    const { error: err } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: code.trim(),
      type: 'email',
    })
    if (err) {
      setVerifyError(err.message || 'Invalid or expired code. Check the digits and try again.')
      setVerifying(false)
    }
    // on success, AuthContext's session listener triggers AuthPage's redirect effect
  }

  if (state === 'sent') {
    return (
      <div className="space-y-3 py-4 text-center">
        <EnvelopeSimple className="mx-auto size-8 text-muted-foreground" weight="light" />
        <p className="text-base font-medium text-foreground">
          Check your email
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We sent a code to{' '}
          <span className="text-foreground">{email}</span>.
          {standalone
            ? ' Enter it below — the link in that email opens your browser, not this app, so it won’t sign you in here.'
            : ' Tap the link, or enter the code below.'}
        </p>
        <button
          onClick={() => setState('idle')}
          className="mt-2 text-sm text-muted-foreground hover:text-foreground"
        >
          Use a different email
        </button>

        <div className="flex items-center gap-3 pt-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">
            {standalone ? 'enter the code' : 'or enter the code'}
          </span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleVerify} className="space-y-3 text-left">
          <div className="flex justify-center">
            <InputOTP
              maxLength={8}
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={setCode}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
                <InputOTPSlot index={6} />
                <InputOTPSlot index={7} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {verifyError && (
            <p className="text-center text-xs text-destructive">{verifyError}</p>
          )}

          <Button type="submit" disabled={verifying || code.length < 8} className="w-full">
            {verifying ? 'Verifying…' : 'Verify code →'}
          </Button>
        </form>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="h-12"
        />
      </div>

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      <Button type="submit" disabled={state === 'loading'} className="w-full">
        {state === 'loading' ? 'Sending…' : 'Send magic link →'}
      </Button>
    </form>
  )
}
