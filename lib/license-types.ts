export interface License {
  id: string
  companyId: string
  name: string
  vendor: string
  licenseType: "perpetual" | "subscription" | "concurrent" | "named-user"
  quantity: number
  purchaseDate: string
  expiryDate: string
  cost: number
  currency: string
  status: "active" | "expiring" | "expired" | "inactive"
  renewalDate?: string
  supportEndDate?: string
  licensee: string
  keyOrIdentifier: string
  notes?: string
  attachments?: string[]
  createdAt: string
  updatedAt: string
}

export interface Warranty {
  id: string
  companyId: string
  assetName: string
  assetType: "hardware" | "software" | "service"
  vendor: string
  purchaseDate: string
  warrantyStartDate: string
  warrantyEndDate: string
  warrantyType: "standard" | "extended" | "premium"
  coverageType: string
  supportLevel: "basic" | "standard" | "premium"
  cost: number
  currency: string
  status: "active" | "expiring" | "expired"
  serialNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface LicenseAlert {
  id: string
  licenseId: string
  type: "expiring-soon" | "expired" | "unused"
  message: string
  daysUntilExpiry: number
  priority: "low" | "medium" | "high"
  acknowledged: boolean
}
