// ===== GERAL IMPORTS =====
import { useEffect, useState } from "react";
import {
  type ChecklistModelProps,
  type ChecklistCategory,
  getChecklistModels as getChecklistModelsService,
  getChecklistModel as getChecklistModelService,
  changeChecklistModelStatus as changeChecklistModelStatusService,
  createChecklistModel as createChecklistModelService,
  updateChecklistModel as updateChecklistModelService,
  deleteChecklistModel as deleteChecklistModelService,
} from "../services/checklistModels.service";
import type { ChecklistModelInput } from "../components/04ChecklistRelated/new-models/ChecklistModelForm";

// ===== TYPES =====
interface FetchChecklistModelsOptions {
  reset?: boolean;
  limit?: number;
  filters?: {
    vertical?: string;
    status?: "active" | "disabled";
  };
}

// ===== HOOK =====
export const useChecklistModels = () => {
  // ===== STATES =====
  const [checklistModel, setChecklistModel] = useState<ChecklistModelProps | null>(null);
  const [checklistModels, setChecklistModels] = useState<ChecklistModelProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // salva os filtros atuais
  const [filters, setFilters] = useState<{
    vertical?: string;
    status?: "active" | "disabled";
  }>({});

  // ===== GET ALL =====
  const fetchChecklistModels = async (options?: FetchChecklistModelsOptions) => {
    try 
    {
      setLoading(true);

      const isReset = options?.reset ?? false;

      // filtros novos OU mantém antigos
      const currentFilters = options?.filters ?? filters;

      // se resetar:
      // limpa cursor e salva filtros
      if (isReset) {
        setCursor(null);
        setHasMore(true);
        setFilters(currentFilters);
      }

      const response = await getChecklistModelsService({
        limit: options?.limit ?? 10,
        cursor: isReset
          ? null
          : cursor,
        vertical: currentFilters.vertical,
        status: currentFilters.status,
      });

      // RESET
      if (isReset) setChecklistModels(response.data || []);

      // LOAD MORE
      else 
        {
        setChecklistModels(prev => [
          ...prev,
          ...response.data,
        ]);
      }

      setCursor(response.pagination.nextCursor);
      setHasMore(response.pagination.hasMore);
    }
    catch (err) 
    {
      console.error("Erro ao buscar checklist models:", err);
    }
    finally 
    {
      setLoading(false);
    }
  };

  // ===== LOAD MORE =====
  const loadMore = async () => {
    if (!hasMore || loading) return;
    await fetchChecklistModels({ filters });
  };

  // ===== INITIAL LOAD =====
  useEffect(() => {
    fetchChecklistModels({ reset: true });
  }, []);

  // ===== GET ONE =====
  const getChecklistModel = async (id: string) => {
    try {
      const data = await getChecklistModelService(id);
      setChecklistModel(data);
    }
    catch (err) 
    {
      console.error("Erro ao buscar checklist modelo:", err);
    }
  };

  // ===== CREATE =====
  const createChecklistModel = async (
    data: {
      name: string;
      vertical: string;
      categories: ChecklistCategory[];
    }
  ) => {
    try 
    {
      const result = await createChecklistModelService(data);

      // refetch usando filtros atuais
      await fetchChecklistModels({ reset: true, filters });
      return result;
    }
    catch (err) 
    {
      console.error("Erro ao criar checklist modelo:", err);
      throw err;
    }
  };

  // ===== UPDATE =====
  const updateChecklistModel = async (id: string, data: Partial<ChecklistModelInput>) => {
    try 
    {
      const result = await updateChecklistModelService(id, data);
      await fetchChecklistModels({ reset: true, filters });
      return result;
    }
    catch (err) 
    {
      console.error("Erro ao atualizar checklist modelo:", err);
      throw err;
    }
  };

  // ===== CHANGE STATUS =====
  const changeChecklistModelStatus = async (id: string, status: "active" | "disabled") => {
    try {
      const result = await changeChecklistModelStatusService(id, status);

      // mantém consistência da lista (recarrega com filtros atuais)
      await fetchChecklistModels({ reset: true, filters });

      return result;
    } catch (err) {
      console.error("Erro ao alterar status do checklist modelo:", err);
      throw err;
    }
  };

  // ===== DELETE =====
  const deleteChecklistModel = async (id: string) => {
    try 
    {
      await deleteChecklistModelService(id);
      await fetchChecklistModels({ reset: true, filters });
    }
    catch (err)
    {
      console.error("Erro ao deletar checklist modelo:", err);
      throw err;
    }
  };

  // ===== RETURN =====
  return {
    checklistModel,
    checklistModels,
    loading,
    cursor,
    hasMore,
    filters,
    fetchChecklistModels,
    loadMore,
    getChecklistModel,
    createChecklistModel,
    updateChecklistModel,
    changeChecklistModelStatus,
    deleteChecklistModel,
  };
};