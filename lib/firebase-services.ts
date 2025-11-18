import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore"
import { db, auth } from "./firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"

export type UserRole = "admin" | "supervisor" | "auditor" | "user"

// ============ USERS SERVICE ============
export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  department?: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}

export const usersService = {
  async createUser(email: string, password: string, userData: Omit<User, "id" | "createdAt" | "updatedAt">) {
    try {
      // Create auth user
      const authUser = await createUserWithEmailAndPassword(auth, email, password)

      // Create user document
      const userDoc = {
        ...userData,
        email,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }

      await updateDoc(doc(db, "users", authUser.user.uid), userDoc)

      return { id: authUser.user.uid, ...userDoc }
    } catch (error) {
      throw error
    }
  },

  async updateUser(userId: string, userData: Partial<Omit<User, "id" | "createdAt">>) {
    try {
      const userRef = doc(db, "users", userId)
      await updateDoc(userRef, {
        ...userData,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      throw error
    }
  },

  async deleteUser(userId: string) {
    try {
      await deleteDoc(doc(db, "users", userId))
    } catch (error) {
      throw error
    }
  },

  async getUser(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, "users", userId))
      if (!userDoc.exists()) return null
      return { id: userDoc.id, ...userDoc.data() } as User
    } catch (error) {
      throw error
    }
  },

  async getAllUsers(): Promise<User[]> {
    try {
      const snapshot = await getDocs(collection(db, "users"))
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as User)
    } catch (error) {
      throw error
    }
  },
}

// ============ AUDITS SERVICE ============
export interface Audit {
  id: string
  title: string
  company: string
  auditType: string
  status: "pendiente" | "en_progreso" | "completado" | "cancelado"
  progress: number
  startDate: Date
  endDate?: Date
  assignedTo: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export const auditsService = {
  async createAudit(auditData: Omit<Audit, "id" | "createdAt" | "updatedAt">) {
    try {
      const docRef = await addDoc(collection(db, "audits"), {
        ...auditData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      return { id: docRef.id, ...auditData }
    } catch (error) {
      throw error
    }
  },

  async updateAudit(auditId: string, auditData: Partial<Omit<Audit, "id" | "createdAt">>) {
    try {
      const auditRef = doc(db, "audits", auditId)
      await updateDoc(auditRef, {
        ...auditData,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      throw error
    }
  },

  async deleteAudit(auditId: string) {
    try {
      await deleteDoc(doc(db, "audits", auditId))
    } catch (error) {
      throw error
    }
  },

  async getAudit(auditId: string): Promise<Audit | null> {
    try {
      const auditDoc = await getDoc(doc(db, "audits", auditId))
      if (!auditDoc.exists()) return null
      return { id: auditDoc.id, ...auditDoc.data() } as Audit
    } catch (error) {
      throw error
    }
  },

  async getAllAudits(): Promise<Audit[]> {
    try {
      const snapshot = await getDocs(collection(db, "audits"))
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Audit)
    } catch (error) {
      throw error
    }
  },

  async getAuditsByAssignee(userId: string): Promise<Audit[]> {
    try {
      const q = query(collection(db, "audits"), where("assignedTo", "==", userId))
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Audit)
    } catch (error) {
      throw error
    }
  },
}

// ============ COMPANIES SERVICE ============
export interface Company {
  id: string
  name: string
  industry: string
  location: string
  riskLevel: "bajo" | "medio" | "alto"
  employees: number
  complianceStatus: number
  lastAuditDate?: Date
  createdAt: Date
  updatedAt: Date
}

export const companiesService = {
  async createCompany(companyData: Omit<Company, "id" | "createdAt" | "updatedAt">) {
    try {
      const docRef = await addDoc(collection(db, "companies"), {
        ...companyData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      return { id: docRef.id, ...companyData }
    } catch (error) {
      throw error
    }
  },

  async updateCompany(companyId: string, companyData: Partial<Omit<Company, "id" | "createdAt">>) {
    try {
      const companyRef = doc(db, "companies", companyId)
      await updateDoc(companyRef, {
        ...companyData,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      throw error
    }
  },

  async deleteCompany(companyId: string) {
    try {
      await deleteDoc(doc(db, "companies", companyId))
    } catch (error) {
      throw error
    }
  },

  async getCompany(companyId: string): Promise<Company | null> {
    try {
      const companyDoc = await getDoc(doc(db, "companies", companyId))
      if (!companyDoc.exists()) return null
      return { id: companyDoc.id, ...companyDoc.data() } as Company
    } catch (error) {
      throw error
    }
  },

  async getAllCompanies(): Promise<Company[]> {
    try {
      const snapshot = await getDocs(collection(db, "companies"))
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Company)
    } catch (error) {
      throw error
    }
  },
}

// ============ LICENSES SERVICE ============
export interface License {
  id: string
  name: string
  vendor: string
  type: "software" | "hardware"
  quantity: number
  expiryDate: Date
  status: "activo" | "por_vencer" | "vencido"
  cost: number
  company: string
  createdAt: Date
  updatedAt: Date
}

export const licensesService = {
  async createLicense(licenseData: Omit<License, "id" | "createdAt" | "updatedAt">) {
    try {
      const docRef = await addDoc(collection(db, "licenses"), {
        ...licenseData,
        expiryDate: Timestamp.fromDate(new Date(licenseData.expiryDate)),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      return { id: docRef.id, ...licenseData }
    } catch (error) {
      throw error
    }
  },

  async updateLicense(licenseId: string, licenseData: Partial<Omit<License, "id" | "createdAt">>) {
    try {
      const licenseRef = doc(db, "licenses", licenseId)
      const updateData: any = { ...licenseData, updatedAt: Timestamp.now() }
      if (licenseData.expiryDate) {
        updateData.expiryDate = Timestamp.fromDate(new Date(licenseData.expiryDate))
      }
      await updateDoc(licenseRef, updateData)
    } catch (error) {
      throw error
    }
  },

  async deleteLicense(licenseId: string) {
    try {
      await deleteDoc(doc(db, "licenses", licenseId))
    } catch (error) {
      throw error
    }
  },

  async getLicense(licenseId: string): Promise<License | null> {
    try {
      const licenseDoc = await getDoc(doc(db, "licenses", licenseId))
      if (!licenseDoc.exists()) return null
      return { id: licenseDoc.id, ...licenseDoc.data() } as License
    } catch (error) {
      throw error
    }
  },

  async getAllLicenses(): Promise<License[]> {
    try {
      const snapshot = await getDocs(collection(db, "licenses"))
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as License)
    } catch (error) {
      throw error
    }
  },
}
