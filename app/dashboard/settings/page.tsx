"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground mt-2">Administra los ajustes del sistema</p>
      </div>

      <div className="grid gap-6">
        {/* Sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Preferencias del Sistema</CardTitle>
            <CardDescription>Configuración general de la aplicación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Tema Oscuro</p>
                <p className="text-sm text-muted-foreground">Activar tema oscuro en la aplicación</p>
              </div>
              <Button variant={isDarkMode ? "default" : "outline"} onClick={() => setIsDarkMode(!isDarkMode)}>
                {isDarkMode ? "Activado" : "Desactivado"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
            <CardDescription>Configura cómo recibes notificaciones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Email de Notificaciones</label>
              <Input type="email" placeholder="correo@empresa.com" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Frecuencia de Reportes</label>
              <select className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-background text-foreground">
                <option>Diaria</option>
                <option>Semanal</option>
                <option>Mensual</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Sistema de Auditoría */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Auditoría</CardTitle>
            <CardDescription>Ajustes para el sistema de auditoría</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Días para Vencimiento de Auditoría</label>
              <Input type="number" placeholder="90" className="mt-2" defaultValue="90" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Nivel de Cumplimiento Mínimo (%)</label>
              <Input type="number" placeholder="70" className="mt-2" defaultValue="70" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
