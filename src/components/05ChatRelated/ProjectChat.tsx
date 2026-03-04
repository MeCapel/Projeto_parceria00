// src/components/05ChatRelated/ProjectChat.tsx
import { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Paperclip, Send } from 'react-bootstrap-icons'; // Você já usa essa lib!
import ChatMessage from './ChatMessage';

const ProjectChat = () => {
  const [message, setMessage] = useState("");

  // Dados falsos para visualizar o padrão
  const mockMessages = [
    { id: 1, text: "Olá time Baldan!", senderName: "Isis", isMe: true, readByCount: 2 },
    { id: 2, text: "Foto do novo protótipo", imageUrl: "https://via.placeholder.com/150", senderName: "Ruivinho", isMe: false, readByCount: 1 },
  ];

  return (
    <div className="d-flex flex-column h-100 p-3 border rounded bg-white">
      <div className="flex-grow-1 overflow-auto mb-3" style={{ minHeight: '300px' }}>
        {mockMessages.map(msg => <ChatMessage key={msg.id} {...msg} />)}
      </div>

      <Form onSubmit={(e) => e.preventDefault()}>
        <InputGroup>
          <Button variant="outline-secondary">
            <Paperclip />
          </Button>
          <Form.Control 
            placeholder="Digite sua mensagem..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="primary">
            <Send />
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default ProjectChat;import { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Paperclip, Send } from 'react-bootstrap-icons';
import ChatMessage from './ChatMessage';

interface ProjectChatProps {
  projectId: string;
}

export default function ProjectChat({ projectId }: ProjectChatProps) {
  const [message, setMessage] = useState("");

  // Dados falsos para você ver o layout funcionando
  const mockMessages = [
    { id: 1, text: "Iniciando o chat do projeto Baldan", senderName: "Isis", isMe: true, readByCount: 2 },
    { id: 2, text: "Preciso enviar as fotos do protótipo", senderName: "Sistema", isMe: false, readByCount: 1 },
  ];

  return (
    <div className="d-flex flex-column bg-white border rounded" style={{ height: '500px' }}>
      <div className="flex-grow-1 overflow-auto p-3" style={{ backgroundColor: '#f8f9fa' }}>
        {mockMessages.map(msg => <ChatMessage key={msg.id} {...msg} />)}
      </div>

      <Form className="p-2 border-top" onSubmit={(e) => e.preventDefault()}>
        <InputGroup>
          <Button variant="outline-secondary" title="Anexar foto">
            <Paperclip />
          </Button>
          <Form.Control 
            placeholder="Escreva para o grupo..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="primary">
            <Send />
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
}