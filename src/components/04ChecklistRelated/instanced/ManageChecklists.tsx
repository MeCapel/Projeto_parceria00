import { useState, useEffect, useCallback } from "react";
import { Modal } from "react-bootstrap";
import ChooseChecklists from "./ChooseChecklist";
import type { ChecklistInstance } from "../../../services/checklistInstances.service";
import { showErrorToast } from "../../../utils/errorToast";

interface ManageChecklistModalProps {
    vertical: string;
    selectedChecklists: ChecklistInstance[];
    onClose: () => void;
    onUpdate: (modelIds: string[]) => Promise<void>;
}

export default function ManageChecklistsModal({ vertical, selectedChecklists, onClose, onUpdate }: ManageChecklistModalProps) {
  const [show, setShow] = useState(false);
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // re-sincroniza sempre que prop mudar
  useEffect(() => {
    const ids = selectedChecklists.map(c => c.originalModel).filter((id): id is string => !!id);
    setSelectedModelIds(ids);
  }, [selectedChecklists]);

  const openModal = () => setShow(true);
  const closeModal = () => {
    if (isSaving) return;
    setShow(false);
    onClose();
  };

  const handleValueChange = useCallback(
    (ids: string[]) => {
      setSelectedModelIds(ids);
    },
    []
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(selectedModelIds);
      setShow(false);
      onClose();
    } catch (err) {
      showErrorToast(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <button className="btn-custom btn-custom-secondary" onClick={openModal} type="button">
        Gerenciar Checklists
      </button>

      <Modal show={show} onHide={closeModal} centered keyboard={!isSaving} backdrop={isSaving ? "static" : true}>
        <Modal.Body className="p-4">
          <ChooseChecklists
            vertical={vertical}
            onSelect={handleValueChange}
            selectedIds={selectedModelIds}
          />

          <div className="d-flex justify-content-center gap-2 mt-4">
            <button className="btn-custom btn-custom-outline-secondary" onClick={closeModal} type="button" disabled={isSaving}>
              Cancelar
            </button>
            <button className="btn-custom btn-custom-success" onClick={handleSave} type="button" disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
} 