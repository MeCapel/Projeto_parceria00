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
            <button className="btn-custom btn-custom-primary px-4 shadow-sm" onClick={openModal}>
                <div className="mb-0 fs-6 d-flex gap-2 align-items-center fw-bold">
                    Adicionar membro
                    <PlusLg size={20} />
                </div>
            </button>

            <Modal 
                show={isOpen} 
                onHide={closeModal} 
                centered 
                className="p-0"
                dialogClassName="custom-modal"
                      >
                <Modal.Header closeButton className="border-0 mt-3 mx-3"></Modal.Header>
                <Modal.Body>

                    <form ref={formRef} className="w-100 mt-0 pt-0 px-3 px-lg-5" onSubmit={handleNewProjectMember} noValidate>
                        
                        <div className="">
                            <p className="fs-5 mb-0 text-custom-red">Adicionar</p>
                            <h1 className="text-custom-black fw-bold mb-1 fs-3 fs-md-2">Novo membro</h1>
                        </div>
                        
                <div className="row g-3 my-4 align-items-end">
    
                    <div className="row g-3 my-4 align-items-end">
                        <div className="form-floating w-100"></div>
                        <input 
                        id='input1'
                        required 
                        type="text" 
                        minLength={3}
                        maxLength={25}
                        className='form-control' 
                        placeholder='Nome do projeto*' 
                            />
                    <label htmlFor="input1">Email do usuário</label>
                    </div>

                        <div className="col-12 col-lg-auto"></div>
                           <button 
                             style={{ height: "3.5rem" }}
                             type='submit'
                             className='btn-custom btn-custom-outline-success d-flex align-items-center justify-content-center gap-3 w-100'>
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