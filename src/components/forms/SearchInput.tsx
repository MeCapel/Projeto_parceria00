import { Search } from "react-bootstrap-icons";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = "Pesquisar..." }: SearchInputProps) {
    return (
        <div className="position-relative mb-4" style={{ maxWidth: "400px" }}>
            <div className="input-group">
                <span 
                    className="input-group-text bg-white border-end-0 ps-3"
                    style={{borderColor: "#dee2e6"}}
                >
                    <Search className="text-secondary" size={16} />
                </span>
                <input
                    type="text"
                    className="form-control border-start-0 shadow-none"
                    style={{ borderColor: "#dee2e6", paddingLeft: "0.5rem" }}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
}
