import { type StepProps } from "../ProtoMultiForm";
import FormRadioGroup from "../../forms/FormRadioGroup";
import FormInput from "../../forms/FormInput";
import SelectLocation from "../../Others/SelectLocation";

export default function Step2({ values, errors, onChange, isFieldRequired }: StepProps) {
    const options = ["Fabricação", "Montagem", "Validação de campo"];
 
    return (
        <div className="">
            {/* 🔵 Radio select div status */}
            <FormRadioGroup
                label="Etapa"
                name="stage"
                value={values.stage}
                options={options}
                onChange={(e) => onChange("stage", e.target.value)}
                required={isFieldRequired("stage")}
                error={errors.stage}
            />

            {values.stage === "Validação de campo" && (

                <div className="d-flex flex-column my-4 gap-3" style={{ overflow: "auto"}}>

                    <div className="d-flex justify-content-between gap-3">

                        <SelectLocation
                            stateValue={values.state || ""}
                            cityValue={values.city || ""}
                            onChangeState={(e) => onChange("state", e.target.value)}
                            onChangeCity={(e) => onChange("city", e.target.value)}
                        />

                        <FormInput
                            label="Área"
                            name="areaSize"
                            value={values.areaSize ?? ""}
                            onChange={e => onChange("areaSize", e.target.value)}
                            required={isFieldRequired("areaSize")}
                        />
                    </div>
                </div>
            )}
    </div>
  );
}