import { db } from "../firebaseConfig/config";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from "firebase/firestore";

export interface MessageProps {
    id?: string;
    text: string;
    senderId: string;
    senderName: string;
    createdAt: Timestamp | null;
    base64Image?: string; // Campo para a imagem em base64
}

// Enviar mensagem (com ou sem imagem)
export const sendMessage = async (projectId: string, text: string, senderId: string, senderName: string, base64Image?: string) => {
    try {
        const messagesRef = collection(db, "projects", projectId, "messages");
        await addDoc(messagesRef, {
            text,
            senderId,
            senderName,
            base64Image: base64Image || null,
            createdAt: serverTimestamp(),
        });
    } catch (err) {
        console.error("Erro ao enviar mensagem:", err);
    }
};

// Ouvir mensagens em tempo real
export const subscribeToMessages = (projectId: string, callback: (messages: MessageProps[]) => void) => {
    const messagesRef = collection(db, "projects", projectId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as MessageProps));
        callback(messages);
    });
};
