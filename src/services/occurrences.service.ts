import { api } from "./api";

// ===== TYPES (matching API) =====
export interface OccurrenceProps {
  id: string;
  name: string;
  description: string;
  criticity: string;
  prototypeId: string;
  image?: string;
  status: "pendente" | "em andamento" | "concluido";
  dueOn: Date | string; // Keep as Date for API
  createdBy?: string;
  createdAt?: string | Date;
}

// ===== CREATE (requires prototypeId) =====
export const createOccurrence = async (data: Omit<OccurrenceProps, "id">) => {
  const payload = {
    ...data,
    // createdAt is handled by API (server timestamp)
  };
  // Keep dueOn as-is (Date object) for API
  const res = await api.post("/occurrences", payload);
  return res.data;
};

// ===== UPDATE =====
export const updateOccurrence = async (id: string, data: Partial<OccurrenceProps>) => {
  const payload = { ...data };
  const res = await api.patch(`/occurrences/${id}`, payload);
  return res.data;
};

// ===== DELETE =====
export const deleteOccurrence = async (id: string) => {
  const res = await api.delete(`/occurrences/${id}`);
  return res.data;
};

// ===== GET BY ID =====
export const getOccurrence = async (id: string): Promise<OccurrenceProps | null> => {
  try {
    const res = await api.get(`/occurrences/${id}`);
    return res.data;
  } catch {
    return null;
  }
};

// ===== GET BY PROTOTYPE ID =====
export const getPrototypeOccurrences = async (prototypeId: string) => {
  const res = await api.get(`/prototypes/${prototypeId}/occurrences`);
  return res.data.data || res.data; 
};
