"use client"

import { useAuth } from "@/lib/auth-context"
import { AdminDashboard } from "@/components/dashboard/views/admin-dashboard"
import { SupervisorDashboard } from "@/components/dashboard/views/supervisor-dashboard"
import { AuditorDashboard } from "@/components/dashboard/views/auditor-dashboard"
import { UserDashboard } from "@/components/dashboard/views/user-dashboard"
import { OrgChart } from "@/components/company/org-chart"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  const role = user.role || "user"

  switch (role) {
    case "admin":
      return <AdminDashboard />
    case "supervisor":
      return <SupervisorDashboard />
    case "auditor":
      return <AuditorDashboard />
    default:
      return <UserDashboard />
  }
}
