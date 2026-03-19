/// ===== GERAL IMPORTS =====
import { useNavigate } from "react-router"
import { deleteChecklistModel } from "../../../services/checklistServices"
import { Modal } from "react-bootstrap"
import { Trash3Fill } from "react-bootstrap-icons"

// ===== TYPE INTERFACE =====
interface Props {
  checklistId: string
  onClose: () => void
}

// ===== MAIN COMPONENT =====
// ----- This component is responsable for deleting and validated deleting operation for a checklist model ----- 
export default function DeleteChecklistModal({ checklistId, onClose }: Props) {

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
              <h4 className="fw-bold mb-3">Excluir Projeto?</h4>
              <p className="text-muted mb-5">Esta ação não pode ser desfeita.</p>
              <div className="d-flex gap-2 justify-content-center">
                  <button className="btn-custom btn-custom-outline-secondary px-4 rounded-pill" onClick={onClose}>Cancelar</button>
                  <button className="btn-custom btn-custom-primary px-4 rounded-pill shadow-sm" onClick={handleDelete}>Excluir</button>
              </div>
          </Modal.Body>
      </Modal>
  )
}