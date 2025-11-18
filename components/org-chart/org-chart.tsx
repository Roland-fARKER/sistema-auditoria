"use client";
import { useEffect, useRef } from "react";
import OrgChart from "@balkangraph/orgchart.js";

export default function OrgChartComponent() {
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!divRef.current) return;

    const chart = new OrgChart(divRef.current, {
      nodes: [
        { id: 1, name: "Ana Trujillo", title: "General Manager", img: "/images/ana.jpg" },
        { id: 2, pid: 1, name: "Anto Moreno", title: "Secretary", img: "/images/anto.jpg" },
        { id: 3, pid: 1, name: "Thomas Hardy", title: "Human Resource Manager", img: "/images/thomas.jpg" },
        // ... resto de jerarquía
      ],
      nodeBinding: {
        field_0: "name",
        field_1: "title",
        img_0: "img",
      },
    });

    return () => {
      if (chart && typeof (chart as any).destroy === "function") {
        (chart as any).destroy();
      }
    };
  }, []);

  return <div ref={divRef} style={{ width: "100%", height: "800px" }} />;
}
