// ===== GERAL IMPORTS =====
import { useEffect, useState } from "react";
import {
  type ChecklistModelProps,
  getChecklistModel as getChecklistModelService,
  getChecklistModels as getChecklistModelsService,
  createChecklistModel as createChecklistModelService,
  updateChecklistModel as updateChecklistModelService,
  deleteChecklistModel as deleteChecklistModelSevice,
  type ChecklistCategory,
} from "../services/checklistModels.service";
import type { ChecklistModelInput } from "../components/04ChecklistRelated/new-models/ChecklistModelForm";

// ===== HOOK ===== 
export const useChecklistModels = () => {
  const [checklistModel, setChecklistModel] = useState<ChecklistModelProps | null>(null);
  const [checklistModels, setChecklistModels] = useState<ChecklistModelProps[]>([]);
  const [loading, setLoading] = useState(true);

  // ----- Get all  -----
  const fetchChecklistModels = async () => {
    try 
    {
      setLoading(true);

      const response = await getChecklistModelsService();

      // console.log(response);
      setChecklistModels(response || []);
    } 
    catch (err) 
    {
      console.error("Erro ao buscar checklists modelos:", err);
    } 
    finally 
    {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklistModels();
  }, []);

  // ----- Get one -----
  const getChecklistModel = async (clientId: string) => {
    try 
    {
      const data = await getChecklistModelService(clientId);
      setChecklistModel(data);
    } 
    catch (err) 
    {
      console.error("Erro ao buscar checklist modelo:", err);
    }
  };

  // ----- Create -----
  const createChecklistModel = async (data: { name: string, vertical: string, categories: ChecklistCategory[] }) => {
    try
    {
      const result = await createChecklistModelService(data);
  
      fetchChecklistModels();
  
      return result;
    }
    catch (err)
    {
      console.error("Erro ao criar checklist modelo:", err);
      throw err;
    }
  };

  // ----- Update -----
  const updateChecklistModel = async (id: string, data: Partial<ChecklistModelInput>) => {
    try
    {
      const result = await updateChecklistModelService(id, data);
  
      setChecklistModels((prev) =>
        prev.map((m) =>
          m.id === id ? result : m
        )
      );
  
      // await fetchChecklistModels();
  
      return result;
    }
    catch (err)
    {
      console.error("Erro ao atualizar checklist modelo:", err);
      throw err;
    }
  };

  // ----- Delete -----
  const deleteChecklistModel = async (id: string) => {
    try
    {
      await deleteChecklistModelSevice(id);
  
      setChecklistModels((prev) => prev.filter((m) => m.id !== id));
  
      // await fetchChecklistModels();
    }
    catch (err)
    {
      console.error("Erro ao deletar checjlist modelo:", err);
      throw err;
    }
  };

  return {
    checklistModel,
    checklistModels,
    loading,
    fetchChecklistModels,
    getChecklistModel,
    createChecklistModel,
    updateChecklistModel,
    deleteChecklistModel,
  };
};