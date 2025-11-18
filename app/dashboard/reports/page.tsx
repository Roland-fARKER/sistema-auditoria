"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Download, Filter } from "lucide-react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import type { ComplianceOverview, AuditReport, RiskDistribution } from "@/lib/report-types"

const COMPLIANCE_DATA: ComplianceOverview[] = [
  { month: "Ene", compliant: 8, partial: 3, nonCompliant: 1 },
  { month: "Feb", compliant: 9, partial: 2, nonCompliant: 1 },
  { month: "Mar", compliant: 10, partial: 2, nonCompliant: 0 },
  { month: "Abr", compliant: 11, partial: 1, nonCompliant: 0 },
  { month: "May", compliant: 12, partial: 1, nonCompliant: 0 },
  { month: "Jun", compliant: 12, partial: 0, nonCompliant: 0 },
]

const RISK_DATA: RiskDistribution[] = [
  { category: "Bajo", count: 18, percentage: 60 },
  { category: "Medio", count: 8, percentage: 27 },
  { category: "Alto", count: 4, percentage: 13 },
]

const AUDIT_REPORTS: AuditReport[] = [
  {
    id: "1",
    companyId: "c1",
    companyName: "Empresa A",
    auditType: "Seguridad IT",
    status: "completed",
    compliancePercentage: 92,
    findingsCount: 3,
    criticalIssues: 0,
    date: "2024-08-15",
    auditorName: "Juan Pérez",
  },
  {
    id: "2",
    companyId: "c2",
    companyName: "Empresa B",
    auditType: "GDPR",
    status: "in-progress",
    compliancePercentage: 78,
    findingsCount: 8,
    criticalIssues: 2,
    date: "2024-08-10",
    auditorName: "María García",
  },
  {
    id: "3",
    companyId: "c3",
    companyName: "Empresa C",
    auditType: "Infraestructura",
    status: "completed",
    compliancePercentage: 85,
    findingsCount: 5,
    criticalIssues: 1,
    date: "2024-08-05",
    auditorName: "Carlos López",
  },
]

const COLORS = {
  compliant: "var(--color-chart-3)",
  partial: "var(--color-chart-2)",
  nonCompliant: "#ef4444",
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
}

export default function ReportsPage() {
  const { user } = useAuth()
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const completedAudits = AUDIT_REPORTS.filter((r) => r.status === "completed").length
  const inProgressAudits = AUDIT_REPORTS.filter((r) => r.status === "in-progress").length
  const totalAudits = AUDIT_REPORTS.length
  const averageCompliance = Math.round(
    AUDIT_REPORTS.reduce((sum, r) => sum + r.compliancePercentage, 0) / AUDIT_REPORTS.length,
  )

  const filteredReports =
    filterStatus === "all" ? AUDIT_REPORTS : AUDIT_REPORTS.filter((r) => r.status === filterStatus)

  const handleExport = () => {
    console.log("Exporting reports...")
    // In production, generate PDF or CSV
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reportes y Cumplimiento</h1>
          <p className="text-muted-foreground mt-2">Análisis de auditorías y métricas de cumplimiento</p>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" />
          Exportar
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Auditorías Totales</p>
                <p className="text-2xl font-bold text-foreground mt-2">{totalAudits}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Completadas</p>
                <p className="text-2xl font-bold text-foreground mt-2">{completedAudits}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">En Progreso</p>
                <p className="text-2xl font-bold text-foreground mt-2">{inProgressAudits}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <span className="text-amber-600 font-bold">⧖</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Cumplimiento Promedio</p>
                <p className="text-2xl font-bold text-foreground mt-2">{averageCompliance}%</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <span className="text-blue-600 font-bold">%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Cumplimiento</CardTitle>
            <CardDescription>Evolución del estado de cumplimiento últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={COMPLIANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="compliant" stackId="a" fill={COLORS.low} name="Cumpliente" />
                <Bar dataKey="partial" stackId="a" fill={COLORS.medium} name="Parcial" />
                <Bar dataKey="nonCompliant" stackId="a" fill={COLORS.high} name="No Cumpliente" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Riesgos</CardTitle>
            <CardDescription>Clasificación de empresas por nivel de riesgo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={RISK_DATA}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category} (${percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  <Cell fill={COLORS.low} />
                  <Cell fill={COLORS.medium} />
                  <Cell fill={COLORS.high} />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Audit Reports Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Reportes de Auditoría Recientes</CardTitle>
              <CardDescription>Últimas auditorías completadas</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              Filtrar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{report.companyName}</p>
                  <p className="text-sm text-muted-foreground">{report.auditType}</p>
                  <p className="text-xs text-muted-foreground mt-1">Auditor: {report.auditorName}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">{report.compliancePercentage}%</p>
                    <p className="text-xs text-muted-foreground">Cumplimiento</p>
                  </div>

                  <div className="flex gap-2">
                    {report.criticalIssues > 0 && <Badge variant="destructive">{report.criticalIssues} Crítico</Badge>}
                    <Badge
                      className={
                        report.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                      }
                    >
                      {report.status === "completed" ? "Completada" : "En Progreso"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
