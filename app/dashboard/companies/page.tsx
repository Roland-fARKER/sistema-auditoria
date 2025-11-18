"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, AlertCircle, TrendingUp } from "lucide-react";
import { getCompanies, createCompany } from "@/lib/companyService";
import { CompanyFormDialog } from "@/components/company/CompanyFormDialog";

export default function CompaniesPage() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data);
      } catch (err: any) {
        setError("Error al cargar empresas.");
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  const handleNewCompany = async () => {
    const name = prompt("Nombre de la empresa:");
    if (!name) return;

    try {
      await createCompany({
        name,
        industry: "Por definir",
        location: "Desconocida",
        riskLevel: "low",
        complianceStatus: "compliant",
      });
      alert("Empresa creada correctamente");
      const data = await getCompanies();
      setCompanies(data);
    } catch (err) {
      setError("Error al crear la empresa.");
    }
  };

  const getRiskColor = (level: string) => {
    const colors: Record<string, string> = {
      low: "bg-green-100 text-green-800",
      medium: "bg-amber-100 text-amber-800",
      high: "bg-red-100 text-red-800",
    };
    return colors[level] || colors.low;
  };

  const getComplianceColor = (status: string) => {
    const colors: Record<string, string> = {
      compliant: "bg-green-100 text-green-800",
      partial: "bg-amber-100 text-amber-800",
      "non-compliant": "bg-red-100 text-red-800",
    };
    return colors[status] || colors.compliant;
  };

  if (loading)
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Cargando empresas...</p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Empresas</h1>
          <p className="text-muted-foreground">Gestión de empresas</p>
        </div>
        {user?.role === "admin" && (
          <CompanyFormDialog
            onCreated={async () => {
              const data = await getCompanies();
              setCompanies(data);
            }}
          />
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {companies.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-muted-foreground">
            No hay empresas registradas
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companies.map((company) => (
            <Link key={company.id} href={`/dashboard/companies/${company.id}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{company.name}</CardTitle>
                      <CardDescription>{company.industry}</CardDescription>
                    </div>
                    <Badge className={getRiskColor(company.riskLevel)}>
                      Riesgo {company.riskLevel}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 border-t pt-2 mt-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <Badge
                      className={getComplianceColor(company.complianceStatus)}
                    >
                      {company.complianceStatus === "compliant"
                        ? "Cumpliente"
                        : company.complianceStatus === "partial"
                        ? "Parcial"
                        : "No Cumpliente"}
                    </Badge>
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
