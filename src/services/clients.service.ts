import type { Pagination } from "../utils/pagination.types";
import { api } from "./api";

// ===== TYPES =====
export interface ClientProps {
  id: string;
  name: string;
  clientFone: string;
  revend: string;
  revendFone: string;
  state: string;
  city: string;
  area: string;
  status?: "active" | "disabled"
  createdBy?: string;
  createdAt?: string;
}

export interface PaginatedChecklistModelsResponse {
  data: ClientProps[];
  pagination: Pagination;
}

// ===== GET =====

// listar clientes
export const getClients = async (
  params?: {
    limit?: number;
    cursor?: string | null;
    status?: "active" | "disabled";
  }
): Promise<PaginatedChecklistModelsResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.limit) searchParams.append("limit", String(params.limit));

  if (params?.cursor) searchParams.append("cursor", params.cursor);

  if (params?.status) searchParams.append("status", params.status);


  const response = await api.get(`/clients?${searchParams.toString()}`);
  return response.data;
};

// pegar cliente por id
export const getClient = async (clientId: string): Promise<ClientProps> => {
  const response = await api.get(`/clients/${clientId}`);
  return response.data;
};

// ===== POST =====

// criar cliente
export const createClient = async (data: Omit<ClientProps, "id">) => {
  const response = await api.post("/clients", data);
  return response.data;
};

// ===== PATCH =====

// atualizar cliente
export const updateClient = async (
  clientId: string,
  data: Partial<ClientProps>
) => {
  const response = await api.patch(`/clients/${clientId}`, data);
  return response.data;
};

// ----- Change status -----
export const changeClientStatus = async (id: string, status: "active" | "disabled") => {
  const response = await api.patch(`/clients/change-status/${id}`, { status });
  return response.data;
};

// ===== DELETE =====
// deletar cliente
export const deleteClient = async (clientId: string) => {
  const response = await api.delete(`/clients/${clientId}`);
  return response.data;
};