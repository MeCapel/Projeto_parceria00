import { useState, useEffect, useCallback } from "react";
import { getPrototypesByProject, type PrototypeProps, type PrototypeWithProgress } from "../services/prototypes.service";
import { getPrototypeChecklists } from "../services/checklistInstances.service";
import type { ChecklistInstance } from "../services/checklistInstances.service";

function calcProgress(checklists: ChecklistInstance[] | null | undefined): number {
  if (!checklists || !Array.isArray(checklists) || checklists.length === 0) return 0;

  let total = 0;
  let checked = 0;

  for (const cl of checklists) {
    for (const cat of cl.categories || []) {
      for (const item of cat.items || []) {
        total++;
        if (item.checked) checked++;
      }
    }
  }

  if (total === 0) return 0;
  return Math.round((checked / total) * 100);
}

export const usePrototypeWithProgress = (projectId: string) => {
  const [prototypes, setPrototypes] = useState<PrototypeWithProgress[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!projectId) {
      setPrototypes([]);
      return;
    }

    setLoading(true);
    try {
      const data = await getPrototypesByProject(projectId);

      const protos: PrototypeWithProgress[] = await Promise.all(
        (data as PrototypeProps[]).map(async (p) => {
          try {
            const checklists = await getPrototypeChecklists(p.id);
            return { ...p, progress: calcProgress(checklists) };
          } catch {
            return { ...p, progress: 0 };
          }
        })
      );

      setPrototypes(protos);
    } catch (err) {
      console.error("Erro ao buscar protótipos com progresso:", err);
      setPrototypes([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    prototypes,
    loading,
    refresh: fetch,
  };
};
