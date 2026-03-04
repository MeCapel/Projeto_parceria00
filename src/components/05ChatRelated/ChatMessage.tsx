// src/components/05ChatRelated/ChatMessage.tsx
import { Card, Image } from 'react-bootstrap';

interface ChatMessageProps {
  text?: string;
  imageUrl?: string;
  senderName: string;
  isMe: boolean;
  readByCount: number;
}

export default function ChatMessage({ text, imageUrl, senderName, isMe, readByCount }: ChatMessageProps) {
  return (
    <div className={`d-flex ${isMe ? 'justify-content-end' : 'justify-content-start'} mb-3`}>
      <Card className={`p-2 ${isMe ? 'bg-primary text-white' : 'bg-light'}`} style={{ maxWidth: '70%' }}>
        <small className="fw-bold mb-1" style={{ fontSize: '0.8rem' }}>{senderName}</small>
        {imageUrl && <Image src={imageUrl} fluid rounded className="mb-2" />}
        {text && <p className="mb-0">{text}</p>}
        <div className="text-end" style={{ fontSize: '0.65rem', opacity: 0.8 }}>
          {readByCount > 0 ? `Visualizado por ${readByCount}` : 'Enviado'}
        </div>
      </Card>
    </div>
  );
}