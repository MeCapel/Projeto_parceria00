import { type StepProps } from "../ProtoMultiForm";
import FormRadioGroup from "../../forms/FormRadioGroup";
import ClientSelector from "../../08ClientsRelated/ClientSelector";

export default function Step2({ values, errors, onChange, isFieldRequired }: StepProps) {
    const stageArray = [
        {label: "Fabricação", value: "fabricacao"},
        {label: "Montagem", value: "montagem"},
        {label: "Validação de campo", value: "validacao de campo"},
    ];
    
    return (
        <div className="">
            <FormRadioGroup
                label="Etapa"
                name="stage"
                value={values.stage}
                options={stageArray}
                onChange={(e) => onChange("stage", e.target.value)}
                required={isFieldRequired("stage")}
                error={errors.stage}
            />

            {values.stage === "validacao de campo" && (

                <div className="d-flex flex-column my-4 gap-3" style={{ overflow: "auto"}}>

                    <ClientSelector
                        value={values.clientId}
                        onSelect={(client) => {
                            onChange("clientId", client.id);
                            onChange("state", client.state);
                            onChange("city", client.city);
                            onChange("areaSize", client.area || "");
                        }}
                        hideNewClientButton
                        error={errors.clientId}
                        required={isFieldRequired("clientId")}
                    />

                </div>
            )}
    </div>
  );
}
