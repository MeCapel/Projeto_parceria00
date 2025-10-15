import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

export default function NewProjectModal()
{
    const [ show, setShow ] = useState(false);

    const openModal = () => setShow(true);
    const closeModal = () => setShow(false);

    return(
        <>
            <button className='btn-custom btn-custom-primary' onClick={openModal} >
                <p className='mb-0 fs-5 text-custom-white'>Novo projeto</p>
            </button>

            <Modal show={show} onHide={closeModal} dialogClassName="modal-fullscreen" className='p-0'>
                <Modal.Header closeButton className="mb-0 mx-5 border-0" style={{ paddingTop: '85px' }}></Modal.Header>
                <Modal.Body className="container-fluid d-flex flex-column align-items-center m-auto"> 

                    {/* --- 🔴 Inner content div --- */}
                    <div className="">

                        {/* --- Title div --- */}
                        <div className="my-4">
                            <p className='fs-5 mb-0 text-custom-red'>Adicionar</p>
                            <p className='text-custom-black display-6 fw-bold mb-1'>Novo projeto</p>
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
                            <input type="text" placeholder='Nome do projeto' className='text-custom-black py-1 px-3 fs-5 border rounded-2' />
                            <input type="text" placeholder='Convide alguém' className='text-custom-black py-1 px-3 fs-5 border rounded-2' />
                        </div>

                        {/* --- 🔵 Button div --- */}
                        <div className="d-flex align-items-center justify-content-end">
                            <button className='btn-custom btn-custom-success rounded-1 px-4'>Adicionar</button>
                        </div>
                    </div>
                </Modal.Body>

            </Modal>
        </>
    )
}