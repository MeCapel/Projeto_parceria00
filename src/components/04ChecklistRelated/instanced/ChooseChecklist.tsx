import { useEffect, useState } from "react";
import { getChecklistsModelByVertical, type ChecklistModelProps } from "../../../services/checklistModels.service";

interface Props {
  vertical: string;
  selectedIds?: string[];
  onSelect: (ids: string[]) => void;
  isInvalid?: boolean;
}

export default function ChooseChecklists({
  vertical,
  selectedIds = [],
  onSelect,
  isInvalid,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ChecklistModelProps[]>([]);
  const [selected, setSelected] = useState<string[]>(selectedIds);

  useEffect(() => {
    setSelected(selectedIds);
  }, [selectedIds]);

  useEffect(() => {
    if (!vertical) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getChecklistsModelByVertical(vertical);
        setData(res);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [vertical]);

  const toggle = (id: string) => {
    const updated = selected.includes(id)
      ? selected.filter(x => x !== id)
      : [...selected, id];

    setSelected(updated);
    onSelect(updated);
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className={`p-3 border rounded-2 ${isInvalid ? "border-danger" : ""}`}>
      <h5>Selecionar checklists</h5>
      <small>{vertical}</small>

      {data.length === 0 ? (
        <p>Nenhuma checklist encontrada</p>
      ) : (
        <ul className="list-unstyled mt-3">
          {data.map(item => (
            <li key={item.id} className="d-flex gap-2 align-items-center">
              <input
                type="checkbox"
                checked={selected.includes(item.id!)}
                onChange={() => toggle(item.id!)}
              />
              <label>{item.name}</label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}