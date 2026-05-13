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
      <div className="d-flex justify-content-between">
        <h4>Checklists</h4>

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