import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, CreditCard, CheckCircle, AlertCircle } from "lucide-react"
import { getMonthlySummary, getCreditCards } from "@/lib/database"
import { formatCurrency } from "@/lib/utils/currency"

export async function DashboardOverview() {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  const [summary, creditCards] = await Promise.all([getMonthlySummary(currentYear, currentMonth), getCreditCards()])

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
