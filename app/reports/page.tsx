import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { CategoryPieChart } from "@/components/category-pie-chart"
import { TrendingUp, TrendingDown, DollarSign, Calendar, Download, Filter } from "lucide-react"

export default function ReportsPage() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Gasto</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{formatCurrency(2847.6)}</p>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-red-600 font-medium">+12%</span>
                    <span className="text-gray-500 ml-1">vs mês anterior</span>
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
                  <p className="text-sm font-medium text-gray-600 mb-1">Média Mensal</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{formatCurrency(2654.3)}</p>
                  <div className="flex items-center text-sm">
                    <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">-5%</span>
                    <span className="text-gray-500 ml-1">vs média anual</span>
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
                  <p className="text-2xl font-bold text-gray-900 mb-2">{formatCurrency(1200.0)}</p>
                  <p className="text-sm text-gray-600">Moradia</p>
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
                  <p className="text-2xl font-bold text-gray-900 mb-2">24</p>
                  <p className="text-sm text-gray-600">Este mês</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart Section */}
          <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Gastos por Categoria</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col items-center">
                <div className="w-full max-w-sm mb-6">
                  <CategoryPieChart />
                </div>
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">Moradia</span>
                    </div>
                    <span className="font-semibold text-gray-900">{formatCurrency(1200.0)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">Transporte</span>
                    </div>
                    <span className="font-semibold text-gray-900">{formatCurrency(512.4)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">Alimentação</span>
                    </div>
                    <span className="font-semibold text-gray-900">{formatCurrency(427.14)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">Serviços Digitais</span>
                    </div>
                    <span className="font-semibold text-gray-900">{formatCurrency(341.71)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">Saúde</span>
                    </div>
                    <span className="font-semibold text-gray-900">{formatCurrency(227.81)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Expenses */}
          <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Maiores Gastos</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-8 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-gray-900">Moradia</p>
                      <p className="text-sm text-gray-600">42% do total</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(1200.0)}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-gray-900">Transporte</p>
                      <p className="text-sm text-gray-600">18% do total</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(512.4)}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-gray-900">Alimentação</p>
                      <p className="text-sm text-gray-600">15% do total</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(427.14)}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-gray-900">Serviços Digitais</p>
                      <p className="text-sm text-gray-600">12% do total</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(341.71)}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-8 bg-cyan-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-gray-900">Saúde</p>
                      <p className="text-sm text-gray-600">8% do total</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(227.81)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">Transações Recentes</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Netflix</p>
                    <p className="text-sm text-gray-600">05/12/2024 • Serviços Digitais</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(29.9)}</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Aluguel</p>
                    <p className="text-sm text-gray-600">10/12/2024 • Moradia</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(1200.0)}</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Spotify</p>
                    <p className="text-sm text-gray-600">12/12/2024 • Serviços Digitais</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(19.9)}</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Academia</p>
                    <p className="text-sm text-gray-600">15/12/2024 • Saúde</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(89.9)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
