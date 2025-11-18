"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCompanyById, updateCompany } from "@/lib/companyService";
import OrgChartComponent from "@/components/company/org-chart";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Import } from "lucide-react";

export default function CompanyDetailPage() {
  const { id } = useParams();
  const [company, setCompany] = useState<any>({
    name: "",
    employees: [],
    departments: [],
  });

  const [loading, setLoading] = useState(true);
  const [newDepartment, setNewDepartment] = useState<any>({});
  const [newEmployee, setNewEmployee] = useState<any>({});

  // 🔹 Cargar la empresa desde Firestore
  useEffect(() => {
    const loadCompany = async () => {
      try {
        const data: any = await getCompanyById(id as string);
        setCompany({
          ...data,
          employees: data.employees || [],
          departments: data.departments || [],
        });
        console.log(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadCompany();
  }, [id]);

  // 🔹 Agregar departamento
  const handleAddDepartment = () => {
    if (!newDepartment.name) return;

    const department = {
      id: crypto.randomUUID(),
      name: newDepartment.name,
      description: newDepartment.description || "",
    };

    setCompany((prev: any) => ({
      ...prev,
      departments: [...(prev.departments || []), department],
    }));

    setNewDepartment({});
  };

  // 🔹 Agregar empleado
  const handleAddEmployee = () => {
    if (!newEmployee.name) return;

    const employee = {
      id: crypto.randomUUID(),
      name: newEmployee.name,
      position: newEmployee.position || "",
      department: newEmployee.department || "",
      managerId: newEmployee.managerId || "",
      email: newEmployee.email || "",
      phone: newEmployee.phone || "",
    };

    setCompany((prev: any) => ({
      ...prev,
      employees: [...(prev.employees || []), employee],
    }));

    setNewEmployee({});
  };

  // 🔹 Guardar cambios en Firestore
  const handleSaveChanges = async () => {
    try {
      await updateCompany(id as string, {
        ...company,
        updatedAt: new Date(),
      });
      alert("Cambios guardados correctamente ✅");
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Error al guardar los cambios ❌");
    }
  };

  if (loading) return <p className="text-center py-10">Cargando empresa...</p>;

  return (
    <div className="space-y-8 p-6">
      {/* 🏢 Información general */}
      <Card>
        <CardHeader>
          <CardTitle>{company.name || "Detalle de Empresa"}</CardTitle>
          <CardDescription>Gestiona departamentos y empleados</CardDescription>
        </CardHeader>
      </Card>

      {/* 🧩 Agregar Departamento */}
      <Card>
        <CardHeader>
          <CardTitle>Agregar Departamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Nombre del departamento"
            value={newDepartment.name || ""}
            onChange={(e) =>
              setNewDepartment({ ...newDepartment, name: e.target.value })
            }
          />
          <Input
            placeholder="Descripción"
            value={newDepartment.description || ""}
            onChange={(e) =>
              setNewDepartment({
                ...newDepartment,
                description: e.target.value,
              })
            }
          />
          <Button onClick={handleAddDepartment}>Agregar Departamento</Button>

          {company.departments?.length > 0 && (
            <ul className="mt-4 space-y-1">
              {company.departments.map((dept: any) => (
                <li
                  key={dept.id}
                  className="text-sm text-muted-foreground border-b pb-1"
                >
                  {dept.name} {dept.description && `- ${dept.description}`}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* 👥 Agregar Empleado */}
      <Card>
        <CardHeader>
          <CardTitle>Agregar Empleado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Nombre"
              value={newEmployee.name || ""}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, name: e.target.value })
              }
            />
            <Input
              placeholder="Puesto"
              value={newEmployee.position || ""}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, position: e.target.value })
              }
            />

            <select
              className="border rounded-md p-2"
              value={newEmployee.department || ""}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, department: e.target.value })
              }
            >
              <option value="">Seleccionar departamento</option>
              {company.departments?.map((dept: any) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>

            <select
              className="border rounded-md p-2"
              value={newEmployee.managerId || ""}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, managerId: e.target.value })
              }
            >
              <option value="">Sin jefe directo</option>
              {company.employees?.map((emp: any) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>

            <Input
              placeholder="Correo"
              value={newEmployee.email || ""}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, email: e.target.value })
              }
            />
            <Input
              placeholder="Teléfono"
              value={newEmployee.phone || ""}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, phone: e.target.value })
              }
            />
          </div>

          <Button onClick={handleAddEmployee}>Agregar Empleado</Button>

          {company.employees?.length > 0 && (
            <ul className="mt-4 space-y-2">
              {company.employees.map((emp: any) => (
                <li key={emp.id} className="border p-2 rounded-md">
                  <p className="font-medium">{emp.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {emp.position} {emp.department && `(${emp.department})`}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <OrgChartComponent companyData={company} />

      {/* 💾 Guardar cambios */}
      <div className="flex justify-end">
        <Button onClick={handleSaveChanges}>Guardar Cambios</Button>
      </div>
    </div>
  );
}
