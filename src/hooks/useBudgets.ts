import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Budget } from '../types'

export function useBudgets(coupleId: string | undefined) {
  const [budgets, setBudgets] = useState<Budget[]>([])

  function fetchBudgets() {
    if (!coupleId) return
    return supabase
      .from('budgets')
      .select('couple_id, user_id, monthly_amount, updated_at')
      .eq('couple_id', coupleId)
      .then(({ data }) => setBudgets(data ?? []))
  }

  useEffect(() => {
    fetchBudgets()
  }, [coupleId])

  return { budgets, refetch: fetchBudgets }
}
