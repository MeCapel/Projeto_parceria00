import { useState } from "react";
import EditChecklistModal from "./EditChecklistModal";
import type { ChecklistInstance } from "../../../services/checklistInstances.service";

interface Props {
  checklists: ChecklistInstance[];
  prototypeId: string;
  onUpdate: (c: ChecklistInstance) => void;
}

export default function DisplayPrototypeChecklists({
  checklists,
  prototypeId,
  onUpdate,
}: Props) {
  const [selected, setSelected] = useState<ChecklistInstance | null>(null);

  return (
    <div className="d-flex flex-wrap gap-3 mt-3">
      {checklists.length === 0 && <p>Nenhuma checklist</p>}

      {checklists.map(cl => (
        <div
          key={cl.id}
          className="card p-3 shadow"
          onClick={() => setSelected(cl)}
          style={{ cursor: "pointer", width: "18rem" }}
        >
          <h5>{cl.name}</h5>
          <p>{cl.categories.length} categorias</p>
        </div>
      ))}

      {selected && (
        <EditChecklistModal
          prototypeId={prototypeId}
          checklist={selected}
          onClose={() => setSelected(null)}
          onSave={(c) => {
            onUpdate(c);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}