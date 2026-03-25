// ===== GERAL IMPORTS =====
import { db } from "../firebaseConfig/config";
import { collection,  addDoc,  query,  orderBy,  onSnapshot,  serverTimestamp,  Timestamp,  doc,  updateDoc,  arrayUnion } from "firebase/firestore";

// ===== TYPE INTERFACE =====
export interface MessageProps {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    base64Image?: string;
    viewedBy?: string[]; // IDs de usuários que viram a mensagem
    isEdited?: boolean;  // Marca se a mensagem foi editada
    createdAt: Timestamp | null;
}

// ===== FUNCTIONS =====

// ----- This function creates / sends a message in the chat of the project -----
// Enviar mensagem (com ou sem imagem)
export const sendMessage = async (projectId: string, text: string, senderId: string, senderName: string, base64Image?: string) => {
    try {
        const messagesRef = collection(db, "projects", projectId, "messages");
        await addDoc(messagesRef, {
            text,
            senderId,
            senderName,
            base64Image: base64Image || null,
            viewedBy: [senderId], // O remetente já "viu" a mensagem ao enviar
            isEdited: false,
            createdAt: serverTimestamp(),
        });
    } catch (err) {
        console.error(`Erro ao enviar mensagem: ${err}`);
    }
};

// ----- This function updates a message in the chat of the project -----
// Editar mensagem existente
export const updateMessage = async (projectId: string, messageId: string, newText: string) => {
    try {
        const messageRef = doc(db, "projects", projectId, "messages", messageId);
        await updateDoc(messageRef, {
            text: newText,
            isEdited: true,
            editedAt: serverTimestamp()
        });
    } catch (err) {
        console.error(`Erro ao editar mensagem: ${err}`);
    }
};

// Marcar mensagem como visualizada
export const markMessageAsRead = async (projectId: string, messageId: string, userId: string) => {
    try {
        const messageRef = doc(db, "projects", projectId, "messages", messageId);
        await updateDoc(messageRef, {
            viewedBy: arrayUnion(userId)
        });
    } catch (err) {
        console.error(`Erro ao marcar como lida: ${err}`);
    }
};

// Ouvir mensagens em tempo real
export const subscribeToMessages = (projectId: string, callback: (messages: MessageProps[]) => void) => {
    const messagesRef = collection(db, "projects", projectId, "messages");

    // order by most recent ones
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as MessageProps));
        callback(messages);
    });
};
