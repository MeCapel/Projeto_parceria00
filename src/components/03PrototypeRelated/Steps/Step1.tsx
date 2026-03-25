import { type StepProps } from "../ProtoMultiForm";
import FormInput from "../../forms/FormInput";
import FormTextarea from "../../forms/FormTextarea";

export default function Step1({ values, errors, onChange }: StepProps) {
  return (
    <div>
      
        {/* --- 🔵 Inputs div --- */}
        <div className="d-flex flex-column my-4 gap-3">

                <FormInput
                        label="N° de série"
                        name="code"
                        value={values.code ?? ""}
                        onChange={e => onChange("code", e.target.value)}
                />
                {errors.code && <p style={{ color: "red" }}>{errors.code}</p>}

                <FormInput
                        label="Nome"
                        name="code"
                        value={values.name}
                        onChange={e => onChange("name", e.target.value)}
                />
                {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}

                <FormTextarea
                        label="Descrição"
                        name="description"
                        value={values.description}
                        onChange={e => onChange("description", e.target.value)}
                />
                {errors.description && <p style={{ color: "red" }}>{errors.description}</p>}
        </div>

    </div>
  );
}