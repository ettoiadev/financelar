export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(date)
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function isValidDay(day: number, month: number, year: number): boolean {
  const daysInMonth = getDaysInMonth(year, month)
  return day >= 1 && day <= daysInMonth
}

export function getNextOccurrence(startDate: Date, dueDay: number, recurrenceType: "monthly" | "yearly"): Date {
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()

  if (recurrenceType === "monthly") {
    // Próxima ocorrência mensal
    let nextMonth = currentMonth
    let nextYear = currentYear

    // Se o dia já passou neste mês, vai para o próximo
    if (today.getDate() > dueDay) {
      nextMonth += 1
      if (nextMonth > 11) {
        nextMonth = 0
        nextYear += 1
      }
    }

    // Ajustar para o último dia do mês se o dia não existir
    const daysInNextMonth = getDaysInMonth(nextYear, nextMonth)
    const adjustedDay = Math.min(dueDay, daysInNextMonth)

    return new Date(nextYear, nextMonth, adjustedDay)
  } else {
    // Próxima ocorrência anual
    let nextYear = currentYear
    const startMonth = startDate.getMonth()

    // Se já passou a data neste ano, vai para o próximo
    if (currentMonth > startMonth || (currentMonth === startMonth && today.getDate() > dueDay)) {
      nextYear += 1
    }

    return new Date(nextYear, startMonth, dueDay)
  }
}

export function calculateNextOccurrences(
  startDate: Date,
  dueDay: number,
  recurrenceType: "monthly" | "yearly",
  count = 12,
): Date[] {
  const occurrences: Date[] = []
  const currentDate = getNextOccurrence(startDate, dueDay, recurrenceType)

  for (let i = 0; i < count; i++) {
    occurrences.push(new Date(currentDate))

    if (recurrenceType === "monthly") {
      currentDate.setMonth(currentDate.getMonth() + 1)
      // Ajustar para o último dia do mês se necessário
      const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())
      if (currentDate.getDate() > daysInMonth) {
        currentDate.setDate(daysInMonth)
      }
    } else {
      currentDate.setFullYear(currentDate.getFullYear() + 1)
    }
  }

  return occurrences
}
