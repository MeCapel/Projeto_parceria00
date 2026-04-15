import { useEffect, useState } from "react"
import { getCurrentUser } from "../services/authServices";
import { 
    type PrototypeProps,
    createPrototype as createPrototypeService,
    updatePrototype as updatePrototypeService,
    deletePrototype as deletePrototypeService,
    getPrototypes,
} from "../services/prototypeServices";

interface CreatePrototypeDTO {
    code: string,
    name: string,
    description: string,
    stage: string,
    vertical: string,
    state?: string,
    city?: string,
    areaSize?: string,
    projectId: string,
}

interface UpdatePrototypeDTO {
    id: string,
    code: string,
    name: string,
    description: string,
    stage: string,
    vertical: string,
    state?: string,
    city?: string,
    areaSize?: string,
    projectId: string,
}
export const usePrototype = () => {
    const [prototypes, setPrototypes] = useState<PrototypeProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const user = getCurrentUser();

        if (!user) {
            setLoading(false);
            return;
        }

        const unsubscribe = getPrototypes((prototypesList) => {
            setPrototypes(prototypesList || []);
            setLoading(false);
        })

        return () => unsubscribe();
    }, []);

    const createPrototype = async (data: CreatePrototypeDTO) => {
        const user = getCurrentUser();
        if (!user) return;

        await createPrototypeService(data);
    };

    const updatePrototype = async (data: UpdatePrototypeDTO) => {
        await updatePrototypeService(data);
    }

    const deletePrototype = async (prototypeId: string) => {
        await deletePrototypeService(prototypeId);
    }

    return {
        prototypes,
        loading,
        createPrototype,
        updatePrototype,
        deletePrototype
    }
}