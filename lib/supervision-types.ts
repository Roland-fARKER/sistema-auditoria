export interface ApprovalRequest {
  id: string
  auditId: string
  auditTitle: string
  companyId: string
  companyName: string
  submittedBy: string
  submittedByEmail: string
  submittedDate: string
  requestType: "audit-completion" | "findings-review" | "report-release" | "exception"
  status: "pending" | "approved" | "rejected" | "clarification-required"
  assignedTo: string
  assignedToEmail: string
  priority: "low" | "medium" | "high"
  description: string
  comments?: string
  attachmentUrls?: string[]
  reviewedDate?: string
  reviewedBy?: string
  rejectionReason?: string
  clarificationNeeded?: string
  createdAt: string
  updatedAt: string
}

export interface SupervisionMetrics {
  totalRequests: number
  pendingApprovals: number
  approvedThisMonth: number
  averageReviewTime: number
  overallApprovalRate: number
}

export interface AuditFinding {
  id: string
  auditId: string
  title: string
  severity: "low" | "medium" | "high" | "critical"
  status: "open" | "in-remediation" | "resolved"
  assignedTo: string
  dueDate: string
  description: string
  remediationPlan?: string
}
