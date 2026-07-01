import { Navigate } from 'react-router-dom'
import { SpinnerGap } from '@phosphor-icons/react'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, couple, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <SpinnerGap className="size-6 animate-spin text-muted-foreground" weight="bold" />
      </div>
    )
  }

  if (!session) return <Navigate to="/auth" replace />
  if (!couple) return <Navigate to="/onboarding" replace />

  return <>{children}</>
}
