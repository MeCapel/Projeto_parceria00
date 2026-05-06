import { useEffect } from "react";
import FormRadioGroup from "../../forms/FormRadioGroup";
import ChooseChecklists from "../../04ChecklistRelated/instanced/ChooseChecklist";
import type { StepProps } from "../ProtoMultiForm";

export default function Step3({ values, onChange, isFieldRequired }: StepProps) {
  const isInvalid =
    !!values.vertical && (!values.checklistsIds || values.checklistsIds.length === 0);

  const isValid =
    !!values.vertical && values.checklistsIds && values.checklistsIds.length > 0;

  // reset quando muda vertical (somente UI, não hook)
  useEffect(() => {
    onChange("checklistsIds", []);
  }, [values.vertical]);

  return (
    <div>
      <FormRadioGroup
        label="Vertical"
        name="vertical"
        value={values.vertical}
        options={["preparo", "plantio", "pulverizacao"]}
        onChange={e => onChange("vertical", e.target.value)}
        required={isFieldRequired("vertical")}
      />

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

      <div className="my-5">
        <ChooseChecklists
          vertical={values.vertical}
          selectedIds={values.checklistsIds || []}
          onSelect={(modelIds) => {
            onChange("checklistsIds", modelIds);
          }}
          isInvalid={isInvalid}
        />
      </div>
    </div>
  );
}