import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import type { Category } from '../types'

export function useCategories() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    supabase.from('categories').select('*').order('id').then(({ data, error }) => {
      if (error) console.error('[categories]', error)
      setCategories(data ?? [])
    })
  }, [])

  const addCategory = useCallback(async (name: string, icon: string) => {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name, icon, created_by: user?.id })
      .select()
      .single()
    if (!error && data) setCategories(prev => [...prev, data])
    return { data, error }
  }, [user?.id])

  return [categories, addCategory] as const
}
