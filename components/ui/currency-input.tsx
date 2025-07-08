"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { formatCurrencyInput } from "@/lib/utils/currency"
import { cn } from "@/lib/utils"

export interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value?: number
  onChange?: (value: number) => void
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value = 0, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState(() => {
      return value > 0 ? formatCurrencyInput((value * 100).toString()) : ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      const formattedValue = formatCurrencyInput(inputValue)
      setDisplayValue(formattedValue)

      // Extrair o valor numérico
      const numericValue = Number.parseFloat(inputValue.replace(/[^\d]/g, "")) / 100 || 0

      onChange?.(numericValue)
    }

    // Atualizar displayValue quando value prop mudar
    React.useEffect(() => {
      if (value === 0) {
        setDisplayValue("")
      } else {
        setDisplayValue(formatCurrencyInput((value * 100).toString()))
      }
    }, [value])

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder="R$ 0,00"
        className={cn(className)}
      />
    )
  },
)
CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }
