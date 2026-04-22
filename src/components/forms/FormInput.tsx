interface Props {
    label: string,
    name: string,
    value: string | number,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    type?: string,
    required?: boolean,
    minLength?: number,
    maxLength?: number,
    regEx?: string,
}

export default function FormInput({ label, name, value, onChange, type, required, minLength, maxLength, regEx } : Props)
{
    return(
        <div className="form-floating w-100">
            {regEx ? 
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
                    pattern={regEx}
                />
                :
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
            }

            <label>{label}</label>
        </div>
    )
}