import { useState } from "react";
import EditChecklistModal from "./EditChecklistModal";
import type { ChecklistProps } from "../../../services/checklistServices";

interface Props {
    prototypeId: string;
    checklists: ChecklistProps[];
    onUpdate: (updatedChecklist: ChecklistProps) => void; // para atualizar a checklist no pai
}

export default function DisplayPrototypeChecklists({ checklists, prototypeId, onUpdate }: Props) {
    const [selectedChecklist, setSelectedChecklist] = useState<ChecklistProps | null>(null);

    const openChecklist = (cl: ChecklistProps) => {
        const copy = structuredClone(cl);
        setSelectedChecklist(copy);
    };

    return (
        <div className="d-flex flex-column gap-2 mt-2">

            <div className="d-flex flex-wrap gap-3">

                {checklists.length === 0 && <p>Nenhuma checklist encontrada.</p>}

                {checklists.map((cl) => (
                    <div
                        key={cl.id}
                        onClick={() => openChecklist(cl)}
                        className="card p-3 shadow"
                        style={{ width: "18rem", cursor: "pointer" }}
                    >
                        <h5>{cl.name} • v{cl.version}</h5>
                        <p>{cl.vertical}</p>
                        <p>{cl.categories.length} categorias</p>
                    </div>
                ))}
            </div>

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
 