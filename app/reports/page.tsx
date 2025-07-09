'use client'

import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { CategoryPieChart } from "@/components/category-pie-chart"
import { TrendingUp, TrendingDown, DollarSign, Calendar, Download, Filter } from "lucide-react"
import { getMonthlySummary, getTransactionInstances } from "@/lib/database"
import { formatCurrency } from "@/lib/utils/currency"

async function ReportsMetrics() {
  try {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1

    const [summary, transactions] = await Promise.all([
      getMonthlySummary(currentYear, currentMonth) || { total_amount: 0, paid_count: 0, overdue_count: 0 },
      getTransactionInstances(currentYear, currentMonth) || []
    ])

    const totalAmount = summary?.total_amount || 0
    const transactionCount = transactions.length
    const averageAmount = transactionCount > 0 ? totalAmount / transactionCount : 0

    // Encontrar o maior gasto
    const maxTransaction = transactions.reduce((max, current) => {
      return (current.amount > (max?.amount || 0)) ? current : max
    }, transactions[0])

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Gasto</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">{formatCurrency(totalAmount)}</p>
                <div className="flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-gray-500">Este mês</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Média por Transação</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">{formatCurrency(averageAmount)}</p>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-gray-500">Este mês</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Maior Gasto</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">{formatCurrency(maxTransaction?.amount || 0)}</p>
                <p className="text-sm text-gray-600">{maxTransaction?.category_name || 'N/A'}</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Transações</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">{transactionCount}</p>
                <p className="text-sm text-gray-600">Este mês</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error('Error in ReportsMetrics:', error)
    return null
  }
}

async function RecentTransactions() {
  try {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1

    const transactions = await getTransactionInstances(currentYear, currentMonth) || []

    return (
      <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: transaction.category_color }} />
                  <div>
                    <p className="font-semibold text-gray-900">{transaction.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.due_date).toLocaleDateString("pt-BR")} • {transaction.category_name}
                    </p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(transaction.amount)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  } catch (error) {
    console.error('Error in RecentTransactions:', error)
    return null
  }
}

function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Relatórios</h1>
              <p className="text-sm text-gray-600">Análise detalhada das suas finanças</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="hover:bg-gray-50 transition-colors duration-200 bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline" className="hover:bg-gray-50 transition-colors duration-200 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Filter Section */}
        <Card className="mb-8 shadow-sm border-0 bg-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select defaultValue="current-month">
                <SelectTrigger className="h-11 border-gray-200 hover:border-gray-300 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <SelectValue placeholder="Mês Atual" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Mês atual</SelectItem>
                  <SelectItem value="last-month">Mês anterior</SelectItem>
                  <SelectItem value="current-year">Ano atual</SelectItem>
                  <SelectItem value="last-year">Ano anterior</SelectItem>
                  <SelectItem value="custom">Período personalizado</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-categories">
                <SelectTrigger className="h-11 border-gray-200 hover:border-gray-300 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">Todas as categorias</SelectItem>
                  <SelectItem value="moradia">Moradia</SelectItem>
                  <SelectItem value="servicos">Serviços Digitais</SelectItem>
                  <SelectItem value="saude">Saúde</SelectItem>
                  <SelectItem value="transporte">Transporte</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-payment">
                <SelectTrigger className="h-11 border-gray-200 hover:border-gray-300 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <SelectValue placeholder="Todas as formas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-payment">Todas as formas</SelectItem>
                  <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                  <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                  <SelectItem value="bank_slip">Boleto</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

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
          <ReportsMetrics />
        </Suspense>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart Section */}
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
            <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Gastos por Categoria</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CategoryPieChart />
              </CardContent>
            </Card>
          </Suspense>

          {/* Recent Transactions */}
          <Suspense
            fallback={
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="animate-pulse h-6 bg-gray-200 rounded w-48"></div>
                </CardHeader>
                <CardContent>
                  <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            }
          >
            <RecentTransactions />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage
