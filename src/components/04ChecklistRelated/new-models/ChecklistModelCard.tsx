import type { ChecklistModelProps } from "../../../services/checklistModels.service";
import ChecklistCardMenu from "./ChecklistModelCardMenu";

interface Props {
  checklist: ChecklistModelProps;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ChecklistModelCard({ checklist, onEdit, onDelete }: Props) {
  return (
    <div className="card-custom card-custom-hover position-relative">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-start mb-2">

        <div>
          <h6 className="fw-bold mb-0">
            {checklist.name || "Sem nome"}
          </h6>

          <span
            className="badge bg-light text-danger border border-danger-subtle rounded-pill mt-1"
            style={{ fontSize: "0.7rem" }}
          >
            v{checklist.version || "Versão não definida"}
          </span>
        </div>

        {/* MENU */}
        <div
          className="position-absolute"
          style={{ top: "8px", right: "8px", zIndex: 10 }}
          onClick={(e) => e.stopPropagation()}
        >
          <ChecklistCardMenu
            onEdit={() => onEdit(checklist.id)}
            onDelete={() => onDelete(checklist.id)}
          />
        </div>

      </div>

      {/* BODY */}
      <p className="text-muted small mb-2">
        {checklist.vertical || "Vertical não definida"}
      </p>

      <p
        className="mt-auto mb-0 fw-semibold"
        style={{ color: "var(--red00)", fontSize: "0.85rem" }}
      >
        {checklist.categories?.length || 0} categorias
      </p>

    </div>
  );
}