import { useState } from "react";

import EditChecklistModal from "./EditChecklistModal";

import type {
  ChecklistInstance,
} from "../../../services/checklistInstances.service";
import { CrudTable } from "../../Others/CrudTable";


interface Props {
  checklists: ChecklistInstance[];
  prototypeId: string;
  onUpdate: (c: ChecklistInstance) => void;
}

export default function DisplayPrototypeChecklists({
  checklists,
  prototypeId,
  onUpdate,
}: Props) {
  const [selected, setSelected] =
    useState<ChecklistInstance | null>(null);

  const handleEdit = (id: string) => {
    const found = checklists.find(
      (c) => c.id === id
    );

    if (found) {
      setSelected(found);
    }
  };

  return (
    <>
      {checklists.length === 0 ? (

        <div className="w-100 py-5 text-center border rounded bg-light mt-3">
          <p className="text-muted mb-0">Nenhuma checklist encontrada.</p>
        </div>

      ) : (

        <div className="mt-3">

          <div className="table-responsive rounded-4 border shadow-sm">

            <CrudTable
              headers={[
                "Nome",
                "Categorias",
                "Progresso",
                "Total de itens",
              ]}

              data={checklists}

              getId={(c) => c.id}

              renderRow={(c) => {
                const totalItems =
                  c.categories.reduce(
                    (acc, cat) =>
                      acc + cat.items.length,
                    0
                  );

                const checkedItems =
                  c.categories.reduce(
                    (acc, cat) =>
                      acc +
                      cat.items.filter(
                        (i) => i.checked
                      ).length,
                    0
                  );

                const progress =
                  totalItems > 0
                    ? Math.round(
                        (checkedItems /
                          totalItems) *
                          100
                      )
                    : 0;

                return (
                  <>
                    {/* NOME */}
                    <td className="px-4 fw-semibold text-dark">
                      {c.name}
                    </td>

                    {/* CATEGORIAS */}
                    <td className="px-4">
                      <span className="badge bg-primary rounded-pill">
                        {c.categories.length}
                      </span>
                    </td>

                    {/* PROGRESSO */}
                    <td className="px-4">

                      <div className="d-flex align-items-center gap-2">

                        <div
                          className="progress grow"
                          style={{
                            height: "8px",
                            minWidth: "120px",
                          }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        </div>

                        <small className="text-muted fw-semibold">
                          {progress}%
                        </small>

                      </div>

                    </td>

                    {/* TOTAL */}
                    <td className="px-4 text-secondary">
                      {checkedItems}/{totalItems}
                    </td>
                  </>
                );
              }}

              onEdit={handleEdit}
            />

          </div>

        </div>

      )}

      {selected && (
        <EditChecklistModal
          prototypeId={prototypeId}
          checklist={selected}
          onClose={() => setSelected(null)}
          onSave={(updatedChecklist) => {
            onUpdate(updatedChecklist);
            setSelected(null);
          }}
        />
      )}
    </>
  );
}