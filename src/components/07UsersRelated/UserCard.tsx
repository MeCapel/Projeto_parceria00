// ===== GERAL IMPORTS =====
import React from "react";
import { Trash3Fill } from "react-bootstrap-icons";
import { toast } from "react-toastify";

// ===== INTERFACE to define type =====
interface Props {
    user: {
        id: string;
        username: string;
        email: string;
        image?: string; // IMPORTANTE: Padronizado como 'image'
        role?: string;
    };
    onDelete?: (userId: string) => Promise<void>;
    subtitle?: React.ReactNode;
    children?: React.ReactNode;
}

export default function UserCard({
    user,
    onDelete,
    subtitle,
    children
}: Props) {

    const handleDelete = async () => {
        if (!user.id || !onDelete) return;
        try {
            await onDelete(user.id);
            toast.success("Membro removido com sucesso!");
        } catch (error) {
            console.error("Erro ao remover membro:", error);
            toast.error("Erro ao remover membro.");
        }
    };

    // Pegar a inicial do nome para o fallback
    const getInitials = (name: string) => {
        return name ? name.charAt(0).toUpperCase() : "?";
    };

    return (
        // AJUSTE VISUAL: Removidas bordas e padding excessivo daqui para evitar duplicação no modal
        <div className="d-flex flex-column gap-3 bg-white w-100">
            <div className="d-flex align-items-center gap-3">
                
                {/* Imagem ou Inicial */}
                <div 
                    className="rounded-circle border border-custom-red shadow-sm d-flex align-items-center justify-content-center bg-white overflow-hidden"
                    style={{ width: "60px", height: "60px" }}
                >
                    {/* A MÁGICA ACONTECE AQUI: Mudamos de profileImage para image */}
                    {user.image ? (
                        <img 
                            src={user.image} 
                            alt={user.username} 
                            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                        />
                    ) : (
                        <span className="fs-3 fw-bold text-custom-red">
                            {getInitials(user.username)}
                        </span>
                    )}
                </div>

                {/* Dados do Usuário */}
                <div className="grow">
                    <span className="text-custom-black fw-bold mb-0 text-truncate">
                        {user.username}
                    </span>
                    <p className="text-muted mb-0 text-truncate" style={{ fontSize: "0.85rem" }}>
                        {user.email}
                    </p>
                    
                    {/* Role Tag */}
                    {user.role && (
                        <div className="d-flex align-items-center gap-2 mt-1">
                            <span 
                                className="badge bg-custom-black text-white px-2 py-1"
                                style={{ fontSize: "0.65rem", textTransform: "capitalize" }}
                            >
                                {user.role}
                            </span>
                            {subtitle && (
                                <span className="text-muted" style={{ fontSize: "0.7rem" }}>
                                    • {subtitle}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Botão Excluir */}
                {onDelete && (
                    <button 
                        type="button"
                        onClick={handleDelete}
                        className="btn-custom btn-custom-outline-danger px-3 py-2 d-flex gap-2 align-items-center text-truncate"
                        style={{ height: "35px" }}
                    >
                        <Trash3Fill size={14}/>
                        <span>Excluir</span>
                    </button>
                )}
            </div>

            {/* Ações Inferiores (Dropdown Função) */}
            {children && (
                <div className="mt-2 pt-3 border-top w-100">
                    {children}
                </div>
            )}
        </div>
    );
}