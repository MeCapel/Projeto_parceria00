import { useState } from "react";
import { Modal } from "react-bootstrap";
import { type Checklist } from "../../services/checklistServices2";
import { toggleChecklistItems } from "../../services/prototypeServices2";

interface Props {
    prototypeId: string;
    checklist: Checklist;
    onClose: () => void;
    onSave: (updatedChecklist: Checklist) => void;
}

export default function EditChecklistModal({ prototypeId, checklist, onClose, onSave }: Props) {
    const [localChecklist, setLocalChecklist] = useState<Checklist>({ ...checklist });

    const handleToggleItem = (catIndex: number, itemId: string) => {
        setLocalChecklist((prev) => {
            const newCategories = prev.categories.map((cat, i) => {
                if (i !== catIndex) return cat;
                return {
                    ...cat,
                    items: cat.items.map(item =>
                        item.id === itemId ? { ...item, checked: !item.checked } : item
                    )
                };
            });
            return { ...prev, categories: newCategories };
        });
    };

    const handleSave = async () => {   
        if (!localChecklist) return;

        const updated = await toggleChecklistItems(
            prototypeId, 
            localChecklist.id, 
            localChecklist
        );

        if (updated)
        {
            onSave(localChecklist);
        }
    };

    return (
        <Modal show={true} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{localChecklist.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="d-flex flex-column gap-3">
                {localChecklist.categories.length === 0 && <p>Adicione categorias ao checklist...</p>}

                {localChecklist.categories.map((cat, catIndex) => (
                    <div key={catIndex} className="border rounded p-3 mb-3">
                        <h5>{cat.name}</h5>
                        {cat.items.map(item => (
                            <div key={`${catIndex}-${item.label}`} className="d-flex align-items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={item.checked}
                                    onChange={() => handleToggleItem(catIndex, item.id)}
                                />
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={onClose} type="button">Fechar</button>
                <button className="btn btn-success" onClick={handleSave} type="button">Salvar</button>
            </Modal.Footer>
        </Modal>
    );
}
