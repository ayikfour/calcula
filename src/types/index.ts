export interface Expense {
  id: string
  paid_by: string | null
  paid_by_label: string | null
  logged_by: string
  amount: number
  category: string
  description: string
  expense_date: string
  created_at: string
  recurring_expense_id: string | null
}

export type RecurrenceFrequency = 'weekly' | 'monthly' | 'yearly'

export interface RecurringExpense {
  id: string
  paid_by: string
  created_by: string
  amount: number
  category: string
  description: string
  frequency: RecurrenceFrequency
  start_date: string
  next_due_date: string
  active: boolean
  created_at: string
}

export interface Category {
  id: number
  name: string
  icon: string
  created_by: string | null
}

export interface SpaceMember {
  user_id: string
  display_name: string
  avatar_url: string | null
  feed_last_seen_at: string | null
}

export type ExpenseActivityAction = 'created' | 'updated' | 'deleted'

export interface ExpenseActivitySnapshot {
  amount: number
  category: string
  description: string
  expense_date: string
  paid_by: string | null
  recurring_expense_id: string | null
}

export interface ExpenseActivity {
  id: string
  expense_id: string
  actor_id: string
  action: ExpenseActivityAction
  old_data: ExpenseActivitySnapshot | null
  new_data: ExpenseActivitySnapshot | null
  created_at: string
}

export interface Budget {
  user_id: string
  effective_month: string
  monthly_amount: number
  updated_at: string
}
