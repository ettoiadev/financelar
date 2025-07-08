"use client"

import { Button } from "@/components/ui/button"
import { DeleteCreditCardDialog } from "./delete-credit-card-dialog"
import { Edit, Trash2, Eye } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

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

interface CreditCardActionsProps {
  card: CreditCard
}

export function CreditCardActions({ card }: CreditCardActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <>
      <div className="flex space-x-2">
        <Link href={`/credit-cards/${card.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
        </Link>

        <Link href={`/credit-cards/${card.id}/edit`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <DeleteCreditCardDialog card={card} open={showDeleteDialog} onOpenChange={setShowDeleteDialog} />
    </>
  )
}
