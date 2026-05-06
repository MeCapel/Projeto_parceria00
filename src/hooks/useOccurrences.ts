import { useEffect, useState, useCallback } from "react";
import {
  getPrototypeOccurrences,
  createOccurrence,
  updateOccurrence,
  deleteOccurrence,
  type OccurrenceProps,
} from "../services/occurrences.service";

interface Params {
  prototypeId: string;
}

export function useOccurrences({ prototypeId }: Params) {
  const [occurrences, setOccurrences] = useState<OccurrenceProps[]>([]);
  const [loading, setLoading] = useState(false);

  // ===== LIST BY PROTOTYPE =====
  const fetchOccurrences = useCallback(async () => {
    if (!prototypeId) return;

    setLoading(true);
    try {
      const data = await getPrototypeOccurrences(prototypeId);
      setOccurrences(data || []);
    } catch (err) {
      console.error("Error fetching occurrences:", err);
    } finally {
      setLoading(false);
    }
  }, [prototypeId]);

  useEffect(() => {
    fetchOccurrences();
  }, [fetchOccurrences]);

  // ===== CREATE =====
  const create = async (data: Omit<OccurrenceProps, "id">) => {
    try {
      const result = await createOccurrence(data);
      setOccurrences(prev => [...prev, result]);
      return result;
    } catch (err) {
      console.error("Error creating occurrence:", err);
      throw err;
    }
  };

  // ===== UPDATE =====
  const update = async (id: string, data: Partial<OccurrenceProps>) => {
    try {
      await updateOccurrence(id, data);
      setOccurrences(prev =>
        prev.map(o => (o.id === id ? { ...o, ...data } : o))
      );
    } catch (err) {
      console.error("Error updating occurrence:", err);
      throw err;
    }
  };

  // ===== DELETE =====
  const remove = async (id: string) => {
    try {
      await deleteOccurrence(id);
      setOccurrences(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      console.error("Error deleting occurrence:", err);
      throw err;
    }
  };

  return {
    occurrences,
    loading,
    create,
    update,
    remove,
    refresh: fetchOccurrences,
  };
}
