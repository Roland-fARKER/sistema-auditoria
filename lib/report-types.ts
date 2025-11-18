export interface ComplianceMetrics {
  totalAudits: number
  completedAudits: number
  pendingAudits: number
  complianceScore: number
  riskLevel: "low" | "medium" | "high"
  lastUpdated: string
}

export interface AuditReport {
  id: string
  companyId: string
  companyName: string
  auditType: string
  status: "in-progress" | "completed" | "pending"
  compliancePercentage: number
  findingsCount: number
  criticalIssues: number
  date: string
  auditorName: string
}

export interface ComplianceOverview {
  month: string
  compliant: number
  partial: number
  nonCompliant: number
}

export interface RiskDistribution {
  category: string
  count: number
  percentage: number
}
