'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { getCategorySummary } from "@/lib/database"
import { formatCurrency } from "@/lib/utils/currency"
import { BarChart3 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function CategoryPieChart() {
  const [categorySummary, setCategorySummary] = useState<any[]>([])
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

        const summary = await getCategorySummary(currentYear, currentMonth) || []
        setCategorySummary(summary)
      } catch (err) {
        console.error('Error loading category summary:', err)
        setError('Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const chartData = categorySummary.map((category) => ({
    name: category.category_name,
    value: category.total_amount,
    color: category.category_color,
    count: category.transaction_count,
  }))

  const totalAmount = categorySummary.reduce((sum, cat) => sum + (cat.total_amount || 0), 0)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            Valor: <span className="font-semibold">{formatCurrency(data.value)}</span>
          </p>
          <p className="text-sm text-gray-600">
            Transações: <span className="font-semibold">{data.count}</span>
          </p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Resumo por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Carregando dados...</p>
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
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Resumo por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <p className="text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Resumo por Categoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma transação encontrada</p>
            <p className="text-sm text-gray-400 mt-1">Adicione algumas transações para ver o resumo</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Pie Chart */}
            <div className="flex-1 w-full lg:w-auto">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category Summary */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="space-y-4">
                <div className="text-center lg:text-left mb-6">
                  <p className="text-sm text-gray-600 mb-1">Total Geral</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {categorySummary.map((category) => {
                    const percentage = totalAmount > 0 ? (category.total_amount / totalAmount) * 100 : 0
                    return (
                      <div
                        key={category.category_id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: category.category_color }}
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">{category.category_name}</p>
                            <p className="text-xs text-gray-500">{category.transaction_count} transações</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold text-gray-900 text-sm">{formatCurrency(category.total_amount)}</p>
                          <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
