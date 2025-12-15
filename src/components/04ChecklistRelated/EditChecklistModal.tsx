import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { type Checklist } from "../../services/checklistServices2";
// import { toggleChecklistItems } from "../../services/prototypeServices2";

interface Props {
    prototypeId: string;
    checklist: Checklist;
    onClose: () => void;
    onSave: (updatedChecklist: Checklist) => void;
}

export default function EditChecklistModal({ prototypeId, checklist, onClose, onSave }: Props) {
    // estado local inicializado com cópia do prop checklist
    const [localChecklist, setLocalChecklist] = useState<Checklist>(checklist);
    const [saving, setSaving] = useState(false);

    // sempre que a prop checklist mudar, atualiza o estado local (deep copy)
    useEffect(() => {
        setLocalChecklist(checklist);
    }, [checklist]);

    // Toggle de um item dentro de uma categoria (usa item.id como identificador)
    const handleToggleItem = (catIndex: number, itemId: string) => {
        setLocalChecklist(prev => {
            if (!prev) return prev;
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

    // Função que garante que todos os itens possuem id (validação leve)
    const validateIds = (cl: Checklist) => {
        if (!cl.id) return false;
        for (const cat of cl.categories || []) {
            // se category tem id opcional, aceitamos, mas itens devem ter id
            for (const it of cat.items || []) {
                if (!it.id) return false;
            }
        }
        return true;
    };

    const handleSave = async () => {
        if (!localChecklist) return;
        if (!prototypeId) {
            console.error("prototypeId ausente ao salvar checklist.");
            return;
        }
        if (!localChecklist.id) {
            console.error("checklist.id ausente ao salvar checklist.");
            return;
        }

        if (!validateIds(localChecklist)) {
            alert("Erro: alguns itens da checklist não possuem id. Verifique a estrutura dos dados.");
            return;
        }

        setSaving(true);
        try {
            onSave(localChecklist);
        } catch (err) {
            console.error("Erro ao salvar checklist:", err);
            alert("Erro ao salvar checklist. Veja o console para detalhes.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={true} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{localChecklist?.name ?? "Checklist"}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="d-flex flex-column gap-3">
                {!localChecklist || localChecklist.categories.length === 0 ? (
                    <p>Adicione categorias ao checklist...</p>
                ) : (
                    localChecklist.categories.map((cat, catIndex) => (
                        <div key={cat.id ?? `cat-${catIndex}`} className="border rounded p-3 mb-3">
                            <h5>{cat.name}</h5>
                            {(cat.items || []).map(item => (
                                <div key={item.id ?? item.label} className="d-flex align-items-center gap-2">
                                    <input
                                        id={`${localChecklist.id}-${catIndex}-${item.id ?? item.label}`}
                                        type="checkbox"
                                        checked={!!item.checked}
                                        onChange={() => handleToggleItem(catIndex, item.id)}
                                    />
                                    <label htmlFor={`${localChecklist.id}-${catIndex}-${item.id ?? item.label}`}>
                                        {item.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </Modal.Body>

            <Modal.Footer>
                <button className="btn btn-secondary" onClick={onClose} type="button" disabled={saving}>
                    Fechar
                </button>
                <button className="btn btn-success" onClick={handleSave} type="button" disabled={saving}>
                    {saving ? "Salvando..." : "Salvar"}
                </button>
            </Modal.Footer>
        </Modal>
    );
}
