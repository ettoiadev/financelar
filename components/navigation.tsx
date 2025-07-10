"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, CreditCard, Receipt, PieChart, BarChart3, Calendar, HomeIcon } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Timeline", href: "/timeline", icon: Calendar },
  { name: "Transações", href: "/transactions", icon: Receipt },
  { name: "Cartões", href: "/credit-cards", icon: CreditCard },
  { name: "Categorias", href: "/categories", icon: PieChart },
  { name: "Relatórios", href: "/reports", icon: BarChart3 },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-[#007AFF] shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <HomeIcon className="h-6 w-6 text-white" />
            <span className="text-xl font-bold text-white">FinanceLar</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive ? "bg-white/20 text-white" : "text-white/80 hover:text-white hover:bg-white/10",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white hover:text-white/80">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
