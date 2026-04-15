interface Props {
    label: string;
    name: string;
    value: string | number;
    options: string[];
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    error?: string;
}

export default function FormRadioGroup({
    label,
    name,
    value,
    options,
    onChange,
    required = false,
    error
}: Props) {

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
            <div className="d-flex flex-column flex-md-row gap-3 justify-content-center align-items-start mt-3">

                {options.map((opt, index) => (
                    <label
                        key={opt}
                        className="d-flex align-items-center gap-2 px-3 py-2 border rounded-3 w-100 w-md-auto"
                        style={{ cursor: "pointer" }}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={opt}
                            checked={value === opt}
                            onChange={onChange}
                            className={`form-check-input ${error ? "is-invalid" : ""}`}
                            required={required && index === 0}
                        />

                        <span>{opt}</span>
                    </label>
                ))}

            </div>

            {/* Feedback Bootstrap */}
            <div className="invalid-feedback">
                {error || `Selecione uma opção`}
            </div>

        </fieldset>
    );
}