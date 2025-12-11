import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import ChooseChecklists from "../04ChecklistRelated/ChooseChecklist2"
import { deletePrototypeChecklist, toggleChecklistSelection, getPrototype } from "../../services/prototypeServices2";
import { type Checklist } from "../../services/checklistServices2"; 

interface ManageChecklistModalProps {
    prototypeId: string;
    vertical: string;
    selectedChecklists: Checklist[];
    onClose: () => void;
    onUpdate: (newChecklists: Checklist[]) => void;
}

// export default function ManageChecklistsModal({ prototypeId, vertical, selectedChecklists, onClose, onUpdate }: ManageChecklistModalProps) {
//     const [show, setShow] = useState(false);
//     const [checklists, setChecklists] = useState<Checklist[]>(selectedChecklists);
//     // Inicializa com apenas IDs válidos
//     const [selectedIds, setSelectedIds] = useState<string[]>(
//         selectedChecklists.map(c => c.id).filter((id): id is string => !!id)
//     );

//     // Sincroniza quando selectedChecklists mudar
//     useEffect(() => {
//         setChecklists(selectedChecklists);
//         setSelectedIds(selectedChecklists.map(c => c.id).filter((id): id is string => !!id));
//     }, [selectedChecklists]);

//     const openModal = () => setShow(true);
//     const closeModal = () => { setShow(false); onClose(); };

//     const handleChecklistChange = (ids: string[]) => {
//         setSelectedIds(ids);
//     };

//     const handleSave = async () => {
//         const updatedChecklists: Checklist[] = checklists.map(c => ({
//             ...c,
//             checked: selectedIds.includes(c.id)
//         }));

//         await Promise.all(
//             updatedChecklists.map(c => toggleChecklistItems(prototypeId, c.id, c))
//         );

//         onUpdate(updatedChecklists);
//         closeModal();
//     };

//     const handleDelete = async (checklistId: string) => {
//         await deletePrototypeChecklist(prototypeId, checklistId);
//         setChecklists(prev => prev.filter(c => c.id !== checklistId));
//         setSelectedIds(prev => prev.filter(id => id !== checklistId));
//     };

//     return (
//         <>
//             <button className="btn-custom btn-custom-secondary" onClick={openModal} type="button">
//                 <p className="mb-0 fs-5 text-custom-white">Gerenciar Checklists</p>
//             </button>

//             <Modal show={show} onHide={closeModal} dialogClassName="modal-fullscreen" className="p-0">
//                 <Modal.Header closeButton className="mb-0 mx-5 border-0 my-3" />
//                 <Modal.Body className="d-flex flex-column align-items-center justify-content-center gap-3">
//                     <ChooseChecklists
//                         vertical={vertical}
//                         onValueChange={handleChecklistChange}
//                         initialSelectedIds={selectedIds}
//                     />

//                     <div className="d-flex gap-3 mt-4 flex-wrap">
//                         {checklists.map(c => (
//                             <button
//                                 key={c.id}
//                                 className="btn-custom btn-custom-outline-danger"
//                                 onClick={() => handleDelete(c.id)}
//                             >
//                                 Excluir {c.name}
//                             </button>
//                         ))}
//                     </div>

//                     <button className="btn-custom btn-custom-success mt-3" onClick={handleSave}>
//                         Salvar alterações
//                     </button>
//                 </Modal.Body>
//             </Modal>
//         </>
//     );
// }

export default function ManageChecklistsModal({ prototypeId, vertical, selectedChecklists, onClose, onUpdate }: ManageChecklistModalProps) {
  const [show, setShow] = useState(false);
  // selectedModelIds = ids de modelos que estarão selecionados ao salvar (model.id)
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>(
    // initial: os modelos que já existem como instâncias no protótipo (originalModel field)
    selectedChecklists.map(c => c.originalModel!).filter((id): id is string => !!id)
  );

  // Mantém initial for diff
  const [initialSelectedModelIds, setInitialSelectedModelIds] = useState<string[]>(selectedModelIds);

  // re-sincroniza sempre que prop mudar
  useEffect(() => {
    const ids = selectedChecklists.map(c => c.originalModel!).filter((id): id is string => !!id);
    setSelectedModelIds(ids);
    setInitialSelectedModelIds(ids);
  }, [selectedChecklists]);

  const openModal = () => setShow(true);
  const closeModal = () => { setShow(false); onClose(); };

  const handleChecklistChange = (ids: string[]) => {
    setSelectedModelIds(ids);
  };

  const handleSave = async () => {
    // diff entre modelos
    const toAdd = selectedModelIds.filter(id => !initialSelectedModelIds.includes(id));
    const toRemove = initialSelectedModelIds.filter(id => !selectedModelIds.includes(id));

    // adicionar instâncias (duplica modelo dentro do protótipo)
    for (const modelId of toAdd) {
      await toggleChecklistSelection(prototypeId, modelId, true); // wrapper que usa addChecklistToPrototype
    }

    // remover instâncias (deleta instancia existente)
    for (const modelId of toRemove) {
      await toggleChecklistSelection(prototypeId, modelId, false);
    }

    // após alterações, recarregar protótipo e enviar instâncias atualizadas ao pai
    const refreshed = await getPrototype(prototypeId);
    const updatedInstances = refreshed?.checklists ?? [];
    onUpdate(updatedInstances);

    closeModal();
  };

  const handleDeleteInstance = async (instanceId: string) => {
    await deletePrototypeChecklist(prototypeId, instanceId);
    // refetch
    const refreshed = await getPrototype(prototypeId);
    const updatedInstances = refreshed?.checklists ?? [];
    onUpdate(updatedInstances);
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
            onValueChange={handleChecklistChange}
            initialSelectedIds={selectedModelIds}
          />

          {/* <div className="d-flex gap-3 mt-4 flex-wrap">
            {selectedChecklists.map(c => (
              <button
                key={c.id}
                className="btn-custom btn-custom-outline-danger"
                onClick={() => handleDeleteInstance(c.id!)}
                type="button"
              >
                Excluir {c.name}
              </button>
            ))}
          </div> */}

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