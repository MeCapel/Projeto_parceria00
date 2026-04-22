interface Props {
    value: string | number,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

export default function FormFoneInput({ value, onChange }: Props) {

    function formatFone(value: string) {
        const numbers = value.replace(/\D/g, "").slice(0, 13);

        if (!numbers) return "";

        let result = "+" + numbers;

        if (numbers.length > 2) {
            result = "+" + numbers.slice(0, 2) + " (" + numbers.slice(2, 4);
        }

        if (numbers.length > 4) {
            result = "+" + numbers.slice(0, 2) + " (" + numbers.slice(2, 4) + ") " + numbers.slice(4);
        }

        return result;
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const rawValue = e.target.value;

        // permite apagar direto
        if (rawValue === "") {
            onChange(e);
            return;
        }

        const formatted = formatFone(rawValue);

        const fakeEvent = {
            ...e,
            target: {
                ...e.target,
                name: "fone",
                value: formatted
            }
        };

        onChange(fakeEvent as React.ChangeEvent<HTMLInputElement>);
    }

    return (
        <div className="form-floating w-100">
            <input 
                name="fone"
                value={value}
                placeholder="Telefone"
                onChange={handleChange}
                className="form-control"
                required
            />
            <label>Telefone</label>
        </div>
    );
}