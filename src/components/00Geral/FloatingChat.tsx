// ===== GERAL IMPORTS =====
import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router";
import { ChatDotsFill, XCircleFill } from "react-bootstrap-icons";
import Chat from "./Chat";
import { AuthContext } from "../../context/AuthContext";

// ===== MAIN COMPONENT =====
// ----- Componente responsável pelo botão flutuante do chat -----
export default function FloatingChat() {
    const { projectid } = useParams();
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

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
                            userName={user.displayName || user.email || "Usuário"} 
                        />
                    </div>
                </div>
            )}

            {/* Botão Flutuante (Floating Action Button) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-danger rounded-circle shadow-lg d-flex align-items-center justify-content-center"
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

            <style>{`
                @keyframes slideIn {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
