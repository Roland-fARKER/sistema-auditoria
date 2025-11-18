"use client";

import { useEffect, useState } from "react";
import { getCompanies } from "@/lib/companyService";
import { createAudit } from "@/lib/firebase-audits";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
// Importamos el componente de la lista de verificación y los tipos
import { AuditChecklist,} from "@/components/audit/audit-checklist";
import { ChecklistItem } from "@/lib/audit-types";

// Función de utilidad para obtener la fecha de hoy y de una semana después en formato YYYY-MM-DD
const getInitialDates = () => {
  const today = new Date();
  const oneWeekLater = new Date(today.getTime() + 7 * 86400000);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  return {
    startDate: formatDate(today),
    dueDate: formatDate(oneWeekLater),
  };
};

export default function NewAuditPage() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // 1. Nuevos estados para las fechas y el checklist
  const { startDate: initialStartDate, dueDate: initialDueDate } =
    getInitialDates();
  const [startDate, setStartDate] = useState(initialStartDate);
  const [dueDate, setDueDate] = useState(initialDueDate);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    // Puedes agregar ítems iniciales aquí si lo deseas
    {
      id: "1",
      title: "Revisar documentación legal",
      description: "",
      completed: false,
      evidence: [],
    },
    {
      id: "2",
      title: "Verificar cumplimiento de políticas internas",
      description: "",
      completed: false,
      evidence: [],
    },
  ]);

  useEffect(() => {
    async function load() {
      const data = await getCompanies();
      setCompanies(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleCreate = async () => {
    // Asegurarse de que el título, la empresa, y las fechas no estén vacíos
    if (!selectedCompany || !title.trim() || !startDate || !dueDate) {
      alert("Por favor, completa la empresa, el título y las fechas.");
      return;
    }

    const audit = {
      companyId: selectedCompany.id,
      companyName: selectedCompany.name,
      title,
      description,
      assignedTo: user?.uid,
      assignedToEmail: user?.email,
      status: "draft",
      // 2. Incluir el checklist y las fechas en el objeto de la auditoría
      checklist: checklist,
      startDate: new Date(startDate).toISOString(), // Guardar como ISO
      dueDate: new Date(dueDate).toISOString(), // Guardar como ISO
      // completedDate ya no se define aquí, se hace al completar
    };

    try {
      const id = await createAudit(audit);
      alert("Auditoría creada con ID: " + id);
      // Opcional: Redirigir al usuario
    } catch (error) {
      console.error("Error al crear la auditoría:", error);
      alert("Error al crear la auditoría. Por favor, revisa la consola.");
    }
  };

  if (loading) return <p>Cargando empresas...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nueva Auditoría</h1>

      {/* ... Sección de Seleccionar empresa (sin cambios) ... */}
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {companies.map((company) => (
            <div
              key={company.id}
              className={`border p-3 rounded cursor-pointer ${
                selectedCompany?.id === company.id
                  ? "bg-blue-100 border-blue-500"
                  : "bg-muted hover:bg-muted/70"
              }`}
              onClick={() => setSelectedCompany(company)}
            >
              <p className="font-semibold">{company.name}</p>
              <p className="text-sm text-muted-foreground">
                {company.industry}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Datos de auditoría - Agregados campos de fecha y el checklist */}
      {selectedCompany && (
        <Card>
          <CardHeader>
            <CardTitle>Información y Planificación de la Auditoría</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Título y Descripción */}
            <div className="space-y-4">
              <Input
                placeholder="Título de la auditoría"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                placeholder="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Fecha de Inicio
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Fecha de Vencimiento
                </label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Checklist */}
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Lista de Verificación Inicial
              </h3>
              <AuditChecklist
                items={checklist}
                onUpdate={setChecklist} // Usamos el setter de estado
              />
            </div>

            <Button
              onClick={handleCreate}
              disabled={!title.trim() || !startDate || !dueDate}
            >
              Crear Auditoría
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
