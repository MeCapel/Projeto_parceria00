import { PlusLg } from "react-bootstrap-icons"
import { Modal } from "react-bootstrap"
import {  useRef, useState } from "react"
import AddNewMember from "./AddNewMember";

interface Props {
    projectId: string;
}

export default function NewMemberModal({ projectId } : Props)
{
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    // const [ username, setUsername ] = useState<string>(""); // falta finalizar, FUNÇÃO PARA PODER PESQUISAR USERS  
    const formRef = useRef<HTMLFormElement | null>(null);

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        if(formRef.current) formRef.current.classList.remove("was-validated");
        setIsOpen(false);
        //setUsername("");
    }
    
    const handleNewProjectMember = async ( e: React.FormEvent ) => {
        e.preventDefault();

        const form = formRef.current;
        if(!form) return;

        form.classList.add("was-validated");

        if(!form.checkValidity())
        {
            const firstInvalid = form.querySelector<HTMLElement>(":invalid");
            if(firstInvalid) firstInvalid.focus();
            return;
        }

        closeModal();
    }

    return(
        <>
            <button className="btn-custom btn-custom-secondary" onClick={openModal}>
                <p className="mb-0 fs-5 text-custom-white d-flex gap-3 align-items-center">
                    Adicionar membro
                    <PlusLg size={30} />
                </p>
            </button>

            <Modal show={isOpen} onHide={closeModal} dialogClassName="" centered className="p-0" size="lg">
                <Modal.Header closeButton className="border-0 mt-3 mx-3"></Modal.Header>
                <Modal.Body>

                    <form ref={formRef} className="w-100 mt-0 pt-0 px-5" onSubmit={handleNewProjectMember} noValidate>
                        
                        <div className="">
                            <p className="fs-5 mb-0 text-custom-red">Adicionar</p>
                            <h1 className="text-custom-black fw-bold mb-1">Novo membro</h1>
                        </div>
                        
                        <div className="d-flex gap-3 my-4">
                            <div className="form-floating mb-3 w-100">
                                <input 
                                    id='input1'
                                    required 
                                    type="text" 
                                    minLength={3}
                                    maxLength={25}
                                    className='form-control' 
                                    placeholder='Nome do projeto*' 
                                    // onChange={(e) => setUsername(e.target.value)} 
                                    />
                                <label htmlFor="input1" className="d-flex flex-column gap-3">Email do usuário</label>
                            </div>

                            <button 
                                style={{ height: "3.5rem" }}
                                type='submit'
                                className='btn-custom btn-custom-outline-success d-flex align-items-center justify-content-center gap-3'>
                                Adicionar
                                <PlusLg size={18}/>
                            </button>

                        </div>

                        <AddNewMember projectId={projectId} />
                        
                    </form>

                </Modal.Body>
            </Modal>
        </>
    )
}