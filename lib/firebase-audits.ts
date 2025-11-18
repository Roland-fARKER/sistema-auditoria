import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Audit } from "./audit-types";
import { useParams } from "next/navigation";

export async function createAudit(audit: any) {
  const auditsRef = collection(db, "audits");

  const doc = await addDoc(auditsRef, {
    ...audit,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return doc.id;
}

export async function getAudits(): Promise<Audit[]> {
  const auditsRef = collection(db, "audits");

  // Opcional: ordenar por fecha de creación o estado
  const q = query(auditsRef, orderBy("createdAt", "desc"));

  try {
    const querySnapshot = await getDocs(q);

    const audits: Audit[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        companyId: data.companyId,
        companyName: data.companyName,
        title: data.title,
        description: data.description,
        status: data.status,
        assignedTo: data.assignedTo,
        assignedToEmail: data.assignedToEmail,
        checklist: data.checklist || [],

        // 🛑 SOLUCIÓN AQUÍ: data.startDate y data.dueDate ya son strings ISO
        startDate: data.startDate || new Date().toISOString(),
        dueDate: data.dueDate || new Date().toISOString(),

        // ✅ MANTENER .toDate() AQUÍ: createdAt y updatedAt sí son Timestamps
        createdAt:
          data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt:
          data.updatedAt?.toDate().toISOString() || new Date().toISOString(),

        supervisorId: data.supervisorId,
        completedDate: data.completedDate,
      } as Audit; // Usar as Audit para asegurar el tipo, aunque es mejor hacer validación de runtime
    });

    return audits;
  } catch (error) {
    console.error("Error al obtener auditorías de Firestore:", error);
    throw new Error("No se pudieron cargar las auditorías.");
  }
}

export async function getAuditById(id: string): Promise<Audit | null> {
  // 🛑 DIAGNÓSTICO: Imprime al inicio de la función
  if (!id) {
    console.log("getAuditById: ID nulo, retornando null.");
    return null;
  }

  console.log(">>> getAuditById INICIADO. ID de URL:", id);
  console.log(
    "Intentando obtener auditoría con DB:",
    db ? "Conectada" : "Fallo de conexión"
  );

  const docRef = doc(db, "audits", id);

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      // Mapeo similar a getAudits(), asegurando la conversión de Timestamp
      return {
        // ✅ RETURN en caso de éxito
        id: docSnap.id,
        companyId: data.companyId,
        companyName: data.companyName,
        title: data.title,
        description: data.description,
        status: data.status,
        assignedTo: data.assignedTo,
        assignedToEmail: data.assignedToEmail,
        checklist: data.checklist || [],

        startDate: data.startDate || new Date().toISOString(),
        dueDate: data.dueDate || new Date().toISOString(),

        createdAt:
          data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt:
          data.updatedAt?.toDate().toISOString() || new Date().toISOString(),

        supervisorId: data.supervisorId,
        completedDate: data.completedDate,
      } as Audit;
    } else {
      console.log("No se encontró la auditoría con ID:", id);
      return null; // ✅ RETURN null si no existe
    }
  } catch (error) {
    console.error("Error al obtener auditoría por ID:", error);
    throw new Error("Error al cargar los detalles de la auditoría."); // Lanza error en caso de fallo
  }
}
