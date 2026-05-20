// ===== GERAL IMPORTS =====
import { useCallback, useEffect, useState } from "react";
import {
  getPrototypeChecklists,
  createChecklistInstance,
  updateChecklistInstance,
  deleteChecklistInstance,
  type ChecklistInstance,
} from "../services/checklistInstances.service";

// ===== INTERFACES =====
interface Params {
  prototypeId: string;
}

// ===== HOOK ===== 
export function useChecklistInstances({ prototypeId }: Params) {
  const [checklists, setChecklists] = useState<ChecklistInstance[]>([]);
  const [loading, setLoading] = useState(false);

  // ----- Get all  -----
  const fetchChecklists = useCallback(async () => {
    if (!prototypeId) return;

    setLoading(true);
    try 
    {
      const data = await getPrototypeChecklists(prototypeId);
      setChecklists(data);
    } 
    finally 
    {
      setLoading(false);
    }
  }, [prototypeId]);

  useEffect(() => {
    fetchChecklists();
  }, [fetchChecklists]);

  // ----- Criar -> instância -----
  const linkChecklist = async (checklistModelIds: string[]) => {
    try
    {
      const result = await Promise.all(checklistModelIds.map(id => createChecklistInstance(prototypeId, id)));
  
      setChecklists(prev => [...prev, ...result]);
  
      return result;
    }
    catch (err)
    {
      console.error("Erro ao criar vinculo entre protótipo e checklist:", err);
      throw err;
    }
  };

  // ----- Toggle do item -----
  const toggleItem = async (checklistId: string, categories: any[]) => {
    try
    {
      await updateChecklistInstance(prototypeId, checklistId, categories);
  
      setChecklists(prev =>
        prev.map(c =>
          c.id === checklistId ? { ...c, categories } : c
        )
      );
    }
    catch (err)
    {
      console.error("Erro ao atualizar item da checklist:", err);
      throw err; 
    }
  };

  // ----- Delete checklist instance -----
  const removeChecklist = async (checklistId: string) => {
    try
    {
      await deleteChecklistInstance(prototypeId, checklistId);
  
      setChecklists(prev => prev.filter(c => c.id !== checklistId));
    }
    catch (err)
    {
      console.error("Erro ao deletar checklist do protótipo:", err);
      throw err;
    }
  };

  return {
    checklists,
    loading,
    fetchChecklists,
    linkChecklist,
    toggleItem,
    removeChecklist,
  };
}
