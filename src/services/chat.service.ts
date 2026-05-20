// ===== GERAL IMPORTS =====
import { api } from "./api";
import { db } from "../firebaseConfig/config";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    type Timestamp,
} from "firebase/firestore";

// ===== TYPES =====
export interface MessageProps {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    base64Image?: string;
    viewedBy?: string[];
    isEdited?: boolean;
    createdAt: Timestamp | null;
}

// ===== API (WRITE) =====

// Enviar mensagem
export const sendMessage = async (projectId: string, text: string, base64Image?: string) => {
await api.post(`/projects/${projectId}/messages`, {
        text,
        base64Image
    });
};

// Editar mensagem
export const updateMessage = async (projectId: string, messageId: string, text: string) => {
    await api.patch(`/projects/${projectId}/messages/${messageId}`, { text });
};

// Marcar como lida
export const markMessageAsRead = async (projectId: string, messageId: string) => {
    await api.patch(`/projects/${projectId}/messages/${messageId}/read`);
};

// ===== FIRESTORE (READ REALTIME) =====

export const subscribeToMessages = (projectId: string,callback: (messages: MessageProps[]) => void) => {
    const messagesRef = collection(db, "projects", projectId, "messages");

    const q = query(messagesRef, orderBy("createdAt", "asc"));

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as MessageProps[];

        callback(messages);
    });
};

export const deleteMessage = async (projectId: string, messageId: string) => {
    await api.delete(`/projects/${projectId}/messages/${messageId}`);
};
