import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, CreditCard, Tag, FileText, Zap } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Nova Conta Recorrente",
      description: "Adicionar nova conta mensal",
      icon: Plus,
      href: "/transactions/new",
      color: "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    },
    {
      title: "Novo Cartão",
      description: "Cadastrar cartão de crédito",
      icon: CreditCard,
      href: "/credit-cards/new",
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700",
    },
    {
      title: "Nova Categoria",
      description: "Criar categoria personalizada",
      icon: Tag,
      href: "/categories",
      color: "bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    },
    {
      title: "Ver Relatórios",
      description: "Análises e gráficos",
      icon: FileText,
      href: "/reports",
      color: "bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
    },
  ]

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Zap className="w-5 h-5 text-blue-600" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link key={index} href={action.href}>
                <Button
                  variant="outline"
                  className={`w-full h-auto p-4 border-0 ${action.color} text-white hover:scale-105 transition-all duration-300 group`}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-sm">{action.title}</p>
                      <p className="text-xs opacity-90">{action.description}</p>
                    </div>
                  </div>
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
