import { useState } from "react"
import { Modal } from "react-bootstrap"
import { Trash3Fill, TrashFill } from "react-bootstrap-icons"

interface Props {
    objectName: string,
    onDelele?: (id: string) => void 
}

export default function ConfirmDeletionModal({ objectName, onDelele } : Props)
{
    const [ showModal, setShowModal ] = useState<boolean>(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    return(
        <>
            <button onClick={openModal} className="btn-custom btn-custom-outline-primary d-flex gap-2 align-items-center" >
                <TrashFill size={20} />
                Deletar
            </button>

            <Modal show={showModal} onHide={closeModal} centered>
                <Modal.Body className="text-center p-5">
                    <Trash3Fill size={50} className="text-danger mb-4" />
                    <h4 className="fw-bold mb-3">Excluir {objectName}?</h4>
                    <p className="text-muted mb-5">Esta ação não pode ser desfeita.</p>
                    <div className="d-flex gap-2 justify-content-center">
                        <button className="btn btn-light px-4 rounded-pill" onClick={closeModal}>Cancelar</button>
                        <button className="btn btn-danger px-4 rounded-pill shadow-sm" onClick={onDelele}>Excluir</button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}