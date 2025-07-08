"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCardActions } from "@/components/credit-card-actions"
import { Plus, CreditCard, TrendingUp, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"

export default function CreditCardsPage() {
  const creditCards = [
    {
      id: "1",
      name: "Cartão Principal",
      bank: "Banco do Brasil",
      creditLimit: 5000.0,
      currentBalance: 1250.3,
      availableLimit: 3749.7,
      closingDay: 15,
      dueDay: 10,
      isActive: true,
      color: "from-blue-600 to-blue-800",
    },
    {
      id: "2",
      name: "Cartão Secundário",
      bank: "Itaú",
      creditLimit: 3000.0,
      currentBalance: 890.5,
      availableLimit: 2109.5,
      closingDay: 20,
      dueDay: 15,
      isActive: true,
      color: "from-orange-500 to-red-600",
    },
    {
      id: "3",
      name: "Cartão Premium",
      bank: "Nubank",
      creditLimit: 8000.0,
      currentBalance: 2340.8,
      availableLimit: 5659.2,
      closingDay: 25,
      dueDay: 20,
      isActive: true,
      color: "from-purple-600 to-pink-600",
    },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.round((current / limit) * 100)
  }

  const totalLimit = creditCards.reduce((sum, card) => sum + card.creditLimit, 0)
  const totalUsed = creditCards.reduce((sum, card) => sum + card.currentBalance, 0)
  const totalAvailable = creditCards.reduce((sum, card) => sum + card.availableLimit, 0)

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cartões de Crédito</h1>
          <p className="text-gray-600">Gerencie seus cartões e limites</p>
        </div>
        <Link href="/credit-cards/new">
          <Button className="bg-[#007AFF] hover:bg-[#0056CC]">
            <Plus className="h-4 w-4 mr-2" />
            Novo Cartão
          </Button>
        </Link>
      </div>

      {/* Resumo geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Limite Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalLimit)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Usado</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalUsed)}</p>
                <p className="text-sm text-gray-600">{Math.round((totalUsed / totalLimit) * 100)}% do limite</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Disponível</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalAvailable)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de cartões */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {creditCards.map((card) => (
          <Card key={card.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className={`h-48 bg-gradient-to-br ${card.color} p-6 text-white relative`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm opacity-80">Cartão de Crédito</p>
                  <p className="text-xl font-bold">{card.name}</p>
                  <p className="text-sm opacity-90">{card.bank}</p>
                </div>
                <CreditCard className="h-8 w-8 opacity-80" />
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs opacity-80">Limite</p>
                    <p className="text-lg font-bold">{formatCurrency(card.creditLimit)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-80">Disponível</p>
                    <p className="text-lg font-bold">{formatCurrency(card.availableLimit)}</p>
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Uso do limite</span>
                    <span className="text-sm font-medium">
                      {getUsagePercentage(card.currentBalance, card.creditLimit)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
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
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Valor usado</p>
                    <p className="font-semibold">{formatCurrency(card.currentBalance)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <Badge variant={card.isActive ? "default" : "secondary"}>
                      {card.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Fechamento</p>
                    <p className="font-semibold flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Dia {card.closingDay}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Vencimento</p>
                    <p className="font-semibold flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Dia {card.dueDay}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <CreditCardActions card={card} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {creditCards.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum cartão cadastrado</h3>
            <p className="text-gray-600 mb-6">
              Adicione seu primeiro cartão de crédito para começar a organizar suas finanças.
            </p>
            <Link href="/credit-cards/new">
              <Button className="bg-[#007AFF] hover:bg-[#0056CC]">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Cartão
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
