interface Props {
    label: string,
    name: string,
    value: string | number,
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
}

export default function FormTextarea({ label, name, value, onChange } : Props)
{
    return(
        <div className="form-floating w-100">
            <textarea 
                rows={5}
                name={name}
                value={value}
                maxLength={150}
                placeholder={label}
                onChange={onChange}
                className="form-control"
                style={{ minHeight: "100px", maxHeight: "250px", resize: "vertical" }}
            />
            <label>{label}</label>
        </div>
    )
}