"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuditChecklist } from "@/components/audit/audit-checklist";
import { EvidenceUpload } from "@/components/audit/evidence-upload";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import type { Audit, ChecklistItem, Evidence } from "@/lib/audit-types";
import { getAuditById } from "@/lib/firebase-audits";

export default function AuditDetailPage() {
  const { id } = useParams();


  // Estados para manejar la auditoría, la carga y errores
  const [audit, setAudit] = useState<Audit | null>(null);
  // 🛑 CAMBIO CLAVE: Cargar solo si el ID está disponible
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState<string | null>(null);

  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Función para cargar la auditoría
  const fetchAudit = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAuditById(id);
      if (data) {
        setAudit(data);
      } else {
        setError("Auditoría no encontrada.");
      }
      console.log("Datos de la auditoría:", data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los datos de la auditoría.");
    } finally {
      setLoading(false);
    }
  }, []);

  // En AuditDetailPage.tsx
  useEffect(() => {
    if (id) {
      fetchAudit(id as string);
    }
  }, [id, fetchAudit]);

  // Funciones de manejo
  const handleChecklistUpdate = (items: ChecklistItem[]) => {
    if (!audit) return;
    setAudit({ ...audit, checklist: items });
  };

  const handleSave = async () => {
    if (!audit) return;
    setSaving(true);
    try {
      console.log("Saving audit:", audit);
      setSaving(false);
      alert("Auditoría guardada correctamente.");
    } catch (error) {
      console.error("Save error:", error);
      setSaving(false);
      alert("Error al guardar la auditoría.");
    }
  };

  // Funciones de evidencia
  const handleEvidenceUpload = (evidence: Evidence) => {
    if (!selectedItem || !audit) return;
    const updatedChecklist = audit.checklist.map((item) => {
      if (item.id === selectedItem.id) {
        return { ...item, evidence: [...item.evidence, evidence] };
      }
      return item;
    });
    setAudit({ ...audit, checklist: updatedChecklist });
    setSelectedItem({
      ...selectedItem,
      evidence: [...selectedItem.evidence, evidence],
    });
  };

  const handleDeleteEvidence = async (url: string) => {
    if (!selectedItem || !audit) return;
    try {
      console.log(`Simulando borrado de evidencia con URL: ${url}`);
      const updatedChecklist = audit.checklist.map((item) => {
        if (item.id === selectedItem.id) {
          return {
            ...item,
            evidence: item.evidence.filter((e) => e.url !== url),
          };
        }
        return item;
      });
      setAudit({ ...audit, checklist: updatedChecklist });
      setSelectedItem({
        ...selectedItem,
        evidence: selectedItem.evidence.filter((e) => e.url !== url),
      });
    } catch (error) {
      console.error("Error al eliminar evidencia:", error);
    }
  };

  // --- Renderizado Condicional de Estado ---

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">
          Cargando detalles de la auditoría...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error de carga</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <p className="mt-2 text-sm">ID Solicitado: **{id}**</p>
      </Alert>
    );
  }

  if (!audit) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Encontrada</AlertTitle>
        <AlertDescription>
          La auditoría con ID **{id}** no existe o no pudo ser cargada.
        </AlertDescription>
      </Alert>
    );
  }

  // --- Renderizado Principal ---
  const getStatusLabel = (status: Audit["status"]) => {
    const labels = {
      draft: "Borrador",
      "in-progress": "En Progreso",
      review: "En Revisión",
      completed: "Completada",
    };
    return labels[status] || "Desconocido";
  };

  return (
    <div className="space-y-6">
      <Link href="/dashboard/audits">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Volver a Auditorías
        </Button>
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{audit.title}</h1>
          <p className="text-muted-foreground mt-2">
            {audit.companyName} (ID: {audit.id})
          </p>
        </div>
        <Badge className="text-lg px-3 py-1">
          {getStatusLabel(audit.status)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
              <CardDescription>Detalles de la auditoría</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Descripción
                </p>
                <p className="text-foreground mt-1">{audit.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Inicio
                  </p>
                  <p className="text-foreground mt-1">
                    {new Date(audit.startDate).toLocaleDateString("es-ES")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Vencimiento
                  </p>
                  <p className="text-foreground mt-1">
                    {new Date(audit.dueDate).toLocaleDateString("es-ES")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <AuditChecklist
            items={audit.checklist}
            onUpdate={handleChecklistUpdate}
            onItemSelect={setSelectedItem}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {selectedItem ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {selectedItem.title}
                  </CardTitle>
                  <CardDescription>Tarea seleccionada</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedItem(null)}
                    className="w-full"
                  >
                    Deseleccionar
                  </Button>
                </CardContent>
              </Card>

              <EvidenceUpload
                onUpload={handleEvidenceUpload}
                existingEvidence={selectedItem.evidence}
                onDelete={handleDeleteEvidence}
              />
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground text-center">
                  Selecciona una tarea para añadir evidencia
                </p>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Guardando..." : "Guardar Auditoría"}
          </Button>
        </div>
      </div>
    </div>
  );
}
