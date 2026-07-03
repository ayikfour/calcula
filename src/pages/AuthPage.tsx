import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { PasswordAuthForm } from '../components/PasswordAuthForm'
import { EmailCodeAuthForm } from '../components/EmailCodeAuthForm'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type Mode = 'password' | 'code'

export function AuthPage() {
  const { session, couple } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('password')
  const [suppressRedirect, setSuppressRedirect] = useState(false)

  useEffect(() => {
    if (session && !suppressRedirect) navigate(couple ? '/log' : '/onboarding', { replace: true })
  }, [session, couple, navigate, suppressRedirect])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-6">

        {/* Wordmark */}
        <div className="space-y-1 text-center">
          <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground">
            Genkin
          </h1>
          <p className="text-sm text-muted-foreground">
            Shared expenses for two
          </p>
        </div>

        {/* Card */}
        <div className="space-y-4 rounded-xl bg-card p-6 ring-1 ring-foreground/10">
          <Tabs
            value={mode}
            onValueChange={v => setMode(v as Mode)}
          >
            <TabsList className="w-full">
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="code">Email code</TabsTrigger>
            </TabsList>
          </Tabs>

          {mode === 'password' ? (
            <PasswordAuthForm onSuppressRedirectChange={setSuppressRedirect} />
          ) : (
            <EmailCodeAuthForm />
          )}
        </div>
      </div>
    </div>
  )
}
