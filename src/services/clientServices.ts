// ===== GERAL IMPORTS =====
import { toast } from "react-toastify";
import { db } from "../firebaseConfig/config"; 
import { addDoc, deleteDoc, collection, doc, updateDoc, onSnapshot, serverTimestamp, getDoc } from 'firebase/firestore';

export interface ClientProps {
    id: string;
    name: string,
    clientFone: string,
    revend: string,
    revendFone: string,
    state: string,
    city: string,
    area: string,
}

const clientsCollectionRef = collection(db, "clients");

// ----- Função para cadastrar -----
export const createClient = async (name: string, clientFone: string, revend: string, revendFone: string, state: string, city: string, area: string) => {
    try {
        const docRef = await addDoc(clientsCollectionRef, {
            name,
            clientFone,
            revend,
            revendFone,
            state,
            city,
            area,
            createdAt: serverTimestamp()
        });
        
        return docRef.id;
    } catch (err) {
        toast.error(`Erro ao cadastrar cliente`);
        console.error(err);
    }
}

// ----- Função para atualizar -----
export const updateClient = async (clientId: string, name: string, clientFone: string, revend: string, revendFone: string, state: string, city: string, area: string) => {
    try {
        const clienteRef = doc(db, "clients", clientId);
        await updateDoc(clienteRef, { 
            name,
            clientFone,
            revend,
            revendFone,
            state,
            city,
            area,
        });
    } catch (err) {
        console.error(err);
        toast.error(`Erro ao atualizar cliente`);
    }
}

// ----- Função para listar em tempo real -----
export const getClients = (callback: (clients: ClientProps[]) => void) => {
    return onSnapshot(clientsCollectionRef, (snapshot) => {
        const clientesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }) as ClientProps);
        callback(clientesData);
    });
}

export const getClient = async (clientId: string): Promise<ClientProps | null> => {
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

// ----- Função para deletar -----
export const deleteClient = async (clientId: string) => {
    try {
        const clienteRef = doc(db, "clients", clientId);
        await deleteDoc(clienteRef);
        toast.info("Cliente removido");
    } catch (err) {
        console.error(err);
    }
}