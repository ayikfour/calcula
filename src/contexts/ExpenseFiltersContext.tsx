import { createContext, useContext, useMemo, useState } from 'react'

interface ExpenseFiltersContextValue {
  selectedMonth: string | null
  setSelectedMonth: (month: string) => void
  filterCategories: string[]
  filterPaidBy: string | null
  setFilters: (categories: string[], payer: string | null) => void
  activeFilterCount: number
}

const ExpenseFiltersContext = createContext<ExpenseFiltersContextValue | null>(null)

export function ExpenseFiltersProvider({ children }: { children: React.ReactNode }) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [filterCategories, setFilterCategories] = useState<string[]>([])
  const [filterPaidBy, setFilterPaidBy] = useState<string | null>(null)

  function setFilters(categories: string[], payer: string | null) {
    setFilterCategories(categories)
    setFilterPaidBy(payer)
  }

  const activeFilterCount = filterCategories.length + (filterPaidBy ? 1 : 0)

  const value = useMemo(
    () => ({ selectedMonth, setSelectedMonth, filterCategories, filterPaidBy, setFilters, activeFilterCount }),
    [selectedMonth, filterCategories, filterPaidBy, activeFilterCount],
  )

  return <ExpenseFiltersContext.Provider value={value}>{children}</ExpenseFiltersContext.Provider>
}

export function useExpenseFilters() {
  const ctx = useContext(ExpenseFiltersContext)
  if (!ctx) throw new Error('useExpenseFilters must be used inside ExpenseFiltersProvider')
  return ctx
}
