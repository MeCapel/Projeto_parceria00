// ===== GERAL IMPORTS =====
import type { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { Trash3Fill } from "react-bootstrap-icons";
import { calcularOpenDays } from '../../utils/dateUtils'; // Função para calcular os dias em abertos

// ===== TYPE INTERFACE =====
interface Props {
  name: string
  description: string
  criticity: "A" | "B" | "C"
  createdAt: string | Timestamp
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

    // Lógica de dias em aberto
    const formattedDate =
        typeof createdAt === "string"
            ? createdAt
            : createdAt.toDate().toLocaleDateString("pt-BR");

    // Calculo de dias em aberto
    const openDays = calcularOpenDays(createdAt);

    return(
        <>
            <div className="card-custom card-custom-hover p-0 overflow-hidden">
            
                {image ? (
                    <div style={{ height: "8rem", overflow: "hidden" }} >
                        <img src={image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                ) : (
                    <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: "8rem" }}>
                        <span className="text-muted small">Sem imagem</span>
                    </div>
                )}

                <div className="p-3 d-flex flex-column grow justify-content-between">

                    
                    <div className="d-flex flex-column gap-1">
                        <div className="d-flex align-items-center justify-content-between mb-1">

                            {/* // ----- Here goes the name of the occurence ----- */}
                            <h6 className="mb-0 fw-bold text-truncate text-custom-black" style={{ maxWidth: "10rem" }}>
                                {name}
                            </h6>

                            {/* // ----- Here goes the criticity of the given occurrence */}
                            <span className={`rounded-pill px-2 py-0 border fw-bold small ${criticityStyles[criticity]}`} style={{ fontSize: '0.7rem' }} >
                                {criticity}
                            </span>
                        
                        </div>

                        {/* --- DATA COM O CONTADOR --- */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            {/* // ----- Here goes the date that the occurence was created ----- */}
                            <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                                {formattedDate}
                            </small>

                            {/* Mostra "Hoje" se for 0, senão mostra a quantidade de dias */}
                                <small className={`fw-bold ${openDays > 5 ? 'text-danger' : 'text-secondary'}`} style={{ fontSize: '0.7rem' }}>
                                    {openDays === 0 ? "Aberto hoje" : `Aberto há: ${openDays} d`}
                                </small>
                        </div>

                        
                        {/* // ----- Here goes the description */}
                        <p className="text-secondary small overflow-hidden" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", fontSize: '0.8rem' }}>
                            {description}
                        </p>
                    </div>

                    {/* // ----- Buttons delete and edit ----- */}
                    <div className="d-flex justify-content-between gap-3 mt-2">
                        <button className="btn-custom btn-custom-outline-primary" onClick={openModal}>Deletar</button>
                        <button className="btn-custom btn-custom-outline-secondary" onClick={onEdit}>Editar</button>
                    </div>
                </div>
            </div>

            <Modal show={openDeleteModal} onHide={closeModal} centered>
                <Modal.Body className="text-center p-5">
                    <Trash3Fill size={50} className="text-danger mb-4" />
                    <h4 className="fw-bold mb-3">Excluir ocorrência?</h4>
                    <p className="text-muted mb-5">Esta ação não pode ser desfeita.</p>
                    <div className="d-flex gap-3 justify-content-center">
                        <button className="btn-custom btn-custom-gray p-2 shadow border" onClick={closeModal}>Cancelar</button>
                        <button className="btn-custom btn-custom-outline-primary p-2" onClick={onDelete}>Excluir</button>
                    </div>
                </Modal.Body>
            </Modal>
        </>

    )
}