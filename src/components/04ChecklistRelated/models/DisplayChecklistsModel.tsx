// ===== GERAL IMPORTS =====
import { useState, useEffect } from "react";
import { type ChecklistProps, getChecklistsModel } from "../../../services/checklistServices";
import ChecklistCard from "./ChecklistModelCard";

// ===== TYPE INTERFACE =====
interface Props {
  inline: boolean,
  showAll: boolean,
  search?: string

}

// ===== MAIN COMPONENT =====
export default function DisplayChecklistsModel({ inline, showAll, search = "" }: Props) {

  const [data, setData] = useState<ChecklistProps[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredModels = data.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const unsubscribe = getChecklistsModel((items: ChecklistProps[]) => {
      setData(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [])

  if (loading) return <div className="p-5 text-center"><div className="spinner-border text-danger"></div></div>;

  return (
    <div className="d-flex gap-4 flex-wrap">
        {filteredModels.length === 0 ? (
            <div className="w-100 py-5 text-center border rounded bg-light">
                <p className="text-muted mb-0">
                    {search ? `Nenhum modelo encontrado para "${search}"` : "Nenhum modelo encontrado."}
                </p>
            </div>
        ) : (
            (showAll ? filteredModels : filteredModels.slice(0, 5)).map(item => (
                <div key={item.id}>
                    <ChecklistCard
                        checklist={item}
                        inline={inline}
                    />
                </div>
            ))
        )}
    </div>
  )
}