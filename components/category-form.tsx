"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { X, Palette } from "lucide-react"

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

interface CategoryFormProps {
  category?: Category
  onClose: () => void
}

const colorOptions = [
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#06B6D4",
  "#8B5CF6",
  "#EC4899",
  "#84CC16",
  "#F97316",
  "#6366F1",
  "#14B8A6",
  "#F43F5E",
  "#8B5A2B",
]

export function CategoryForm({ category, onClose }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    color: category?.color || "#3B82F6",
    icon: category?.icon || "folder",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validação
      if (!formData.name.trim()) {
        toast({
          title: "Nome obrigatório",
          description: "Por favor, informe o nome da categoria.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const action = category ? "editada" : "criada"
      toast({
        title: `Categoria ${action}`,
        description: `A categoria "${formData.name}" foi ${action} com sucesso.`,
      })

      onClose()

      // Recarregar a página para mostrar as mudanças
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      toast({
        title: "Erro ao salvar categoria",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{category ? "Editar Categoria" : "Nova Categoria"}</h2>
        <Button type="button" variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nome *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Alimentação, Transporte..."
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descreva o tipo de gastos desta categoria..."
            rows={3}
          />
        </div>

        <div>
          <Label className="flex items-center space-x-2 mb-3">
            <Palette className="h-4 w-4" />
            <span>Cor da Categoria</span>
          </Label>
          <div className="grid grid-cols-6 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  formData.color === color ? "border-gray-900 scale-110" : "border-gray-300 hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <Label className="text-sm font-medium text-gray-600 mb-2 block">Preview</Label>
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${formData.color}20` }}
            >
              <div className="w-5 h-5 rounded-full" style={{ backgroundColor: formData.color }} />
            </div>
            <div>
              <p className="font-medium text-gray-900">{formData.name || "Nome da categoria"}</p>
              <p className="text-sm text-gray-600">{formData.description || "Descrição da categoria"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="flex-1 bg-transparent"
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1 bg-[#007AFF] hover:bg-[#0056CC]">
          {isSubmitting ? "Salvando..." : category ? "Salvar Alterações" : "Criar Categoria"}
        </Button>
      </div>
    </form>
  )
}
