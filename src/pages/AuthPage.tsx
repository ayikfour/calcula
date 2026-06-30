import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

type State = 'idle' | 'loading' | 'sent' | 'error'

export function AuthPage() {
  const { session, couple } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    if (session) navigate(couple ? '/log' : '/onboarding', { replace: true })
  }, [session, couple, navigate])

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-void">
      <div className="w-full max-w-sm space-y-6">

        {/* Wordmark */}
        <div className="text-center space-y-1">
          <h1 style={{ fontFamily: 'var(--font-geist)', fontSize: '32px', fontWeight: 500, color: 'var(--color-bone)', letterSpacing: '-0.02em' }}>
            Calcula
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-fog)' }}>
            Shared expenses for two
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-card p-6 space-y-4">
          {state === 'sent' ? (
            <div className="text-center space-y-3 py-4">
              <div className="text-3xl">✉️</div>
              <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-bone)' }}>
                Check your email
              </p>
              <p style={{ fontSize: '14px', color: 'var(--color-mist)', lineHeight: 1.5 }}>
                We sent a magic link to{' '}
                <span style={{ color: 'var(--color-bone)' }}>{email}</span>.
                Tap it to sign in.
              </p>
              <button
                onClick={() => setState('idle')}
                style={{ fontSize: '14px', color: 'var(--color-fog)', marginTop: '8px' }}
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <label className="block space-y-1.5">
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-fog)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Email
                </span>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '48px',
                    background: 'var(--color-ink)',
                    border: '1px solid rgba(229,229,229,0.12)',
                    borderRadius: 'var(--radius-input)',
                    padding: '12px 16px',
                    fontSize: '16px',
                    color: 'var(--color-bone)',
                    outline: 'none',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(229,229,229,0.30)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(229,229,229,0.12)')}
                />
              </label>

              {error && (
                <p style={{ fontSize: '13px', color: 'var(--color-danger)' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={state === 'loading'}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '48px',
                  borderRadius: 'var(--radius-pill)',
                  background: state === 'loading' ? 'rgba(255,255,255,0.6)' : 'var(--color-paper)',
                  color: 'var(--color-onyx)',
                  fontSize: '16px',
                  fontWeight: 500,
                  cursor: state === 'loading' ? 'not-allowed' : 'pointer',
                  transition: 'opacity 150ms',
                }}
              >
                {state === 'loading' ? 'Sending…' : 'Send magic link →'}
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--color-fog)' }}>
          No password needed — just your email.
        </p>
      </div>
    </div>
  )
}
