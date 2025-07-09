import { createClient } from "@/lib/supabase/client"
import { cache } from "react"

export const revalidate = 3600 // revalidate the data at most every hour

// Supabase client initialized
const supabase = createClient()

// Database types - these should match your Supabase schema
export interface User {
  id: string
  email: string
  name: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  user_id: string
  name: string
  description?: string
  color: string
  icon?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreditCard {
  id: string
  user_id: string
  name: string
  bank?: string
  last_four_digits?: string
  credit_limit: number
  closing_day: number
  due_day: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RecurringTransaction {
  id: string
  user_id: string
  category_id: string
  credit_card_id?: string
  title: string
  description?: string
  amount: number
  payment_method: "credit_card" | "debit_card" | "bank_slip" | "automatic_debit" | "pix"
  recurrence_type: "monthly" | "quarterly" | "semi_annual" | "annual"
  due_day: number
  start_date: string
  end_date?: string
  is_active: boolean
  reminder_days: number
  created_at: string
  updated_at: string
}

export interface TransactionInstance {
  id: string
  recurring_transaction_id: string
  due_date: string
  amount: number
  status: "pending" | "paid" | "overdue" | "cancelled"
  paid_date?: string
  notes?: string
  created_at: string
  updated_at: string
}

// Types for views/joined data
export interface RecurringTransactionWithDetails extends RecurringTransaction {
  category_name: string
  category_color: string
  category_icon: string
  credit_card_name?: string
}

export interface TransactionInstanceWithDetails extends TransactionInstance {
  title: string
  description?: string
  payment_method: string
  category_name: string
  category_color: string
  category_icon: string
  credit_card_name?: string
}

export interface MonthlySummary {
  total_amount: number
  paid_amount: number
  pending_amount: number
  overdue_amount: number
  transaction_count: number
}

export interface CategorySummary {
  category_id: string
  category_name: string
  category_color: string
  category_icon: string
  total_amount: number
  transaction_count: number
}


// --- DATA FETCHING FUNCTIONS ---

// Helper to get current user ID
const getUserId = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user?.id) {
    throw new Error("User not authenticated.")
  }
  return session.user.id
}

// Categories
export const getCategories = cache(async (): Promise<Category[]> => {
  const { data, error } = await supabase.from('categories').select('*')
  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }
  return data
})

export const getCategoryById = cache(async (id: string): Promise<Category | null> => {
  const { data, error } = await supabase.from('categories').select('*').eq('id', id).single()
  if (error) {
    console.error(`Error fetching category ${id}:`, error)
    return null
  }
  return data
})

export const createCategory = async (
  categoryData: Omit<Category, "id" | "user_id" | "created_at" | "updated_at">
): Promise<Category | null> => {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('categories')
    .insert([{ ...categoryData, user_id: userId }])
    .select()
    .single()
    
  if (error) {
    console.error("Error creating category:", error)
    return null
  }
  return data
}

export const updateCategory = async (id: string, categoryData: Partial<Category>): Promise<Category | null> => {
  const { data, error } = await supabase
    .from('categories')
    .update(categoryData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error(`Error updating category ${id}:`, error)
    return null
  }
  return data
}

export const deleteCategory = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) {
    console.error(`Error deleting category ${id}:`, error)
    return false
  }
  return true
}

// Credit Cards
export const getCreditCards = cache(async (): Promise<CreditCard[]> => {
  const { data, error } = await supabase.from('credit_cards').select('*')
  if (error) {
    console.error("Error fetching credit cards:", error)
    return []
  }
  return data
})

export const getCreditCardById = cache(async (id: string): Promise<CreditCard | null> => {
  const { data, error } = await supabase.from('credit_cards').select('*').eq('id', id).single()
  if (error) {
    console.error(`Error fetching credit card ${id}:`, error)
    return null
  }
  return data
})

export const createCreditCard = async (
  cardData: Omit<CreditCard, "id" | "user_id" | "created_at" | "updated_at">
): Promise<CreditCard | null> => {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('credit_cards')
    .insert([{ ...cardData, user_id: userId }])
    .select()
    .single()

  if (error) {
    console.error("Error creating credit card:", error)
    return null
  }
  return data
}

