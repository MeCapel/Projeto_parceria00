import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { useState, useEffect, useContext } from "react";
import { doc, getDoc } from 'firebase/firestore'
import { Logout } from "../../services/authService";
import { db } from "../../firebaseConfig/config";
import { PersonCircle, BoxArrowRight, PersonAdd, InfoCircle } from "react-bootstrap-icons";
import { AuthContext } from "../../context/AuthContext";

interface AccountSettingsProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

interface UserData {
    username: string; // Corrigido para bater com o Firestore
    email: string;
}

export default function AccountSettings({ isOpen, onOpen, onClose } : AccountSettingsProps)
{
    const { user, loading } = useContext(AuthContext);
    const [ userData, setUserData ] = useState<UserData | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading || !user) return;

        const fetchUserData = async () => {
            try 
            {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists())
                {
                    const data = docSnap.data();
                    setUserData({
                        username: data.username || "",
                        email: data.email || user.email || ""
                    });
                }
            }
            catch (error)
            {
                console.error("Error fetching user: ", error);
            }
        };

        fetchUserData();
    }, [user, loading, isOpen]); // Busca sempre que abrir o menu ou mudar o usuário

    return(
        <div className="d-flex justify-content-center">
            <button className={ isOpen ? "d-flex align-items-center btn-custom btn-custom-outline-primary shadow-sm" : "d-flex align-items-center text-custom-black btn-custom" } 
                    style={{ borderRadius: "50%", padding: "8px" }}
                    onClick={ () => (isOpen ? onClose() : onOpen() ) }>
                <PersonCircle size={28} />
            </button>

            { isOpen &&
                createPortal(
                    (
                        /* --- 🔴 Portal div --- */
                        <div className="shadow-lg border rounded-3 bg-white"
                                style={{ 
                                    position: "fixed",
                                    top: '70px', 
                                    right: '20px', 
                                    zIndex: 2000,
                                    width: "320px",
                                    animation: "fadeIn 0.2s ease-out"
                                }}>

                            {/* --- 🔵 Inner content portal --- */}
                            <div className="p-4">
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    {/* --- 🔵 Img div --- */}
                                    <div className="d-flex align-items-center justify-content-center rounded-circle border bg-light shadow-sm"
                                            style={{ width: '60px', height: '60px', flexShrink: 0 }}>
                                            <PersonCircle size={40} className="text-secondary" />
                                    </div>

                                    {/* --- 🔵 Text infos div --- */}
                                    <div className="overflow-hidden">
                                        <p className="fs-5 mb-0 fw-bold text-dark text-truncate">{userData?.username || "Usuário"}</p>
                                        <p className="small mb-0 text-muted text-truncate">{user?.email}</p>
                                    </div>
                                </div>

                                <div className="d-flex flex-column gap-2">
                                    <button 
                                        className="btn btn-outline-danger d-flex gap-3 align-items-center w-100 justify-content-start py-2 border-0"
                                        onClick={() => {
                                            onClose();
                                            navigate("/profile");
                                        }}
                                    >
                                        <InfoCircle size={20}/>
                                        <span className="fw-semibold">Meu Perfil</span>
                                    </button>

                                    <button 
                                        className="btn btn-outline-secondary d-flex gap-3 align-items-center w-100 justify-content-start py-2 border-0 text-dark"
                                        onClick={() => {
                                            onClose();
                                            // Lógica de convite aqui se houver
                                        }}
                                    >
                                        <PersonAdd size={20}/>
                                        <span className="fw-semibold">Convidar Colegas</span>
                                    </button>
                                    
                                    <hr className="my-2" />

                                    <button 
                                        className="btn btn-danger d-flex gap-3 align-items-center w-100 justify-content-center py-2 mt-2 shadow-sm"
                                        onClick={async () => {
                                            onClose();
                                            await Logout();
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