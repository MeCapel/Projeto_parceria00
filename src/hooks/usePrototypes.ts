// ===== GERAL IMPORTS =====
import { useEffect, useState } from "react";
import {
  getPrototypes,
  getPrototypesByProject,
  createPrototype as createPrototypeService,
  updatePrototype as updatePrototypeService,
  deletePrototype as deletePrototypeService,
  type PrototypeProps,
} from "../services/prototypes.service";

// ===== INTERFACES =====
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
    checklistModelIds?: string[];
}

interface UpdatePrototypeDTO extends Partial<CreatePrototypeDTO> {
    id: string;
}

// ===== HOOK ===== 
export const usePrototypes = (projectId: string) => {
  const [prototypes, setPrototypes] = useState<PrototypeProps[]>([]);
  const [projectPrototypes, setProjectPrototypes] = useState<PrototypeProps[]>([]);
  const [loading, setLoading] = useState(false);

  // ----- Get all  -----
  const fetchPrototypes = async () => {
    try 
    {
      setLoading(true);

      const data = await getPrototypes();
      setPrototypes(data.data || []);
    } 
    catch (err)
    {
      console.error("Erro ao buscar protótipos:", err);
    } 
    finally 
    {
      setLoading(false);
    }
  };

  // ----- Get all by project -----
  const fetchProjectPrototypes = async () => {
    if (!projectId) return;

    try 
    {
      setLoading(true);

      const data = await getPrototypesByProject(projectId);
      setProjectPrototypes(data || []);
    } 
    catch (err) 
    {
      console.error("Erro ao buscar protótipos do projeto:", err);
    } 
    finally 
    {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) 
    {
      fetchProjectPrototypes();
    } 
    else 
    {
      fetchPrototypes();
    }
  }, [projectId]);

  // ----- Create -----
  const createPrototype = async (data: CreatePrototypeDTO) => {
    try 
    {
      const result = await createPrototypeService(data);

      // await fetchPrototypes();
      // if (projectId) 
        fetchProjectPrototypes();
      // else
        fetchPrototypes();

      return result;
    } 
    catch (err) 
    {
      console.error("Erro ao criar protótipo:", err);
      throw err;
    }
  };

  // ----- Update -----
  const updatePrototype = async (data: UpdatePrototypeDTO) => {
    try 
    {
      await updatePrototypeService(data.id, data);

      // setPrototypes(prev => prev.map(p => (p.id === data.id ? { ...p, ...data } as PrototypeProps : p)));
      if (projectId) 
        fetchProjectPrototypes();
      else
        fetchPrototypes();
    } 
    catch (err) 
    {
      console.error("Erro ao atualizar protótipo:", err);
      throw err;
    }
  };

  // ----- Delete -----
  const deletePrototype = async (id: string) => {
    try 
    {
      await deletePrototypeService(id);

      // setPrototypes(prev => prev.filter(p => p.id !== id));
      if (projectId) 
        fetchProjectPrototypes();
      else
        fetchPrototypes();
    } 
    catch (err) 
    {
      console.error("Erro ao deletar protótipo:", err);
      throw err;
    }
  };

  return {
    prototypes,
    projectPrototypes,
    loading,
    fetchPrototypes,
    fetchProjectPrototypes,
    createPrototype,
    updatePrototype,
    deletePrototype,
  };
};