// Mock data for development when Supabase is not available
const mockCategories = [
  {
    id: "1",
    user_id: "demo-user",
    name: "Moradia",
    description: "Aluguel, financiamento, condomínio",
    color: "#EF4444",
    icon: "home",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "demo-user",
    name: "Alimentação",
    description: "Supermercado, restaurantes, delivery",
    color: "#F59E0B",
    icon: "utensils",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    user_id: "demo-user",
    name: "Transporte",
    description: "Combustível, transporte público, manutenção",
    color: "#10B981",
    icon: "car",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    user_id: "demo-user",
    name: "Saúde",
    description: "Plano de saúde, medicamentos, consultas",
    color: "#06B6D4",
    icon: "heart",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    user_id: "demo-user",
    name: "Educação",
    description: "Cursos, livros, mensalidades",
    color: "#8B5CF6",
    icon: "book",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    user_id: "demo-user",
    name: "Lazer",
    description: "Cinema, viagens, hobbies",
    color: "#EC4899",
    icon: "gamepad-2",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "7",
    user_id: "demo-user",
    name: "Serviços Digitais",
    description: "Streaming, software, aplicativos",
    color: "#8B5CF6",
    icon: "smartphone",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockCreditCards = [
  {
    id: "1",
    user_id: "demo-user",
    name: "Cartão Principal",
    bank: "Banco do Brasil",
    last_four_digits: "1234",
    credit_limit: 5000.0,
    closing_day: 15,
    due_day: 10,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "demo-user",
    name: "Cartão Secundário",
    bank: "Itaú",
    last_four_digits: "5678",
    credit_limit: 3000.0,
    closing_day: 20,
    due_day: 15,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockRecurringTransactions = [
  {
    id: "1",
    user_id: "demo-user",
    title: "Netflix",
    description: "Assinatura mensal",
    amount: 45.9,
    category_id: "7",
    payment_method: "credit_card" as const,
    credit_card_id: "1",
    recurrence_type: "monthly" as const,
    due_day: 15,
    start_date: "2024-01-15",
    is_active: true,
    reminder_days: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "demo-user",
    title: "Aluguel",
    description: "Aluguel do apartamento",
    amount: 1200.0,
    category_id: "1",
    payment_method: "bank_slip" as const,
    recurrence_type: "monthly" as const,
    due_day: 10,
    start_date: "2024-01-10",
    is_active: true,
    reminder_days: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    user_id: "demo-user",
    title: "Spotify",
    description: "Assinatura premium",
    amount: 21.9,
    category_id: "7",
    payment_method: "credit_card" as const,
    credit_card_id: "1",
    recurrence_type: "monthly" as const,
    due_day: 5,
    start_date: "2024-01-05",
    is_active: true,
    reminder_days: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    user_id: "demo-user",
    title: "Plano de Saúde",
    description: "Unimed",
    amount: 350.0,
    category_id: "4",
    payment_method: "automatic_debit" as const,
    recurrence_type: "monthly" as const,
    due_day: 20,
    start_date: "2024-01-20",
    is_active: true,
    reminder_days: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Database types
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

export interface RecurringTransactionWithDetails extends RecurringTransaction {
  category_name: string
  category_color: string
  category_icon: string
  credit_card_name?: string
  credit_card_bank?: string
}

export interface TransactionInstanceWithDetails extends TransactionInstance {
  title: string
  description?: string
  payment_method: string
  category_name: string
  category_color: string
  category_icon: string
  credit_card_name?: string
  credit_card_bank?: string
}

export interface MonthlySummary {
  total_amount: number
  paid_amount: number
  pending_amount: number
  overdue_amount: number
  transaction_count: number
  paid_count: number
  pending_count: number
  overdue_count: number
}

export interface CategorySummary {
  category_id: string
  category_name: string
  category_color: string
  category_icon: string
  total_amount: number
  transaction_count: number
}

// Generate mock transaction instances
function generateMockTransactionInstances(year: number, month: number): TransactionInstanceWithDetails[] {
  const instances: TransactionInstanceWithDetails[] = []

  mockRecurringTransactions.forEach((transaction) => {
    const category = mockCategories.find((cat) => cat.id === transaction.category_id)!
    const creditCard = transaction.credit_card_id
      ? mockCreditCards.find((card) => card.id === transaction.credit_card_id)
      : undefined

    const dueDate = new Date(year, month - 1, transaction.due_day)
    const startDate = new Date(transaction.start_date)

    if (dueDate >= startDate && (!transaction.end_date || dueDate <= new Date(transaction.end_date))) {
      const instance: TransactionInstanceWithDetails = {
        id: `${transaction.id}-${year}-${month}`,
        recurring_transaction_id: transaction.id,
        due_date: dueDate.toISOString().split("T")[0],
        amount: transaction.amount,
        status: Math.random() > 0.7 ? "paid" : "pending",
        paid_date: Math.random() > 0.7 ? dueDate.toISOString().split("T")[0] : undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title: transaction.title,
        description: transaction.description,
        payment_method: transaction.payment_method,
        category_name: category.name,
        category_color: category.color,
        category_icon: category.icon || "circle",
        credit_card_name: creditCard?.name,
        credit_card_bank: creditCard?.bank,
      }
      instances.push(instance)
    }
  })

  return instances.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
}

// Category functions
export async function getCategories(): Promise<Category[]> {
  console.log("Using mock categories data")
  return mockCategories.filter((cat) => cat.is_active)
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return mockCategories.find((cat) => cat.id === id) || null
}

export async function createCategory(
  categoryData: Omit<Category, "id" | "user_id" | "created_at" | "updated_at">,
): Promise<Category | null> {
  const newCategory: Category = {
    ...categoryData,
    id: Math.random().toString(36).substr(2, 9),
    user_id: "demo-user",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  mockCategories.push(newCategory)
  return newCategory
}

export async function updateCategory(id: string, categoryData: Partial<Category>): Promise<Category | null> {
  const index = mockCategories.findIndex((cat) => cat.id === id)
  if (index === -1) return null

  mockCategories[index] = {
    ...mockCategories[index],
    ...categoryData,
    updated_at: new Date().toISOString(),
  }
  return mockCategories[index]
}

export async function deleteCategory(id: string): Promise<boolean> {
  const index = mockCategories.findIndex((cat) => cat.id === id)
  if (index === -1) return false

  mockCategories[index].is_active = false
  mockCategories[index].updated_at = new Date().toISOString()
  return true
}

// Credit Card functions
export async function getCreditCards(): Promise<CreditCard[]> {
  console.log("Using mock credit cards data")
  return mockCreditCards.filter((card) => card.is_active)
}

export async function getCreditCardById(id: string): Promise<CreditCard | null> {
  return mockCreditCards.find((card) => card.id === id) || null
}

export async function createCreditCard(
  cardData: Omit<CreditCard, "id" | "user_id" | "created_at" | "updated_at">,
): Promise<CreditCard | null> {
  const newCard: CreditCard = {
    ...cardData,
    id: Math.random().toString(36).substr(2, 9),
    user_id: "demo-user",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  mockCreditCards.push(newCard)
  return newCard
}

export async function updateCreditCard(id: string, cardData: Partial<CreditCard>): Promise<CreditCard | null> {
  const index = mockCreditCards.findIndex((card) => card.id === id)
  if (index === -1) return null

  mockCreditCards[index] = {
    ...mockCreditCards[index],
    ...cardData,
    updated_at: new Date().toISOString(),
  }
  return mockCreditCards[index]
}

export async function deleteCreditCard(id: string): Promise<boolean> {
  const index = mockCreditCards.findIndex((card) => card.id === id)
  if (index === -1) return false

  mockCreditCards[index].is_active = false
  mockCreditCards[index].updated_at = new Date().toISOString()
  return true
}

// Recurring Transaction functions
export async function getRecurringTransactions(): Promise<RecurringTransaction[]> {
  console.log("Using mock recurring transactions data")
  return mockRecurringTransactions.filter((transaction) => transaction.is_active)
}

export async function getRecurringTransactionById(id: string): Promise<RecurringTransaction | null> {
  return mockRecurringTransactions.find((transaction) => transaction.id === id) || null
}

export async function createRecurringTransaction(
  transactionData: Omit<RecurringTransaction, "id" | "user_id" | "created_at" | "updated_at">,
): Promise<RecurringTransaction | null> {
  const newTransaction: RecurringTransaction = {
    ...transactionData,
    id: Math.random().toString(36).substr(2, 9),
    user_id: "demo-user",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  mockRecurringTransactions.push(newTransaction)
  return newTransaction
}

export async function updateRecurringTransaction(
  id: string,
  transactionData: Partial<RecurringTransaction>,
): Promise<RecurringTransaction | null> {
  const index = mockRecurringTransactions.findIndex((transaction) => transaction.id === id)
  if (index === -1) return null

  mockRecurringTransactions[index] = {
    ...mockRecurringTransactions[index],
    ...transactionData,
    updated_at: new Date().toISOString(),
  }
  return mockRecurringTransactions[index]
}

export async function deleteRecurringTransaction(id: string): Promise<boolean> {
  const index = mockRecurringTransactions.findIndex((transaction) => transaction.id === id)
  if (index === -1) return false

  mockRecurringTransactions[index].is_active = false
  mockRecurringTransactions[index].updated_at = new Date().toISOString()
  return true
}

// Transaction Instance functions
export async function getTransactionInstances(
  year?: number,
  month?: number,
): Promise<TransactionInstanceWithDetails[]> {
  console.log("Using mock transaction instances data")
  return year && month ? generateMockTransactionInstances(year, month) : []
}

export async function updateTransactionInstanceStatus(id: string, status: string, paidDate?: string): Promise<boolean> {
  console.log("Mock: updating transaction instance status", id, status)
  return true
}

// Summary functions
export async function getMonthlySummary(year: number, month: number): Promise<MonthlySummary> {
  console.log("Calculating mock monthly summary for", year, month)
  const instances = generateMockTransactionInstances(year, month)
  const totalAmount = instances.reduce((sum, t) => sum + t.amount, 0)
  const paidAmount = instances.filter((t) => t.status === "paid").reduce((sum, t) => sum + t.amount, 0)
  const pendingAmount = instances.filter((t) => t.status === "pending").reduce((sum, t) => sum + t.amount, 0)
  const overdueAmount = instances.filter((t) => t.status === "overdue").reduce((sum, t) => sum + t.amount, 0)

  return {
    total_amount: totalAmount,
    paid_amount: paidAmount,
    pending_amount: pendingAmount,
    overdue_amount: overdueAmount,
    transaction_count: instances.length,
    paid_count: instances.filter((t) => t.status === "paid").length,
    pending_count: instances.filter((t) => t.status === "pending").length,
    overdue_count: instances.filter((t) => t.status === "overdue").length,
  }
}

export async function getCategorySummary(year: number, month: number): Promise<CategorySummary[]> {
  console.log("Calculating mock category summary for", year, month)
  const instances = generateMockTransactionInstances(year, month)
  const categoryMap = new Map<string, CategorySummary>()

  instances.forEach((instance) => {
    const existing = categoryMap.get(instance.category_name) || {
      category_id: mockCategories.find((c) => c.name === instance.category_name)?.id || "",
      category_name: instance.category_name,
      category_color: instance.category_color,
      category_icon: instance.category_icon,
      total_amount: 0,
      transaction_count: 0,
    }

    existing.total_amount += instance.amount
    existing.transaction_count += 1
    categoryMap.set(instance.category_name, existing)
  })

  return Array.from(categoryMap.values()).sort((a, b) => b.total_amount - a.total_amount)
}

// Utility functions
export async function getTransactionsWithDetails(): Promise<RecurringTransactionWithDetails[]> {
  console.log("Using mock transactions with details")
  return mockRecurringTransactions.map((transaction) => {
    const category = mockCategories.find((cat) => cat.id === transaction.category_id)!
    const creditCard = transaction.credit_card_id
      ? mockCreditCards.find((card) => card.id === transaction.credit_card_id)
      : undefined

    return {
      ...transaction,
      category_name: category.name,
      category_color: category.color,
      category_icon: category.icon || "circle",
      credit_card_name: creditCard?.name,
      credit_card_bank: creditCard?.bank,
    }
  })
}

export async function getUpcomingTransactions(days = 7): Promise<TransactionInstanceWithDetails[]> {
  console.log("Generating mock upcoming transactions")
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  const instances = generateMockTransactionInstances(currentYear, currentMonth)

  return instances
    .filter((instance) => {
      const dueDate = new Date(instance.due_date)
      const today = new Date()
      const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
      return dueDate >= today && dueDate <= futureDate && instance.status === "pending"
    })
    .slice(0, 5)
}

// Legacy compatibility
export const sql = async (query: string, ...params: any[]) => {
  console.warn("Using mock SQL function:", query)
  return []
}
