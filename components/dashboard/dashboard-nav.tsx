"use client"
import { usePathname } from "next/navigation"

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <div className="border-b border-border">
      <nav className="flex gap-8 px-6 py-4">{/* Navigation items */}</nav>
    </div>
  )
}
