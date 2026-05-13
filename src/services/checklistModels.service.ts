import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, where, type Timestamp } from "firebase/firestore";
import { api } from "./api";
import { db } from "../firebaseConfig/config";

export interface ChecklistItem {
  id?: string;
  label: string;
  checked?: boolean;
}

export interface ChecklistCategory {
  id?: string;
  name: string;
  items: ChecklistItem[];
}

export interface ChecklistModelProps {
  id: string;
  name: string;
  vertical: string;
  categories: ChecklistCategory[];
  version: number;
  baseModelId: string;
  createdAt?: Date | Timestamp;
  createdBy?: string;
}

// ----- ESTA FUNÇÃO PEGA TODOS OS MODELOS DE CHECKLIST -----
export const listenChecklistModels = (callback: (items: (ChecklistModelProps & { id: string })[]) => void) => {
    const docRef = collection(db, "checklistModels");
    const q = query(
        docRef,
        orderBy("version", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
        })) as (ChecklistModelProps & { id: string })[];

        callback(data);
    });
} 

// ----- ESTA FUNÇÃO PEGA UM ÚNICO MODELE DE CHECKLIST -----
export const listenChecklistModel = async ( checklistModelId: string ) : Promise<(ChecklistModelProps & { id: string }) | null> => {
    try 
    {
        const docRef = doc(db, "checklistModels", checklistModelId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists())
        {
            console.error("Checklist modelo não encontrada!");
            return null;
        }

        return { 
          ...(docSnap.data() as ChecklistModelProps), 
          id: docSnap.id, 
        };
    }
    catch (err)
    {
        console.error("Erro na tentativa de pegar a checklist modelo: " + err);
        return null;
    }
}

// ================= GET ALL =================
export const getChecklistModels = async (vertical?: string) => {
  const url = vertical
    ? `/checklist-models?vertical=${encodeURIComponent(vertical)}`
    : "/checklist-models";
  const response = await api.get(url);
  return response.data.data || response.data;
};

// ================= GET ONE =================
export const getChecklistModel = async (id: string) => {
  const response = await api.get(`/checklist-models/${id}`);
  return response.data;
};

// ================= CREATE =================
export const createChecklistModel = async (data: {
  name: string;
  vertical: string;
  categories: ChecklistCategory[];
}) => {
  const response = await api.post("/checklist-models", data);
  return response.data;
};

// ================= UPDATE (cria nova versão) =================
export const updateChecklistModel = async (
  id: string,
  data: Partial<{
    name: string;
    vertical: string;
    categories: ChecklistCategory[];
  }>
) => {
  const response = await api.patch(`/checklist-models/${id}`, data);
  return response.data;
};

// ================= DELETE =================
export const deleteChecklistModel = async (id: string) => {
  await api.delete(`/checklist-models/${id}`);
};

// ----- ESTA FUNÇÃO PEGA OS MODELOS DE CHECKLIST DE ACORDO COM A VERTICAL SOLICITADA -----
export const getChecklistsModelByVertical = async (vertical: string) => {
    try
    {
        const docRef = collection(db, "checklistModels");
        const q = query(
            docRef,
            where("vertical", "==", vertical),
            orderBy("version", "desc")
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) return [];
        
        const results = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data()
        })) as (ChecklistModelProps & { id: string })[];

        return results;
    }
    catch (err)
    {
        console.error("Erro na tentativa de pegar a lista de checklists por vertical(P): " + err);
        return [];
    }
}