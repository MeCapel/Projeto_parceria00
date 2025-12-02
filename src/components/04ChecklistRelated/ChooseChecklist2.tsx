import { useState, useEffect } from "react";
import { getChecklistsModelByP, type Checklist } from "../../services/checklistServices2";

interface Props {
    vertical: string;
    onValueChange: (values: string[]) => void;
    initialSelectedIds?: string[]; // opcional
}

export default function ChooseChecklists({ vertical, onValueChange, initialSelectedIds }: Props) {
    const [data, setData] = useState<Checklist[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds || []);
    const [loading, setLoading] = useState(true);

    // Atualiza selectedIds se initialSelectedIds mudar
    useEffect(() => {
        if (initialSelectedIds) setSelectedIds(initialSelectedIds);
    }, [initialSelectedIds]);

    // Alterna seleção do checkbox
    const handleToggle = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // Sincroniza com o componente pai
    useEffect(() => {
        onValueChange(selectedIds);
    }, [selectedIds, onValueChange]);

    // Busca checklists sempre que a vertical muda
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const checklists = await getChecklistsModelByP(vertical);
                setData(checklists);
            } catch (err) {
                console.error("Erro ao buscar checklists por vertical:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [vertical]);

    if (loading) return <p>Carregando...</p>;

    return (
        <div className="p-3 d-flex flex-column gap-3 border rounded-2">
            <div>
                <p className="text-custom-black fs-4 fw-bold mb-0">Selecionar checklists</p>
                <p className="fs-5 mb-0 text-custom-red">{vertical}</p>
            </div>

            {data.length === 0 ? (
                <p>Nenhuma checklist encontrada para este P.</p>
            ) : (
                <ul className="list-unstyled d-flex flex-column gap-2">
                    {data.map(item => (
                        <li key={item.id} className="d-flex gap-3 align-items-center">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={item.id}
                                checked={selectedIds.includes(item.id!)}
                                onChange={() => handleToggle(item.id!)}
                            />
                            <label htmlFor={item.id} className="form-check-label">{item.name}</label>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
