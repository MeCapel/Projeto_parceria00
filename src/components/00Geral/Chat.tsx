import React, { useState, useEffect, useRef } from "react";
import {
    sendMessage,
    subscribeToMessages,
    updateMessage,
    markMessageAsRead,
    type MessageProps
} from "../../services/chatService";
import {
    SendFill,
    Paperclip,
    XCircleFill,
    PencilFill,
    Check2All
} from "react-bootstrap-icons";

interface ChatProps {
    projectId: string;
    userId: string;
    userName: string;
}

export default function Chat({ projectId, userId, userName }: ChatProps) {
    const [messages, setMessages] = useState<MessageProps[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showViewersId, setShowViewersId] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Carregar mensagens em tempo real
    useEffect(() => {
        if (!projectId) return;
        const unsubscribe = subscribeToMessages(projectId, (data) => {
            setMessages(data);
            setTimeout(() => setLoading(false), 1000);

            data.forEach((msg) => {
                const isViewed = msg.viewedBy && msg.viewedBy.some(v => 
                    typeof v === 'string' ? v === userId : v.id === userId
                );
                
                if (msg.id && !isViewed && msg.senderId !== userId) {
                    markMessageAsRead(projectId, msg.id, userId);
                }
            });
        });
        return () => unsubscribe();
    }, [projectId, userId, userName]);

    // Scroll automático
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const formatTime = (timestamp: any) => {
        if (!timestamp) return "";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === "" && !selectedImage) return;

        if (editingId) {
            await updateMessage(projectId, editingId, newMessage);
            setEditingId(null);
            setNewMessage("");
        } else {
            const text = newMessage;
            const image = selectedImage;
            setNewMessage("");
            setSelectedImage(null);
            await sendMessage(projectId, text, userId, userName, image || undefined);
        }
    };

    const startEditing = (msg: MessageProps) => {
        setEditingId(msg.id);
        setNewMessage(msg.text);
    };

    return (
        <div className="d-flex flex-column h-100 chat-container">

            {/* Área de Mensagens */}
            <div
                ref={scrollRef}
                className="overflow-auto p-3 d-flex flex-column gap-2"
                style={{ scrollBehavior: "smooth" }}
            >
                {loading ? (
                    <div className="d-flex flex-column h-100 gap-3">
                        <div className="d-flex flex-column align-items-start"><div className="skeleton skeleton-bubble" /></div>
                        <div className="d-flex flex-column align-items-end"><div className="skeleton skeleton-bubble" /></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="d-flex h-100 align-items-center justify-content-center text-muted">
                        <div className="bg-white px-3 py-1 rounded-pill shadow-sm small border">Inicie uma conversa!</div>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMyMessage = String(msg.senderId) === String(userId);
                        const viewers = msg.viewedBy ? msg.viewedBy.filter(v => 
                            typeof v === 'string' ? v !== msg.senderId : v.id !== msg.senderId
                        ) : [];
                        const isReadByOthers = viewers.length > 0;

                        return (
                            <div
                                key={msg.id}
                                className={`d-flex flex-column msg-group ${isMyMessage ? "align-items-end" : "align-items-start"}`}
                            >
                                {/* Nome do Remetente */}
                                {!isMyMessage && (
                                    <small className="text-muted mb-1 ms-2" style={{ fontSize: '0.65rem', fontWeight: "bold" }}>
                                        {msg.senderName}
                                    </small>
                                )}

                                <div className="d-flex align-items-center gap-2">
                                    {isMyMessage && (
                                        <PencilFill
                                            size={12}
                                            className="text-muted edit-btn-trigger"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => startEditing(msg)}
                                        />
                                    )}

                                    <div
                                        className={`msg-bubble rounded-4 shadow-sm ${isMyMessage ? "msg-bubble-sent" : "msg-bubble-received"}`}
                                    >
                                        {msg.base64Image && (
                                            <img src={msg.base64Image} alt="Anexo" className="img-fluid rounded mb-2 d-block" style={{ maxHeight: "200px" }} />
                                        )}

                                        <div className="d-flex flex-column">
                                            <span className="pe-4">{msg.text}</span>

                                            <div className={`msg-meta ${isMyMessage ? "msg-sent-meta" : "msg-received-meta"}`}>
                                                {msg.isEdited && <span className="fw-normal" style={{fontSize: '0.6rem', fontStyle: 'italic'}}>editada</span>}
                                                <span>{formatTime(msg.createdAt)}</span>
                                                {isMyMessage && (
                                                    <Check2All 
                                                        size={15} 
                                                        style={{ color: isReadByOthers ? "#007bff" : "#adb5bd" }} 
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Lista de Quem Viu no Hover */}
                                {isMyMessage && isReadByOthers && (
                                    <div 
                                        className="viewed-by-list px-2 position-relative" 
                                        onMouseEnter={() => setShowViewersId(msg.id)}
                                        onMouseLeave={() => setShowViewersId(null)}
                                    >
                                        <small style={{ cursor: 'default', color: '#6c757d', fontSize: '0.6rem' }}>
                                            Visto por {viewers.length} pessoa(s)
                                        </small>
                                        
                                        {showViewersId === msg.id && (
                                            <div 
                                                className="bg-white border rounded shadow-lg p-2 position-absolute" 
                                                style={{ 
                                                    zIndex: 100, 
                                                    minWidth: '140px',
                                                    bottom: '100%',
                                                    right: '0',
                                                    marginBottom: '5px',
                                                    animation: 'fadeIn 0.2s ease-out'
                                                }}
                                            >
                                                <p className="mb-1 border-bottom fw-bold text-dark" style={{ fontSize: '0.65rem' }}>Lido por:</p>
                                                {viewers.map((v, i) => (
                                                    <div key={i} className="text-dark" style={{ fontSize: '0.6rem', whiteSpace: 'nowrap' }}>
                                                        • {typeof v === 'string' ? 'Usuário' : v.name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Preview Imagem / Edição */}
            {(selectedImage || editingId) && (
                <div className="p-2 bg-white border-top d-flex align-items-center gap-2">
                    {selectedImage ? (
                        <>
                            <img src={selectedImage} alt="Preview" style={{ height: "40px", width: "40px", objectFit: "cover" }} className="rounded" />
                            <small className="text-muted grow">Imagem selecionada</small>
                            <XCircleFill className="text-danger" style={{ cursor: "pointer" }} onClick={() => setSelectedImage(null)} />
                        </>
                    ) : (
                        <>
                            <PencilFill size={12} className="text-danger" />
                            <small className="text-muted grow">Editando mensagem</small>
                            <XCircleFill className="text-danger" style={{ cursor: "pointer" }} onClick={() => { setEditingId(null); setNewMessage(""); }} />
                        </>
                    )}
                </div>
            )}

            {/* Rodapé Input */}
            <div className="chat-input-area p-3 mt-auto border-top">
                <form onSubmit={handleSend} className="d-flex align-items-center gap-2">
                    {!editingId && (
                        <button type="button" className="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center border p-0" style={{ width: "40px", height: "40px" }} onClick={() => fileInputRef.current?.click()}>
                            <Paperclip size={20} className="text-secondary" />
                        </button>
                    )}
                    <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setSelectedImage(reader.result as string);
                            reader.readAsDataURL(file);
                        }
                    }} />
                    <input type="text" className="form-control rounded-pill border shadow-sm px-4" placeholder={editingId ? "Edite sua mensagem..." : "Escreva algo..."} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} style={{ fontSize: "0.95rem", height: "40px" }} />
                    <button type="submit" className="btn btn-danger rounded-circle shadow-sm d-flex align-items-center justify-content-center p-0" style={{ width: "40px", height: "40px", flexShrink: 0 }} disabled={!newMessage.trim() && !selectedImage}>
                        <SendFill size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}
