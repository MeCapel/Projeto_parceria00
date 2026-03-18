interface Props {
    label: string,
    name: string,
    value: string | number,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    type?: string,
}

export default function FormInput({ label, name, value, onChange, type } : Props)
{
    return(
        <div className="form-floating w-100">
            <input 
                type={type} 
                name={name}
                value={value}
                maxLength={50}
                placeholder={label}
                onChange={onChange}
                className="form-control"
            />
            <label>{label}</label>
        </div>
    )
}