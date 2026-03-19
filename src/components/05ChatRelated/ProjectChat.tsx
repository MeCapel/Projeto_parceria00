import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebaseConfig/config';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { getCurrentUser } from '../../services/authServices';

interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  createdAt: Timestamp | null;
}

interface ChatProps {
  projectId: string;
}

const ProjectChat: React.FC<ChatProps> = ({ projectId }) => {
  const user = getCurrentUser();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messagesRef = collection(db, "projects", projectId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];
      setMessages(docs);
    });

    return () => unsubscribe();
  }, [projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !user) return;

    try {
      const messagesRef = collection(db, "projects", projectId, "messages");
      await addDoc(messagesRef, {
        text: newMessage,
        senderId: user.uid,
        senderName: user.displayName || user.email,
        createdAt: serverTimestamp()
      });
      setNewMessage("");
    } catch (error) {
      console.error("Erro ao enviar:", error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '400px', background: '#fff' }}>
      {/* Área de Mensagens */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '15px', background: '#f9f9f9' }}>
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <small style={{ background: '#eee', padding: '2px 8px', borderRadius: '10px', color: '#666' }}>Sistema</small>
            <p style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>Bem-vindo ao chat do projeto!</p>
        </div>
        
        {messages.map((msg) => (
          <div key={msg.id} style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: msg.senderId === user?.uid ? 'flex-end' : 'flex-start',
            marginBottom: '10px'
          }}>
            <div style={{
              padding: '10px',
              borderRadius: '10px',
              background: msg.senderId === user?.uid ? '#d32f2f' : '#fff', // Vermelho Baldan ou Branco
              color: msg.senderId === user?.uid ? '#fff' : '#333',
              maxWidth: '85%',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              fontSize: '14px'
            }}>
              {msg.text}
            </div>
            <small style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>
              {msg.senderId === user?.uid ? 'Enviado' : msg.senderName}
            </small>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} style={{ padding: '10px', borderTop: '1px solid #eee', display: 'flex' }}>
        <input 
          style={{ flex: 1, border: 'none', padding: '8px', outline: 'none' }}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escreva..."
        />
        <button type="submit" className="btn-custom btn-custom-primary fw-bold" style={{ border: 'none', cursor: 'pointer' }}>
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ProjectChat;