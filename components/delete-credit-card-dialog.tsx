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

interface CreditCard {
  id: string
  name: string
  bank?: string
  creditLimit: number
  currentBalance: number
  availableLimit: number
  closingDay: number
  dueDay: number
  isActive: boolean
  color: string
}

interface DeleteCreditCardDialogProps {
  card: CreditCard
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteCreditCardDialog({ card, open, onOpenChange }: DeleteCreditCardDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      // Verificar se há saldo pendente
      if (card.currentBalance > 0) {
        toast({
          title: "Não é possível excluir",
          description: `Este cartão possui saldo pendente de ${new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(card.currentBalance)}. Quite o saldo antes de excluir.`,
          variant: "destructive",
        })
        setIsDeleting(false)
        return
      }

      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Cartão excluído",
        description: `O cartão "${card.name}" foi excluído com sucesso.`,
      })

      onOpenChange(false)

      // Recarregar a página para mostrar as mudanças
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      toast({
        title: "Erro ao excluir cartão",
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
          <AlertDialogTitle>Excluir cartão de crédito</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o cartão "{card.name}"?
            {card.currentBalance > 0 && (
              <span className="block mt-2 text-red-600 font-medium">
                ⚠️ Este cartão possui saldo pendente de{" "}
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(card.currentBalance)}
                .
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
