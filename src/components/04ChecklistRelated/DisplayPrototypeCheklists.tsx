import { useState } from "react";
import { type Checklist } from "../../services/checklistServices2";
import EditChecklistModal from "./EditChecklistModal";
import { Check2Circle } from "react-bootstrap-icons";

interface Props {
    checklists: Checklist[];
    prototypeId: string;
    onUpdate: (updatedChecklist: Checklist) => void; // para atualizar a checklist no pai
}

export default function DisplayPrototypeChecklists({ checklists, prototypeId, onUpdate }: Props) {
    const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);

    return (
        <div className="d-flex flex-column gap-2 mt-2">
            {checklists.length === 0 && <p>Nenhuma checklist encontrada para este protótipo.</p>}

            {checklists.map((cl) => (
                <button className="w-100 text-start py-2 px-3 border rounded-2 bg-light text-custom-black d-flex justify-content-between" 
                    key={cl.id} onClick={() => setSelectedChecklist(cl)} type="button">
                    {cl.name}
                    <Check2Circle size={25}/>
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
