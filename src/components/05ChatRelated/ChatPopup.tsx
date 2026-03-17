import React, { useState } from 'react';
import ProjectChat from './ProjectChat';

interface ChatPopupProps {
  projectId: string;
}

const ChatPopup: React.FC<ChatPopupProps> = ({ projectId }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, fontFamily: 'sans-serif' }}>
      {isOpen && (
        <div style={{ 
          width: '320px', 
          backgroundColor: '#fff', 
          borderRadius: '12px', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          overflow: 'hidden',
          marginBottom: '15px',
          border: '1px solid #eee'
        }}>
          {/* Header do Pop-up */}
          <div style={{ 
            background: '#f8f9fa', 
            padding: '15px', 
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <strong style={{ display: 'block', fontSize: '14px' }}>Chat do Projeto</strong>
              <small style={{ color: '#888', fontSize: '11px' }}>ID: {projectId}</small>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#999' }}>×</button>
          </div>

          {/* O conteúdo do chat */}
          <ProjectChat projectId={projectId} />
        </div>
      )}

      {/* Botão Flutuante */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '60px', 
          height: '60px', 
          borderRadius: '50%', 
          backgroundColor: '#fff', 
          border: 'none', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
};

export default ChatPopup;