import { useState, useEffect, useCallback } from "react";
import { Modal } from "react-bootstrap";
import ChooseChecklists from "./ChooseChecklist";
import { type ChecklistProps } from "../../../services/checklistServices";

interface ManageChecklistModalProps {
    vertical: string;
    selectedChecklists: ChecklistProps[];
    onClose: () => void;
    onUpdate: (newChecklists: ChecklistProps[]) => void;
}

export default function ManageChecklistsModal({ vertical, selectedChecklists, onClose, onUpdate }: ManageChecklistModalProps) {
  const [show, setShow] = useState(false);
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([]);
  const [avaliableModels, setAvaliableModels] = useState<ChecklistProps[]>([]);

  // re-sincroniza sempre que prop mudar
  useEffect(() => {
    const ids = selectedChecklists.map(c => c.originalModel).filter((id): id is string => !!id);
    setSelectedModelIds(ids);
  }, [selectedChecklists]);

  const openModal = () => setShow(true);
  const closeModal = () => { setShow(false); onClose(); };

  const handleValueChange = useCallback(
    (ids: string[], checklists: ChecklistProps[]) => {
      setSelectedModelIds(ids);
      setAvaliableModels(checklists);
    },
    []
  );

  const handleSave = () => {
    // checklists que já existem no protótipo E continuam selecionadas
    const kept = selectedChecklists.filter(
      cl =>
        cl.originalModel &&
        selectedModelIds.includes(cl.originalModel)
    );

    // modelos selecionados que ainda NÃO viraram instância
    const toCreate = avaliableModels.filter(
      model =>
        !kept.some(cl => cl.originalModel === model.id)
    );

    const created: ChecklistProps[] = toCreate.map(model => ({
      id: crypto.randomUUID(),
      name: model.name,
      vertical: model.vertical,
      categories: structuredClone(model.categories),
      version: model.version,
      createdAt: new Date().toISOString(),
      originalModel: model.id,
    }));

    //  Array que realmente sobre para o pai
    const finalChecklists = [...kept, ...created];

    onUpdate(finalChecklists);
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
            onValueChange={handleValueChange}
            initialSelectedIds={selectedModelIds}
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