import type { Timestamp } from "firebase/firestore";
import { api } from "./api";
import type { Pagination } from "../utils/pagination.types";

// ===== TYPES (matching API) =====
export interface OccurrenceProps {
  id: string;
  name: string;
  description: string;
  criticity: string;
  prototypeId: string;
  image?: string;
  progress: "pendente" | "em andamento" | "concluido";
  actions: string;
  results: string;
  dueOn: Date | null; // Keep as Date for API
  createdBy?: string;
  createdAt?: Date | Timestamp;
}

export interface PaginatedOccurrencesResponse {
  data: OccurrenceProps[];
  pagination: Pagination;
}

// ----- GET ALL -----
export const getOccurrences = async (
  params?: {
    limit?: number;
    cursor?: string | null;
    status?: "active" | "disabled";
    prototypeId?: string;
  }
): Promise<PaginatedOccurrencesResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.limit) searchParams.append("limit", String(params.limit));

  if (params?.cursor) searchParams.append("cursor", params.cursor);

  if (params?.status) searchParams.append("status", params.status);

  if (params?.prototypeId) searchParams.append("prototypeId", params.prototypeId);

  const response = await api.get(`/occurrences?${searchParams.toString()}`);
  return response.data;
};

// ===== GET BY ID =====
export const getOccurrence = async (id: string): Promise<OccurrenceProps | null> => {
  try 
  {
    const res = await api.get(`/occurrences/${id}`);
    return res.data;
  } 
  catch 
  {
    return null;
  }
};

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

// ----- Change status -----
export const changeOccurrenceStatus = async (id: string, status: "active" | "disabled") => {
  const response = await api.patch(`/occurrences/change-status/${id}`, { status });
  return response.data;
};


// ===== DELETE =====
export const deleteOccurrence = async (id: string) => {
  const res = await api.delete(`/occurrences/${id}`);
  return res.data;
};
