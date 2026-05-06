import { useEffect, useState } from "react";
import {
  type ChecklistModelProps,
  getChecklistModels as getChecklistModelsService,
  createChecklistModel as createChecklistModelService,
  updateChecklistModel as updateChecklistModelService,
  deleteChecklistModel as deleteChecklistModelSevice,
  type ChecklistCategory,
} from "../services/checklistModels.service";
import type { ChecklistModelInput } from "../components/04ChecklistRelated/new-models/ChecklistModelForm";
import { getCurrentUser } from "../services/auth.service";

export const useChecklistModels = () => {
  const [checklistModels, setChecklistModels] = useState<ChecklistModelProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const user = getCurrentUser();

      if (!user) {
        setChecklistModels([]);
        setLoading(false);
        return;
      }

      try {
        const data = await getChecklistModelsService();
        setChecklistModels(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  // ================= CREATE =================
  const createChecklistModel = async (data: { name: string, vertical: string, categories: ChecklistCategory[] }) => {
    const newModel = await createChecklistModelService(data);

    setChecklistModels((prev) => [...prev, newModel]);

    return newModel;
  };

  // ================= UPDATE =================
  const updateChecklistModel = async (id: string, data: Partial<ChecklistModelInput>) => {
    const newVersion = await updateChecklistModelService(id, data);

    setChecklistModels((prev) => [...prev, newVersion]);

    return newVersion;
  };

  // ================= DELETE =================
  const deleteChecklistModel = async (id: string) => {
    await deleteChecklistModelSevice(id);

    setChecklistModels((prev) => prev.filter((m) => m.id !== id));
  };

  return {
    checklistModels,
    loading,
    createChecklistModel,
    updateChecklistModel,
    deleteChecklistModel,
  };
};