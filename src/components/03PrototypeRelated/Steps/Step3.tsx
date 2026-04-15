import { useEffect, useState } from "react";
import ChooseChecklists from "../../04ChecklistRelated/instanced/ChooseChecklist";
import FormRadioGroup from "../../forms/FormRadioGroup";
import type { StepProps } from "../ProtoMultiForm";

export default function Step3({ values, onChange, isFieldRequired }: StepProps) {
    const [checklistsIds, setChecklistsIds] = useState<string[]>([]);
    const isInvalid = !!values.vertical && values.checklistsIds.length === 0;
    const isValid = !!values.vertical && values.checklistsIds.length > 0;

    useEffect(() => {
        onChange("checklistsIds", checklistsIds);
    }, [checklistsIds]);

    useEffect(() => {
        setChecklistsIds([]);
        onChange("checklistsIds", []);
    }, [values.vertical]);

    return (
        <div>

        <FormRadioGroup
            label="Vertical"
            name="vertical"
            value={values.vertical}
            options={["Preparo", "Plantio", "Pulverização"]}
            onChange={e => onChange("vertical", e.target.value)}
            required={isFieldRequired("vertical")}
        />

            <div className="position-relative mt-4">

                <input
                    type="text"
                    className={`form-control position-absolute opacity-0 ${
                        isInvalid ? "is-invalid" : isValid ? "is-valid" : ""
                    }`}
                    style={{ height: 0, padding: 0, border: 0 }}
                    tabIndex={-1}
                    required
                    value={isValid ? "ok" : ""}
                    onChange={() => {}}
                />

            </div>

        <div className="my-5">
            <ChooseChecklists
            vertical={values.vertical}
            onValueChange={setChecklistsIds}
            isInvalid={isInvalid}
            />
        </div>

        </div>
    );
}