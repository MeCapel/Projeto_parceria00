import Layout from '../components/Layout'

import { Modal } from 'react-bootstrap'
import { PencilSquare } from 'react-bootstrap-icons'

import { useNavigate } from 'react-router'
import { useCallback, useEffect, useState } from 'react'

import { db, auth } from '../firebaseConfig/config'
import { doc, getDoc } from 'firebase/firestore'
import { updateAccount, type EditUserData } from '../services/authService'

export default function Profile()
{
    const [ userData, setUserData ] = useState<EditUserData | null>(null);
    const [ show, setShow ] = useState<boolean>(false);
    const [ newUsername, setNewUsername ] = useState("");
    
    const navigate = useNavigate();

    const openModal = () => setShow(true);
    const closeModal = useCallback(() => {setShow(false)}, []);

    const handleSubmit = async (e: React.FormEvent ) => {
        e.preventDefault();

        if (!userData) return;
        if (!newUsername) return;

        try
        {
            await updateAccount( {
                userId: userData.userId, 
                username: newUsername, 
                email: userData.email 
            });
            closeModal();
        }
        catch (err)
        {
            console.error(err);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            
            if (userData?.email === user?.email) return;

            if (!user)
            {
                console.log("User not logged in!");
                navigate("/login");
                return;
            }

            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data() as EditUserData;
                setUserData({ ...data, userId: user.uid });
                setNewUsername(data.username);
}
            else 
            {
                console.log("No user document found!");
            }
            
        });


        return () => unsubscribe();
    }, [navigate, userData]);

    useEffect(() => {
        const header = document.querySelector('.showOrHide') as HTMLElement | null;

        if (!header) return;

        header.classList.toggle("hidden-header", show);
    }, [show]);


    return(
        <Layout>
            <div className="container-fluid d-flex justify-content-center my-5" style={{ }}>
                <div className="bg-light rounded-3 border">
                    <div className="rounded-3" style={{ backgroundImage: 'url(/fromBrand/background-pattern.png)', height: "15rem" }}></div>
                    <div className="d-flex align-items-center justify-content-center rounded-circle position-relative ms-5" 
                            style={{ height: "150px", width: "150px", top: "-80px", background: "var(--gray02)" }}>
                        {/* <img src="/vite.svg" alt="" className='img-fluid'/> */}
                    </div>
                    <div className="my-4 mx-5 d-flex flex-column gap-3 position-relative" style={{ top: "-75px" }}>
                        <div className="d-flex gap-3 align-items-center justify-content-between">
                            <h2 className='text-cusstom-black mb-2'>{userData?.username}</h2>
                            <span className="fs-3 text-custom-black">-</span>
                            <p className="mb-0 text-custom-black fs-5">Papel da pessoa</p>

                            <button className="ms-5 btn-custom btn-custom-primary d-flex gap-3 align-items-center justify-content-between"
                                    onClick={openModal}>
                                <PencilSquare size={20}/>
                                <p className="mb-0">Editar perfil</p>
                            </button>
                        </div>
                        <div className="">
                            <p className="text-custom-black fs-5">{userData?.email}</p>
                        </div>
                    </div>
                </div>

                <Modal show={show} onHide={closeModal} className='p-0'>
                    <Modal.Header closeButton className="mb-0 mx-5 border-0 my-3"></Modal.Header>
                    <Modal.Body className="mx-5">

                        <form className='' onSubmit={handleSubmit}>

                            {/* --- Title div --- */}
                            <div className="">
                                <p className='fs-5 mb-0 text-custom-red'>Editar</p>
                                <p className='text-custom-black display-6 fw-bold mb-1'>Perfil: {userData?.username}</p>
                                <p className='text-custom-black'>*Campos obrigatórios</p>
                            </div>

                            {/* --- 🔵 Photo div --- */}
                            <div className="d-flex align-items-center">
                                <div className="d-flex align-items-center justify-content-center rounded-circle" 
                                    style={{ width: '70px', height: '70px', overflow: 'hidden', backgroundColor: 'var(--red02)' }}>
                                    <img src="/vite.svg" alt="Ícone do projeto" />
                                </div>
                                <p className='mb-0 mx-4 text-custom-black'>Adicionar foto</p>
                            </div>

                            {/* --- 🔵 Inputs div --- */}
                            <div className="d-flex flex-column my-4 gap-3">
                                <input type="text" placeholder='Insira o seu novo nome...' className='form-control text-custom-black py-1 px-3 fs-5 border rounded-2' 
                                    required onChange={(e) => setNewUsername(e.target.value)} value={newUsername} />
                                {/* <input type="text" placeholder='Insira o seu email...' className='form-control text-custom-black py-1 px-3 fs-5 border rounded-2' 
                                    required onChange={(e) => setNewEmail(e.target.value)} value={userData?.email} /> */}
                            </div>

                            {/* --- 🔵 Button div --- */}
                            <div className="d-flex align-items-center justify-content-between my-5">
                                <button className='btn-custom btn-custom-secondary rounded-1 px-4' type='button' onClick={() => navigate("/profile")}>Voltar</button>
                                <button className='btn-custom btn-custom-success rounded-1 px-4' type='submit'>Salvar</button>
                            </div>
                            </form>
                    </Modal.Body>
                </Modal>
            </div>
        </Layout>
    )
}