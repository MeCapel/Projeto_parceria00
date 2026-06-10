// ===== GERAL IMPORTS ======
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { PersonCircle, BoxArrowRight, InfoCircle } from "react-bootstrap-icons";
import { AuthContext } from "../../context/AuthContext";
import { logout } from "../../services/auth.service";

// ===== INTERFACE TYPES =====
interface AccountSettingsProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

// ===== MAIN COMPONENT =====
// ----- Componente responsável por exbir pequeno menu de ações relacionadas a conta do usuário ao criar na foto de perfil no canto direito superior ----- 
export default function AccountSettings({ isOpen, onOpen, onClose } : AccountSettingsProps)
{
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    return(
        <div className="d-flex justify-content-center">
            {/* Botão do Header */}
            <button 
                className={ isOpen ? "d-flex align-items-center btn-custom btn-custom-gray shadow-sm overflow-hidden" : "d-flex align-items-center text-custom-black btn-custom overflow-hidden" }
                style={{ borderRadius: "50%", padding: user?.profileImage ? "0px" : "8px", width: "45px", height: "45px" }}
                onClick={ () => (isOpen ? onClose() : onOpen() ) }
            >
                {user?.profileImage ? (
                    <img src={user.profileImage} alt="Me" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <PersonCircle size={28} />
                )}
            </button>

            { isOpen &&
                createPortal(
                    (
                        <div 
                            className="shadow-lg border rounded-3 bg-white"
                            style={{
                                position: "fixed",
                                top: '70px',
                                right: '20px',
                                zIndex: 2000,
                                width: "320px",
                                animation: "fadeIn 0.2s ease-out"
                            }}>

                            <div className="p-4">
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    {/* Foto no Card que desce */}
                                    <div 
                                        className="d-flex align-items-center justify-content-center rounded-circle border bg-light shadow-sm overflow-hidden"
                                        style={{ width: '60px', height: '60px', flexShrink: 0 }}
                                    >
                                            {user?.profileImage ? (
                                                <img src={user.profileImage} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <PersonCircle size={40} className="text-secondary" />
                                            )}
                                    </div>

                                    <div className="overflow-hidden">
                                        <p className="fs-5 mb-0 fw-bold text-dark text-truncate">{user?.username || "Usuário"}</p>
                                        <p className="small mb-0 text-muted text-truncate">{user?.email}</p>
                                    </div>
                                </div>

                                <div className="d-flex flex-column gap-2">
                                    <button
                                        className="btn-custom btn-custom-gray d-flex gap-3 align-items-center w-100 justify-content-start py-2 border-0 rounded-3"
                                        onClick={() => {
                                            onClose();
                                            navigate("/profile");
                                        }}
                                    >
                                        <InfoCircle size={20}/>
                                        <span className="fw-semibold">Meu Perfil</span>
                                    </button>

                                    <hr className="my-2" />

                                    <button
                                        className="btn-custom btn-custom-outline-primary d-flex gap-3 align-items-center w-100 justify-content-center py-2 mt-2 shadow-sm rounded-3"
                                        onClick={async () => {
                                            onClose();
                                            await logout();
                                            navigate("/login");
                                        }}
                                    >
                                        <BoxArrowRight size={20}/>
                                        <span className="fw-bold">Sair da Conta</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                ), document.body
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}
