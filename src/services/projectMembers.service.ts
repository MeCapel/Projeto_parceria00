import { collection, documentId, onSnapshot, query, where } from "firebase/firestore";
import { api } from "./api";
import { db } from "../firebaseConfig/config";
import type { ProjectProps } from "./projects.service";

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

export const lisenUserProjects = (
    userId: string,
    callback: (projects: ProjectProps[]) => void
) => {
    try {
        const collectionRef = collection(db, "projectMembers");
        const q = query(collectionRef, where("userId", "==", userId));

        let unsubscribeProjects: (() => void) | null = null;

        const unsubscribeMembers = onSnapshot(q, (snapshot) => {
            const projectsIds = snapshot.docs.map(doc => doc.data().projectId);

            // limpa listener anterior (IMPORTANTE)
            if (unsubscribeProjects) {
                unsubscribeProjects();
                unsubscribeProjects = null;
            }

            if (projectsIds.length === 0) {
                callback([]);
                return;
            }

            // limite do Firestore
            const limitedIds = projectsIds.slice(0, 30);

            const projectsQuery = query(
                collection(db, "projects"),
                where(documentId(), "in", limitedIds)
            );

            // agora SIM reativo
            unsubscribeProjects = onSnapshot(projectsQuery, (projectsSnap) => {
                const projectsList = projectsSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as ProjectProps));

                callback(projectsList);
            });
        });

        // cleanup completo
        return () => {
            unsubscribeMembers();
            if (unsubscribeProjects) unsubscribeProjects();
        };

    } catch (err) {
        console.error(err);
        callback([]);
        return () => {};
    }
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