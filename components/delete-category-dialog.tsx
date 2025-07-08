"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
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

interface DeleteCategoryDialogProps {
  category: Category
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteCategoryDialog({ category, open, onOpenChange }: DeleteCategoryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      // Verificar se há transações vinculadas
      if (category.transactionCount > 0) {
        toast({
          title: "Não é possível excluir",
          description: `Esta categoria possui ${category.transactionCount} transação(ões) vinculada(s). Remova ou altere a categoria das transações primeiro.`,
          variant: "destructive",
        })
        setIsDeleting(false)
        return
      }

      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Categoria excluída",
        description: `A categoria "${category.name}" foi excluída com sucesso.`,
      })

      onOpenChange(false)

      // Recarregar a página para mostrar as mudanças
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      toast({
        title: "Erro ao excluir categoria",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir categoria</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a categoria "{category.name}"?
            {category.transactionCount > 0 && (
              <span className="block mt-2 text-red-600 font-medium">
                ⚠️ Esta categoria possui {category.transactionCount} transação(ões) vinculada(s).
              </span>
            )}
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
