import { db } from "./firebase"
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDoc
} from "firebase/firestore"

const companiesRef = collection(db, "companies")

// Obtener todas las empresas
export const getCompanies = async () => {
  const snapshot = await getDocs(companiesRef)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

// Obtener una empresa por ID
export const getCompanyById = async (id: string) => {
  const companyDoc = doc(db, "companies", id)
  const snapshot = await getDoc(companyDoc)
  if (!snapshot.exists()) {
    throw new Error("La empresa no existe")
  }
  return { id: snapshot.id, ...snapshot.data() }
}

// Crear nueva empresa
export const createCompany = async (data: any) => {
  const docRef = await addDoc(companiesRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

// Actualizar empresa
export const updateCompany = async (id: string, data: any) => {
  const companyDoc = doc(db, "companies", id)
  await updateDoc(companyDoc, { ...data, updatedAt: serverTimestamp() })
}

// Eliminar empresa
export const deleteCompany = async (id: string) => {
  const companyDoc = doc(db, "companies", id)
  await deleteDoc(companyDoc)
}
