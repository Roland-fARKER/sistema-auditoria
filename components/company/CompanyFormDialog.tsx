"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createCompany } from "@/lib/companyService";
import { Plus } from "lucide-react";

const companySchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  legalName: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Correo inválido").optional(),
  website: z.string().url("URL inválida").optional(),
  taxId: z.string().optional(),
  foundedYear: z.coerce.number().optional(),
  riskLevel: z.enum(["low", "medium", "high"]).default("low"),
  complianceStatus: z
    .enum(["compliant", "partial", "non-compliant"])
    .default("compliant"),
});

type CompanyFormData = z.infer<typeof companySchema>;

export function CompanyFormDialog({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      riskLevel: "low",
      complianceStatus: "compliant",
    },
  });

  const onSubmit = async (data: CompanyFormData) => {
    setLoading(true);
    try {
      await createCompany(data);
      reset();
      setOpen(false);
      onCreated?.();
    } catch (error) {
      console.error("Error al crear empresa:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Nueva Empresa
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Crear Nueva Empresa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <Label>Nombre *</Label>
            <Input placeholder="Ej. Vortex Solutions" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label>Nombre Legal</Label>
            <Input
              placeholder="Ej. Vortex Solutions S.A."
              {...register("legalName")}
            />
          </div>

          <div className="flex gap-5">
            <div>
              <Label>Industria</Label>
              <Input placeholder="Ej. Tecnología" {...register("industry")} />
            </div>

            <div>
              <Label>Ubicación</Label>
              <Input
                placeholder="Ej. Managua, Nicaragua"
                {...register("location")}
              />
            </div>
          </div>

          <div>
            <Label>Teléfono</Label>
            <Input placeholder="+505 8888 8888" {...register("phone")} />
          </div>

          <div>
            <Label>Correo</Label>
            <Input placeholder="contacto@empresa.com" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label>Sitio Web</Label>
            <Input placeholder="https://empresa.com" {...register("website")} />
          </div>

          <div className="flex gap-5">
            <div>
              <Label>RUC / Tax ID</Label>
              <Input placeholder="A12345678" {...register("taxId")} />
            </div>

            <div>
              <Label>Año de Fundación</Label>
              <Input
                type="number"
                placeholder="2010"
                {...register("foundedYear")}
              />
            </div>
          </div>

          <div className="flex gap-4 w-40">
            <Button type="submit" disabled={loading}  className="w-full">
              {loading ? "Guardando..." : "Guardar"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
