// ===== GERAL IMPORTS =====
import { useState } from "react"
import type { ChecklistProps } from "../../../services/checklistServices"
import ChecklistCardMenu from "./ChecklistModelCardMenu"
import EditChecklistModelModal from "./EditChecklistModelModal"
import DeleteChecklistModal from "./DeleteChecklistModelModal"

// ===== TYPE INTERFACE =====
interface Props {
  checklist: ChecklistProps
  inline?: boolean
}

// ===== MAIN COMPONENT =====
// ----- This component is the card responsable for displaying checklist's data -----
export default function ChecklistCard({ checklist, inline }: Props) {

  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  return (
    <>
      {inline ? (
        <div
          className="w-100 d-flex align-items-center justify-content-between px-4 py-3 rounded-3 shadow-sm border bg-white"
        >
          <div className="d-flex flex-column">
            <span className="fw-bold text-custom-black">
              {checklist.name}
            </span>

            <small className="text-muted">
              {checklist.categories.length} categoria(s)
            </small>
          </div>

          <span className="badge bg-custom-red00 text-white">
            v{checklist.version}
          </span>

          <div className="d-flex gap-3">
            <button
              className="btn-custom btn-custom-secondary"
              onClick={() => setShowEdit(true)}
            >
              Editar
            </button>

            <button
              className="btn btn-danger"
              onClick={() => setShowDelete(true)}
            >
              Excluir
            </button>
          </div>
        </div>
      ) : (
        <div
          className="card shadow border rounded-3"
          style={{ width: "18rem", padding: "1.2rem" }}
        >
          <div className="d-flex justify-content-between">

            <h5 className="fw-bold">
              {checklist.name} • v{checklist.version}
            </h5>

            <ChecklistCardMenu
              onEdit={() => setShowEdit(true)}
              onDelete={() => setShowDelete(true)}
            />

          </div>

          <p className="text-muted">
            {checklist.vertical || "Vertical não definida"}
          </p>

          <p style={{ color: "var(--red00)" }}>
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