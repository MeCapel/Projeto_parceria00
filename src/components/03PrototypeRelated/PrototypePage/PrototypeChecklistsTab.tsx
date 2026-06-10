import { useChecklistInstances } from "../../../hooks/useChecklistInstances";
import { updatePrototype } from "../../../services/prototypes.service";
import DisplayPrototypeChecklists from "../../04ChecklistRelated/instanced/DisplayPrototypeChecklists";
import ManageChecklistsModal from "../../04ChecklistRelated/instanced/ManageChecklists";

interface Props {
  prototypeId: string;
  vertical: string;
}

export default function PrototypeChecklistsTab({
  prototypeId,
  vertical,
}: Props) {
  const {
    checklists,
    fetchChecklists,
  } = useChecklistInstances({ prototypeId });

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h4 className="fw-bold text-custom-black mb-0">Checklists</h4>
          <small className="text-muted">Gerencie os checklists do protótipo</small>
        </div>

      <ManageChecklistsModal
        vertical={vertical}
        selectedChecklists={checklists}
        onUpdate={async (modelIds) => {
          const existingModels = new Set(checklists.map(c => c.originalModel).filter(Boolean));
          const addChecklistModelIds = modelIds.filter(id => !existingModels.has(id));
          const removeChecklistIds = checklists
            .filter(c => c.originalModel && !modelIds.includes(c.originalModel))
            .map(c => c.id);

          await updatePrototype(prototypeId, { addChecklistModelIds, removeChecklistIds });
          await fetchChecklists();
        }}
        onClose={() => {}}
      />
      </div>

      <DisplayPrototypeChecklists
        prototypeId={prototypeId}
        checklists={checklists}
        onUpdate={() => fetchChecklists()}
      />
    </>
  );
}