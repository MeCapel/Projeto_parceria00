import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import type { ChecklistInstance, ChecklistItem } from "../../../services/checklistInstances.service";
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
    const normalized = {
      ...checklist,
      categories: checklist.categories.map((cat) => ({
        ...cat,
        items: cat.items.map((item: ChecklistItem) => ({
          id: item.id,
          label: item.label || "",
          checked: item.checked || false,
        })),
      })),
    };

    setLocal(normalized);
  }, [checklist]);

  const handleToggle = (catIndex: number, itemIndex: number) => {
    setLocal((prev) => ({
      ...prev,
      categories: prev.categories.map((cat, cIndex) =>
        cIndex !== catIndex
          ? cat
          : {
              ...cat,
              items: cat.items.map((item, iIndex) =>
                iIndex !== itemIndex
                  ? item
                  : {
                      ...item,
                      checked: !item.checked,
                    }
              ),
            }
      ),
    }));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const categoriesToSend = local.categories.map((cat) => ({
        ...cat,
        items: cat.items.map((item: ChecklistItem) => ({
          id: item.id,
          label: item.label,
          checked: item.checked,
        })),
      }));

      await toggleItem(local.id, categoriesToSend);

      onSave(local);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show onHide={onClose} size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">
          {local.name}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-3">
        {local.categories.map((cat, catIndex) => (
          <div
            key={cat.id ?? catIndex}
            className="mb-4 p-3 border rounded-4 bg-light from-check"
          >
            <h5 className="fw-semibold mb-3">
              {cat.name}
            </h5>

            <div className="d-flex flex-column gap-2">
              {cat.items.map((item, itemIndex) => (
                <label
                  key={item.id ?? `${catIndex}-${itemIndex}`}
                  className="
                    d-flex
                    align-items-center
                    gap-3
                    p-2
                    rounded-3
                    cursor-pointer
                    hover-shadow
                    form-check-label
                  "
                  style={{
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() =>
                      handleToggle(catIndex, itemIndex)
                    }
                    style={{
                      accentColor: "var(--various03)",
                    }}
                    className="form-check-input"
                  />

                  <span
                    style={
                      item.checked
                        ? {
                            textDecoration: "line-through",
                            textDecorationColor: "#fffff",
                            textDecorationThickness: "1px",
                          }
                        : {}
                    }
                  >
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </Modal.Body>

      <Modal.Footer>
         <button onClick={onClose} className="btn-custom btn-custom-outline-primary">Fechar</button>
         <button onClick={handleSave} className="btn-custom btn-custom-outline-success">
          {saving ? "Salvando..." : "Salvar"}
         </button>
      </Modal.Footer> 
    </Modal>
  );
}

  