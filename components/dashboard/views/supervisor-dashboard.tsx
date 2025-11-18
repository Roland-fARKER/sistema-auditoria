"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, Users, AlertCircle } from "lucide-react"

export function SupervisorDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Panel de Supervisor</h1>
        <p className="text-muted-foreground mt-2">Supervisión y validación de auditorías</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Auditorías a Revisar" value="3" icon={AlertCircle} color="bg-amber-500/10" />
        <StatCard title="Aprobadas" value="7" icon={CheckSquare} color="bg-green-500/10" />
        <StatCard title="Auditores" value="5" icon={Users} color="bg-blue-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Auditorías Pendientes de Revisión</CardTitle>
            <CardDescription>Auditorías que requieren tu aprobación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 border border-border rounded-lg">
                  <p className="font-medium text-foreground">Auditoría #{i}</p>
                  <p className="text-sm text-muted-foreground">Auditor: Usuario {i}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equipo</CardTitle>
            <CardDescription>Auditores bajo tu supervisión</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-foreground">Auditor {i}</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Activo</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6 text-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
