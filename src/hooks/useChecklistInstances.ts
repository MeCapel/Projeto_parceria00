import { useCallback, useEffect, useState } from "react";

import {
  getPrototypeChecklists,
  createChecklistInstance,
  updateChecklistInstance,
  deleteChecklistInstance,
  type ChecklistInstance,
} from "../services/checklistInstances.service";

interface Params {
  prototypeId: string;
}

export function useChecklistInstances({ prototypeId }: Params) {
  const [checklists, setChecklists] = useState<ChecklistInstance[]>([]);
  const [loading, setLoading] = useState(false);

  // ===== LISTAR =====
  const fetchChecklists = useCallback(async () => {
    if (!prototypeId) return;

    setLoading(true);
    try {
      const data = await getPrototypeChecklists(prototypeId);
      setChecklists(data);
    } finally {
      setLoading(false);
    }
  }, [prototypeId]);

  useEffect(() => {
    fetchChecklists();
  }, [fetchChecklists]);

  // ===== CRIAR LINK MODEL -> INSTANCE =====
  const linkChecklist = async (checklistModelIds: string[]) => {
    const newChecklist = await createChecklistInstance(
      prototypeId,
      checklistModelIds
    );

    setChecklists(prev => [...prev, newChecklist]);

    return newChecklist;
  };

  // ===== TOGGLE ITEM =====
  const toggleItem = async (
    checklistId: string,
    categories: any[]
  ) => {
    await updateChecklistInstance(
      prototypeId,
      checklistId,
      categories
    );

    setChecklists(prev =>
      prev.map(c =>
        c.id === checklistId ? { ...c, categories } : c
      )
    );
  };

  // ===== DELETE CHECKLIST =====
  const removeChecklist = async (checklistId: string) => {
    await deleteChecklistInstance(prototypeId, checklistId);

    setChecklists(prev =>
      prev.filter(c => c.id !== checklistId)
    );
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
