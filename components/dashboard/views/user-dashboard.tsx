"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dices as License, FileCheck, AlertCircle } from "lucide-react"

export function UserDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mi Panel</h1>
        <p className="text-muted-foreground mt-2">Información de tus licencias y cumplimiento</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Licencias Activas" value="3" icon={License} color="bg-green-500/10" />
        <StatCard title="Cumplimiento" value="95%" icon={FileCheck} color="bg-blue-500/10" />
        <StatCard title="Alertas" value="1" icon={AlertCircle} color="bg-amber-500/10" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mis Licencias</CardTitle>
          <CardDescription>Estado de tus licencias y garantías</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border border-border rounded-lg">
                <p className="font-medium text-foreground">Licencia #{i}</p>
                <p className="text-sm text-muted-foreground mt-1">Vence: {i > 2 ? "Pronto" : "En curso"}</p>
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
