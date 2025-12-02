import { type StepProps } from "../ProtoMultiForm2";

export default function Step1({ values, errors, onChange }: StepProps) {
  return (
    <div>
      
        {/* --- 🔵 Inputs div --- */}
        <div className="d-flex flex-column my-4 gap-3">
            <input type="text" placeholder='N° de série' className='text-custom-black py-1 px-3 fs-5 border rounded-2' 
                    onChange={e => onChange("code", e.target.value)} value={values.code || ""} maxLength={15} />
            {errors.code && <p style={{ color: "red" }}>{errors.code}</p>}

            <input type="text" placeholder='Nome do protótipo' className='text-custom-black py-1 px-3 fs-5 border rounded-2' 
                    onChange={e => onChange("name", e.target.value)} value={values.name || ""} maxLength={20}/>
            {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}

            {/* <input type="text" placeholder='Convide alguém' className='text-custom-black py-1 px-3 fs-5 border rounded-2' required/> */}
            <textarea className="form-control text-custom-black py-1 px-3 fs-5 border rounded-2" id="textarea" rows={3} placeholder="Descrição do protótipo..."
                    onChange={e => onChange("description", e.target.value)} value={values.description || ""} maxLength={50} style={{ resize: "none"}}>
            </textarea>
            {errors.description && <p style={{ color: "red" }}>{errors.description}</p>}
        </div>

    </div>
  );
}