import { useState } from "react";
import { type Checklist } from "../../services/checklistServices2";
import EditChecklistModal from "./EditChecklistModal";
import { Check2Circle } from "react-bootstrap-icons";

interface Props {
    prototypeId: string;
    checklists: Checklist[];
    onUpdate: (updatedChecklist: Checklist) => void; // para atualizar a checklist no pai
}

export default function DisplayPrototypeChecklists({ checklists, prototypeId, onUpdate }: Props) {
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);

  // Ao abrir, criamos uma cópia para evitar mutações por referência
  const openChecklist = (cl: Checklist) => {
    const copy = structuredClone(cl) as Checklist;
    setSelectedChecklist(copy);
  };

  return (
    <div className="d-flex flex-column gap-2 mt-2">
      {(!checklists || checklists.length === 0) && <p>Nenhuma checklist encontrada para este protótipo.</p>}

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
 