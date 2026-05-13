import { usePrototypes } from "./usePrototypes";

export const usePrototypeWithProgress = (projectId: string) => {
    const { prototypes, loading: loadingPrototypes } = usePrototypes(projectId);

    // API doesn't support progress endpoint - return prototypes without progress
    const prototypesWithProgress = prototypes.map(p => ({
        ...p,
        progress: 0 // Default progress since API doesn't provide this
    }));

    return {
        prototypes: prototypesWithProgress,
        loading: loadingPrototypes,
        refresh: () => {} // No-op since no progress API
    };
};