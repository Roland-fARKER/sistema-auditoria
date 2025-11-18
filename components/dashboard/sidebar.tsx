"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  CheckSquare,
  Building2,
  BarChart3,
  FileCheck,
  Users,
  Settings,
  Dices as License,
} from "lucide-react"
import type { UserRole } from "@/lib/auth-context"

interface SidebarProps {
  open: boolean
  role?: UserRole
}

export function Sidebar({ open, role = "user" }: SidebarProps) {
  const pathname = usePathname()

  const navItems = {
    admin: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/companies", label: "Empresas", icon: Building2 },
      { href: "/dashboard/audits", label: "Auditorías", icon: CheckSquare },
      {
        href: "/dashboard/licenses",
        label: "Licencias",
        icon: License,
      },
      {
        href: "/dashboard/supervisions",
        label: "Supervisiones",
        icon: Users,
      },
      {
        href: "/dashboard/users",
        label: 'Usuarios',
        icon: Users
      },
      { href: "/dashboard/reports", label: "Reportes", icon: BarChart3 },
      { href: "/dashboard/settings", label: "Configuración", icon: Settings },
    ],
    supervisor: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/audits", label: "Auditorías", icon: CheckSquare },
      { href: "/dashboard/reports", label: "Reportes", icon: BarChart3 },
      {
        href: "/dashboard/supervisions",
        label: "Supervisiones",
        icon: Users,
      },
    ],
    auditor: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/audits", label: "Mis Auditorías", icon: CheckSquare },
      { href: "/dashboard/licenses", label: "Licencias", icon: License },
      { href: "/dashboard/reports", label: "Reportes", icon: BarChart3 },
    ],
    user: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/licenses", label: "Mis Licencias", icon: License },
      {
        href: "/dashboard/compliance",
        label: "Cumplimiento",
        icon: FileCheck,
      },
    ],
  }

  const items = navItems[role] || navItems.user

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 z-30 lg:translate-x-0",
        !open && "-translate-x-full",
      )}
    >
      <nav className="flex flex-col h-full p-4 space-y-2 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/10",
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
