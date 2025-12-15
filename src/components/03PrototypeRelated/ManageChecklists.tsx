import { useState, useEffect, useCallback } from "react";
import { Modal } from "react-bootstrap";
import ChooseChecklists from "../04ChecklistRelated/ChooseChecklist2"
import { type Checklist } from "../../services/checklistServices2"; 

interface ManageChecklistModalProps {
    vertical: string;
    selectedChecklists: Checklist[];
    onClose: () => void;
    onUpdate: (newChecklists: Checklist[]) => void;
}

export default function ManageChecklistsModal({ vertical, selectedChecklists, onClose, onUpdate }: ManageChecklistModalProps) {
  const [show, setShow] = useState(false);
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([]);
  const [avaliableModels, setAvaliableModels] = useState<Checklist[]>([]);

  // re-sincroniza sempre que prop mudar
  useEffect(() => {
    const ids = selectedChecklists.map(c => c.originalModel).filter((id): id is string => !!id);
    setSelectedModelIds(ids);
  }, [selectedChecklists]);

  const openModal = () => setShow(true);
  const closeModal = () => { setShow(false); onClose(); };

  const handleValueChange = useCallback(
    (ids: string[], checklists: Checklist[]) => {
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

    const created: Checklist[] = toCreate.map(model => ({
      id: crypto.randomUUID(),
      name: model.name,
      vertical: model.vertical,
      categories: structuredClone(model.categories),
      version: model.version,
      createdAt: new Date().toISOString(),
      originalModel: model.id,
    }));

    // 🔥 ESTE array é a VERDADE ABSOLUTA
    const finalChecklists = [...kept, ...created];

    onUpdate(finalChecklists);
    closeModal();
  };

  return (
    <>
      <button className="btn-custom btn-custom-secondary" onClick={openModal} type="button">
        <p className="mb-0 fs-5 text-custom-white">Gerenciar Checklists</p>
      </button>

      <Modal show={show} onHide={closeModal} dialogClassName="" centered className="p-0">
        <Modal.Header closeButton className="mb-0 mx-3 border-0 my-3" />
        <Modal.Body className="d-flex flex-column align-items-center justify-content-center gap-3 my-3">
          <ChooseChecklists
            vertical={vertical}
            onValueChange={handleValueChange}
            initialSelectedIds={selectedModelIds}
          />

          <div className="d-flex gap-3">
            <button className="btn-custom btn-custom-secondary mt-3" onClick={closeModal} type="button">
              Voltar
            </button>
            <button className="btn-custom btn-custom-success mt-3" onClick={handleSave} type="button">
              Salvar alterações
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
} 