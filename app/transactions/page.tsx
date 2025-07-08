import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Plus, Calendar, CreditCard, Banknote } from "lucide-react"
import Link from "next/link"

export default function TransactionsPage() {
  const transactions = [
    {
      id: "1",
      title: "Netflix",
      amount: 29.9,
      category: "Serviços Digitais",
      categoryColor: "#8B5CF6",
      paymentMethod: "credit_card",
      creditCard: "Cartão Principal",
      dueDate: "2024-12-05",
      status: "pending",
      recurrence: "Mensal",
    },
    {
      id: "2",
      title: "Aluguel",
      amount: 1200.0,
      category: "Moradia",
      categoryColor: "#EF4444",
      paymentMethod: "bank_slip",
      creditCard: null,
      dueDate: "2024-12-10",
      status: "overdue",
      recurrence: "Mensal",
    },
    {
      id: "3",
      title: "Academia",
      amount: 89.9,
      category: "Saúde",
      categoryColor: "#06B6D4",
      paymentMethod: "credit_card",
      creditCard: "Cartão Secundário",
      dueDate: "2024-12-15",
      status: "pending",
      recurrence: "Mensal",
    },
    {
      id: "4",
      title: "Spotify",
      amount: 19.9,
      category: "Serviços Digitais",
      categoryColor: "#8B5CF6",
      paymentMethod: "credit_card",
      creditCard: "Cartão Principal",
      dueDate: "2024-11-12",
      status: "paid",
      recurrence: "Mensal",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>
      case "overdue":
        return <Badge variant="destructive">Atrasado</Badge>
      default:
        return <Badge variant="secondary">Pendente</Badge>
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    return method === "credit_card" ? <CreditCard className="h-4 w-4" /> : <Banknote className="h-4 w-4" />
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transações</h1>
          <p className="text-gray-600">Gerencie suas contas recorrentes</p>
        </div>
        <Link href="/transactions/new">
          <Button className="bg-[#007AFF] hover:bg-[#0056CC]">
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Buscar transações..." className="pl-10" />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                <SelectItem value="moradia">Moradia</SelectItem>
                <SelectItem value="servicos">Serviços Digitais</SelectItem>
                <SelectItem value="saude">Saúde</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="overdue">Atrasado</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de transações */}
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <Card key={transaction.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: transaction.categoryColor }} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900">{transaction.title}</h3>
                      <span className="text-sm text-gray-600">{transaction.category}</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        {getPaymentMethodIcon(transaction.paymentMethod)}
                        <span>{transaction.paymentMethod === "credit_card" ? "Cartão de Crédito" : "Boleto"}</span>
                      </div>
                      {transaction.creditCard && (
                        <>
                          <span>•</span>
                          <span>{transaction.creditCard}</span>
                        </>
                      )}
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(transaction.dueDate)}</span>
                      </div>
                      <span>•</span>
                      <span>{transaction.recurrence}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">{formatCurrency(transaction.amount)}</div>
                    {getStatusBadge(transaction.status)}
                  </div>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between mt-8">
        <p className="text-sm text-gray-600">Mostrando 4 de 4 transações</p>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>
            Anterior
          </Button>
          <Button variant="outline" size="sm" disabled>
            Próximo
          </Button>
        </div>
      </div>
    </div>
  )
}
