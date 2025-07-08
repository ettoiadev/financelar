"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CurrencyInput } from "@/components/ui/currency-input"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

export default function EditCreditCardPage() {
  const params = useParams()
  const cardId = params.id
  const router = useRouter()
  const { toast } = useToast()

  // Mock data - em produção viria de uma API
  const [formData, setFormData] = useState({
    name: "",
    bank: "",
    creditLimit: 0,
    closingDay: "",
    dueDay: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Simular carregamento dos dados do cartão
  useEffect(() => {
    const loadCardData = async () => {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock data baseado no ID
      const mockCard = {
        name: "Cartão Principal",
        bank: "Banco do Brasil",
        creditLimit: 5000.0,
        closingDay: "15",
        dueDay: "10",
      }

      setFormData(mockCard)
      setIsLoading(false)
    }

    loadCardData()
  }, [cardId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validações
      if (!formData.name.trim()) {
        toast({
          title: "Nome obrigatório",
          description: "Por favor, informe o nome do cartão.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (!formData.closingDay || !formData.dueDay) {
        toast({
          title: "Datas obrigatórias",
          description: "Por favor, informe o dia de fechamento e vencimento.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (formData.creditLimit <= 0) {
        toast({
          title: "Limite inválido",
          description: "Por favor, informe um limite de crédito válido.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Cartão atualizado com sucesso!",
        description: `As informações do cartão "${formData.name}" foram atualizadas.`,
      })

      // Redirecionar para a página de detalhes do cartão
      setTimeout(() => {
        router.push(`/credit-cards/${cardId}`)
      }, 1000)
    } catch (error) {
      toast({
        title: "Erro ao atualizar cartão",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Gerar opções de dias (1-31)
  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1)

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados do cartão...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <Link href={`/credit-cards/${cardId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Cartão de Crédito</h1>
          <p className="text-gray-600">Atualize as informações do seu cartão</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Informações do Cartão</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="name">Nome do Cartão *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Cartão Principal, Nubank, Itaú..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bank">Banco/Instituição</Label>
                  <Input
                    id="bank"
                    value={formData.bank}
                    onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                    placeholder="Ex: Nubank, Itaú, Bradesco..."
                  />
                </div>

                <div>
                  <Label htmlFor="creditLimit">Limite de Crédito *</Label>
                  <CurrencyInput
                    id="creditLimit"
                    value={formData.creditLimit}
                    onChange={(value) => setFormData({ ...formData, creditLimit: value })}
                  />
                </div>

                <div>
                  <Label htmlFor="closingDay">Dia de Fechamento *</Label>
                  <Select
                    value={formData.closingDay}
                    onValueChange={(value) => setFormData({ ...formData, closingDay: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {dayOptions.map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          Dia {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dueDay">Dia de Vencimento *</Label>
                  <Select
                    value={formData.dueDay}
                    onValueChange={(value) => setFormData({ ...formData, dueDay: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {dayOptions.map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          Dia {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Preview do cartão */}
              {formData.name && (
                <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-sm opacity-80">Cartão de Crédito</p>
                      <p className="text-xl font-bold">{formData.name}</p>
                    </div>
                    <CreditCard className="h-8 w-8 opacity-80" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="opacity-80">Limite</p>
                      <p className="font-semibold">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(formData.creditLimit)}
                      </p>
                    </div>
                    <div>
                      <p className="opacity-80">Banco</p>
                      <p className="font-semibold">{formData.bank || "Não informado"}</p>
                    </div>
                    <div>
                      <p className="opacity-80">Fechamento</p>
                      <p className="font-semibold">
                        {formData.closingDay ? `Dia ${formData.closingDay}` : "Não definido"}
                      </p>
                    </div>
                    <div>
                      <p className="opacity-80">Vencimento</p>
                      <p className="font-semibold">{formData.dueDay ? `Dia ${formData.dueDay}` : "Não definido"}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-4 pt-6">
                <Link href={`/credit-cards/${cardId}`} className="flex-1">
                  <Button type="button" variant="outline" className="w-full bg-transparent" disabled={isSubmitting}>
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" className="flex-1 bg-[#007AFF] hover:bg-[#0056CC]" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
