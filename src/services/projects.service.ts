import type { Pagination } from "../utils/pagination.types";
import { api } from "./api";

// ===== TYPES =====
export interface ProjectProps {
  id: string;
  name: string;
  description?: string;
  membersCount: number;
  prototypesCount: number;
  status?: "active" | "disabled";
  createdBy: string;
  createdAt: string;
}

export interface PaginatedProjectsResponse {
  data: ProjectProps[];
  pagination: Pagination;
}


// ===== GET =====

// listar projetos
export const getProjects = async (
  params?: {
    limit?: number;
    cursor?: string | null;
    status?: "active" | "disabled";
  }
): Promise<PaginatedProjectsResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.limit) searchParams.append("limit", String(params.limit));

  if (params?.cursor) searchParams.append("cursor", params.cursor);

  if (params?.status) searchParams.append("status", params.status);


  const response = await api.get(`/projects?${searchParams.toString()}`);
  return response.data;
};

// 🔹 pegar projeto específico
export const getProject = async (projectId: string): Promise<ProjectProps> => {
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
};

// ===== POST =====

// 🔹 criar projeto
export const createProject = async (data: { name: string, description?: string }) => {
  const response = await api.post("/projects", data);
  return response.data;
};

// ===== PATCH =====

// 🔹 atualizar projeto
export const updateProject = async (projectId: string, data: { name?: string, description?: string }) => {
  const response = await api.patch(`/projects/${projectId}`, data);
  return response.data;
};

// ----- Change status -----
export const changeProjectStatus = async (id: string, status: "active" | "disabled") => {
  const response = await api.patch(`/projects/change-status/${id}`, { status });
  return response.data;
};

// ===== DELETE =====

// 🔹 deletar projeto
export const deleteProject = async (projectId: string) => {
  const response = await api.delete(`/projects/${projectId}`);
  return response.data;
};