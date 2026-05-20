// ===== GERAL IMPORTS =====
import { useEffect, useState } from "react";
import {
  getOccurrence as getOccurrenceSevice,
  getOccurrences as getOccurrencesService,
  getPrototypeOccurrences as getPrototypeOccurrencesService,
  createOccurrence as createOccurrenceService,
  updateOccurrence as updateOccurrenceService,
  deleteOccurrence as deleteOccurrenceService,
  type OccurrenceProps,
} from "../services/occurrences.service";

// ===== INTERFACES =====
interface Params {
  prototypeId: string;
}

// ===== HOOK =====
export function useOccurrences({ prototypeId }: Params) {
  const [occurrence, setOccurrence] = useState<OccurrenceProps | null>(null);
  const [occurrences, setOccurrences] = useState<OccurrenceProps[]>([]);
  const [loading, setLoading] = useState(false);

  // ----- Get all  -----
  const fetchOccurrences = async () => {
    try 
    {
      setLoading(true);

      const response = await getOccurrencesService();
      setOccurrences(response.data || []);
    } 
    catch (err) 
    {
      console.error("Erro ao buscar ocorrências:", err);
    } 
    finally 
    {
      setLoading(false);
    }
  };

  // ----- Get prototype occurrences -----
  const fetchOccurrencesByPrototype = (async () => {
    if (!prototypeId) return;

    try 
    {
      setLoading(true);

      const data = await getPrototypeOccurrencesService(prototypeId);

      setOccurrences(data || []);
    } 
    catch (err) 
    {
      console.error("Erro ao buscar ocorrências:", err);
    } 
    finally 
    {
      setLoading(false);
    }
  });

  useEffect(() => {
    if (prototypeId) 
    {
      fetchOccurrencesByPrototype();
    } 
    else 
    {
      fetchOccurrences();
    }
  }, [prototypeId]);

  // ----- Get one -----
  const getOccurrence = async (clientId: string) => {
    try 
    {
      const data = await getOccurrenceSevice(clientId);
      setOccurrence(data);
    } 
    catch (err) 
    {
      console.error("Erro ao buscar ocorrência:", err);
    }
  };

  // ----- Create -----
  const createOccurrence = async (data: Omit<OccurrenceProps, "id">) => {
    try 
    {
      const result = await createOccurrenceService(data);

      setOccurrences(prev => [...prev, result]);
      
      return result;
    } 
    catch (err) 
    {
      console.error("Erro ao criar ocorrência:", err);
      throw err;
    }
  };

  // ----- Update -----
  const updateOccurrence = async (id: string, data: Partial<OccurrenceProps>) => {
    try 
    {
      await updateOccurrenceService(id, data);
      
      setOccurrences(prev => prev.map(o => (o.id === id ? { ...o, ...data } : o)));
    } 
    catch (err) 
    {
      console.error("Erro ao atualizar ocorrência:", err);
      throw err;
    }
  };

  // ----- Delete -----
  const deleteOccurrence = async (id: string) => {
    try 
    {
      await deleteOccurrenceService(id);

      setOccurrences(prev => prev.filter(o => o.id !== id));
    } 
    catch (err) 
    {
      console.error("Erro ao deletar ocorrência:", err);
      throw err;
    }
  };

  return {
    occurrence,
    occurrences,
    loading,
    fetchOccurrences,
    fetchOccurrencesByPrototype,
    getOccurrence,
    createOccurrence,
    updateOccurrence,
    deleteOccurrence,
  };
}
