"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils/date"
import { Check, Clock, AlertTriangle, CreditCard, Banknote, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data para desenvolvimento
const mockRecurringTransactions = [
  {
    id: "1",
    title: "Netflix",
    amount: 29.9,
    category_name: "Serviços Digitais",
    category_color: "#8B5CF6",
    payment_method: "credit_card",
    credit_card_name: "Cartão Principal",
    recurrence_type: "monthly",
    due_day: 5,
    start_date: new Date("2024-01-01"),
    end_date: null,
    is_active: true,
  },
  {
    id: "2",
    title: "Aluguel",
    amount: 1200.0,
    category_name: "Moradia",
    category_color: "#EF4444",
    payment_method: "bank_slip",
    credit_card_name: null,
    recurrence_type: "monthly",
    due_day: 10,
    start_date: new Date("2024-01-01"),
    end_date: null,
    is_active: true,
  },
  {
    id: "3",
    title: "Academia",
    amount: 89.9,
    category_name: "Saúde",
    category_color: "#06B6D4",
    payment_method: "credit_card",
    credit_card_name: "Cartão Secundário",
    recurrence_type: "monthly",
    due_day: 15,
    start_date: new Date("2024-01-01"),
    end_date: null,
    is_active: true,
  },
  {
    id: "4",
    title: "Spotify",
    amount: 19.9,
    category_name: "Serviços Digitais",
    category_color: "#8B5CF6",
    payment_method: "credit_card",
    credit_card_name: "Cartão Principal",
    recurrence_type: "monthly",
    due_day: 12,
    start_date: new Date("2024-01-01"),
    end_date: null,
    is_active: true,
  },
  {
    id: "5",
    title: "Seguro Auto",
    amount: 180.0,
    category_name: "Seguros",
    category_color: "#84CC16",
    payment_method: "automatic_debit",
    credit_card_name: null,
    recurrence_type: "monthly",
    due_day: 20,
    start_date: new Date("2024-01-01"),
    end_date: null,
    is_active: true,
  },
]

// Mock de instâncias pagas
const mockPaidInstances = new Set([
  "2024-12-05-1", // Netflix dezembro
  "2024-12-10-2", // Aluguel dezembro
])

const months = [
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

interface TransactionInstance {
  id: string
  recurring_transaction_id: string
  title: string
  amount: number
  category_name: string
  category_color: string
  payment_method: string
  credit_card_name: string | null
  due_date: Date
  status: "pending" | "paid"
  instanceKey: string
}

export default function TimelinePage() {
  const currentDate = new Date()
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth())
  const [paidInstances, setPaidInstances] = useState<Set<string>>(mockPaidInstances)

  // Gerar anos disponíveis (3 anos atrás até 2 anos à frente)
  const availableYears = useMemo(() => {
    const years = []
    const currentYear = new Date().getFullYear()
    for (let year = currentYear - 3; year <= currentYear + 2; year++) {
      years.push(year)
    }
    return years
  }, [])

  // Calcular transações para o mês selecionado
  const monthlyTransactions = useMemo(() => {
    const transactions: TransactionInstance[] = []
    const targetDate = new Date(selectedYear, selectedMonth, 1)

    mockRecurringTransactions.forEach((recurring) => {
      if (!recurring.is_active) return

      // Verificar se a transação já começou
      const startDate = new Date(recurring.start_date)
      if (targetDate < startDate) return

      // Verificar se a transação já terminou
      if (recurring.end_date) {
        const endDate = new Date(recurring.end_date)
        if (targetDate > endDate) return
      }

      // Criar instância para o mês
      const dueDate = new Date(selectedYear, selectedMonth, recurring.due_day)
      const instanceKey = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, "0")}-${recurring.due_day.toString().padStart(2, "0")}-${recurring.id}`

      transactions.push({
        id: `${recurring.id}-${selectedYear}-${selectedMonth}`,
        recurring_transaction_id: recurring.id,
        title: recurring.title,
        amount: recurring.amount,
        category_name: recurring.category_name,
        category_color: recurring.category_color,
        payment_method: recurring.payment_method,
        credit_card_name: recurring.credit_card_name,
        due_date: dueDate,
        status: paidInstances.has(instanceKey) ? "paid" : "pending",
        instanceKey,
      })
    })

    return transactions.sort((a, b) => a.due_date.getTime() - b.due_date.getTime())
  }, [selectedYear, selectedMonth, paidInstances])

  // Agrupar transações por dia
  const transactionsByDay = useMemo(() => {
    const grouped: { [key: string]: TransactionInstance[] } = {}

    monthlyTransactions.forEach((transaction) => {
      const dayKey = transaction.due_date.getDate().toString()
      if (!grouped[dayKey]) {
        grouped[dayKey] = []
      }
      grouped[dayKey].push(transaction)
    })

    return grouped
  }, [monthlyTransactions])

  // Marcar como pago
  const handleMarkAsPaid = (transaction: TransactionInstance) => {
    const newPaidInstances = new Set(paidInstances)
    if (transaction.status === "paid") {
      newPaidInstances.delete(transaction.instanceKey)
    } else {
      newPaidInstances.add(transaction.instanceKey)
    }
    setPaidInstances(newPaidInstances)
  }

  const getStatusIcon = (status: string, dueDate: Date) => {
    if (status === "paid") return <Check className="h-4 w-4 text-green-600" />
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)
    if (due < today) {
      return <AlertTriangle className="h-4 w-4 text-red-600" />
    }
    return <Clock className="h-4 w-4 text-orange-600" />
  }

  const getPaymentMethodIcon = (method: string) => {
    if (method === "credit_card") return <CreditCard className="h-4 w-4" />
    return <Banknote className="h-4 w-4" />
  }

  const getPaymentMethodLabel = (method: string) => {
    const labels = {
      credit_card: "Cartão de Crédito",
      debit_card: "Cartão de Débito",
      bank_slip: "Boleto",
      automatic_debit: "Débito Automático",
      pix: "PIX",
    }
    return labels[method as keyof typeof labels] || method
  }

  const isOverdue = (dueDate: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)
    return due < today
  }

  const totalPending = monthlyTransactions.filter((t) => t.status === "pending").reduce((sum, t) => sum + t.amount, 0)

  const totalPaid = monthlyTransactions.filter((t) => t.status === "paid").reduce((sum, t) => sum + t.amount, 0)

  const overdueCount = monthlyTransactions.filter((t) => t.status === "pending" && isOverdue(t.due_date)).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da página integrado ao topo */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          {/* Header com seletor de ano */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Timeline Financeira</h1>
              <p className="text-gray-600">Visualização cronológica das suas contas</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(Number.parseInt(value))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Menu de navegação de meses integrado */}
          <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-hide">
            {months.map((month, index) => (
              <button
                key={month}
                onClick={() => setSelectedMonth(index)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 hover:scale-105",
                  selectedMonth === index
                    ? "bg-[#007AFF] text-white shadow-md font-semibold transform scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                )}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-6 py-8">
        {/* Resumo do mês */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pendente</p>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalPending)}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pago</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Em Atraso</p>
                  <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de transações agrupadas por dia */}
        <div className="space-y-6">
          {Object.keys(transactionsByDay)
            .sort((a, b) => Number.parseInt(a) - Number.parseInt(b))
            .map((day) => (
              <div key={day} className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#007AFF] rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg">{day}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {day} de {months[selectedMonth]}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {transactionsByDay[day].length} transação
                      {transactionsByDay[day].length !== 1 ? "ões" : ""}
                    </p>
                  </div>
                </div>

                <div className="ml-6 space-y-3">
                  {transactionsByDay[day].map((transaction) => (
                    <Card
                      key={transaction.id}
                      className={cn(
                        "bg-white shadow-sm border-0 ring-1 transition-all duration-200 hover:shadow-md hover:scale-[1.01]",
                        transaction.status === "paid"
                          ? "ring-green-200 bg-green-50"
                          : isOverdue(transaction.due_date)
                            ? "ring-red-200 bg-red-50"
                            : "ring-gray-200",
                      )}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {getStatusIcon(transaction.status, transaction.due_date)}
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <h4 className="font-semibold text-gray-900">{transaction.title}</h4>
                                <div
                                  className="w-3 h-3 rounded-full shadow-sm"
                                  style={{ backgroundColor: transaction.category_color }}
                                />
                                <span className="text-sm text-gray-600">{transaction.category_name}</span>
                              </div>
                              <div className="flex items-center space-x-4 mt-1">
                                <div className="flex items-center space-x-1">
                                  {getPaymentMethodIcon(transaction.payment_method)}
                                  <span className="text-sm text-gray-600">
                                    {getPaymentMethodLabel(transaction.payment_method)}
                                  </span>
                                </div>
                                {transaction.credit_card_name && (
                                  <>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-sm text-gray-600">{transaction.credit_card_name}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-xl font-bold text-gray-900">
                                {formatCurrency(transaction.amount)}
                              </div>
                              <Badge
                                variant={
                                  transaction.status === "paid"
                                    ? "default"
                                    : isOverdue(transaction.due_date)
                                      ? "destructive"
                                      : "secondary"
                                }
                                className={cn(
                                  "transition-all duration-200",
                                  transaction.status === "paid" && "bg-green-100 text-green-800 hover:bg-green-100",
                                )}
                              >
                                {transaction.status === "paid"
                                  ? "Pago"
                                  : isOverdue(transaction.due_date)
                                    ? "Atrasado"
                                    : "Pendente"}
                              </Badge>
                            </div>
                            <Button
                              onClick={() => handleMarkAsPaid(transaction)}
                              variant={transaction.status === "paid" ? "outline" : "default"}
                              size="sm"
                              className={cn(
                                "transition-all duration-200 hover:scale-105",
                                transaction.status === "paid"
                                  ? "border-green-300 text-green-700 hover:bg-green-50"
                                  : "bg-[#007AFF] hover:bg-[#0056CC] text-white shadow-md",
                              )}
                            >
                              {transaction.status === "paid" ? (
                                <>
                                  <Check className="h-4 w-4 mr-1" />
                                  Pago
                                </>
                              ) : (
                                "Marcar como Pago"
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}

          {Object.keys(transactionsByDay).length === 0 && (
            <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200">
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma transação neste mês</h3>
                <p className="text-gray-600 mb-4">
                  Não há contas programadas para {months[selectedMonth]} de {selectedYear}.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
