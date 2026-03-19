import type { ChecklistProps } from "../../../services/checklistServices";
import DisplayPrototypeChecklists from "../../04ChecklistRelated/instanced/DisplayPrototypeChecklists";
import ManageChecklistsModal from "../../04ChecklistRelated/instanced/ManageChecklists";

interface Props {
    prototypeId: string;
    vertical: string;
    checklists: ChecklistProps[];
    onUpdate: (updatedChecklist: ChecklistProps) => void;
    onListUpdate: (newChecklists: ChecklistProps[]) => void;
}

export default function PrototypeChecklistsTab({
    prototypeId,
    vertical,
    checklists,
    onUpdate,
    onListUpdate
}: Props) {

    return (
        <>
            <div className="d-flex align-items-center justify-content-between mb-3">

                <div>
                    <h4 className="fw-bold text-custom-black mb-0">
                        Checklists
                    </h4>

                    <small className="text-muted">
                        Listas de requisiitos vinculadas ao protótipo
                    </small>
                </div>

                <ManageChecklistsModal
                    vertical={vertical}
                    selectedChecklists={checklists}
                    onUpdate={onListUpdate}
                    onClose={() => {}}
                />

            </div>

            <DisplayPrototypeChecklists
                prototypeId={prototypeId}
                checklists={checklists}
                onUpdate={onUpdate}
            />
        </>
    );
}