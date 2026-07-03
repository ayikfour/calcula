import { useState } from 'react'
import { EnvelopeSimple } from '@phosphor-icons/react'
import { supabase } from '../lib/supabase'
import { isStandalonePwa } from '../lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from './PasswordInput'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp'

type View =
  | { kind: 'signin' }
  | { kind: 'signup-pending'; email: string }
  | { kind: 'forgot-request' }
  | { kind: 'forgot-verify'; email: string }
  | { kind: 'forgot-set-password' }

interface PasswordAuthFormProps {
  // Password recovery briefly holds an authenticated session before the
  // user has actually set a new password (verifyOtp({type:'recovery'})
  // signs them in so updateUser() can run). AuthPage's "session exists ->
  // redirect away from /auth" effect would otherwise fire the instant that
  // session appears, skipping the set-password screen entirely — this lets
  // us tell it to hold off until the new password is actually saved.
  onSuppressRedirectChange: (suppress: boolean) => void
}

export function PasswordAuthForm({ onSuppressRedirectChange }: PasswordAuthFormProps) {
  const [view, setView] = useState<View>({ kind: 'signin' })
  const [intent, setIntent] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [code, setCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [standalone] = useState(isStandalonePwa)

  function resetFeedback() {
    setError('')
    setVerifyError('')
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    resetFeedback()
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })
    if (err) {
      if (err.message.includes('Email not confirmed')) {
        setError('Confirm your email first — check your inbox for the code.')
      } else if (err.status === 429) {
        setError('Too many attempts, wait a moment.')
      } else {
        setError('Incorrect email or password.')
      }
      setLoading(false)
    }
    // on success, AuthContext's session listener triggers AuthPage's redirect effect
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    resetFeedback()
    const trimmedEmail = email.trim().toLowerCase()
    const { data, error: err } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: { emailRedirectTo: window.location.origin },
    })
    if (err) {
      setError(err.message || 'Failed to create account. Try again.')
      setLoading(false)
      return
    }
    if (data.user && data.user.identities?.length === 0) {
      setError('An account already exists for this email — try signing in, or use "Forgot password" if you don’t remember it.')
      setLoading(false)
      return
    }
    setLoading(false)
    setView({ kind: 'signup-pending', email: trimmedEmail })
  }

  async function handleVerifySignup(e: React.FormEvent) {
    e.preventDefault()
    if (view.kind !== 'signup-pending' || !code.trim()) return
    setVerifying(true)
    setVerifyError('')
    const { error: err } = await supabase.auth.verifyOtp({
      email: view.email,
      token: code.trim(),
      type: 'signup',
    })
    if (err) {
      setVerifyError(err.message || 'Invalid or expired code. Check the digits and try again.')
      setVerifying(false)
    }
    // on success, AuthContext's session listener triggers AuthPage's redirect effect
  }

  async function handleForgotRequest(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    resetFeedback()
    const trimmedEmail = email.trim().toLowerCase()
    const { error: err } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
      redirectTo: window.location.origin,
    })
    setLoading(false)
    if (err) {
      setError(err.message || 'Something went wrong. Try again.')
      return
    }
    // Always proceed to the code screen regardless of whether the account
    // exists — Supabase's own enumeration-safety behavior, don't add a
    // distinguishing branch here.
    setView({ kind: 'forgot-verify', email: trimmedEmail })
  }

  async function handleForgotVerify(e: React.FormEvent) {
    e.preventDefault()
    if (view.kind !== 'forgot-verify' || !code.trim()) return
    setVerifying(true)
    setVerifyError('')
    const { error: err } = await supabase.auth.verifyOtp({
      email: view.email,
      token: code.trim(),
      type: 'recovery',
    })
    if (err) {
      setVerifyError(err.message || 'Invalid or expired code. Check the digits and try again.')
      setVerifying(false)
      return
    }
    setVerifying(false)
    // A session now exists (see PasswordAuthFormProps comment) — hold off
    // the container's redirect until the new password is actually saved.
    onSuppressRedirectChange(true)
    setView({ kind: 'forgot-set-password' })
  }

  async function handleSetNewPassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    resetFeedback()
    const { error: err } = await supabase.auth.updateUser({ password: newPassword })
    if (err) {
      setError(err.message || 'Could not update password. Try again.')
      setLoading(false)
      return
    }
    // Password saved — let AuthPage's redirect effect take over now.
    onSuppressRedirectChange(false)
  }

  if (view.kind === 'signup-pending' || view.kind === 'forgot-verify') {
    const handleVerify = view.kind === 'signup-pending' ? handleVerifySignup : handleForgotVerify
    const heading = view.kind === 'signup-pending' ? 'Confirm your email' : 'Check your email'
    const purpose = view.kind === 'signup-pending' ? 'confirmation code' : 'recovery code'
    return (
      <div className="space-y-3 py-4 text-center">
        <EnvelopeSimple className="mx-auto size-8 text-muted-foreground" weight="light" />
        <p className="text-base font-medium text-foreground">{heading}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We sent a {purpose} to{' '}
          <span className="text-foreground">{view.email}</span>.
          {standalone
            ? ' Enter it below — the link in that email opens your browser, not this app, so it won’t sign you in here.'
            : ' Tap the link, or enter the code below.'}
        </p>

        <form onSubmit={handleVerify} className="space-y-3 pt-2 text-left">
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

        <button
          onClick={() => { setCode(''); setVerifyError(''); setView({ kind: 'signin' }) }}
          className="mt-2 text-sm text-muted-foreground hover:text-foreground"
        >
          Use a different email
        </button>
      </div>
    )
  }

  if (view.kind === 'forgot-request') {
    return (
      <form onSubmit={handleForgotRequest} className="space-y-3">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Enter your email and we'll send you a code to reset your password.
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="forgot-email">Email</Label>
          <Input
            id="forgot-email"
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

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Sending…' : 'Send reset code →'}
        </Button>

        <button
          type="button"
          onClick={() => { resetFeedback(); setView({ kind: 'signin' }) }}
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
        >
          Back to sign in
        </button>
      </form>
    )
  }

  if (view.kind === 'forgot-set-password') {
    return (
      <form onSubmit={handleSetNewPassword} className="space-y-3">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Choose a new password for your account.
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="new-password">New password</Label>
          <PasswordInput
            id="new-password"
            autoComplete="new-password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="At least 6 characters"
            required
          />
        </div>

        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}

        <Button type="submit" disabled={loading || newPassword.length < 6} className="w-full">
          {loading ? 'Saving…' : 'Save password →'}
        </Button>
      </form>
    )
  }

  // view.kind === 'signin' — handles both sign-in and sign-up intents
  return (
    <form onSubmit={intent === 'signin' ? handleSignIn : handleSignUp} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="password-email">Email</Label>
        <Input
          id="password-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="h-12"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          autoComplete={intent === 'signin' ? 'current-password' : 'new-password'}
          value={password}
          onChange={setPassword}
          placeholder={intent === 'signup' ? 'At least 6 characters' : undefined}
          required
        />
      </div>

      {intent === 'signin' && (
        <button
          type="button"
          onClick={() => { resetFeedback(); setView({ kind: 'forgot-request' }) }}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Forgot password?
        </button>
      )}

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      <Button
        type="submit"
        disabled={loading || (intent === 'signup' && password.length < 6)}
        className="w-full"
      >
        {loading
          ? (intent === 'signin' ? 'Signing in…' : 'Creating account…')
          : (intent === 'signin' ? 'Sign in →' : 'Create account →')}
      </Button>

      <button
        type="button"
        onClick={() => { resetFeedback(); setIntent(i => i === 'signin' ? 'signup' : 'signin') }}
        className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
      >
        {intent === 'signin' ? 'New here? Create an account' : 'Already have an account? Sign in'}
      </button>
    </form>
  )
}
