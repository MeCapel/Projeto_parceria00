import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { type ChecklistProps } from "../../../services/checklistServices";
import { toggleChecklistItems } from "../../../services/prototypeServices";
// import { toggleChecklistItems } from "../../services/prototypeServices2";

interface Props {
    prototypeId: string;
    checklist: ChecklistProps;
    onClose: () => void;
    onSave: (updatedChecklist: ChecklistProps) => void;
}

export default function EditChecklistModal({ prototypeId, checklist, onClose, onSave }: Props) {

    const [localChecklist, setLocalChecklist] = useState<ChecklistProps>(structuredClone(checklist));
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setLocalChecklist(structuredClone(checklist));
    }, [checklist]);

    const handleToggleItem = (catIndex: number, itemId: string) => {
        setLocalChecklist(prev => ({
            ...prev,
            categories: prev.categories.map((cat, i) =>
                i !== catIndex
                    ? cat
                    : {
                        ...cat,
                        items: cat.items.map(item =>
                            item.id === itemId
                                ? { ...item, checked: !item.checked }
                                : item
                        )
                    }
            )
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await toggleChecklistItems(
                prototypeId,
                localChecklist.id!,
                localChecklist
            );

            onSave(localChecklist);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show onHide={onClose} size="lg" centered>

            <Modal.Header closeButton>
                <Modal.Title>{localChecklist.name}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {localChecklist.categories.map((cat, catIndex) => (
                    <div key={cat.id} className="mb-3">

                        <h5>{cat.name}</h5>

                        {cat.items.map(item => (
                            <div key={item.id} className="d-flex gap-2">

                                <input
                                    type="checkbox"
                                    checked={!!item.checked}
                                    onChange={() => handleToggleItem(catIndex, item.id)}
                                />

                                <label>{item.label}</label>

                            </div>
                        ))}
                    </div>
                ))}
            </Modal.Body>

            <Modal.Footer>
                <button onClick={onClose} className="btn-custom btn-custom-secondary rounded-pill">Fechar</button>
                <button onClick={handleSave} className="btn-custom btn-custom-success rounded-pill">
                    {saving ? "Salvando..." : "Salvar"}
                </button>
            </Modal.Footer>
        </Modal>
    );
}