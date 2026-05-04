// ===== GERAL IMPORTS =====
import { useState } from "react"
import type { ChecklistProps } from "../../../services/checklistServices"
import ChecklistCardMenu from "./ChecklistModelCardMenu"
import EditChecklistModelModal from "./EditChecklistModelModal"
import { useNavigate } from "react-router"
import { deleteChecklistModel } from "../../../services/checklistServices"
import { Modal } from "react-bootstrap"
import { Trash3Fill } from "react-bootstrap-icons"

// ===== TYPE INTERFACE =====
interface CardProps {
  checklist: ChecklistProps
  inline?: boolean
}

// ===== MAIN COMPONENT =====
// ----- This component is the card responsable for displaying checklist's data -----
export default function ChecklistCard({ checklist, inline }: CardProps) {

  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  // Função centralizada para abrir a edição
  const handleOpenEdit = () => setShowEdit(true);

  return (
    <>
      {inline ? (
        <div
          className="card-custom w-100 d-flex flex-row align-items-center justify-content-between px-4 py-3"
          onClick={handleOpenEdit} // Clique na linha toda
          style={{ cursor: 'pointer' }}
        >
          <div className="d-flex flex-column">
            <span className="fw-bold text-custom-black">
              {checklist.name}
            </span>

            <small className="text-muted">
              {checklist.categories.length} categoria(s)
            </small>
          </div>

          <span className="badge bg-custom-red00 text-white rounded-pill px-3">
            v{checklist.version}
          </span>

          <div className="d-flex gap-2" onClick={(e) => e.stopPropagation()}> 
            {/* stopPropagation evita que clique no botão dispare o clique do card duas vezes */}
            <button
              className="btn-custom btn-custom-outline-secondary px-3"
              onClick={handleOpenEdit}
            >
              Editar
            </button>

            <button
              className="btn-custom btn-custom-primary px-3"
              onClick={() => setShowDelete(true)}
            >
              Excluir
            </button>
          </div>
        </div>
      ) : (
        <div
          className="card-custom card-custom-hover"
          onClick={handleOpenEdit} // Clique no card todo
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
               <h6 className="fw-bold mb-0">
                {checklist.name}
              </h6>
              <span className="badge bg-light text-danger border border-danger-subtle rounded-pill mt-1" style={{ fontSize: '0.7rem' }}>
                v{checklist.version}
              </span>
            </div>

            <div
              className="position-absolute"
              style={{ top: "8px", right: "8px", zIndex: 10 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ChecklistCardMenu
                onEdit={handleOpenEdit}
                onDelete={() => setShowDelete(true)}
              />
            </div>

          </div>

          <p className="text-muted small mb-2">
            {checklist.vertical || "Vertical não definida"}
          </p>

          <p className="mt-auto mb-0 fw-semibold" style={{ color: "var(--red00)", fontSize: '0.85rem' }}>
            {checklist.categories.length} categorias
          </p>

        </div>
      )}

      {showEdit && (
        <EditChecklistModelModal
          checklist={checklist}
          onClose={() => setShowEdit(false)}
        />
      )}

      {showDelete && (
        <DeleteChecklistModal
          checklistId={checklist.id!}
          onClose={() => setShowDelete(false)}
        />
      )}
    </>
  )
}

// ===== DELETE MODAL COMPONENT =====
interface DeleteProps {
  checklistId: string
  onClose: () => void
}

function DeleteChecklistModal({ checklistId, onClose }: DeleteProps) {
  const navigate = useNavigate()

  const handleDelete = async () => {
    await deleteChecklistModel(checklistId)
    onClose()
    navigate("/home")
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Body className="text-center p-5">
        <Trash3Fill size={50} className="text-danger mb-4" />
        <h4 className="fw-bold mb-3">Excluir?</h4>
        <p className="text-muted mb-5">Esta ação não pode ser desfeita.</p>
        <div className="d-flex gap-3 justify-content-center">
          <button className="btn-custom btn-custom-outline-secondary px-4 rounded-3 shadow-sm" onClick={onClose}>Cancelar</button>
          <button className="btn-custom btn-custom-primary px-4 rounded-3 shadow-sm" onClick={handleDelete}>Excluir</button>
        </div>
      </Modal.Body>
    </Modal>
  )
}