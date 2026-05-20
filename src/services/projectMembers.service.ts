import { api } from "./api";

// ===== TYPES =====
export interface ProjectMember {
    userId: string;
    username: string;
}

// ===== GET =====

// Buscar projetos do usuário
export const getUserProjects = async (userId: string) => {
    const response = await api.get(`/users/${userId}/projects`);
    return response.data.data;
};

// Buscar membros do projeto
export const getProjectMembers = async (projectId: string): Promise<ProjectMember[]> => {
    const response = await api.get(`/project/${projectId}/projectMembers`);
    return response.data.data;
};

// Buscar membro específico
export const getProjectMember = async (projectId: string, userId: string) => {
    const response = await api.get(`/project/${projectId}/projectMembers/${userId}`);
    return response.data;
};

export const getUsersNotInProject = async (projectId: string) => {
    const response = await api.get(`/project/${projectId}/users-not-in-project`);
    return response.data.data;
};

// ===== POST =====

// Adicionar membro (backend usa req.user ou body dependendo da lógica)
export const addProjectMember = async (projectId: string, userId: string) => {
    const response = await api.post(`/project/${projectId}/projectMembers`, { userId });

    return response.data;
};

// ===== DELETE =====

export const removeProjectMember = async (projectId: string, userId: string) => {
    await api.delete(`/project/${projectId}/projectMembers/${userId}`);
};