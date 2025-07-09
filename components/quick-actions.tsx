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
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Novo Cartão",
      description: "Cadastrar cartão de crédito",
      icon: CreditCard,
      href: "/credit-cards/new",
      color: "bg-teal-500 hover:bg-teal-600",
    },
    {
      title: "Nova Categoria",
      description: "Criar categoria personalizada",
      icon: Tag,
      href: "/categories",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Ver Relatórios",
      description: "Análises e gráficos",
      icon: FileText,
      href: "/reports",
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ]

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
          <Zap className="w-4 h-4 text-blue-600" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <Link key={index} href={action.href}>
              <Button
                variant="outline"
                className={`w-full h-auto p-3 border-0 ${action.color} text-white hover:scale-[1.02] transition-all duration-200 group`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center group-hover:bg-white/30 transition-colors duration-200">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium text-sm">{action.title}</p>
                    <p className="text-xs opacity-80">{action.description}</p>
                  </div>
                </div>
              </Button>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
