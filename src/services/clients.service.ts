import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { api } from "./api";
import { db } from "../firebaseConfig/config";

// ===== TYPES =====
export interface ClientProps {
  id: string;
  name: string;
  clientFone: string;
  revend: string;
  revendFone: string;
  state: string;
  city: string;
  area: string;
  createdBy?: string;
  createdAt?: string;
}

const clientsCollectionRef = collection(db, "clients");

// ===== GET =====

// ----- Função para listar em tempo real -----
export const listenClients = (callback: (clients: ClientProps[]) => void) => {
    return onSnapshot(clientsCollectionRef, (snapshot) => {
        const clientesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }) as ClientProps);
        callback(clientesData);
    });
}

export const listenClient = async (clientId: string): Promise<ClientProps | null> => {
    try
    {
        const docRef = doc(clientsCollectionRef, clientId);
        const docSnap = await getDoc(docRef) 

        if (!docSnap.exists()) return null;

        return {
            id: docSnap.id,
            ...docSnap.data()
        } as ClientProps;
    }
    catch (err)
    {
        console.error(err);
        return null;
    }
}

// listar clientes
export const getClients = async () => {
  const response = await api.get("/clients");
  return response.data;
};

// pegar cliente por id
export const getClient = async (clientId: string): Promise<ClientProps> => {
  const response = await api.get(`/clients/${clientId}`);
  return response.data;
};

// ===== POST =====

// criar cliente
export const createClient = async (data: Omit<ClientProps, "id">) => {
  const response = await api.post("/clients", data);
  return response.data;
};

// ===== PATCH =====

// atualizar cliente
export const updateClient = async (
  clientId: string,
  data: Partial<ClientProps>
) => {
  const response = await api.patch(`/clients/${clientId}`, data);
  return response.data;
};

// ===== DELETE =====

// deletar cliente
export const deleteClient = async (clientId: string) => {
  const response = await api.delete(`/clients/${clientId}`);
  return response.data;
};