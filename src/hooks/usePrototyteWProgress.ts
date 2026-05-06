import { useEffect, useState, useCallback } from "react";
import { usePrototypes } from "./usePrototypes";
import { getProjectPrototypesProgress } from "../services/checklistInstances.service";
import type { PrototypeProps } from "../services/prototypes.service";

export const usePrototypeWithProgress = (projectId: string) => {
    const { prototypes, loading: loadingPrototypes } = usePrototypes(projectId);

    const [prototypesWithProgress, setPrototypesWithProgress] = useState<(PrototypeProps & { progress: number })[]>([]);

    const fetchProgress = useCallback(async () => {
        if (!projectId) return;

        try {
            const result = await getProjectPrototypesProgress(projectId);
            // API returns: { prototypes: [{ id, name, ..., progress: number }] }
            setPrototypesWithProgress(result?.prototypes || []);
        } catch (err) {
            console.error("Error fetching prototype progress:", err);
        }
    }, [projectId]);

    useEffect(() => {
        if (!prototypes || prototypes.length === 0) {
            setPrototypesWithProgress([]);
            return;
        }

        fetchProgress();
    }, [prototypes, fetchProgress]);

    return {
        prototypes: prototypesWithProgress,
        loading: loadingPrototypes,
        refresh: fetchProgress
    };
};