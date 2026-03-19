import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router";
import { ChatDotsFill, XCircleFill } from "react-bootstrap-icons";
import Chat from "./Chat";
import { AuthContext } from "../../context/AuthContext";
import { getUserById } from "../../services/authServices";
import { subscribeToMessages } from "../../services/chatService";

export default function FloatingChat() {
    const { projectid } = useParams();
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [displayUserName, setDisplayUserName] = useState<string>("Usuário");
    const [unreadCount, setUnreadCount] = useState(0);

    // Busca o nome real do usuário no Firestore
    useEffect(() => {
        if (!user?.uid) return;

        const fetchName = async () => {
            const data = await getUserById(user.uid);
            if (data?.username) {
                setDisplayUserName(data.username);
            } else {
                setDisplayUserName(user.displayName || user.email?.split('@')[0] || "Usuário");
            }
        };

        fetchName();
    }, [user]);

    // Monitora mensagens não lidas
    useEffect(() => {
        if (!projectid || !user?.uid) return;

        const unsubscribe = subscribeToMessages(projectid, (messages) => {
            const unread = messages.filter(msg => 
                msg.senderId !== user.uid && 
                (!msg.viewedBy || !msg.viewedBy.includes(user.uid))
            );
            setUnreadCount(unread.length);
        });

        return () => unsubscribe();
    }, [projectid, user?.uid]);

    // Efeito para fechar o chat automaticamente ao trocar de projeto ou sair da tela de projeto
    useEffect(() => {
        setIsOpen(false);
    }, [projectid]);

    // Se não estiver em um projeto, não mostra o widget
    if (!projectid || !user) return null;

    return (
        <div 
            style={{ 
                position: "fixed", 
                bottom: "30px", 
                right: "30px", 
                zIndex: 1050, 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "flex-end",
                gap: "15px"
            }}
        >
            {/* Janela de Chat */}
            {isOpen && (
                <div 
                    className="shadow-lg border rounded-4 overflow-hidden"
                    style={{ 
                        width: "350px", 
                        height: "500px", 
                        backgroundColor: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        animation: "slideIn 0.3s ease-out"
                    }}
                >
                    {/* Header customizado da janelinha flutuante */}
                    <div className="bg-danger p-3 d-flex justify-content-between align-items-center text-white">
                        <div>
                            <h6 className="mb-0 fw-bold">Chat do Projeto</h6>
                            <small style={{ opacity: 0.8 }}>Mensagens em tempo real</small>
                        </div>
                        <XCircleFill 
                            size={24} 
                            style={{ cursor: "pointer" }} 
                            onClick={() => setIsOpen(false)} 
                        />
                    </div>

                    {/* Componente de Chat */}
                    <div style={{ flex: 1, overflow: "hidden" }}>
                        <Chat 
                            projectId={projectid} 
                            userId={user.uid} 
                            userName={displayUserName} 
                        />
                    </div>
                </div>
            )}

            {/* Botão Flutuante (Floating Action Button) */}
            <div className="position-relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="btn-custom btn-custom-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center"
                    style={{ 
                        width: "65px", 
                        height: "65px", 
                        fontSize: "30px",
                        transition: "all 0.3s ease",
                        border: "4px solid #fff"
                    }}
                >
                    {isOpen ? <XCircleFill /> : <ChatDotsFill />}
                </button>

                {!isOpen && unreadCount > 0 && (
                    <span 
                        className="position-absolute translate-middle badge rounded-pill bg-success border border-light"
                        style={{ 
                            top: "5px", 
                            right: "-5px", 
                            fontSize: "0.75rem",
                            padding: "0.4em 0.6em",
                            zIndex: 1051,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                        }}
                    >
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </div>

            <style>{`
                @keyframes slideIn {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
