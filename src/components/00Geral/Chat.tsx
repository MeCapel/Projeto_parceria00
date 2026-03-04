import React, { useState, useEffect, useRef } from "react";
import { sendMessage, subscribeToMessages, type MessageProps } from "../../services/chatService";
import { SendFill, Paperclip, XCircleFill } from "react-bootstrap-icons";

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
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Carregar mensagens em tempo real
    useEffect(() => {
        if (!projectId) return;
        const unsubscribe = subscribeToMessages(projectId, (data) => {
            setMessages(data);
            // Delay artificial para visualização do Skeleton
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        });
        return () => unsubscribe();
    }, [projectId]);

    // Scroll automático para a última mensagem
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    // Converter imagem para Base64
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 800 * 1024) { // Limite de 800KB para não pesar o Firestore
                alert("Imagem muito grande! Máximo 800KB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === "" && !selectedImage) return;

        const text = newMessage;
        const image = selectedImage;
        
        setNewMessage(""); 
        setSelectedImage(null);
        
        await sendMessage(projectId, text, userId, userName, image || undefined);
    };

    return (
        <div className="d-flex flex-column h-100" style={{ backgroundColor: "#f8f9fa" }}>
            
            {/* Área de Mensagens */}
            <div 
                ref={scrollRef}
                className="overflow-auto p-3 flex-grow-1" 
                style={{ scrollBehavior: "smooth" }}
            >
                {loading ? (
                    /* SKELETON SCREEN */
                    <div className="d-flex flex-column h-100 gap-3">
                        <div className="d-flex flex-column align-items-start">
                             <div className="skeleton skeleton-title" />
                             <div className="skeleton skeleton-bubble" />
                        </div>
                        <div className="d-flex flex-column align-items-end">
                             <div className="skeleton skeleton-title text-end" style={{ alignSelf: 'flex-end' }} />
                             <div className="skeleton skeleton-bubble" />
                        </div>
                        <div className="d-flex flex-column align-items-start">
                             <div className="skeleton skeleton-title" />
                             <div className="skeleton skeleton-bubble" style={{ width: '60%' }} />
                        </div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="d-flex h-100 align-items-center justify-content-center text-muted">
                        <small>Inicie uma conversa!</small>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div 
                            key={msg.id} 
                            className={`d-flex flex-column mb-3 ${msg.senderId === userId ? "align-items-end" : "align-items-start"}`}
                        >
                            <small className="text-muted mb-1" style={{ fontSize: '0.65rem', fontWeight: "bold" }}>
                                {msg.senderId === userId ? "Você" : msg.senderName}
                            </small>
                            <div 
                                className={`p-2 px-3 rounded-4 shadow-sm ${msg.senderId === userId ? "bg-danger text-white" : "bg-white text-dark border"}`}
                                style={{ 
                                    maxWidth: "85%", 
                                    wordBreak: "break-word",
                                    borderBottomRightRadius: msg.senderId === userId ? "0px" : "15px",
                                    borderBottomLeftRadius: msg.senderId === userId ? "15px" : "0px",
                                }}
                            >
                                {msg.base64Image && (
                                    <img 
                                        src={msg.base64Image} 
                                        alt="Anexo" 
                                        className="img-fluid rounded mb-2 d-block shadow-sm" 
                                        style={{ maxHeight: "150px" }}
                                    />
                                )}
                                <span className="fs-6">{msg.text}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Preview da Imagem */}
            {selectedImage && (
                <div className="p-2 bg-white border-top d-flex align-items-center gap-2">
                    <img src={selectedImage} alt="Preview" style={{ height: "40px", width: "40px", objectFit: "cover" }} className="rounded" />
                    <small className="text-muted flex-grow-1">Imagem pronta para envio</small>
                    <XCircleFill className="text-danger" style={{ cursor: "pointer" }} onClick={() => setSelectedImage(null)} />
                </div>
            )}

            {/* Rodapé com Input (ESSENCIAL: SEMPRE VISÍVEL) */}
            <div className="bg-white border-top p-3 mt-auto">
                <form onSubmit={handleSend} className="d-flex align-items-center gap-2">
                    
                    <button 
                        type="button" 
                        className="btn btn-light rounded-circle p-1 d-flex align-items-center justify-content-center border"
                        style={{ width: "35px", height: "35px" }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Paperclip size={20} className="text-secondary" />
                    </button>
                    
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{ display: "none" }} 
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                    <input 
                        type="text" 
                        className="form-control rounded-pill border-0 bg-light px-3" 
                        placeholder="Escreva algo..." 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        style={{ fontSize: "0.9rem" }}
                    />

                    <button 
                        type="submit" 
                        className="btn btn-danger rounded-circle d-flex align-items-center justify-content-center p-0" 
                        style={{ width: "35px", height: "35px", flexShrink: 0 }}
                        disabled={!newMessage.trim() && !selectedImage}
                    >
                        <SendFill size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
}