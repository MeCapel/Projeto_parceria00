import { useEffect, useState } from "react";
import {
  type OccurrenceProps,
  getOccurrence as getOccurrenceService,
  getOccurrences as getOccurrencesService,
  createOccurrence as createOccurrenceService,
  updateOccurrence as updateOccurrenceService,
  changeOccurrenceStatus as changeOccurrencesStatusService,
  deleteOccurrence as deleteOccurrenceService,
} from "../services/occurrences.service";
import { showErrorToast } from "../utils/errorToast";

// ===== TYPES =====
interface FetchOccurrencesOptions {
  reset?: boolean;
  limit?: number;
  filters?: {
    prototypeId?: string;
    status?: "active" | "disabled";
  };
}

interface UseOccurrencesProps {
  prototypeId?: string;
}

// ===== HOOK =====
export const useOccurrences = (props?: UseOccurrencesProps) => {
  // ===== PARAMS =====
  const prototypeId = props?.prototypeId;

  // ===== STATES =====
  const [occurrence, setOccurrence] = useState<OccurrenceProps | null>(null);

  const [occurrences, setOccurrences] = useState<OccurrenceProps[]>([]);

  const [loading, setLoading] = useState(false);

  const [cursor, setCursor] = useState<string | null>(null);

  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState<{
    prototypeId?: string;
    status?: "active" | "disabled";
  }>({});

  // ===== GET ALL =====
  const fetchOccurrences = async (options?: FetchOccurrencesOptions) => {
    try
    {
      setLoading(true);

      const isReset = options?.reset ?? false;

      const currentFilters = options?.filters ?? filters;

      if (isReset)
      {
        setCursor(null);
        setHasMore(true);
        setFilters(currentFilters);
      }

      const response = await getOccurrencesService({
        limit:
          options?.limit ?? 10,

        cursor:
          isReset
            ? null
            : cursor,

        prototypeId:
          prototypeId
            ?? currentFilters.prototypeId,

        status:
          currentFilters.status,
      });

      if (isReset)
      {
        setOccurrences(response.data || []);
      }
      else
      {
        setOccurrences(prev => [
          ...prev,
          ...response.data,
        ]);
      }

      setCursor(response.pagination.nextCursor);
      setHasMore(response.pagination.hasMore);
    }
    catch (err)
    {
      console.error("Erro ao buscar ocorrências:", err);
      setOccurrences([]);
    }
    finally
    {
      setLoading(false);
    }
  };

  // ===== LOAD MORE =====
  const loadMore = async () => {

    if (!hasMore || loading) return;

    await fetchOccurrences({ filters });
  };

  // ===== INITIAL LOAD =====
  useEffect(() => {
    fetchOccurrences({
      reset: true,
      filters: {
        prototypeId,
      },
    });

  }, [prototypeId]);

  // ===== GET ONE =====
  const getOccurrence = async (id: string) => {
    try
    {
      const data = await getOccurrenceService(id);
      setOccurrence(data);
    }
    catch (err)
    {
      console.error("Erro ao buscar ocorrência:", err);
    }
  };

  // ===== CREATE =====
  const createOccurrence = async (data: Omit<OccurrenceProps, "id">) => {

    try
    {
      const result = await createOccurrenceService(data);

      // await fetchOccurrences({ reset: true, filters });

      setOccurrences(prev => [ result, ...prev ]);

      return result;
    }
    catch (err)
    {
      showErrorToast(err);
      console.error("Erro ao criar ocorrência:", err);
      throw err;
    }
  };

  // ===== UPDATE =====
  const updateOccurrence = async (id: string, data: Partial<OccurrenceProps>) => {
    try
    {
      const result = await updateOccurrenceService(id, data);

      // await fetchOccurrences({ reset: true, filters });

      setOccurrences(prev =>
        prev.map(occurrence =>
          occurrence.id === id
            ? result
            : occurrence
        )
      );

      return result;
    }
    catch (err)
    {
      showErrorToast(err);
      console.error("Erro ao atualizar ocorrência:", err);
      throw err;
    }
  };

  // ===== CHANGE STATUS =====
  const changeOccurrencesStatus = async (id: string, status: "active" | "disabled") => {
    try {
      const result = await changeOccurrencesStatusService(id, status);

      // mantém consistência da lista (recarrega com filtros atuais)
      // await fetchClients({ reset: true, filters });

      setOccurrences(prev =>
        prev.map(occurrence =>
          occurrence.id === id
            ? result
            : occurrence
        )
      );

      return result;
    } catch (err) 
    {
      showErrorToast(err);
      console.error("Erro ao alterar status da ocorrência:", err);
      throw err;
    }
  };

  // ===== DELETE =====
  const deleteOccurrence = async (id: string) => {
    try
    {
      await deleteOccurrenceService(id);

      // await fetchOccurrences({ reset: true, filters });

      setOccurrences(prev => prev.filter(c => c.id !== id));
    }
    catch (err)
    {
      showErrorToast(err);
      console.error("Erro ao deletar ocorrência:", err);
      throw err;
    }
  };

  // ===== RETURN =====
  return {

    // states
    occurrence,
    occurrences,

    loading,

    cursor,
    hasMore,

    filters,

    // fetch
    fetchOccurrences,
    loadMore,

    // crud
    getOccurrence,

    createOccurrence,
    updateOccurrence,

    changeOccurrencesStatus,
    deleteOccurrence,
  };
};