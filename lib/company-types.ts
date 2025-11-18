export interface Employee {
  id: string
  name: string
  email: string
  role: string
  department: string
  managerId?: string
  position: string
  joinDate: string
  phone?: string
}

export interface Department {
  id: string
  name: string
  description: string
  managerId: string
  employees: Employee[]
}

export interface Company {
  id: string
  name: string
  legalName: string
  industry: string
  location: string
  phone: string
  email: string
  website?: string
  taxId: string
  foundedYear: number
  employees: Employee[]
  departments: Department[]
  riskLevel: "low" | "medium" | "high"
  lastAuditDate?: string
  complianceStatus: "compliant" | "partial" | "non-compliant"
  createdAt: string
  updatedAt: string
}
