import type { Timestamp } from "firebase/firestore";
import { api } from "./api";

// ===== TYPES =====

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface ChecklistCategory {
  id: string;
  name: string;
  items: ChecklistItem[];
}

export interface ChecklistInstance {
  id: string;
  name: string;
  vertical: string;
  version: number;
  categories: ChecklistCategory[];

  prototypeId: string;
  originalModelId?: string;

  createdAt?: Date | Timestamp;
}

// ===== GET =====

// todas as checklists do protótipo
export const getPrototypeChecklists = async (prototypeId: string) => {
  const res = await api.get(`/prototypes/${prototypeId}/checklists`);
  return res.data.data || res.data;
};

// ===== POST =====

export const createChecklistInstance = async (
  prototypeId: string,
  checklistModelIds: string[]
) => {
  const res = await api.post(
    `/prototypes/${prototypeId}/checklists`,
    { checklistModelIds }
  );

  return res.data;
};

// ===== PATCH (toggle itens) =====

export const updateChecklistInstance = async (
  prototypeId: string,
  checklistId: string,
  categories: ChecklistCategory[]
) => {
  const res = await api.patch(
    `/prototypes/${prototypeId}/checklists/${checklistId}`,
    { categories }
  );    

  return res.data;
};

// ===== DELETE =====

export const deleteChecklistInstance = async (
  prototypeId: string,
  checklistId: string
) => {
  const res = await api.delete(
    `/prototypes/${prototypeId}/checklists/${checklistId}`
  );

  return res.data;
};