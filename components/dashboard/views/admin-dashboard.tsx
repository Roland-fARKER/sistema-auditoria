"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Building2, CheckSquare, Users } from "lucide-react"

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Panel Administrativo</h1>
        <p className="text-muted-foreground mt-2">Gestión completa del sistema de auditoría</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Empresas" value="12" icon={Building2} color="bg-blue-500/10" />
        <StatCard title="Auditorías Activas" value="5" icon={CheckSquare} color="bg-green-500/10" />
        <StatCard title="Auditores" value="8" icon={Users} color="bg-purple-500/10" />
        <StatCard title="Reportes" value="23" icon={BarChart3} color="bg-orange-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Auditorías Recientes</CardTitle>
            <CardDescription>Últimas auditorías registradas en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Auditoría #{i}</p>
                    <p className="text-sm text-muted-foreground">Empresa {i}</p>
                  </div>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">En progreso</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Usuarios activos</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tareas pendientes</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cambios hoy</span>
                <span className="font-medium">15</span>
              </div>
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
