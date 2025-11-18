export interface ChecklistItem {
  id: string
  title: string
  description: string
  completed: boolean
  evidence: Evidence[]
  notes?: string
}

export interface Evidence {
  id: string
  filename: string
  url: string
  size: number
  type: string
  uploadedAt: string
  uploadedBy?: string
}

export interface Audit {
  id: string
  companyId: string
  companyName: string
  title: string
  description: string
  status: "draft" | "in-progress" | "review" | "completed"
  assignedTo: string
  assignedToEmail?: string
  checklist: ChecklistItem[]
  startDate: string
  dueDate: string
  completedDate?: string
  createdAt: string
  updatedAt: string
  supervisorId?: string
}
