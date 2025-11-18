"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Añadí AlertTitle
import Link from "next/link";
import { Plus, AlertCircle } from "lucide-react";
import type { Audit } from "@/lib/audit-types";
// Importa la función de Firebase
import { getAudits } from "@/lib/firebase-audits"; // Asegúrate de que la ruta sea correcta

export default function AuditsPage() {
  const { user } = useAuth();
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar las auditorías desde Firebase
  const fetchAudits = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      // Llama a la función de Firebase para obtener los datos
      const data = await getAudits();
      setAudits(data);
      console.log(data)
    } catch (err) {
      console.error(err);
      setError(
        "Error al cargar las auditorías. Revisa la consola para más detalles."
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAudits();
  }, [fetchAudits]); // Dependencia de fetchAudits

  // ... (El resto de funciones getStatusColor y getStatusLabel quedan igual) ...
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      "in-progress":
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      review:
        "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return colors[status] || colors.draft;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: "Borrador",
      "in-progress": "En progreso",
      review: "En revisión",
      completed: "Completada",
    };
    return labels[status] || status;
  };

  if (loading) {
    // ... (Tu spinner de carga) ...
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando auditorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Auditorías</h1>
          <p className="text-muted-foreground mt-2">
            {user?.role === "admin"
              ? "Gestiona todas las auditorías"
              : "Tus auditorías asignadas"}
          </p>
        </div>
        {/* Asegúrate de usar Link en el botón */}
        {user?.role === "admin" && (
          <Link href="/dashboard/audits/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nueva Auditoría
            </Button>
          </Link>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* ... (Resto de la lógica de renderizado de tarjetas) ... */}
      {audits.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-center">
              No hay auditorías asignadas
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {audits.map((audit) => (
            <Link key={audit.id} href={`/dashboard/audits/${audit.id}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{audit.title}</CardTitle>
                      <CardDescription>{audit.companyName}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(audit.status)}>
                      {getStatusLabel(audit.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {audit.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {audit.checklist.filter((c) => c.completed).length} de{" "}
                      {audit.checklist.length} tareas completadas
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Vencimiento:{" "}
                      {new Date(audit.dueDate).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
