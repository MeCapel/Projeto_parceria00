interface Props {
    label: string,
    name: string,
    value: string | number,
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
    required?: boolean,
    minLength?: number,
    maxLength?: number
}

export default function FormTextarea({ label, name, value, onChange, required, minLength, maxLength } : Props)
{
    return(
        <div className="form-floating w-100">
            <textarea 
                rows={5}
                name={name}
                value={value}
                placeholder={label}
                onChange={onChange}
                required={required}
                minLength={minLength}
                maxLength={maxLength || 250}
                className="form-control"
                style={{ minHeight: "100px", maxHeight: "250px", resize: "vertical" }}
            />
            <label>{label}</label>
        </div>
    )
}