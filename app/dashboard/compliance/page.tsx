"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const complianceData = [
  { month: "Ene", compliance: 65, target: 80 },
  { month: "Feb", compliance: 72, target: 80 },
  { month: "Mar", compliance: 78, target: 80 },
  { month: "Abr", compliance: 82, target: 80 },
  { month: "May", compliance: 85, target: 80 },
  { month: "Jun", compliance: 88, target: 80 },
]

const myCompliances = [
  {
    id: 1,
    name: "Cumplimiento LGPD",
    status: "compliant",
    score: 92,
    lastCheck: "2024-01-15",
  },
  {
    id: 2,
    name: "Cumplimiento ISO 27001",
    status: "compliant",
    score: 85,
    lastCheck: "2024-01-10",
  },
  {
    id: 3,
    name: "Cumplimiento GDPR",
    status: "warning",
    score: 72,
    lastCheck: "2024-01-05",
  },
  {
    id: 4,
    name: "Cumplimiento SOC 2",
    status: "non-compliant",
    score: 45,
    lastCheck: "2024-01-01",
  },
]

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Cumplimiento</h1>
        <p className="text-muted-foreground mt-2">Visualiza tu estado de cumplimiento normativo</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Cumplimiento Promedio</p>
              <p className="text-3xl font-bold text-primary">83%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Normativas Activas</p>
              <p className="text-3xl font-bold text-secondary">4</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Últimas Revisiones</p>
              <p className="text-3xl font-bold text-accent">12 días</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cumplimiento Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Cumplimiento</CardTitle>
          <CardDescription>Evolución del cumplimiento vs. meta</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={complianceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="compliance" fill="var(--color-chart-1)" name="Cumplimiento Actual" />
              <Bar dataKey="target" fill="var(--color-chart-2)" name="Meta" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Compliance List */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Normativas</CardTitle>
          <CardDescription>Cumplimiento de cada normativa regulatoria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myCompliances.map((compliance) => (
              <div
                key={compliance.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{compliance.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Última revisión: {new Date(compliance.lastCheck).toLocaleDateString("es-ES")}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">{compliance.score}%</p>
                  </div>
                  <Badge
                    variant={
                      compliance.status === "compliant"
                        ? "default"
                        : compliance.status === "warning"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {compliance.status === "compliant"
                      ? "Conforme"
                      : compliance.status === "warning"
                        ? "Alerta"
                        : "No Conforme"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
