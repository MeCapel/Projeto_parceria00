import { Modal } from 'react-bootstrap'
import { PencilSquare, CameraFill, PersonCircle } from 'react-bootstrap-icons'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import { useCallback, useEffect, useState, useContext, useRef } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig/config'
import { updateAccount } from '../services/authServices'
import { AuthContext } from '../context/AuthContext'

interface UserProfileData {
    userId: string;
    username: string;
    email: string;
    profileImage?: string;
}

export default function Profile() {
    const { user, loading } = useContext(AuthContext);
    const [userData, setUserData] = useState<UserProfileData | null>(null);
    const [show, setShow] = useState<boolean>(false);
    const [newUsername, setNewUsername] = useState("");
    const [newProfileImage, setNewProfileImage] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const openModal = () => {
        setNewUsername(userData?.username || "");
        setNewProfileImage(userData?.profileImage || null);
        setShow(true);
    };
    const closeModal = useCallback(() => { setShow(false) }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 500 * 1024) { // Limite de 500KB para o perfil
                toast.warn("Imagem muito grande! Escolha uma de até 500KB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || !newUsername.trim()) {
            toast.error("Dados inválidos para atualização.");
            return;
        }

        try {
            await updateAccount({
                userId: user.uid,
                username: newUsername,
                profileImage: newProfileImage || undefined
            });

            setUserData(prev => prev ? { 
                ...prev, 
                username: newUsername, 
                profileImage: newProfileImage || prev.profileImage 
            } : null);

            closeModal();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao salvar alterações.");
        }
    };

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
                        email: data.email || user.email || "",
                        profileImage: data.profileImage || undefined
                    });
                    setNewUsername(data.username || "");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [user, loading, navigate]);

    if (loading) return <div className="p-5 text-center"><div className="spinner-border text-danger"></div></div>;

    return (
        <>
            <div className="container-fluid d-flex justify-content-center my-5">
                <div className="bg-light rounded-3 border w-100 shadow-sm" style={{ maxWidth: "800px" }}>
                    {/* Banner de Fundo */}
                    <div className="rounded-top-3" style={{ 
                        backgroundImage: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(/fromBrand/background-pattern.png)', 
                        height: "12rem", 
                        backgroundSize: "cover" 
                    }}></div>

                    <div className="px-5 pb-5">
                        {/* Foto de Perfil Grande */}
                        <div className="d-flex align-items-center justify-content-center rounded-circle shadow border bg-white position-relative overflow-hidden"
                            style={{ height: "160px", width: "150px", top: "-80px", border: "5px solid white !important" }}>
                            {userData?.profileImage ? (
                                <img src={userData.profileImage} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <PersonCircle size={80} className="text-secondary opacity-50" />
                            )}
                        </div>

                        <div className="position-relative" style={{ top: "-60px" }}>
                            <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
                                <div>
                                    <h2 className='text-custom-black fw-bold mb-1'>{userData?.username || "Usuário"}</h2>
                                    <p className="text-muted fs-6 mb-0">Colaborador Baldan</p>
                                </div>

                                <button className="btn-custom btn-custom-primary d-flex gap-2 align-items-center px-4 rounded-pill shadow-sm"
                                    onClick={openModal}>
                                    <PencilSquare size={18} />
                                    <span>Editar perfil</span>
                                </button>
                            </div>

                            <div className="border-top pt-4 mt-2">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="text-muted small fw-bold text-uppercase">E-mail Institucional</label>
                                        <p className="text-custom-black fs-5 mb-0">{userData?.email}</p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="text-muted small fw-bold text-uppercase">Status da Conta</label>
                                        <p className="text-success fs-5 mb-0 fw-semibold">Ativo</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={show} onHide={closeModal} centered>
                    <Modal.Header closeButton className="border-0 px-4 pt-4"></Modal.Header>
                    <Modal.Body className="px-5 pb-5 pt-0">
                        <form onSubmit={handleSubmit}>
                            <div className="text-center mb-4">
                                <div className="position-relative d-inline-block">
                                    <div className="rounded-circle border shadow-sm bg-light overflow-hidden" style={{ width: '120px', height: '120px' }}>
                                        {newProfileImage ? (
                                            <img src={newProfileImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <PersonCircle size={60} className="text-secondary mt-4 opacity-50" />
                                        )}
                                    </div>
                                    <button 
                                        type="button"
                                        className="btn-custom btn-custom-primary btn-sm rounded-circle position-absolute bottom-0 end-0 p-2 shadow"
                                        style={{ width: '35px', height: '35px' }}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <CameraFill size={16} />
                                    </button>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        style={{ display: 'none' }} 
                                        accept="image/*" 
                                        onChange={handleFileChange} 
                                    />
                                </div>
                                <h4 className="mt-3 fw-bold text-dark">Editar Informações</h4>
                            </div>

                            <div className="form-group mb-4">
                                <label className="mb-2 text-muted small fw-bold text-uppercase">Nome de usuário</label>
                                <input
                                    type="text"
                                    className='form-control form-control-lg border shadow-sm'
                                    placeholder='Seu nome...'
                                    required
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    value={newUsername}
                                />
                            </div>

                            <div className="d-grid gap-2">
                                <button className='btn-custom btn-custom-primary btn-lg shadow-sm rounded-pill fw-bold py-3' type='submit'>Salvar Alterações</button>
                                <button className='btn-custom btn-custom-link text-muted' type='button' onClick={closeModal}>Cancelar</button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    )
}