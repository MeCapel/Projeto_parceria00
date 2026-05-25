// ===== IMPORTS =====
import {
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  getPrototypes,
  type PrototypeProps,
  type PrototypeWithProgress,
} from "../services/prototypes.service";

import {
  getPrototypeChecklists,
} from "../services/checklistInstances.service";

import type {
  ChecklistInstance,
} from "../services/checklistInstances.service";

// ===== HELPERS =====
function calcProgress(
  checklists: ChecklistInstance[] | null | undefined
): number {

  if (
    !checklists ||
    !Array.isArray(checklists) ||
    checklists.length === 0
  ) {
    return 0;
  }

  let total = 0;
  let checked = 0;

  for (const checklist of checklists)
  {
    for (const category of checklist.categories || [])
    {
      for (const item of category.items || [])
      {
        total++;

        if (item.checked)
        {
          checked++;
        }
      }
    }
  }

  if (total === 0)
  {
    return 0;
  }

  return Math.round(
    (checked / total) * 100
  );
}

// ===== TYPES =====
interface UsePrototypeWithProgressProps {
  projectId?: string;
}

// ===== HOOK =====
export const usePrototypeWithProgress = (props?: UsePrototypeWithProgressProps) => {
  // ===== PARAMS =====
  const projectId =
    props?.projectId;

  // ===== STATES =====
  const [prototypes, setPrototypes] =
    useState<PrototypeWithProgress[]>([]);

  const [loading, setLoading] =
    useState(false);

  // ===== FETCH =====
  const fetch = useCallback(async () => {

    // sem projectId não busca
    if (!projectId)
    {
      setPrototypes([]);
      return;
    }

    try
    {
      setLoading(true);

      // ===== FETCH PROTOTYPES =====
      const response =
        await getPrototypes({
          limit: 100,
          projectId,
        });

      const data =
        response.data || [];

      // ===== CALCULATE PROGRESS =====
      const prototypesWithProgress:
        PrototypeWithProgress[] =
          await Promise.all(

            data.map(
              async (
                prototype: PrototypeProps
              ) => {

                try
                {
                  const checklists =
                    await getPrototypeChecklists(
                      prototype.id
                    );

                  return {
                    ...prototype,

                    progress:
                      calcProgress(
                        checklists
                      ),
                  };
                }
                catch
                {
                  return {
                    ...prototype,
                    progress: 0,
                  };
                }
              }
            )
          );

      setPrototypes(
        prototypesWithProgress
      );
    }
    catch (err)
    {
      console.error(
        "Erro ao buscar protótipos com progresso:",
        err
      );

      setPrototypes([]);
    }
    finally
    {
      setLoading(false);
    }

  }, [projectId]);

  // ===== INITIAL LOAD =====
  useEffect(() => {

    fetch();

  }, [fetch]);

  // ===== RETURN =====
  return {
    prototypes,
    loading,

    refresh: fetch,
  };
};