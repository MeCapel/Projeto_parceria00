import { type StepProps } from "../ProtoMultiForm2";

export default function Step2({ values, errors, onChange }: StepProps) {
  return (
    <div>

        {/* 🔵 Radio select div status */}
        <fieldset className="d-flex flex-column mt-5 p-3 align-items-start border rounded-2">
            <div className="d-flex py-1 px-3 align-items-start justify-content-center rounded-5 position-relative border bg-secondary" 
                    style={{ top: '-2.5rem' }}>
                <legend className='mb-0 text-white fs-5'>
                    Etapa atual*
                </legend>
            </div>

            <div className="d-flex w-100 gap-3 align-items-start justify-content-center position-relative" style={{ top: '-0.75rem' }}>
                <label htmlFor="fabricacao" className="d-flex gap-2">
                    <input type="radio" value="Fabricação" name="radio" id="fabricacao" checked={values.stage === "Fabricação"} 
                            onChange={e => onChange("stage", e.target.value)} />
                    Fabricação
                </label>

                <label htmlFor="montagem" className="d-flex gap-2">
                    <input type="radio" value="Montagem" name="radio" id="montagem" checked={values.stage === "Montagem"} 
                            onChange={e => onChange("stage", e.target.value)} />
                    Montagem
                </label>

                <label htmlFor="validacao" className="d-flex gap-2">
                    <input type="radio" value="Validação de campo" name="radio" id="validacao" checked={values.stage === "Validação de campo"} 
                            onChange={e => onChange("stage", e.target.value)} />
                    Validação de campo
                </label>
            </div>
            
        </fieldset>

        {errors.stage && <p style={{ color: "red" }}>{errors.stage}</p>}

        {values.stage === "Validação de campo" && (

            <div className="d-flex flex-column my-4 gap-3" style={{ overflow: "auto"}}>

                <div className="d-flex justify-content-between gap-3">
                    <select className="form-select py-1 px-3" name="estado" id="estado" 
                            onChange={e => onChange("state", e.target.value)} value={values.state} >
                        <option defaultValue={"Estado*"}>Estado*</option>
                        <option value="">Selecione...</option>
                        <option value="ES">ES</option>
                        <option value="MG">MG</option>
                        <option value="RJ">RJ</option>
                        <option value="SP">SP</option>
                    </select>

                    {errors.state && <p style={{ color: "red" }}>{errors.state}</p>}

                    <input type="text" placeholder='Cidade*' className='text-custom-black py-1 px-3 fs-5 border rounded-2' 
                        onChange={e => onChange("city", e.target.value)} value={values.city || ""} maxLength={20} />

                    {errors.city && <p style={{ color: "red" }}>{errors.city}</p>}
                </div>

                <input type="number" placeholder='Tamanho da área (em km²)' className='text-custom-black py-1 px-3 fs-5 border rounded-2' 
                        onChange={e => onChange("areaSize", e.target.value)} value={values.areaSize} maxLength={10} />
                {errors.areaSize && <p style={{ color: "red" }}>{errors.areaSize}</p>}
            </div>
        )}
    </div>
  );
}