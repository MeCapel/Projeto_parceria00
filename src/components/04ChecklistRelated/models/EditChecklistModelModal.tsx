// ===== GERAL IMPORTS =====
import { Modal } from "react-bootstrap"
import { createNewChecklistVersion, type ChecklistProps } from "../../../services/checklistServices"
import { useState } from "react"
import { useNavigate } from "react-router"
import ChecklistModelEditor from "./ChecklistModelEditor"

// ===== TYPE INNTERFACE =====
interface Props {
  checklist: ChecklistProps
  onClose: () => void
}

// ===== MAIN COMPONENT =====
// ----- This component is responsable for displaying the edit modal, and only for it, so it do not edit the checklist, only opens a edit modal and call inside it the real component that deals with editing the checklists models -----
export default function EditChecklistModelModal({ checklist, onClose }: Props) {

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSave = async (updatedChecklist: ChecklistProps) => {

    setLoading(true)

    try {

      await createNewChecklistVersion(updatedChecklist, checklist.id!)

      onClose()

      navigate("/home")

    } catch (err) {

      console.error("Erro ao salvar checklist:", err)

    } finally {

      setLoading(false)

    }

  }

  return (
    <Modal show onHide={onClose} centered size="lg">

      <Modal.Header closeButton className="border-0 mt-3 mx-3" />

      <Modal.Body>

        <ChecklistModelEditor
          checklist={checklist}
          loading={loading}
          onSave={handleSave}
          onCancel={onClose}
        />

      </Modal.Body>

    </Modal>
  )
}