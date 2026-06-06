import type { CreatePrototypeDTO } from "../hooks/usePrototypes";
import type { Pagination } from "../utils/pagination.types";
import { api } from "./api";

// ===== TYPES =====
export interface PrototypeProps {
  id: string;
  code: string;
  name: string;
  description: string;
  image?: string;
  stage: string;
  vertical: string;
  projectId: string;
  clientId?: string;
  location?: { state?: string; city?: string };
  areaSize?: number;
  status?: "active" | "disabled",
  createdBy?: string;
  createdAt?: string;
}

export interface PrototypeWithProgress extends PrototypeProps {
  progress: number;
}

export interface PaginatedPrototypesResponse {
  data: PrototypeProps[];
  pagination: Pagination;
}

// ===== GET =====

export const getPrototypes = async (
  params?: {
    limit?: number;
    cursor?: string | null;
    status?: "active" | "disabled";
    projectId?: string;
  }
): Promise<PaginatedPrototypesResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.limit) searchParams.append("limit", String(params.limit));

  if (params?.cursor) searchParams.append("cursor", params.cursor);

  if (params?.status) searchParams.append("status", params.status);

  if (params?.projectId) searchParams.append("projectId", params.projectId);

  const response = await api.get(`/prototypes?${searchParams.toString()}`);
  return response.data;
};

// 🔹 pegar protótipo específico
export const getPrototype = async (prototypeId: string): Promise<PrototypeProps> => {
  const response = await api.get(`/prototypes/${prototypeId}`);
  return response.data;
};

// ===== POST =====

// 🔹 criar protótipo
export const createPrototype = async (
  data: CreatePrototypeDTO
) => {
  const response = await api.post("/prototypes", data);
  return response.data;
};

// ===== PATCH =====

// 🔹 atualizar protótipo
export const updatePrototype = async (
  prototypeId: string,
  data: Partial<PrototypeProps> & {
    addChecklistModelIds?: string[];
    removeChecklistIds?: string[];
  }
) => {
  const response = await api.patch(`/prototypes/${prototypeId}`, data);
  return response.data;
};

// ----- Change status -----
export const changePrototypeStatus = async (id: string, status: "active" | "disabled") => {
  const response = await api.patch(`/prototypes/change-status/${id}`, { status });
  return response.data;
};

// ===== DELETE =====

// 🔹 deletar protótipo
export const deletePrototype = async (prototypeId: string) => {
  const response = await api.delete(`/prototypes/${prototypeId}`);
  return response.data;
};