import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { TopNav } from './components/TopNav'
import { AuthPage } from './pages/AuthPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { LogPage } from './pages/LogPage'
import { DashboardPage } from './pages/DashboardPage'
import { SettingsPage } from './pages/SettingsPage'

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main
        className="max-w-lg mx-auto pb-10"
        style={{ paddingTop: 'calc(64px + var(--safe-top))' }}
      >
        {children}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster theme="dark" position="top-center" />
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route
            path="/log"
            element={<ProtectedRoute><AppShell><LogPage /></AppShell></ProtectedRoute>}
          />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><AppShell><DashboardPage /></AppShell></ProtectedRoute>}
          />
          <Route
            path="/settings"
            element={<ProtectedRoute><AppShell><SettingsPage /></AppShell></ProtectedRoute>}
          />
          <Route path="*" element={<Navigate to="/log" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
