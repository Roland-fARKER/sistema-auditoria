"use client";

import React, { useEffect, useRef } from "react";
import OrgChart from "@balkangraph/orgchart.js";

// ... (Interfaces de Employee, Department, CompanyData, OrgChartProps)

interface Employee {
  id: string;
  managerId?: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
}

interface Department {
  id: string;
  name: string;
  description: string;
}

interface CompanyData {
  id: string;
  name: string;
  industry: string;
  email: string;
  phone: string;
  employees: Employee[];
  departments: Department[];
}

interface OrgChartProps {
  companyData: CompanyData;
}

const OrgChartComponent: React.FC<OrgChartProps> = ({ companyData }) => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!companyData || !divRef.current) return;

    const employees: Employee[] = companyData.employees || [];
    const nodes = employees.map((emp) => ({
      id: emp.id,
      pid: emp.managerId || null,
      name: emp.name,
      title: `${emp.position} (${emp.department})`,
      email: emp.email,
      phone: emp.phone,
    }));

    // Nodo raíz → empresa
    nodes.push({
      id: companyData.id,
      pid: null,
      name: companyData.name,
      title: companyData.industry,
      email: companyData.email,
      phone: companyData.phone,
    });

    nodes.forEach((n) => {
      if (!n.pid && n.id !== companyData.id) {
        n.pid = companyData.id;
      }
    });

    // ## Personalización de la Plantilla 'vortex'
    OrgChart.templates.vortex = Object.assign({}, OrgChart.templates.ana);
    OrgChart.templates.vortex.size = [250, 100]; // Ajuste a 250 de ancho para el rectángulo
    
    // 1. Redefinir el nodo (rectángulo de fondo)
    OrgChart.templates.vortex.node =
      '<rect x="0" y="0" width="250" height="100" rx="12" ry="12" fill="#1E293B" stroke="#0EA5E9" stroke-width="2"></rect>';
    
    // 2. Redefinir field_0 (para el nombre) usando las coordenadas de tu diseño anterior
    OrgChart.templates.vortex.field_0 = 
        `<text data-width="230" style="font-size: 16px; font-weight:600;" fill="#F8FAFC" x="125" y="40" text-anchor="middle">{val}</text>`;

    // 3. Redefinir field_1 (para el título) usando las coordenadas de tu diseño anterior
    OrgChart.templates.vortex.field_1 = 
        `<text data-width="230" style="font-size: 13px;" fill="#CBD5E1" x="125" y="70" text-anchor="middle">{val}</text>`;
    
    // Aseguramos que no se muestren la imagen y el menú si no los definimos
    OrgChart.templates.vortex.img_0 = ''; 
    OrgChart.templates.vortex.nodeMenuButton = '';

    const chart = new OrgChart(divRef.current, {
      template: "vortex",
      enableDragDrop: false,
      mouseScrool: OrgChart.action.scroll,
      scaleInitial: OrgChart.match.boundary,
      nodes,
      // *** CORRECCIÓN: Usar field_0 y field_1 para el enlace de datos ***
      nodeBinding: {
        field_0: "name",  // Nombre de empleado → field_0
        field_1: "title", // Título/posición → field_1
      },
      // Deshabilitar búsqueda y scroll
 
      enableSearch: false,

    });

    return () => chart.destroy();
  }, [companyData]);

  return (
    <div
      id="orgchart"
      ref={divRef}
      style={{ width: "100%", height: "600px", backgroundColor: "#f8fafc" }}
    ></div>
  );
};

export default OrgChartComponent;