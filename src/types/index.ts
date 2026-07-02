export interface Expense {
  id: string
  couple_id: string
  paid_by: string
  logged_by: string
  amount: number
  category: string
  description: string
  expense_date: string
  created_at: string
}

export interface Category {
  id: number
  name: string
  icon: string
}

export interface CoupleMember {
  user_id: string
  display_name: string
}
