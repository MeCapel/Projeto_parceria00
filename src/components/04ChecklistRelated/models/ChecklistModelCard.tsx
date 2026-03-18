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
          className="card-custom w-100 d-flex flex-row align-items-center justify-content-between px-4 py-3"
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

          <div className="d-flex gap-2">
            <button
              className="btn-custom btn-custom-outline-secondary btn-sm rounded-pill px-3"
              onClick={() => setShowEdit(true)}
            >
              Editar
            </button>

            <button
              className="btn-custom btn-custom-primary btn-sm rounded-pill px-3"
              onClick={() => setShowDelete(true)}
            >
              Excluir
            </button>
          </div>
        </div>
      ) : (
        <div
          className="card-custom card-custom-hover"
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

            <ChecklistCardMenu
              onEdit={() => setShowEdit(true)}
              onDelete={() => setShowDelete(true)}
            />

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