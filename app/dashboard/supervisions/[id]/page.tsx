"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { ArrowLeft, CheckCircle } from "lucide-react"
import type { ApprovalRequest } from "@/lib/supervision-types"

const MOCK_REQUEST: ApprovalRequest = {
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
  comments: "Auditoría completada exitosamente sin hallazgos críticos",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export default function SupervisionDetailPage() {
  const params = useParams()
  const [request, setRequest] = useState<ApprovalRequest>(MOCK_REQUEST)
  const [supervisorComment, setSupervisorComment] = useState("")
  const [clarificationText, setClarificationText] = useState("")
  const [rejectionText, setRejectionText] = useState("")
  const [showClarificationForm, setShowClarificationForm] = useState(false)
  const [showRejectionForm, setShowRejectionForm] = useState(false)
  const [processing, setProcessing] = useState(false)

  const handleApprove = async () => {
    setProcessing(true)
    try {
      // In production, update in Firestore
      setRequest({
        ...request,
        status: "approved",
        reviewedDate: new Date().toISOString(),
        reviewedBy: "Current Supervisor",
        comments: supervisorComment,
      })
      setSupervisorComment("")
    } finally {
      setProcessing(false)
    }
  }

  const handleRequestClarification = async () => {
    setProcessing(true)
    try {
      setRequest({
        ...request,
        status: "clarification-required",
        clarificationNeeded: clarificationText,
        comments: supervisorComment,
      })
      setClarificationText("")
      setSupervisorComment("")
      setShowClarificationForm(false)
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    setProcessing(true)
    try {
      setRequest({
        ...request,
        status: "rejected",
        rejectionReason: rejectionText,
        comments: supervisorComment,
      })
      setRejectionText("")
      setSupervisorComment("")
      setShowRejectionForm(false)
    } finally {
      setProcessing(false)
    }
  }

  const isProcessed = request.status !== "pending"

  return (
    <div className="space-y-6">
      <Link href="/dashboard/supervisions">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Volver a Supervisiones
        </Button>
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{request.auditTitle}</h1>
          <p className="text-muted-foreground mt-2">{request.companyName}</p>
        </div>
        <Badge
          className={
            request.status === "pending"
              ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
              : request.status === "approved"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }
        >
          {request.status === "pending"
            ? "Pendiente"
            : request.status === "approved"
              ? "Aprobado"
              : request.status === "clarification-required"
                ? "Requiere Aclaración"
                : "Rechazado"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Solicitud</CardTitle>
              <CardDescription>Información de la auditoría y solicitud</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Tipo de Solicitud</p>
                  <p className="text-foreground mt-1 font-medium">
                    {request.requestType === "audit-completion"
                      ? "Finalización de Auditoría"
                      : request.requestType === "findings-review"
                        ? "Revisión de Hallazgos"
                        : "Liberación de Informe"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Prioridad</p>
                  <p className="text-foreground mt-1 font-medium">
                    {request.priority === "low" ? "Baja" : request.priority === "medium" ? "Media" : "Alta"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Enviado Por</p>
                <p className="text-foreground mt-1">{request.submittedBy}</p>
                <p className="text-sm text-muted-foreground">{request.submittedByEmail}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Descripción</p>
                <p className="text-foreground mt-1">{request.description}</p>
              </div>

              {request.comments && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 rounded-lg">
                  <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 mb-1">Comentarios del Auditor</p>
                  <p className="text-sm text-blue-800 dark:text-blue-300">{request.comments}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {isProcessed && (
            <Card>
              <CardHeader>
                <CardTitle>Revisión Completada</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <p className="font-medium">
                    {request.status === "approved"
                      ? "Solicitud aprobada"
                      : request.status === "rejected"
                        ? "Solicitud rechazada"
                        : "Aclaración requerida"}
                  </p>
                </div>
                {request.reviewedDate && (
                  <p className="text-sm text-muted-foreground">
                    Revisado por {request.reviewedBy} el {new Date(request.reviewedDate).toLocaleDateString("es-ES")}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Approval Actions */}
        {!isProcessed && (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>Esta solicitud requiere tu revisión y aprobación</AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Comentarios de Supervisión</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Añade comentarios adicionales..."
                  value={supervisorComment}
                  onChange={(e) => setSupervisorComment(e.target.value)}
                  className="min-h-24"
                />

                <Button
                  onClick={handleApprove}
                  disabled={processing}
                  className="w-full bg-green-600 hover:bg-green-700 gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {processing ? "Procesando..." : "Aprobar"}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowClarificationForm(!showClarificationForm)}
                  className="w-full"
                >
                  Requerir Aclaración
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => setShowRejectionForm(!showRejectionForm)}
                  className="w-full"
                >
                  Rechazar
                </Button>
              </CardContent>
            </Card>

            {showClarificationForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Requerir Aclaración</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Describe qué necesitas que se aclare..."
                    value={clarificationText}
                    onChange={(e) => setClarificationText(e.target.value)}
                    className="min-h-20"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleRequestClarification}
                      disabled={!clarificationText || processing}
                      size="sm"
                      className="flex-1"
                    >
                      Enviar Aclaración
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowClarificationForm(false)}>
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {showRejectionForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Rechazar Solicitud</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Explica el motivo del rechazo..."
                    value={rejectionText}
                    onChange={(e) => setRejectionText(e.target.value)}
                    className="min-h-20"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleReject}
                      disabled={!rejectionText || processing}
                      size="sm"
                      className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                      Confirmar Rechazo
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowRejectionForm(false)}>
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