export const updateCreditCard = async (id: string, cardData: Partial<CreditCard>): Promise<CreditCard | null> => {
  const { data, error } = await supabase
    .from('credit_cards')
    .update(cardData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating credit card ${id}:`, error)
    return null
  }
  return data
}

export const deleteCreditCard = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('credit_cards').delete().eq('id', id)
  if (error) {
    console.error(`Error deleting credit card ${id}:`, error)
    return false
  }
  return true
}

// Recurring Transactions
export const getRecurringTransactions = cache(async (): Promise<RecurringTransaction[]> => {
  const { data, error } = await supabase.from('recurring_transactions').select('*')
  if (error) {
    console.error("Error fetching recurring transactions:", error)
    return []
  }
  return data
})

export const getRecurringTransactionById = cache(async (id: string): Promise<RecurringTransaction | null> => {
  const { data, error } = await supabase.from('recurring_transactions').select('*').eq('id', id).single()
  if (error) {
    console.error(`Error fetching recurring transaction ${id}:`, error)
    return null
  }
  return data
})

export const createRecurringTransaction = async (
  transactionData: Omit<RecurringTransaction, "id" | "user_id" | "created_at" | "updated_at">
): Promise<RecurringTransaction | null> => {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('recurring_transactions')
    .insert([{ ...transactionData, user_id: userId }])
    .select()
    .single()

  if (error) {
    console.error("Error creating recurring transaction:", error)
    return null
  }
  return data
}

export const updateRecurringTransaction = async (
  id: string,
  transactionData: Partial<RecurringTransaction>
): Promise<RecurringTransaction | null> => {
  const { data, error } = await supabase
    .from('recurring_transactions')
    .update(transactionData)
    .eq('id', id)
    .select()
    .single()
    
  if (error) {
    console.error(`Error updating recurring transaction ${id}:`, error)
    return null
  }
  return data
}

export const deleteRecurringTransaction = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('recurring_transactions').delete().eq('id', id)
  if (error) {
    console.error(`Error deleting recurring transaction ${id}:`, error)
    return false
  }
  return true
}

// Transaction Instances
export const getTransactionInstances = cache(async (
  year?: number,
  month?: number
): Promise<TransactionInstanceWithDetails[]> => {
  let query = supabase.from('v_transaction_instances_with_details').select('*')

  if (year && month) {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    query = query.gte('due_date', startDate.toISOString()).lte('due_date', endDate.toISOString())
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error("Error fetching transaction instances:", error)
    return []
  }
  return data
})

export const updateTransactionInstanceStatus = async (id: string, status: string, paidDate?: string): Promise<boolean> => {
  const { error } = await supabase
    .from('transaction_instances')
    .update({ status, paid_date: paidDate })
    .eq('id', id)

  if (error) {
    console.error(`Error updating transaction instance ${id}:`, error)
    return false
  }
  return true
}

// Summaries and Views
export const getMonthlySummary = cache(async (year: number, month: number): Promise<MonthlySummary | null> => {
  const userId = await getUserId();
  const { data, error } = await supabase.rpc('get_monthly_summary', {
    p_user_id: userId,
    p_year: year,
    p_month: month
  }).single()

  if (error) {
    console.error("Error fetching monthly summary:", error)
    return null
  }
  return data
})


export const getCategorySummary = cache(async (year: number, month: number): Promise<CategorySummary[]> => {
  const userId = await getUserId();
  const { data, error } = await supabase.rpc('get_category_summary', {
    p_user_id: userId,
    p_year: year,
    p_month: month
  })

  if (error) {
    console.error("Error fetching category summary:", error)
    return []
  }
  return data
})

export const getTransactionsWithDetails = cache(async (): Promise<RecurringTransactionWithDetails[]> => {
  const { data, error } = await supabase.from('v_transactions_with_details').select('*')
  if (error) {
    console.error("Error fetching transactions with details:", error)
    return []
  }
  return data
})

export const getUpcomingTransactions = cache(async (days = 7): Promise<TransactionInstanceWithDetails[]> => {
  const today = new Date()
  const upcomingDate = new Date()
  upcomingDate.setDate(today.getDate() + days)

  const { data, error } = await supabase
    .from('v_transaction_instances_with_details')
    .select('*')
    .gte('due_date', today.toISOString())
    .lte('due_date', upcomingDate.toISOString())
    .eq('status', 'pending')
    .order('due_date', { ascending: true })

  if (error) {
    console.error("Error fetching upcoming transactions:", error)
    return []
  }
  return data
})

// Raw SQL executor (use with caution)
export const sql = async (query: string, ...params: any[]) => {
  // This is a placeholder. Direct SQL execution from client-side is not recommended.
  // For complex queries, create PostgreSQL functions or views and call them via RPC.
  console.warn("Raw SQL execution is not implemented and is not recommended from the client-side.");
  return Promise.resolve({ rows: [] });
};
