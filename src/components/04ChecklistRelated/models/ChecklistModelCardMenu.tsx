// ===== GERAL IMPORTS =====
import { useEffect, useRef, useState } from "react"
import { PencilSquare, ThreeDotsVertical, Trash3Fill } from "react-bootstrap-icons"

// ===== TYPE INTERFACE =====
interface Props {
  onEdit: () => void
  onDelete: () => void
}

// ===== MAIN COMPONENT =====
// ----- This component is responsable for adding that little 3 dots menu on each checklist card annd actually connect the card with the real edit and delte functions -----
export default function ChecklistCardMenu({ onEdit, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={menuRef} onClick={(e) => e.stopPropagation()}>
      
      {/* BOTÃO */}
      <div
        onClick={() => setOpen(!open)}
        className="btn btn-link p-1 text-muted"
        style={{ cursor: "pointer" }}
      >
        <ThreeDotsVertical size={18} />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div
          className="position-absolute rounded-3 shadow-lg p-2 bg-white border"
          style={{ top: "25px", right: 0, minWidth: "9rem", zIndex: 100 }}
        >
          <button
            onClick={onEdit}
            className="btn-custom btn-custom-inside-primary w-100 d-flex gap-2 align-items-center text-start py-2 border-0 bg-transparent"
          >
            <PencilSquare />
            Editar
          </button>

          <button
            onClick={onDelete}
            className="btn-custom btn-custom-inside-primary w-100 d-flex gap-2 align-items-center text-start py-2 border-0 bg-transparent"
          >
            <Trash3Fill />
            Excluir
          </button>
        </div>
      )}
    </div>
  );
}