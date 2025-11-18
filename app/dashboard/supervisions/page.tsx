"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { CheckCircle, AlertTriangle, Clock, AlertCircle, Eye, ThumbsUp, ThumbsDown } from "lucide-react"
import type { ApprovalRequest, SupervisionMetrics } from "@/lib/supervision-types"

const MOCK_METRICS: SupervisionMetrics = {
  totalRequests: 45,
  pendingApprovals: 8,
  approvedThisMonth: 12,
  averageReviewTime: 2.5,
  overallApprovalRate: 88,
}

const MOCK_REQUESTS: ApprovalRequest[] = [
  {
    id: "1",
    auditId: "a1",
    auditTitle: "Auditoría de Seguridad IT Q1",
    companyId: "c1",
    companyName: "Empresa A",
    submittedBy: "Juan García",
    submittedByEmail: "juan@empresa-a.com",
    submittedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    requestType: "audit-completion",
    status: "pending",
    assignedTo: "supervisor1",
    assignedToEmail: "supervisor@empresa.com",
    priority: "high",
    description: "Solicitud de aprobación para finalizar la auditoría completada",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    auditId: "a2",
    auditTitle: "Auditoría de Cumplimiento GDPR",
    companyId: "c2",
    companyName: "Empresa B",
    submittedBy: "María López",
    submittedByEmail: "maria@empresa-b.com",
    submittedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    requestType: "findings-review",
    status: "pending",
    assignedTo: "supervisor1",
    assignedToEmail: "supervisor@empresa.com",
    priority: "medium",
    description: "Revisión de hallazgos encontrados durante la auditoría",
    clarificationNeeded: "Se necesita más información sobre los hallazgos de privacidad de datos",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    auditId: "a3",
    auditTitle: "Auditoría de Infraestructura",
    companyId: "c3",
    companyName: "Empresa C",
    submittedBy: "Carlos Martínez",
    submittedByEmail: "carlos@empresa-c.com",
    submittedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    requestType: "report-release",
    status: "approved",
    assignedTo: "supervisor1",
    assignedToEmail: "supervisor@empresa.com",
    priority: "low",
    description: "Solicitud de liberación de informe de auditoría",
    reviewedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedBy: "Supervisor1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export default function SupervisionsPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<ApprovalRequest[]>(MOCK_REQUESTS)
  const [filterStatus, setFilterStatus] = useState("pending")
  const [loading, setLoading] = useState(false)

  const pendingRequests = requests.filter((r) => r.status === "pending")
  const approvedRequests = requests.filter((r) => r.status === "approved")
  const rejectedRequests = requests.filter((r) => r.status === "rejected")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-amber-600" />
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "rejected":
        return <ThumbsDown className="w-4 h-4 text-red-600" />
      case "clarification-required":
        return <AlertCircle className="w-4 h-4 text-amber-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
      approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      "clarification-required": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    }
    return colors[status] || colors.pending
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendiente",
      approved: "Aprobado",
      rejected: "Rechazado",
      "clarification-required": "Requiere Aclaración",
    }
    return labels[status] || status
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    }
    return colors[priority] || colors.low
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Supervisiones</h1>
        <p className="text-muted-foreground mt-2">Flujo de aprobación de auditorías y hallazgos</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Solicitudes</p>
                <p className="text-2xl font-bold text-foreground mt-2">{MOCK_METRICS.totalRequests}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Pendientes</p>
                <p className="text-2xl font-bold text-foreground mt-2">{MOCK_METRICS.pendingApprovals}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Aprobadas Este Mes</p>
                <p className="text-2xl font-bold text-foreground mt-2">{MOCK_METRICS.approvedThisMonth}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Tiempo Promedio</p>
                <p className="text-2xl font-bold text-foreground mt-2">{MOCK_METRICS.averageReviewTime}d</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Tasa Aprobación</p>
                <p className="text-2xl font-bold text-foreground mt-2">{MOCK_METRICS.overallApprovalRate}%</p>
              </div>
              <ThumbsUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {pendingRequests.length > 0 && (
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            Hay {pendingRequests.length} solicitud(es) pendiente(s) de aprobación
          </AlertDescription>
        </Alert>
      )}

      {/* Requests Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            Pendientes ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            Aprobadas ({approvedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            Rechazadas ({rejectedRequests.length})
          </TabsTrigger>
        </TabsList>

        {["pending", "approved", "rejected"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            <div className="grid gap-4">
              {requests
                .filter((r) => r.status === status)
                .map((request) => (
                  <Link key={request.id} href={`/dashboard/supervisions/${request.id}`}>
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {getStatusIcon(request.status)}
                              <h3 className="font-semibold text-foreground">{request.auditTitle}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{request.companyName}</p>
                            <p className="text-sm text-foreground mb-3">{request.description}</p>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>Enviado por: {request.submittedBy}</span>
                              <span>•</span>
                              <span>{new Date(request.submittedDate).toLocaleDateString("es-ES")}</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 text-right">
                            <Badge className={getStatusColor(request.status)}>{getStatusLabel(request.status)}</Badge>
                            <Badge className={getPriorityColor(request.priority)}>
                              {request.priority === "low" ? "Baja" : request.priority === "medium" ? "Media" : "Alta"}
                            </Badge>

                            {status === "pending" && (
                              <Button size="sm" className="mt-2 gap-1" variant="default">
                                <Eye className="w-4 h-4" />
                                Revisar
                              </Button>
                            )}
                          </div>
                        </div>

                        {request.clarificationNeeded && (
                          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg">
                            <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1">
                              Aclaración Necesaria
                            </p>
                            <p className="text-sm text-amber-800 dark:text-amber-300">{request.clarificationNeeded}</p>
                          </div>
                        )}

                        {request.rejectionReason && (
                          <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg">
                            <p className="text-xs font-semibold text-red-900 dark:text-red-200 mb-1">
                              Razón del Rechazo
                            </p>
                            <p className="text-sm text-red-800 dark:text-red-300">{request.rejectionReason}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}

              {requests.filter((r) => r.status === status).length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground text-center">
                      {status === "pending"
                        ? "No hay solicitudes pendientes"
                        : status === "approved"
                          ? "No hay solicitudes aprobadas"
                          : "No hay solicitudes rechazadas"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
