"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, Clock, FileCheck } from "lucide-react"

export function AuditorDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mis Auditorías</h1>
        <p className="text-muted-foreground mt-2">Gestiona tus auditorías y tareas asignadas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Auditorías Activas" value="2" icon={CheckSquare} color="bg-blue-500/10" />
        <StatCard title="En Revisión" value="1" icon={Clock} color="bg-amber-500/10" />
        <StatCard title="Completadas" value="8" icon={FileCheck} color="bg-green-500/10" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mis Auditorías</CardTitle>
          <CardDescription>Auditorías asignadas a tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                <p className="font-medium text-foreground">Auditoría #{i}</p>
                <p className="text-sm text-muted-foreground mt-1">Empresa X</p>
                <div className="flex gap-2 mt-3">
                  <span className="text-xs bg-blue-500/10 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
                    En progreso
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
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
