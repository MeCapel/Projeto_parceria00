// ===== GERAL IMPORTS =====
import { useState } from "react";
import { Card, Modal } from "react-bootstrap";
import { PencilSquare, Trash3Fill } from "react-bootstrap-icons";

// ===== TYPE INTERFACE =====
interface Props {
    name: string
    description: string
    criticity: "A" | "B" | "C"
    createdAt: string
    image?: string
    onDelete?: () => void
    onEdit?: () => void
}

// ===== MAIN COMPONENT =====
// ----- This is the occurrence card -----
export default function OccurrenceCard({ name, description, criticity, image, createdAt, onEdit, onDelete } : Props)
{
    const [ openDeleteModal, setOpenDeleteModal ] = useState<boolean>(false);
    const openModal = () => setOpenDeleteModal(true);
    const closeModal = () => setOpenDeleteModal(false);
    
    // ---- This describes the 3 possible styes -----
    const criticityStyles = {
        A: "border border-danger bg-danger-subtle",
        B: "border border-warning bg-warning-subtle",
        C: "border border-info bg-info-subtle"
    }

    return(
        <>
            <Card className="shadow border p-2" style={{ height: "18rem", width: '18rem' }}>
                
                {image && (
                    <div style={{ height: "8rem", overflow: "hidden" }} >
                        <Card.Img src={image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                )}

                <Card.Body className="d-flex flex-column justify-content-between">
                    
                    <div className="d-flex flex-column gap-2">
                        <div className="d-flex align-items-center gap-2 mb-2">

                            {/* // ----- Here goes the criticity of the given occurrence */}
                            <span className={`rounded-5 px-3 py-1 border fw-semibold text-black ${criticityStyles[criticity]}`} >
                                {criticity}
                            </span>
                            
                            {/* // ----- Here goes the name of the occurence ----- */}
                            <Card.Title className="mb-0 fs-6 fw-bold text-truncate" style={{ maxWidth: "9rem" }}>
                                {name}
                            </Card.Title>
                        
                        </div>

                        {/* // ----- Here goes the date that the occurence was created ----- */}
                        <small className="text-muted mb-2">
                            {typeof createdAt === "string"
                                ? createdAt
                                : createdAt?.toDate?.().toLocaleDateString()}
                        </small>
                        
                        {/* // ----- Here goes the description */}
                        <Card.Text>{description}</Card.Text>
                    </div>

                    {/* // ----- Buttons delete and edit ----- */}
                    <div className="d-flex align-items-center justify-content-between">
                        <button onClick={openModal} className="btn btn-sm w-100 d-flex gap-2 align-items-center justify-content-center text-start py-2">
                            <Trash3Fill className="text-danger"/>
                            <span>Excluir</span>
                        </button>
                        <button onClick={onEdit} className="btn btn-sm w-100 d-flex gap-2 align-items-center justify-content-center text-start py-2">
                            <PencilSquare className="text-danger"/>
                            <span>Editar</span>
                        </button>
                    </div>
                </Card.Body>
            </Card>

            <Modal show={openDeleteModal} onHide={closeModal} centered>
                <Modal.Body className="text-center p-5">
                    <Trash3Fill size={50} className="text-danger mb-4" />
                    <h4 className="fw-bold mb-3">Excluir ocorrência?</h4>
                    <p className="text-muted mb-5">Esta ação não pode ser desfeita.</p>
                    <div className="d-flex gap-2 justify-content-center">
                        <button className="btn btn-light px-4 rounded-pill" onClick={closeModal}>Cancelar</button>
                        <button className="btn btn-danger px-4 rounded-pill shadow-sm" onClick={onDelete}>Excluir</button>
                    </div>
                </Modal.Body>
            </Modal>
        </>

    )
}