// ===== GERAL IMPORTS =====
import { useEffect, useRef, useState } from "react"
import { ThreeDotsVertical } from "react-bootstrap-icons"

// ===== TYPE INTERFACE =====
interface Props {
  onEdit: () => void
  onDelete: () => void
}

// ===== MAIN COMPONENT =====
// ----- This component is responsable for adding that little 3 dots menu on each checklist card annd actually connect the card with the real edit and delte functions -----
export default function ChecklistCardMenu({ onEdit, onDelete }: Props) {

  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () =>
      document.removeEventListener("mousedown", handleClickOutside)

  }, [open])

  return (
    <div style={{ position: "relative", zIndex: "10" }} ref={menuRef}>

      <div
        onClick={() => setOpen(!open)}
        style={{ cursor: "pointer" }}
      >
        <ThreeDotsVertical size={22}/>
      </div>

      {open && (
        <div className="position-absolute shadow p-2 bg-white border rounded-3">

          <button
            onClick={onEdit}
            className="btn w-100 text-start"
          >
            Editar
          </button>

          <button
            onClick={onDelete}
            className="btn w-100 text-start"
          >
            Excluir
          </button>

        </div>
      )}

    </div>
  )
}