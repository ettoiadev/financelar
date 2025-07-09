'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, CreditCard, CheckCircle, AlertCircle } from "lucide-react"
import { getMonthlySummary, getCreditCards } from "@/lib/database"
import { formatCurrency } from "@/lib/utils/currency"
import { createClient } from '@/lib/supabase/client'

export function DashboardOverview() {
  const [summary, setSummary] = useState({ total_amount: 0, paid_count: 0, overdue_count: 0 })
  const [creditCards, setCreditCards] = useState<any[]>([])
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

        const [summaryData, creditCardsData] = await Promise.all([
          getMonthlySummary(currentYear, currentMonth),
          getCreditCards()
        ])
        
        setSummary(summaryData || { total_amount: 0, paid_count: 0, overdue_count: 0 })
        setCreditCards(creditCardsData || [])
      } catch (err) {
        console.error('Error loading dashboard overview:', err)
        setError('Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const activeCreditCards = creditCards.filter((card) => card.is_active).length

  const metrics = [
    {
      title: "Total Mensal",
      value: formatCurrency(summary.total_amount),
      icon: TrendingUp,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Cartões Ativos",
      value: activeCreditCards.toString(),
      icon: CreditCard,
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Contas Pagas",
      value: summary.paid_count.toString(),
      icon: CheckCircle,
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Em Atraso",
      value: summary.overdue_count.toString(),
      icon: AlertCircle,
      gradient: "from-red-500 to-red-600",
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((index) => (
          <Card key={index} className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg col-span-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">{error}</p>
            <p className="text-xs text-gray-400 mt-1">Tente fazer login novamente</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${metric.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
