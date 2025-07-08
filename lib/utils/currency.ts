export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function parseCurrency(value: string): number {
  // Remove todos os caracteres que não são dígitos, vírgula ou ponto
  const cleanValue = value.replace(/[^\d,.-]/g, "")

  // Substitui vírgula por ponto para conversão
  const normalizedValue = cleanValue.replace(",", ".")

  // Converte para número
  const numericValue = Number.parseFloat(normalizedValue)

  // Retorna 0 se não for um número válido
  return isNaN(numericValue) ? 0 : numericValue
}

export function formatCurrencyInput(value: string): string {
  // Remove tudo que não é dígito
  const digits = value.replace(/\D/g, "")

  // Se não há dígitos, retorna string vazia
  if (!digits) return ""

  // Converte para número (centavos)
  const cents = Number.parseInt(digits)

  // Converte centavos para reais
  const reais = cents / 100

  // Formata como moeda brasileira
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(reais)
}
