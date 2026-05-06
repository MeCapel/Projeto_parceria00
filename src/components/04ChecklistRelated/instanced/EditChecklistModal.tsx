import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import type { ChecklistInstance } from "../../../services/checklistInstances.service";
import { useChecklistInstances } from "../../../hooks/useChecklistInstances";

interface Props {
  prototypeId: string;
  checklist: ChecklistInstance;
  onClose: () => void;
  onSave: (c: ChecklistInstance) => void;
}

export default function EditChecklistModal({
  prototypeId,
  checklist,
  onClose,
  onSave,
}: Props) {
  const { toggleItem } = useChecklistInstances({ prototypeId });

  const [local, setLocal] = useState(checklist);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Normalize items to use "name" (handle both old "label" and new "name" fields)
    const normalized = {
      ...checklist,
      categories: checklist.categories.map(cat => ({
        ...cat,
        items: cat.items.map((item: any) => ({
          id: item.id,
          name: item.name || item.label || "",
          checked: item.checked || false,
        }))
      }))
    };
    setLocal(normalized);
  }, [checklist]);

  const handleToggle = (catIndex: number, itemId: string) => {
    setLocal(prev => ({
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
              ),
            }
      ),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Normalize items to use "name" (handle both old "label" and new "name" fields)
      const categoriesToSend = local.categories.map(cat => ({
        ...cat,
        items: cat.items.map((item: any) => ({
          id: item.id,
          name: item.name || item.label || "",
          checked: item.checked,
        }))
      }));
      
      await toggleItem(local.id, categoriesToSend);
      onSave(local);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{local.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {local.categories.map((cat, catIndex) => (
          <div key={cat.id} className="mb-3">
            <h5>{cat.name}</h5>

            {cat.items.map(item => (
              <div key={item.id} className="d-flex gap-2">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleToggle(catIndex, item.id!)}
                />
                <label>{item.name}</label>
              </div>
            ))}
          </div>
        ))}
      </Modal.Body>

      <Modal.Footer>
        <button onClick={onClose}>Fechar</button>
        <button onClick={handleSave}>
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </Modal.Footer>
    </Modal>
  );
}