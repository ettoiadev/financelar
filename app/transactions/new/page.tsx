"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CurrencyInput } from "@/components/ui/currency-input"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Receipt, CreditCard } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NewTransactionPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: 0,
    categoryId: "",
    paymentMethod: "",
    creditCardId: "",
    recurrenceType: "monthly",
    dueDay: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Mock data
  const categories = [
    { id: "1", name: "Moradia", color: "#EF4444" },
    { id: "2", name: "Alimentação", color: "#F59E0B" },
    { id: "3", name: "Transporte", color: "#10B981" },
    { id: "4", name: "Saúde", color: "#06B6D4" },
    { id: "5", name: "Educação", color: "#8B5CF6" },
    { id: "6", name: "Lazer", color: "#EC4899" },
    { id: "7", name: "Serviços Digitais", color: "#8B5CF6" },
    { id: "8", name: "Seguros", color: "#84CC16" }
  ]

  const creditCards = [
    { id: "1", name: "Cartão Principal", bank: "Banco do Brasil" },
    { id: "2", name: "Cartão Secundário", bank: "Itaú" },
    { id: "3", name: "Cartão Premium", bank: "Nubank" }
  ]

  const paymentMethods = [
    { value: "credit_card", label: "Cartão de Crédito" },
    { value: "debit_card", label: "Cartão de Débito" },
    { value: "bank_slip", label: "Boleto Bancário" },
    { value: "automatic_debit", label: "Débito Automático" },
    { value: "pix", label: "PIX" }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validações
      if (!formData.title.trim()) {
        toast({
          title: "Título obrigatório",
          description: "Por favor, informe o título da transação.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (formData.amount <= 0) {
        toast({
          title: "Valor inválido",
          description: "Por favor, informe um valor válido.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (!formData.categoryId) {
        toast({
          title: "Categoria obrigatória",
          description: "Por favor, selecione uma categoria.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (!formData.paymentMethod) {
        toast({
          title: "Forma de pagamento obrigatória",
          description: "Por favor, selecione a forma de pagamento.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (formData.paymentMethod === "credit_card" && !formData.creditCardId) {
        toast({
          title: "Cartão obrigatório",
          description: "Por favor, selecione um cartão de crédito.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (!formData.dueDay) {
        toast({
          title: "Dia de vencimento obrigatório",
          description: "Por favor, informe o dia de vencimento.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (!formData.startDate) {
        toast({
          title: "Data de início obrigatória",
          description: "Por favor, selecione a data de início.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Transação criada com sucesso!",
        description: `A transação "${formData.title}" foi adicionada às suas contas recorrentes.`,
      })
      
      // Redirecionar para a página de transações
      setTimeout(() => {
        router.push("/transactions")
      }, 1000)
      
    } catch (error) {
      toast({
        title: "Erro ao criar transação",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Gerar opções de dias (1-31)
  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1)

  const selectedCategory = categories.find(cat => cat.id === formData.categoryId)
  const selectedCreditCard = creditCards.find(card => card.id === formData.creditCardId)

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/transactions">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nova Transação Recorrente</h1>
          <p className="text-gray-600">Adicione uma nova conta recorrente</p>
        </div>
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="h-5 w-5" />
                <span>Informações Básicas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Netflix, Aluguel, Academia..."
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição adicional (opcional)"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="amount">Valor *</Label>
                  <CurrencyInput
                    id="amount"
                    value={formData.amount}
                    onChange={(value) => setFormData({ ...formData, amount: value })}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Forma de pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Forma de Pagamento</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="paymentMethod">Forma de Pagamento *</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData({ ...formData, paymentMethod: value, creditCardId: "" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a forma de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.paymentMethod === "credit_card" && (
                  <div>
                    \
