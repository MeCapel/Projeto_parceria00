// ===== GERAL IMPORTS =====
import { useState, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router';
import { getCurrentUser } from '../../services/authService';
import { createProject } from '../../services/projectServices';

// ===== MAIN COMPONENT =====
export default function NewProjectModal()
{
    // ===== DECLARING & INITIALIZING VARIABLES =====
    const navigate = useNavigate();
    const [ show, setShow ] = useState(false);
    const [ description, setDescription ] = useState("");
    const [ name, setName ] = useState("");
    const formRef = useRef<HTMLFormElement | null>(null);

    // ===== DECLARING & INITIALIZING MODAL RELATED FUNCTIONS =====
    const openModal = () => setShow(true);
    const closeModal = () => {
        if (formRef.current) formRef.current.classList.remove("was-validated");
        setShow(false);
        setName("");
        setDescription("");
    };

    // ===== FUNCTION TO CREATE A NEW PROJECT =====
    const handleNewProject = async (e: React.FormEvent ) => {

        // ===== FORM VALIDATION =====

        e.preventDefault();

        const form = formRef.current;
        if (!form) return;

        form.classList.add("was-validated");
        
        if (!form.checkValidity()) {
            // foca no primeiro campo inválido
            const firstInvalid = form.querySelector<HTMLElement>(":invalid");
            if (firstInvalid) firstInvalid.focus();
            return; // não prossegue enquanto inválido
        }
        
        closeModal();

        // ===== ONCE FORM VALIDATED GO ON =====

        const userData = getCurrentUser();

        if (!userData)
        {
            console.log("Erro ao puxar informações do usuário!");
            return null;
        }

        const userId = userData.uid;

        const projectId = await createProject(name, description, userId);

        if (!projectId)
        {
            console.log("Erro ao puxar informações do projeto!");
            return null;
        }
        
        navigate("/projects");
    };

    return(
        <>
            <button className='btn-custom btn-custom-primary' onClick={openModal} >
                <p className='mb-0 fs-5 text-custom-white'>Novo projeto</p>
            </button>

            <Modal show={show} onHide={closeModal} dialogClassName="" centered className='p-0' size="lg">
                <Modal.Header closeButton className="border-0 mt-3 mx-3"></Modal.Header>
                <Modal.Body className="d-flex flex-column align-items-center  mb-4"> 

                    {/* --- 🔴 Inner content div --- */}
                    <form ref={formRef} className="w-100 mt-0 pt-0 px-5" onSubmit={handleNewProject} noValidate>

                        {/* --- Title div --- */}
                        <div className="">
                            <p className='fs-5 mb-0 text-custom-red'>Adicionar</p>
                            <h1 className='text-custom-black fw-bold mb-1'>Novo projeto</h1>
                        </div>

                        {/* --- 🔵 Inputs div --- */}
                        <div className="d-flex flex-column my-4 gap-3">
                            <div className="form-floating mb-3">
                                <input 
                                    id='input1'
                                    required 
                                    type="text" 
                                    minLength={3}
                                    maxLength={25}
                                    className='form-control' 
                                    placeholder='Nome do projeto*' 
                                    onChange={(e) => setName(e.target.value)} 
                                    />
                                <label htmlFor="input1">Nome do projeto</label>
                            </div>
                            
                            <div className="form-floating">
                                <textarea 
                                    required
                                    id="input2" 
                                    minLength={3}
                                    maxLength={150} 
                                    name="textarea" 
                                    className='form-control'
                                    placeholder='Descrição do projeto*'  
                                    style={{ resize: "none", height: "100px" }} 
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                                <label htmlFor="input2">Descrição do projeto</label>
                            </div>

                            

                        </div>

                        {/* --- 🔵 Button div --- */}
                        <div className="d-flex align-items-center justify-content-end">
                            <button 
                                type='submit'
                                className='btn-custom btn-custom-success rounded-1 px-4' 
                            >Adicionar</button>
                        </div>
                    </form>
                </Modal.Body>

            </Modal>
        </>
    )
}