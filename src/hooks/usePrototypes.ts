import { useEffect, useState } from "react";
import {
  createPrototype as createPrototypeService,
  updatePrototype as updatePrototypeService,
  deletePrototype as deletePrototypeService,
  getPrototypesByProject,
  type PrototypeProps,
} from "../services/prototypes.service";

interface CreatePrototypeDTO {
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

interface UpdatePrototypeDTO extends Partial<CreatePrototypeDTO> {
    id: string;
}

export const usePrototypes = (projectId: string) => {
  const [prototypes, setPrototypes] = useState<PrototypeProps[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 fetch
  const fetchPrototypes = async () => {
    if (!projectId) return;

    try {
      setLoading(true);

      const response = await getPrototypesByProject(projectId);
      setPrototypes(response.data || []);
    } catch (err) {
      console.error("Erro ao buscar protótipos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrototypes();
  }, [projectId]);

  // 🔹 criar
  const createPrototype = async (data: CreatePrototypeDTO) => {
    try {
      const result = await createPrototypeService(data);

      await fetchPrototypes(); // refresh

      return result;
    } catch (err) {
      console.error("Erro ao criar protótipo:", err);
      throw err;
    }
  };

  // 🔹 update
  const updatePrototype = async (data: UpdatePrototypeDTO) => {
    try {
      await updatePrototypeService(data.id, data as any);

      setPrototypes(prev =>
        prev.map(p => (p.id === data.id ? { ...p, ...data } as PrototypeProps : p))
      );
    } catch (err) {
      console.error("Erro ao atualizar protótipo:", err);
      throw err;
    }
  };

  // 🔹 delete
  const deletePrototype = async (id: string) => {
    try {
      await deletePrototypeService(id);

      setPrototypes(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Erro ao deletar protótipo:", err);
      throw err;
    }
  };

  return {
    prototypes,
    loading,
    createPrototype,
    updatePrototype,
    deletePrototype,
  };
};