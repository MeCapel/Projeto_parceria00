interface Option {
    value: string;
    label: string;
    disabled?: boolean;
}

interface Props {
    label: string;
    name: string;
    value: string | number;
    options: Option[];
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function FormSelect({ label, name, value, options, required, onChange }: Props) {
    return (
        <div className="form-floating">
            <select
                name={name}
                className="form-select"
                value={value}
                onChange={onChange}
                required={required}
            >
                {options.map(opt => (
                    <option
                        key={opt.value}
                        value={opt.value}
                        disabled={opt.disabled}
                    >
                        {opt.label}
                    </option>
                ))}
            </select>
            <label>{label}</label>
        </div>
    );
}