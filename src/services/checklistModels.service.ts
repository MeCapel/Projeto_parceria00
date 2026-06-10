// ===== GERAL IMPORTS =====
import { collection, getDocs, orderBy, query, where, type Timestamp } from "firebase/firestore";
import { api } from "./api";
import { db } from "../firebaseConfig/config";
import type { Pagination } from "../utils/pagination.types";

// ===== INTERFACES =====
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
  normalizedName?: string,

  vertical: string;
  verticalLabel: string;
  
  categories: ChecklistCategory[];
  
  version: number;
  baseModelId: string;

  status: "active" | "disabled",
  
  createdAt?: Date | Timestamp;
  createdBy?: string;
}

export interface PaginatedChecklistModelsResponse {
  data: ChecklistModelProps[];
  pagination: Pagination;
}

// ===== API ENDPOINTS =====

// ----- GET ALL -----
export const getChecklistModels = async (
  params?: {
    limit?: number;
    cursor?: string | null;
    status?: "active" | "disabled";
    vertical?: string;
  }
): Promise<PaginatedChecklistModelsResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.limit) searchParams.append("limit", String(params.limit));

  if (params?.cursor) searchParams.append("cursor", params.cursor);

  if (params?.status) searchParams.append("status", params.status);

  if (params?.vertical) searchParams.append("vertical", params.vertical);

  const response = await api.get(`/checklist-models?${searchParams.toString()}`);
  return response.data;
};

// ----- GET ONE -----
export const getChecklistModel = async (id: string): Promise<ChecklistModelProps> => {
  const response = await api.get(`/checklist-models/${id}`);
  return response.data;
};

// ----- CREATE -----
export const createChecklistModel = async (
  data: { 
    name: string, 
    vertical: string, 
    categories: ChecklistCategory[] 
  } ) => {

  const response = await api.post("/checklist-models", data);
  return response.data;
};

// ----- UPDATE (cria nova versão) -----
export const updateChecklistModel = async (id: string,
  data: Partial<{
    name: string;
    vertical: string;
    categories: ChecklistCategory[];
  }> ) => {

  const response = await api.patch(`/checklist-models/${id}`, data);
  return response.data;
};

// ----- Change status -----
export const changeChecklistModelStatus = async (id: string, status: "active" | "disabled") => {
  const response = await api.patch(`/checklist-models/change-status/${id}`, { status });
  return response.data;
};

// ----- DELETE -----
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