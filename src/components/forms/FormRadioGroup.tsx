interface OptionsProps {
    label: string,
    value: string
}

interface Props {
    label: string;
    name: string;
    value: string | number;
    options: OptionsProps[];
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    error?: string;
    vertical?: boolean;
    scrollableMaxHeight?: string;
}

export default function FormRadioGroup({
    label,
    name,
    value,
    options,
    onChange,
    required = false,
    error,
    vertical,
    scrollableMaxHeight
}: Props) {

    const radioList = (
        <div className={`d-flex gap-3 justify-content-center align-items-start mt-3 ${vertical ? `flex-column` : `flex-row flex-md-row`}`}>

                {options.map((opt, index) => (
                    <label
                        key={opt.label}
                        className="d-flex align-items-center gap-2 px-3 py-2 border rounded-3 w-100 w-md-auto"
                        style={{ cursor: "pointer" }}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={opt.value}
                            checked={value === opt.value}
                            onChange={onChange}
                            className={`form-check-input ${error ? "is-invalid" : ""}`}
                            required={required && index === 0}
                        />

                        <span>{opt.label}</span>
                    </label>
                ))}

            </div>
    );

    return (
        <fieldset className={`w-100 mt-4 p-3 border rounded-3 position-relative ${
                error ? "border-danger" : ""
            }`} >

            {/* Label flutuante */}
            <legend 
                className="w-auto py-1 px-3 text-white fs-6 position-absolute bg-custom-gray00 rounded-pill"
                style={{ top: "-1rem", left: "1rem" }}>
                {label}
            </legend>

            {/* Radios */}
            {scrollableMaxHeight ? (
                <div style={{ maxHeight: scrollableMaxHeight, overflowY: "auto" }}>
                    {radioList}
                </div>
            ) : (
                radioList
            )}

            {/* Feedback Bootstrap */}
            <div className="invalid-feedback">
                {error || `Selecione uma opção`}
            </div>

        </fieldset>
    );
}