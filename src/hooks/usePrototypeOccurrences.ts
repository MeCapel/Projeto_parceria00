import { useEffect, useState } from "react"
import { 
    createOccurrence as createOccurrenceService, 
    updateOccurrence as updateOccurrenceService,
    deleteOccorrence as deleteOccurenceService,
    listOccurenciesByPrototype, 
    type OccurrenceProps 
} from "../services/occurrenceServices";
import { getCurrentUser } from "../services/authServices";

export interface CreateOccurrenceDTO {
    name: string
    description: string
    criticity: string
    prototypeId: string
    image?: string
    status: "Pendente" | "Em andamento" | "Concluído",
    dueOn: Date | null,
}

export interface updateOccurrenceDTO {
    id: string,
    name: string
    description: string
    criticity: string
    image?: string
    status: "Pendente" | "Em andamento" | "Concluído",
    dueOn: Date | null,
}

export default function usePrototypeOccurrences(prototypeId: string)
{
    const [ protoOccurrences, setProtoOccurrences ] = useState<OccurrenceProps[]>([]);
    const [ loading, setLoading ] = useState<boolean>(true);

    useEffect(() => {
        const user = getCurrentUser();
        
        if (!user) {
            setLoading(false);
            return;
        }

        const unsubscribe = listOccurenciesByPrototype(prototypeId, (occurrencesList) => {
            setProtoOccurrences(occurrencesList || []);
            setLoading(false);
        })

        return () => unsubscribe();
    }, [prototypeId]);

    const createOccurrence = async (data: CreateOccurrenceDTO) => {
        return createOccurrenceService(data);
    };

    const updateOccurrence = async (data: updateOccurrenceDTO) => {
        await updateOccurrenceService(data);
    } 

    const deleteOccurrence = async (id: string) => {
        await deleteOccurenceService(id);
    }

    return {
        protoOccurrences,
        loading,
        createOccurrence,
        updateOccurrence,
        deleteOccurrence
    }
} 