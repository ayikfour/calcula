import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { DEFAULT_CURRENCY_CODE } from '../lib/currencies'
import { materializeDueRecurringExpenses } from '../lib/recurringExpenses'

interface CoupleInfo {
  couple_id: string
  display_name: string
  currency_code: string
}

interface AuthContextValue {
  session: Session | null
  user: User | null
  couple: CoupleInfo | null
  hasPassword: boolean
  loading: boolean
  signOut: () => Promise<void>
  refreshCouple: () => Promise<void>
  refreshHasPassword: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [couple, setCouple] = useState<CoupleInfo | null>(null)
  const [hasPassword, setHasPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const materializedForCoupleId = useRef<string | null>(null)

  async function fetchCouple(userId: string) {
    const { data } = await supabase
      .from('couple_members')
      .select('couple_id, display_name, couples(currency_code)')
      .eq('user_id', userId)
      .maybeSingle()
    if (!data) { setCouple(null); return }
    const couples = data.couples as { currency_code: string } | { currency_code: string }[] | null
    const currency_code = (Array.isArray(couples) ? couples[0]?.currency_code : couples?.currency_code) ?? DEFAULT_CURRENCY_CODE
    setCouple({ couple_id: data.couple_id, display_name: data.display_name, currency_code })
  }

  async function fetchHasPassword() {
    const { data } = await supabase.rpc('user_has_password')
    setHasPassword(data ?? false)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session?.user) {
        Promise.all([fetchCouple(data.session.user.id), fetchHasPassword()]).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      if (s?.user) {
        fetchCouple(s.user.id)
        fetchHasPassword()
      } else {
        setCouple(null)
        setHasPassword(false)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  // Runs once per couple per session — there's no scheduled-job infra in
  // this app, so recurring expenses are materialized lazily whenever
  // someone opens it. See src/lib/recurringExpenses.ts.
  useEffect(() => {
    if (!couple?.couple_id || materializedForCoupleId.current === couple.couple_id) return
    materializedForCoupleId.current = couple.couple_id
    materializeDueRecurringExpenses(couple.couple_id)
  }, [couple?.couple_id])

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function refreshCouple() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) await fetchCouple(user.id)
  }

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, couple, hasPassword, loading, signOut, refreshCouple, refreshHasPassword: fetchHasPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
