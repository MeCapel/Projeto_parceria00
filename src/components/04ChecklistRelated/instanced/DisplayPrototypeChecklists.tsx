import { useState } from "react";
import EditChecklistModal from "./EditChecklistModal";
import { Check2Circle } from "react-bootstrap-icons";
import type { ChecklistProps } from "../../../services/checklistServices";

interface Props {
    prototypeId: string;
    checklists: ChecklistProps[];
    onUpdate: (updatedChecklist: ChecklistProps) => void; // para atualizar a checklist no pai
}

export default function DisplayPrototypeChecklists({ checklists, prototypeId, onUpdate }: Props) {
  const [selectedChecklist, setSelectedChecklist] = useState<ChecklistProps | null>(null);

  // Ao abrir, criamos uma cópia para evitar mutações por referência
  const openChecklist = (cl: ChecklistProps) => {
    const copy = structuredClone(cl) as ChecklistProps;
    setSelectedChecklist(copy);
  };

  return (
    <div className="d-flex flex-column gap-2 mt-2">
      {(!checklists || checklists.length === 0) && <p>Nenhuma checklist encontrada.</p>}

      {/* ===== Card to navigate inner prototype checklists and display all items to check or uncheck ===== */}
      {checklists.map((cl) => (
        <button
          key={cl.id}
          onClick={() => openChecklist(cl)}
          type="button"
          className="w-100 text-start py-2 px-3 border rounded-2 bg-light text-custom-black d-flex justify-content-between"
        >
          {cl.name}
          <Check2Circle size={25} />
        </button>
      ))}

      {selectedChecklist && (
        <EditChecklistModal
          prototypeId={prototypeId}
          checklist={selectedChecklist}
          onClose={() => setSelectedChecklist(null)}
          onSave={(updatedChecklist) => {
            onUpdate(updatedChecklist);
            setSelectedChecklist(null);
          }}
        />
      )}
    </div>
  );
}
 