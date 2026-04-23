import { useEffect, useState } from "react";
import { usePrototype } from "./usePrototypes";
import { getPrototypeChecklistsRealtime, type PrototypeProps } from "../services/prototypeServices";

export const usePrototypeWithProgress = (projectId: string) => {
    const { prototypes, loading: loadingPrototypes } = usePrototype(projectId);

    const [prototypesWithProgress, setPrototypesWithProgress] = useState<(PrototypeProps & { progress: number })[]>([]);

    useEffect(() => {
        if (!prototypes || prototypes.length === 0) {
            setPrototypesWithProgress([]);
            return;
        }

        const unsubscribes: (() => void)[] = [];

        const updatedMap: Record<string, PrototypeProps & { progress: number }> = {};

        prototypes.forEach((prototype) => {

            const unsubscribe = getPrototypeChecklistsRealtime(
                prototype.id!,
                (checklists) => {

                    let total = 0;
                    let done = 0;

                    checklists.forEach(c =>
                        c.categories.forEach(cat => {
                            total += cat.items.length;
                            done += cat.items.filter(i => i.checked).length;
                        })
                    );

                    const progress =
                        total === 0 ? 0 : Math.round((done / total) * 100);

                    updatedMap[prototype.id!] = {
                        ...prototype,
                        progress
                    };

                    setPrototypesWithProgress(Object.values(updatedMap));
                }
            );

            unsubscribes.push(unsubscribe);
        });

        return () => {
            unsubscribes.forEach(unsub => unsub());
        };
    }, [prototypes]);

    return {
        prototypes: prototypesWithProgress,
        loading: loadingPrototypes
    };
};