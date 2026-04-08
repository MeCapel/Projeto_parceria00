// ===== GERAL IMPORTS =====
import { toast } from "react-toastify";
import { db } from "../firebaseConfig/config"; 
import { addDoc, deleteDoc, collection, doc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import type { Cliente } from "../types";

const clientsCollectionRef = collection(db, "clients");

// ----- Função para cadastrar -----
export const createCliente = async (nome: string, revenda: string, telefone: string, area: string) => {
    try {
        const docRef = await addDoc(clientsCollectionRef, {
            nome,
            revenda,
            telefone,
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
export const updateCliente = async (clientId: string, nome: string, revenda: string, telefone: string, area: string) => {
    try {
        const clienteRef = doc(db, "clients", clientId);
        await updateDoc(clienteRef, { nome, revenda, telefone, area });
    } catch (err) {
        console.error(err);
        toast.error(`Erro ao atualizar cliente`);
    }
}

// ----- Função para listar em tempo real -----
export const getClientes = (callback: (clients: Cliente[]) => void) => {
    return onSnapshot(clientsCollectionRef, (snapshot) => {
        const clientesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }) as Cliente);
        callback(clientesData);
    });
}

// ----- Função para deletar -----
export const deleteCliente = async (clientId: string) => {
    try {
        const clienteRef = doc(db, "clients", clientId);
        await deleteDoc(clienteRef);
        toast.info("Cliente removido");
    } catch (err) {
        console.error(err);
    }
}