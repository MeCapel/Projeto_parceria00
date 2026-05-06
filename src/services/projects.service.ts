import { api } from "./api";

// ===== TYPES =====
export interface ProjectProps {
  id: string;
  name: string;
  description?: string;
  membersCount: number;
  prototypesCount: number;
  createdBy: string;
  createdAt: string;
}

// ===== GET =====

// 🔹 listar projetos (com paginação opcional)
export const getProjects = async (params?: { limit?: number, startAfter?: string }) => {
  const response = await api.get("/projects", { params});

  return response.data;
};

// 🔹 pegar projeto específico
export const getProjectById = async (projectId: string): Promise<ProjectProps> => {
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

// ===== DELETE =====

// 🔹 deletar projeto
export const deleteProject = async (projectId: string) => {
  const response = await api.delete(`/projects/${projectId}`);
  return response.data;
};