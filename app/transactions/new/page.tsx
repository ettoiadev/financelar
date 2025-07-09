"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Receipt, CreditCard, Calendar as CalendarIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CurrencyInput } from "@/components/ui/currency-input"
import { useToast } from "@/components/ui/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { getCategories, getCreditCards, createRecurringTransaction } from "@/lib/database";
import type { Category, CreditCard } from "@/lib/database";

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
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
    const { toast } = useToast();
    const router = useRouter();

    useState(() => {
        const fetchData = async () => {
            const [categoriesData, creditCardsData] = await Promise.all([
                getCategories(),
                getCreditCards()
            ]);
            setCategories(categoriesData);
            setCreditCards(creditCardsData);
        };
        fetchData();
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validations
            if (!formData.title.trim() || formData.amount <= 0 || !formData.categoryId || !formData.paymentMethod || !formData.dueDay || !formData.startDate) {
                toast({
                    title: "Campos obrigatórios",
                    description: "Por favor, preencha todos os campos obrigatórios.",
                    variant: "destructive",
                });
                setIsSubmitting(false);
                return;
            }

            if (formData.paymentMethod === "credit_card" && !formData.creditCardId) {
                toast({
                    title: "Cartão de crédito obrigatório",
                    description: "Por favor, selecione um cartão de crédito.",
                    variant: "destructive",
                });
                setIsSubmitting(false);
                return;
            }

            const newTransaction = await createRecurringTransaction({
                title: formData.title,
                description: formData.description,
                amount: formData.amount,
                category_id: formData.categoryId,
                payment_method: formData.paymentMethod as any,
                credit_card_id: formData.creditCardId || undefined,
                recurrence_type: formData.recurrenceType as any,
                due_day: parseInt(formData.dueDay),
                start_date: formData.startDate.toISOString(),
                end_date: formData.endDate?.toISOString(),
                is_active: true,
                reminder_days: 3,
            });

            if (newTransaction) {
                 toast({
                    title: "Transação criada com sucesso!",
                    description: `A transação "${formData.title}" foi adicionada.`,
                });

                setTimeout(() => {
                    router.push("/transactions");
                }, 1000);
            } else {
                 throw new Error("Failed to create transaction");
            }

        } catch (error) {
            toast({
                title: "Erro ao criar transação",
                description: "Ocorreu um erro inesperado. Tente novamente.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);

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
                                        onValueChange={(value) => setFormData({ ...formData, amount: value || 0 })}
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
                                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
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

                    {/* Detalhes do Pagamento e Recorrência */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <CreditCard className="h-5 w-5" />
                                <span>Pagamento e Recorrência</span>
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
                                            <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                                            <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                                            <SelectItem value="bank_slip">Boleto Bancário</SelectItem>
                                            <SelectItem value="automatic_debit">Débito Automático</SelectItem>
                                            <SelectItem value="pix">PIX</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {formData.paymentMethod === 'credit_card' && (
                                    <div>
                                        <Label htmlFor="creditCardId">Cartão de Crédito *</Label>
                                        <Select
                                            value={formData.creditCardId}
                                            onValueChange={(value) => setFormData({ ...formData, creditCardId: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione um cartão" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {creditCards.map((card) => (
                                                    <SelectItem key={card.id} value={card.id}>
                                                        {card.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                <div>
                                    <Label htmlFor="recurrenceType">Tipo de Recorrência *</Label>
                                    <Select
                                        value={formData.recurrenceType}
                                        onValueChange={(value) => setFormData({ ...formData, recurrenceType: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione a recorrência" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="monthly">Mensal</SelectItem>
                                            <SelectItem value="yearly">Anual</SelectItem>
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
                                                <SelectItem key={day} value={String(day)}>{day}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="startDate">Data de Início *</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn("w-full justify-start text-left font-normal", !formData.startDate && "text-muted-foreground")}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {formData.startDate ? format(formData.startDate, "PPP") : <span>Escolha uma data</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={formData.startDate}
                                                onSelect={(date) => setFormData({ ...formData, startDate: date })}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div>
                                    <Label htmlFor="endDate">Data de Término (Opcional)</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn("w-full justify-start text-left font-normal", !formData.endDate && "text-muted-foreground")}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {formData.endDate ? format(formData.endDate, "PPP") : <span>Escolha uma data</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={formData.endDate}
                                                onSelect={(date) => setFormData({ ...formData, endDate: date })}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end space-x-4">
                        <Link href="/transactions">
                            <Button type="button" variant="outline">Cancelar</Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Salvando..." : "Salvar Transação"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
