import { useState, useEffect, useCallback } from "react";
import { Modal } from "react-bootstrap";
import ChooseChecklists from "./ChooseChecklist";
import type { ChecklistInstance } from "../../../services/checklistInstances.service";

interface ManageChecklistModalProps {
    vertical: string;
    selectedChecklists: ChecklistInstance[];
    onClose: () => void;
    onUpdate: (modelIds: string[]) => void;
}

export default function ManageChecklistsModal({ vertical, selectedChecklists, onClose, onUpdate }: ManageChecklistModalProps) {
  const [show, setShow] = useState(false);
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([]);

  // re-sincroniza sempre que prop mudar
  useEffect(() => {
    const ids = selectedChecklists.map(c => c.originalModelId).filter((id): id is string => !!id);
    setSelectedModelIds(ids);
  }, [selectedChecklists]);

  const openModal = () => setShow(true);
  const closeModal = () => { setShow(false); onClose(); };

  const handleValueChange = useCallback(
    (ids: string[]) => {
      setSelectedModelIds(ids);
    },
    []
  );

  const handleSave = () => {
    onUpdate(selectedModelIds);
    closeModal();
  };

  return (
    <>
      <button className="btn-custom btn-custom-secondary" onClick={openModal} type="button">
        Gerenciar Checklists
      </button>

      <Modal show={show} onHide={closeModal} centered>
        <Modal.Body className="p-4">
          <ChooseChecklists
            vertical={vertical}
            onSelect={handleValueChange}
            selectedIds={selectedModelIds}
          />

          <div className="d-flex justify-content-center gap-2 mt-4">
            <button className="btn-custom btn-custom-outline-secondary" onClick={closeModal} type="button">
              Cancelar
            </button>
            <button className="btn-custom btn-custom-success" onClick={handleSave} type="button">
              Salvar
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
} 