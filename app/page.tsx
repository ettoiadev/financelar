'use client'

import { Suspense, useState, useEffect } from "react"
import { QuickActions } from "@/components/quick-actions"
import { CategoryPieChart } from "@/components/category-pie-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, CreditCard, CheckCircle, AlertCircle, Calendar } from "lucide-react"
import { getMonthlySummary, getUpcomingTransactions, getCreditCards } from "@/lib/database"
import { formatCurrency } from "@/lib/utils/currency"
import { createClient } from "@/lib/supabase/client"

function DashboardMetrics() {
  const [summary, setSummary] = useState<any>({ total_amount: 0, paid_amount: 0, overdue_amount: 0 })
  const [activeCreditCards, setActiveCreditCards] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user?.id) {
          setError('Usuário não autenticado')
          return
        }

        const currentDate = new Date()
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth() + 1

        const [summaryData, creditCards] = await Promise.all([
          getMonthlySummary(currentYear, currentMonth),
          getCreditCards()
        ])

        setSummary(summaryData || { total_amount: 0, paid_amount: 0, overdue_amount: 0 })
        setActiveCreditCards(creditCards?.filter((card) => card.is_active).length || 0)
      } catch (err) {
        console.error('Error loading dashboard metrics:', err)
        setError('Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-lg col-span-full">
          <CardContent className="p-6 text-center">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Mensal */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Mensal</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.total_amount)}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cartões Ativos */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Cartões Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{activeCreditCards}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contas Pagas */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Contas Pagas</p>
              <p className="text-2xl font-bold text-gray-900">{summary.paid_count}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Em Atraso */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Em Atraso</p>
              <p className="text-2xl font-bold text-gray-900">{summary.overdue_count}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function UpcomingDues() {
  const [upcomingTransactions, setUpcomingTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user?.id) {
          setError('Usuário não autenticado')
          return
        }

        const transactions = await getUpcomingTransactions(7) || []
        setUpcomingTransactions(transactions)
      } catch (err) {
        console.error('Error loading upcoming transactions:', err)
        setError('Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Calendar className="w-5 h-5 text-blue-600" />
            Próximos Vencimentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">Carregando dados...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Calendar className="w-5 h-5 text-blue-600" />
            Próximos Vencimentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-red-300 mx-auto mb-3" />
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Calendar className="w-5 h-5 text-blue-600" />
          Próximos Vencimentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingTransactions.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Nenhum vencimento próximo</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: transaction.category_color }} />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{transaction.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.due_date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 text-sm">{formatCurrency(transaction.amount)}</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pendente
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Visão geral das suas finanças</p>
        </div>

        {/* Metrics Cards */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-32"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          }
        >
          <DashboardMetrics />
        </Suspense>

        {/* Second Row: Upcoming Dues and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Suspense
            fallback={
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="animate-pulse h-6 bg-gray-200 rounded w-48"></div>
                </CardHeader>
                <CardContent>
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            }
          >
            <UpcomingDues />
          </Suspense>

          <QuickActions />
        </div>

        {/* Category Summary */}
        <Suspense
          fallback={
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="animate-pulse h-6 bg-gray-200 rounded w-48"></div>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse">
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          }
        >
          <CategoryPieChart />
        </Suspense>
      </div>
    </div>
  )
}
