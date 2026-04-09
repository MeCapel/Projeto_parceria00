import { type StepProps } from "../ProtoMultiForm";
import FormRadioGroup from "../../forms/FormRadioGroup";
import FormInput from "../../forms/FormInput";

export default function Step2({ values, errors, onChange }: StepProps) {
    const options = ["Fabricação", "Montagem", "Validação de campo"];
 
    return (
    <div className="">
        {/* 🔵 Radio select div status */}
        <FormRadioGroup
            label="Etapa"
            name="stage"
            value={values.stage}
            options={options}
            onChange={(e) => {onChange("stage", e.target.value)}}
        />

        {errors.stage && <p style={{ color: "red" }}>{errors.stage}</p>}

        {values.stage === "Validação de campo" && (

            <div className="d-flex flex-column my-4 gap-3" style={{ overflow: "auto"}}>

                <div className="d-flex justify-content-between gap-3">

                    <div className="form-floating">
                        <select
                            name="state"
                            className="form-select"
                            value={values.state}
                            onChange={e => onChange("state", e.target.value)}
                        >
                            <option value="">Escolha o estado</option>
                            <option value="AC">AC</option>
                            <option value="AL">AL</option>
                            <option value="AP">AP</option>
                            <option value="AM">AM</option> 
                            <option value="BA">BA</option>
                            <option value="CE">CE</option>
                            <option value="DF">DF</option> 
                            <option value="ES">ES</option>
                            <option value="GO">GO</option>
                            <option value="MA">MA</option> 
                            <option value="MT">MT</option>
                            <option value="MS">MS</option>
                            <option value="MG">MG</option> 
                            <option value="PA">PA</option>
                            <option value="PB">PB</option>
                            <option value="PR">PR</option> 
                            <option value="PE">PE</option>
                            <option value="PI">PI</option>
                            <option value="RJ">RJ</option> 
                            <option value="RN">RN</option>
                            <option value="RS">RS</option>
                            <option value="RO">RO</option>
                            <option value="RR">RR</option>
                            <option value="SC">SC</option>
                            <option value="SP">SP</option>
                            <option value="SE">SE</option>
                            <option value="TO">TO</option>
                        </select>
                        <label>Estado</label>
                    </div>
                    {errors.state && <p style={{ color: "red" }}>{errors.state}</p>}

                    <FormInput
                        label="Cidade"
                        name="city"
                        value={values.city ?? ""}
                        onChange={e => onChange("city", e.target.value)}
                    />
                    {errors.city && <p style={{ color: "red" }}>{errors.city}</p>}
                </div>

                <FormInput
                    label="Área"
                    name="areaSize"
                    value={values.areaSize ?? ""}
                    onChange={e => onChange("areaSize", e.target.value)}
                />
                {errors.areaSize && <p style={{ color: "red" }}>{errors.areaSize}</p>}
            </div>
        )}
    </div>
  );
}