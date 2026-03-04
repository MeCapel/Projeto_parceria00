import { Modal } from 'react-bootstrap'
import { PencilSquare } from 'react-bootstrap-icons'
import { toast } from 'react-toastify'

import { useNavigate } from 'react-router'
import { useCallback, useEffect, useState, useContext } from 'react'

import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig/config'
import { updateAccount, type EditUserData } from '../services/authService'
import { AuthContext } from '../context/AuthContext'

export default function Profile()
{
    const { user, loading } = useContext(AuthContext);
    const [ userData, setUserData ] = useState<EditUserData | null>(null);
    const [ show, setShow ] = useState<boolean>(false);
    const [ newUsername, setNewUsername ] = useState("");
    
    const navigate = useNavigate();

    const openModal = () => {
        setNewUsername(userData?.username || "");
        setShow(true);
    };
    const closeModal = useCallback(() => {setShow(false)}, []);

    const handleSubmit = async (e: React.FormEvent ) => {
        e.preventDefault();

        // Se não tiver usuário logado ou nome vazio, não faz nada
        if (!user || !newUsername.trim()) {
            toast.error("❌ Dados inválidos para atualização.");
            return;
        }

        try
        {
            // Usamos o UID direto do contexto para garantir o salvamento no documento certo
            await updateAccount({
                userId: user.uid, 
                username: newUsername, 
                email: user.email || "" 
            });
            
            // Atualiza o estado local para a UI refletir a mudança
            if (userData) {
                setUserData({ ...userData, username: newUsername });
            } else {
                setUserData({ userId: user.uid, username: newUsername, email: user.email || "" });
            }

            toast.success("✅ Perfil atualizado com sucesso!");
            closeModal();
        }
        catch (err)
        {
            console.error(err);
            toast.error("❌ Erro ao salvar alterações.");
        }
    };

    // Busca os dados do Firestore baseados no usuário do contexto
    useEffect(() => {
        if (loading) return;

        if (!user) {
            navigate("/login");
            return;
        }

        const fetchUserData = async () => {
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUserData({ 
                        userId: user.uid,
                        username: data.username || "",
                        email: data.email || user.email || ""
                    });
                    setNewUsername(data.username || "");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [user, loading, navigate]);

    useEffect(() => {
        const header = document.querySelector('.showOrHide') as HTMLElement | null;
        if (!header) return;
        header.classList.toggle("hidden-header", show);
    }, [show]);

    if (loading) return <div className="p-5">Carregando perfil...</div>;

    return(
        <>
            <div className="container-fluid d-flex justify-content-center my-5">
                <div className="bg-light rounded-3 border w-100" style={{ maxWidth: "800px" }}>
                    <div className="rounded-top-3" style={{ backgroundImage: 'url(/fromBrand/background-pattern.png)', height: "15rem", backgroundSize: "cover" }}></div>
                    
                    <div className="px-5 pb-5">
                        <div className="d-flex align-items-center justify-content-center rounded-circle shadow-sm border bg-white position-relative" 
                                style={{ height: "150px", width: "150px", top: "-75px" }}>
                             <PencilSquare size={40} className="text-muted" />
                        </div>
                        
                        <div className="position-relative" style={{ top: "-50px" }}>
                            <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
                                <div>
                                    <h2 className='text-custom-black fw-bold mb-0'>{userData?.username || "Usuário"}</h2>
                                    <p className="text-muted fs-5 mb-0">Colaborador</p>
                                </div>

                                <button className="btn-custom btn-custom-primary d-flex gap-2 align-items-center px-4"
                                        onClick={openModal}>
                                    <PencilSquare size={18}/>
                                    <span>Editar perfil</span>
                                </button>
                            </div>
                            
                            <div className="border-top pt-4">
                                <p className="text-custom-black fs-5">
                                    <strong>Email:</strong> {user?.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={show} onHide={closeModal} centered>
                    <Modal.Header closeButton className="border-0 px-4 pt-4"></Modal.Header>
                    <Modal.Body className="px-5 pb-5 pt-0">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <p className='fs-6 mb-1 text-custom-red fw-bold'>GERENCIAMENTO</p>
                                <h2 className='text-custom-black fw-bold'>Editar Perfil</h2>
                                <p className='text-muted small'>Atualize suas informações de conta.</p>
                            </div>

                            <div className="d-flex flex-column gap-3 mb-4">
                                <div className="form-group">
                                    <label className="mb-2 text-custom-black fw-semibold">Nome de usuário</label>
                                    <input 
                                        type="text" 
                                        placeholder='Insira seu nome...' 
                                        className='form-control py-2 px-3 border' 
                                        required 
                                        onChange={(e) => setNewUsername(e.target.value)} 
                                        value={newUsername} 
                                    />
                                </div>
                            </div>

                            <div className="d-flex align-items-center justify-content-end gap-2 mt-5">
                                <button className='btn btn-light px-4' type='button' onClick={closeModal}>Cancelar</button>
                                <button className='btn btn-danger px-4' type='submit'>Salvar Alterações</button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    )
}