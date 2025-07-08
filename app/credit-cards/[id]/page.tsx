"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Calendar, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function CreditCardDetailsPage() {
  const params = useParams()
  const cardId = params.id

  // Mock data - em produção viria de uma API
  const card = {
    id: cardId,
    name: "Cartão Principal",
    bank: "Banco do Brasil",
    creditLimit: 5000.0,
    currentBalance: 1250.3,
    availableLimit: 3749.7,
    closingDay: 15,
    dueDay: 10,
    isActive: true,
    color: "from-blue-600 to-blue-800",
    createdAt: "2024-01-15",
  }

  const transactions = [
    {
      id: "1",
      title: "Netflix",
      amount: 29.9,
      date: "2024-12-05",
      category: "Serviços Digitais",
      status: "pending",
    },
    {
      id: "2",
      title: "Spotify",
      amount: 19.9,
      date: "2024-12-12",
      category: "Serviços Digitais",
      status: "pending",
    },
    {
      id: "3",
      title: "Supermercado",
      amount: 156.8,
      date: "2024-12-08",
      category: "Alimentação",
      status: "paid",
    },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.round((current / limit) * 100)
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/credit-cards">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{card.name}</h1>
          <p className="text-gray-600">{card.bank}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-8">
          {/* Cartão visual */}
          <Card className="overflow-hidden">
            <div className={`h-56 bg-gradient-to-br ${card.color} p-8 text-white relative`}>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-sm opacity-80">Cartão de Crédito</p>
                  <p className="text-2xl font-bold">{card.name}</p>
                  <p className="text-base opacity-90">{card.bank}</p>
                </div>
                <CreditCard className="h-10 w-10 opacity-80" />
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-xs opacity-80">Limite Total</p>
                    <p className="text-xl font-bold">{formatCurrency(card.creditLimit)}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-80">Disponível</p>
                    <p className="text-xl font-bold">{formatCurrency(card.availableLimit)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Transações recentes */}
          <Card>
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{transaction.title}</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(transaction.date)} • {transaction.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(transaction.amount)}</p>
                      <Badge variant={transaction.status === "paid" ? "default" : "secondary"}>
                        {transaction.status === "paid" ? "Pago" : "Pendente"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Informações do cartão */}
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Uso do limite</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        getUsagePercentage(card.currentBalance, card.creditLimit) > 80
                          ? "bg-red-500"
                          : getUsagePercentage(card.currentBalance, card.creditLimit) > 60
                            ? "bg-orange-500"
                            : "bg-green-500"
                      }`}
                      style={{
                        width: `${getUsagePercentage(card.currentBalance, card.creditLimit)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {getUsagePercentage(card.currentBalance, card.creditLimit)}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Valor usado</p>
                  <p className="font-semibold">{formatCurrency(card.currentBalance)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge variant={card.isActive ? "default" : "secondary"}>{card.isActive ? "Ativo" : "Inativo"}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Fechamento</p>
                  <p className="font-semibold flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Dia {card.closingDay}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Vencimento</p>
                  <p className="font-semibold flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Dia {card.dueDay}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Criado em</p>
                <p className="font-semibold">{formatDate(card.createdAt)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/credit-cards/${card.id}/edit`} className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Cartão
                </Button>
              </Link>

              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Cartão
              </Button>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Transações este mês</span>
                <span className="font-semibold">{transactions.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Gasto médio</span>
                <span className="font-semibold">
                  {formatCurrency(transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Maior transação</span>
                <span className="font-semibold">{formatCurrency(Math.max(...transactions.map((t) => t.amount)))}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
