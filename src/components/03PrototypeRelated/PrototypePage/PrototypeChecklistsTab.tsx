import { useChecklistInstances } from "../../../hooks/useChecklistInstances";
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
    linkChecklist,
    removeChecklist,
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
            const existing = new Set(checklists.map(c => c.originalModelId).filter(Boolean));
            const toAdd = modelIds.filter(id => !existing.has(id));
            const toRemove = checklists.filter(c => c.originalModelId && !modelIds.includes(c.originalModelId));

            await Promise.all([
              ...toAdd.map(id => linkChecklist(id)),
              ...toRemove.map(c => removeChecklist(c.id))
            ]);
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