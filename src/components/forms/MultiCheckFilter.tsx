import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "react-bootstrap-icons";

interface Props {
    label: string;
    options: { label: string; value: string }[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

export default function MultiCheckFilter({ label, options, selected, onChange }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function toggle(value: string) {
        if (selected.includes(value)) {
            onChange(selected.filter(v => v !== value));
        } else {
            onChange([...selected, value]);
        }
    }

    return (
        <div ref={ref} className="position-relative">
            <button
                type="button"
                className="bg-white border rounded-3 d-flex align-items-center justify-content-between gap-2 w-100"
                style={{
                    height: "2.375rem",
                    padding: "0.375rem 0.75rem",
                    cursor: "pointer",
                    color: "inherit",
                    fontSize: "1rem",
                    lineHeight: "1.5",
                }}
                onClick={() => setOpen(!open)}
            >
                <span className="d-inline-block text-truncate">
                    {label}
                    {selected.length > 0 && (
                        <span className="badge bg-custom-gray00 rounded-pill ms-1">{selected.length}</span>
                    )}
                </span>
                <ChevronDown size={16} className="flex-shrink-0" />
            </button>

            {open && (
                <div
                    className="position-absolute bg-white border rounded-3 shadow-sm p-2 mt-1"
                    style={{ zIndex: 1060, minWidth: "100%", maxHeight: 260, overflowY: "auto" }}
                >
                    {options.map(opt => (
                        <label
                            key={opt.value}
                            className="d-flex align-items-center gap-2 px-2 py-1 rounded-3"
                            style={{ cursor: "pointer" }}
                        >
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={selected.includes(opt.value)}
                                onChange={() => toggle(opt.value)}
                            />
                            <span className="text-secondary text-truncate">{opt.label}</span>
                        </label>
                    ))}

                    {options.length === 0 && (
                        <p className="text-muted small mb-0 px-2 py-1">Nenhuma opção disponível</p>
                    )}
                </div>
            )}
        </div>
    );
}
