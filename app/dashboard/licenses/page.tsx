"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Plus, AlertTriangle, Clock, CheckCircle, AlertCircle } from "lucide-react"
import type { License, Warranty } from "@/lib/license-types"

export default function LicensesPage() {
  const { user } = useAuth()
  const [licenses, setLicenses] = useState<License[]>([])
  const [warranties, setWarranties] = useState<Warranty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulated data - in production, fetch from Firestore
    const mockLicenses: License[] = [
      {
        id: "1",
        companyId: "c1",
        name: "Microsoft Office 365",
        vendor: "Microsoft",
        licenseType: "subscription",
        quantity: 50,
        purchaseDate: "2023-01-15",
        expiryDate: "2025-01-15",
        cost: 12.5,
        currency: "EUR",
        status: "active",
        renewalDate: "2024-12-15",
        supportEndDate: "2025-01-15",
        licensee: "Empresa A S.L.",
        keyOrIdentifier: "MS-OFF-365-001",
        notes: "Subscription para 50 usuarios",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        companyId: "c1",
        name: "Adobe Creative Cloud",
        vendor: "Adobe",
        licenseType: "subscription",
        quantity: 10,
        purchaseDate: "2024-03-20",
        expiryDate: "2025-03-20",
        cost: 54.99,
        currency: "EUR",
        status: "active",
        licensee: "Empresa A S.L.",
        keyOrIdentifier: "ADOBE-CC-001",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        companyId: "c1",
        name: "Acrobat Pro",
        vendor: "Adobe",
        licenseType: "subscription",
        quantity: 5,
        purchaseDate: "2023-06-10",
        expiryDate: "2024-09-10",
        cost: 14.99,
        currency: "EUR",
        status: "expiring",
        licensee: "Empresa A S.L.",
        keyOrIdentifier: "ADOBE-AC-001",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    const mockWarranties: Warranty[] = [
      {
        id: "w1",
        companyId: "c1",
        assetName: "Servidores Dell PowerEdge",
        assetType: "hardware",
        vendor: "Dell",
        purchaseDate: "2022-08-15",
        warrantyStartDate: "2022-08-15",
        warrantyEndDate: "2025-08-15",
        warrantyType: "extended",
        coverageType: "24x7 On-Site",
        supportLevel: "premium",
        cost: 5000,
        currency: "EUR",
        status: "active",
        serialNumber: "DELL-SRV-001",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "w2",
        companyId: "c1",
        assetName: "Firewall Fortinet",
        assetType: "hardware",
        vendor: "Fortinet",
        purchaseDate: "2021-11-20",
        warrantyStartDate: "2021-11-20",
        warrantyEndDate: "2024-11-20",
        warrantyType: "standard",
        coverageType: "Service & Support",
        supportLevel: "standard",
        cost: 2000,
        currency: "EUR",
        status: "expiring",
        serialNumber: "FORT-FW-001",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    setLicenses(mockLicenses)
    setWarranties(mockWarranties)
    setLoading(false)
  }, [user])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "expiring":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />
      case "expired":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: "Activo",
      expiring: "Próximo a vencer",
      expired: "Vencido",
      inactive: "Inactivo",
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      expiring: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
      expired: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    }
    return colors[status] || colors.inactive
  }

  const expiringLicenses = licenses.filter((l) => l.status === "expiring").length
  const expiredLicenses = licenses.filter((l) => l.status === "expired").length
  const expiringWarranties = warranties.filter((w) => w.status === "expiring").length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando licencias...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Licencias y Garantías</h1>
          <p className="text-muted-foreground mt-2">Gestión de licencias de software y garantías de activos</p>
        </div>
        {user?.role === "admin" && (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Agregar
          </Button>
        )}
      </div>

      {/* Alerts */}
      {(expiringLicenses > 0 || expiredLicenses > 0 || expiringWarranties > 0) && (
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            {expiringLicenses} licencias próximas a vencer, {expiredLicenses} licencias vencidas y {expiringWarranties}{" "}
            garantías próximas a vencer
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="licenses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="licenses">Licencias ({licenses.length})</TabsTrigger>
          <TabsTrigger value="warranties">Garantías ({warranties.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="licenses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Licencias</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{licenses.length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Próximas a Vencer</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{expiringLicenses}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-amber-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Vencidas</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{expiredLicenses}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Licencias Registradas</CardTitle>
              <CardDescription>Todas las licencias de software</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {licenses.map((license) => (
                  <Link key={license.id} href={`/dashboard/licenses/${license.id}`}>
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(license.status)}
                          <div>
                            <p className="font-medium text-foreground">{license.name}</p>
                            <p className="text-sm text-muted-foreground">{license.vendor}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Cantidad: {license.quantity} • {license.licenseType}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">
                            {new Date(license.expiryDate).toLocaleDateString("es-ES")}
                          </p>
                          <p className="text-xs text-muted-foreground">Vencimiento</p>
                        </div>
                        <Badge className={getStatusColor(license.status)}>{getStatusLabel(license.status)}</Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warranties" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Garantías</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{warranties.length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Activas</p>
                    <p className="text-2xl font-bold text-foreground mt-2">
                      {warranties.filter((w) => w.status === "active").length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Próximas a Vencer</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{expiringWarranties}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-amber-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Garantías Registradas</CardTitle>
              <CardDescription>Todas las garantías de activos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {warranties.map((warranty) => (
                  <div
                    key={warranty.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(warranty.status)}
                        <div>
                          <p className="font-medium text-foreground">{warranty.assetName}</p>
                          <p className="text-sm text-muted-foreground">{warranty.vendor}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {warranty.assetType} • {warranty.warrantyType}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {new Date(warranty.warrantyEndDate).toLocaleDateString("es-ES")}
                        </p>
                        <p className="text-xs text-muted-foreground">Vencimiento</p>
                      </div>
                      <Badge className={getStatusColor(warranty.status)}>{getStatusLabel(warranty.status)}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
