import { useEffect, useState } from "react"
import { type ClientProps, 
         getClients,
         getClient as getAClient,
         createClient as createClientService,
         updateClient as updateClientService,
         deleteClient as deletaClientService,
} from "../services/clientServices";
import { getCurrentUser } from "../services/authServices";

interface CreateClientDTO {
    name: string,
    clientFone: string,
    revend: string,
    revendFone: string,
    state: string,
    city: string,
    area: string,
}

interface UpdateClientDTO {
    id: string,
    name: string,
    clientFone: string,
    revend: string,
    revendFone: string,
    state: string,
    city: string,
    area: string,
}

export const useClients = () => {
    const [client, setClient] = useState<ClientProps | null>(null);
    const [ clients, setClients ] = useState<ClientProps[]>([]);
    const [ loading, setLoading ] = useState<boolean>(true);

    useEffect(() => {
        const user = getCurrentUser()
        
            if (!user) {
              setClients([]);
              setLoading(false);
              return;
            }
        
            setLoading(true);

        const unsubscribe = getClients((clientsList) => {
            setClients(clientsList || []);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const createClient = async (data: CreateClientDTO): Promise<ClientProps | null> => {
        const user = getCurrentUser();
        if (!user) return null;

        const id = await createClientService(
            data.name,
            data.clientFone,
            data.revend,
            data.revendFone,
            data.state,
            data.city,
            data.area
        );

        if (!id) return null;

        const newClient = await getAClient(id);

        if (!newClient) return null;
        
        return newClient;
    };

    const getClient = async (clientId: string) => {
        const user = getCurrentUser();
        if (!user) return;

        const newClient = await getAClient(clientId);
        setClient(newClient);
    };

    const updateClient = async (data: UpdateClientDTO) => {
        await updateClientService(data.id, data.name, data.clientFone, data.revend, data.revendFone, data.state, data.city, data.area);
    }

    const deleteClient = async (clientId: string) => {
        await deletaClientService(clientId);
    }

    return {
        client,
        clients,
        loading,
        createClient,
        getClient,
        updateClient,
        deleteClient
    }
}
