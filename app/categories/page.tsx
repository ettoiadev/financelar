"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CategoryCard } from "@/components/category-card"
import { CategoryForm } from "@/components/category-form"
import { Search, Plus, Filter } from "lucide-react"
import { useState } from "react"

export default function CategoriesPage() {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const categories = [
    {
      id: "1",
      name: "Moradia",
      description: "Aluguel, financiamento, condomínio",
      color: "#EF4444",
      icon: "home",
      transactionCount: 3,
      totalAmount: 1350.0,
      isActive: true,
    },
    {
      id: "2",
      name: "Alimentação",
      description: "Supermercado, restaurantes, delivery",
      color: "#F59E0B",
      icon: "utensils",
      transactionCount: 8,
      totalAmount: 650.3,
      isActive: true,
    },
    {
      id: "3",
      name: "Transporte",
      description: "Combustível, transporte público, manutenção",
      color: "#10B981",
      icon: "car",
      transactionCount: 5,
      totalAmount: 420.8,
      isActive: true,
    },
    {
      id: "4",
      name: "Saúde",
      description: "Plano de saúde, medicamentos, consultas",
      color: "#06B6D4",
      icon: "heart",
      transactionCount: 2,
      totalAmount: 180.0,
      isActive: true,
    },
    {
      id: "5",
      name: "Educação",
      description: "Cursos, livros, mensalidades",
      color: "#8B5CF6",
      icon: "book",
      transactionCount: 1,
      totalAmount: 299.9,
      isActive: true,
    },
    {
      id: "6",
      name: "Lazer",
      description: "Cinema, viagens, hobbies",
      color: "#EC4899",
      icon: "gamepad-2",
      transactionCount: 4,
      totalAmount: 320.5,
      isActive: true,
    },
    {
      id: "7",
      name: "Serviços Digitais",
      description: "Streaming, software, aplicativos",
      color: "#8B5CF6",
      icon: "smartphone",
      transactionCount: 6,
      totalAmount: 149.4,
      isActive: true,
    },
    {
      id: "8",
      name: "Seguros",
      description: "Seguro auto, vida, residencial",
      color: "#84CC16",
      icon: "shield",
      transactionCount: 2,
      totalAmount: 380.0,
      isActive: true,
    },
  ]

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Categorias</h1>
          <p className="text-gray-600">Organize suas despesas por categoria</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-[#007AFF] hover:bg-[#0056CC]">
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Barra de busca e filtros */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar categorias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              <p className="text-sm text-gray-600">Total de Categorias</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {categories.reduce((sum, cat) => sum + cat.transactionCount, 0)}
              </p>
              <p className="text-sm text-gray-600">Transações</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                R${" "}
                {categories
                  .reduce((sum, cat) => sum + cat.totalAmount, 0)
                  .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-gray-600">Valor Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{categories.filter((cat) => cat.isActive).length}</p>
              <p className="text-sm text-gray-600">Ativas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid de categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600 mb-4">Nenhuma categoria encontrada para "{searchTerm}"</p>
            <Button onClick={() => setSearchTerm("")} variant="outline">
              Limpar busca
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal de nova categoria */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <CategoryForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
