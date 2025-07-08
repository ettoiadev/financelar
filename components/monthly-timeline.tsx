import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, DollarSign } from "lucide-react"
import { getTransactionInstances } from "@/lib/database"
import { formatCurrency } from "@/lib/utils/currency"

interface MonthlyTimelineProps {
  year: number
  month: number
}

export async function MonthlyTimeline({ year, month }: MonthlyTimelineProps) {
  const transactions = await getTransactionInstances(year, month)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Pago"
      case "pending":
        return "Pendente"
      case "overdue":
        return "Em Atraso"
      default:
        return "Cancelado"
    }
  }

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          {monthNames[month - 1]} {year}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">Nenhuma transação encontrada</p>
            <p className="text-gray-400 text-sm mt-2">
              Não há transações programadas para {monthNames[month - 1].toLowerCase()} de {year}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: transaction.category_color }} />
                  <div>
                    <h4 className="font-semibold text-gray-900">{transaction.title}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(transaction.due_date).toLocaleDateString("pt-BR")}
                      </span>
                      <span className="text-sm text-gray-500">{transaction.category_name}</span>
                      {transaction.credit_card_name && (
                        <span className="text-sm text-gray-500">{transaction.credit_card_name}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-gray-900 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  <Badge className={getStatusColor(transaction.status)}>{getStatusText(transaction.status)}</Badge>
                  {transaction.status === "pending" && (
                    <Button size="sm" variant="outline">
                      Marcar como Pago
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
