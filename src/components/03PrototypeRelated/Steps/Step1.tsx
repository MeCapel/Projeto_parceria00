import { type StepProps } from "../ProtoMultiForm";
import FormInput from "../../forms/FormInput";
import FormTextarea from "../../forms/FormTextarea";

export default function Step1({ values, onChange, isFieldRequired }: StepProps) {
  return (
    <div>
      
        {/* --- 🔵 Inputs div --- */}
        <div className="d-flex flex-column my-4 gap-3">

                <FormInput
                        label="N° de série"
                        name="code"
                        value={values.code ?? ""}
                        onChange={e => onChange("code", e.target.value)}
                        required={isFieldRequired("code")}
                />

                <FormInput
                        label="Nome"
                        name="name"
                        value={values.name}
                        onChange={e => onChange("name", e.target.value)}
                        required={isFieldRequired("name")}
                />

                <FormTextarea
                        label="Descrição"
                        name="description"
                        value={values.description}
                        onChange={e => onChange("description", e.target.value)}
                        required={isFieldRequired("description")}
                />
        </div>

    </div>
  );
}