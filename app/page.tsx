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
  const [summary, setSummary] = useState<any>({ total_amount: 0, paid_count: 0, overdue_count: 0 })
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
          getMonthlySummary(currentYear, currentMonth) || { total_amount: 0, paid_count: 0, overdue_count: 0 },
          getCreditCards()
        ])

        setSummary(summaryData)
        setActiveCreditCards(creditCards.filter((card) => card.is_active).length)
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
    )
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-lg col-span-full">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-gray-500">{error}</p>
              <p className="text-sm text-gray-400 mt-1">Tente fazer login novamente</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Mensal */}
      <Card className="bg-blue-500 border-0 text-white hover:bg-blue-600 transition-colors duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100 mb-1">Total Mensal</p>
              <p className="text-xl font-bold">{formatCurrency(summary?.total_amount || 0)}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cartões Ativos */}
      <Card className="bg-teal-500 border-0 text-white hover:bg-teal-600 transition-colors duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-teal-100 mb-1">Cartões Ativos</p>
              <p className="text-xl font-bold">{activeCreditCards}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contas Pagas */}
      <Card className="bg-green-500 border-0 text-white hover:bg-green-600 transition-colors duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100 mb-1">Contas Pagas</p>
              <p className="text-xl font-bold">{summary?.paid_count || 0}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Em Atraso */}
      <Card className="bg-red-500 border-0 text-white hover:bg-red-600 transition-colors duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-100 mb-1">Em Atraso</p>
              <p className="text-xl font-bold">{summary?.overdue_count || 0}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
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

        const transactions = await getUpcomingTransactions(7)
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
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Calendar className="w-5 h-5 text-blue-600" />
            Próximos Vencimentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Carregando vencimentos...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Calendar className="w-5 h-5 text-blue-600" />
            Próximos Vencimentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">{error}</p>
            <p className="text-xs text-gray-400 mt-1">Tente fazer login novamente</p>
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
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
          <p className="text-gray-600">Visão geral das suas finanças</p>
        </div>

        {/* Metrics Cards */}
        <div className="mb-8">
          <Suspense fallback={<div>Carregando métricas...</div>}>
            <DashboardMetrics />
          </Suspense>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Próximos Vencimentos */}
            <Suspense fallback={<div>Carregando próximos vencimentos...</div>}>
              <UpcomingDues />
            </Suspense>
            
            {/* Ações Rápidas */}
            <QuickActions />
          </div>
          
          {/* Right Column - Gráfico de Categorias */}
          <div>
            <Suspense fallback={<div>Carregando gráfico...</div>}>
              <CategoryPieChart />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
