import { api } from "./api";

// ===== TYPES =====
export interface PrototypeProps {
  id: string;
  code: string;
  name: string;
  description: string;
  stage: string;
  vertical: string;
  projectId: string;
  clientId?: string;
  location?: { state?: string; city?: string };
  areaSize?: number;
  createdBy?: string;
  createdAt?: string;
}

// ===== GET =====

// 🔹 listar todos protótipos
export const getPrototypes = async () => {
  const response = await api.get("/prototypes");
  return response.data; // { data, lastDoc }
};

// 🔹 protótipos de um projeto
export const getPrototypesByProject = async (projectId: string) => {
  const response = await api.get(`/projects/${projectId}/prototypes`);
  return response.data; // { data, lastDoc }
};

// 🔹 pegar protótipo específico
export const getPrototype = async (prototypeId: string): Promise<PrototypeProps> => {
  const response = await api.get(`/prototypes/${prototypeId}`);
  return response.data;
};

// ===== POST =====

// 🔹 criar protótipo
export const createPrototype = async (data: Omit<PrototypeProps, "id">) => {
  const response = await api.post("/prototypes", data);
  return response.data;
};

// ===== PATCH =====

// 🔹 atualizar protótipo
export const updatePrototype = async (
  prototypeId: string,
  data: Partial<PrototypeProps>
) => {
  const response = await api.patch(`/prototypes/${prototypeId}`, data);
  return response.data;
};

// ===== DELETE =====

// 🔹 deletar protótipo
export const deletePrototype = async (prototypeId: string) => {
  const response = await api.delete(`/prototypes/${prototypeId}`);
  return response.data;
};