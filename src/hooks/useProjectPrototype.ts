import { useEffect, useState } from "react";
import { deletePrototype, getPrototype, updatePrototype, type PrototypeProps } from "../services/prototypeServices";

export function useProjectPrototypes(prototypeId?: string)
{
    const [prototype, setPrototype] = useState<PrototypeProps | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!prototypeId) return;

        const fetch = async () => {
            setLoading(true);

            try {
                const data = await getPrototype(prototypeId);

                if (!data) {
                    setPrototype(null);
                    return;
                }

                setPrototype({
                    ...data,
                    id: prototypeId
                });

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [prototypeId]);

    // ================= UPDATE =================
    const update = async (data: PrototypeProps) => {
        await updatePrototype(data);
        setPrototype(data);
    };

    // ================= DELETE =================
    const remove = async () => {
        if (!prototype?.id) return;

        await deletePrototype(prototype.id);
    };

    // ================= LOCAL UPDATE =================
    const patch = (data: Partial<PrototypeProps>) => {
        setPrototype(prev => prev ? { ...prev, ...data } : prev);
    };

    return {
        prototype,
        loading,
        update,
        remove,
        patch
    };
}