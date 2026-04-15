interface Props {
    label: string,
    name: string,
    value: string | number,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    type?: string,
    required?: boolean,
    minLength?: number,
    maxLength?: number
}

export default function FormInput({ label, name, value, onChange, type, required, minLength, maxLength } : Props)
{
    return(
        <div className="form-floating w-100">
            <input 
                type={type} 
                name={name}
                value={value}
                placeholder={label}
                onChange={onChange}
                required={required}
                minLength={minLength}
                maxLength={maxLength}
                className="form-control"
            />
            <label>{label}</label>
        </div>
    )
}