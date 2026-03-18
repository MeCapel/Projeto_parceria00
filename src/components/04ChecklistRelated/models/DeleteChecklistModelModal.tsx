/// ===== GERAL IMPORTS =====
import { useNavigate } from "react-router"
import { deleteChecklistModel } from "../../../services/checklistServices"
import { Modal } from "react-bootstrap"

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

      <Modal.Header closeButton>
        Confirmação
      </Modal.Header>

      <Modal.Body className="text-center">

        <p>
          Tem certeza que deseja excluir este modelo?
        </p>

        <div className="d-flex gap-3 justify-content-center">

          <button
            className="btn-custom btn-custom-secondary rounded-pill"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="btn-custom btn-custom-primary rounded-pill"
            onClick={handleDelete}
          >
            Excluir
          </button>

        </div>

      </Modal.Body>

    </Modal>
  )
}