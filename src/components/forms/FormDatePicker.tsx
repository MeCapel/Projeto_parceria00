import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
    label: string;
    value: Date | null;
    onChange: (date: Date | null) => void;
}

export default function FormDatePicker({ label, value, onChange }: Props) {
    return (
        <div className="d-flex align-items-center w-100 gap-3">
            <label className={value ? "active" : ""}>
                {label}:
            </label>

            <DatePicker
                selected={value}
                onChange={onChange}
                dateFormat="dd/MM/yyyy"
                placeholderText=" "
                className="form-control custom-date-input w-100"
                minDate={new Date()}
                onKeyDown={(e) => e.preventDefault()}
                required
            />

        </div>
    );
}