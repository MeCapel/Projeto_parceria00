interface Props {
    label: string,
    name: string,
    value: string | number,
    options: string[],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

export default function FormRadioGroup({ label, name, value, options, onChange }: Props)
{
    return(
        <fieldset className="w-100 mt-4 p-3 border rounded-3 position-relative">

            {/* Label flutuante */}
            <div className="position-relative">
                <legend className="w-auto py-2 px-4 text-white fs-6 position-absolute bg-custom-gray00 rounded-pill" style={{ top: "-2.5rem"}}>
                    {label}
                </legend>
            </div>

            {/* Radios */}
            <div className="
                d-flex 
                flex-column 
                flex-md-row 
                gap-3 
                justify-content-center 
                align-items-start 
                mt-3
            ">

                {options.map(opt => (
                    <label 
                        key={opt} 
                        className="
                            d-flex 
                            align-items-center 
                            gap-2 
                            px-3 py-2 
                            border 
                            rounded-3 
                            w-100 
                            w-md-auto
                            cursor-pointer
                        "
                        style={{ cursor: "pointer" }}
                    >
                        <input 
                            type="radio"
                            name={name}
                            value={opt}
                            checked={value === opt}
                            onChange={onChange}
                            className="form-check-input"
                        />

                        <span>{opt}</span>
                    </label>
                ))}

            </div>
        </fieldset>
    )
}