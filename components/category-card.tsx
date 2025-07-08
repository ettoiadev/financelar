"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DeleteCategoryDialog } from "./delete-category-dialog"
import { CategoryForm } from "./category-form"
import { Edit, Trash2, TrendingUp } from "lucide-react"
import { useState } from "react"

interface Category {
  id: string
  name: string
  description: string
  color: string
  icon: string
  transactionCount: number
  totalAmount: number
  isActive: boolean
}

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-200 group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: category.color }} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            </div>
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" variant="ghost" onClick={() => setShowEditForm(true)} className="h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowDeleteDialog(true)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Transações</span>
              <Badge variant="secondary">{category.transactionCount}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total gasto</span>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-gray-900">{formatCurrency(category.totalAmount)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <Badge variant={category.isActive ? "default" : "secondary"}>
                {category.isActive ? "Ativa" : "Inativa"}
              </Badge>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Média por transação</span>
              <span className="font-medium">
                {formatCurrency(category.totalAmount / Math.max(category.transactionCount, 1))}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de edição */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <CategoryForm category={category} onClose={() => setShowEditForm(false)} />
          </div>
        </div>
      )}

      {/* Dialog de exclusão */}
      <DeleteCategoryDialog category={category} open={showDeleteDialog} onOpenChange={setShowDeleteDialog} />
    </>
  )
}
