// ===== GERAL IMPORTS =====
import { useState, useEffect } from "react";
import { type ChecklistProps, getChecklistsModel } from "../../../services/checklistServices";
import { useNavigate } from "react-router";
import ChecklistCard from "./ChecklistModelCard";

// ===== TYPE INTERFACE =====
interface Props {
  inline: boolean,
  showAll: boolean,
}

// ===== MAIN COMPONENT =====
// ----- This component comes from AddCheccklist component as its father, and organize all checklist models by using ChecklistCard component, only organizes cards -----
export default function DisplayChecklistsModel({ inline, showAll }: Props) {

  const [data, setData] = useState<ChecklistProps[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {

    const unsubscribe = getChecklistsModel((items: ChecklistProps[]) => {

      setData(items);
      setLoading(false);

    });

    return () => unsubscribe();

  }, [])

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="pt-3 d-flex flex-column gap-3">

      {inline ? (

        <div className="p-5">

          <div className="d-flex flex-column mb-4">

            <p
              style={{ cursor: "pointer" }}
              className="mb-0 text-custom-red fs-5"
              onClick={() => navigate("/checklists")}
            >
              Modelos de Checklist
            </p>

            <p className="mb-0 text-custom-black fs-1 fw-bold">
              Gerenciar modelos
            </p>

          </div>

          <ul className="list-unstyled d-flex flex-wrap gap-3">

            {data.length === 0 && (
              <p className="text-muted">
                Nenhum modelo encontrado.
              </p>
            )}

            {data.map(item => (

              <li key={item.id} className="w-100">

                <ChecklistCard
                  checklist={item}
                  inline
                />

              </li>

            ))}

          </ul>

        </div>

      ) : (

        <div className="row">

          <div className="d-flex w-100 gap-3 align-items-start justify-content-center my-3">

            <ul className="d-flex flex-wrap gap-4 list-unstyled w-100">

              {data.length === 0 && (
                <p>Nenhum modelo encontrado.</p>
              )}

              {showAll ? (
                data.map(item => (

                <li key={item.id}>

                  <ChecklistCard
                    checklist={item}
                    inline={false}
                  />

                </li>

              ))
              ) : 
              (
                data.slice(0, 5).map(item => (

                <li key={item.id}>

                  <ChecklistCard
                    checklist={item}
                    inline={false}
                  />

                </li>

              ))
              )}

              

            </ul>

          </div>

        </div>

      )}

    </div>
  )
}