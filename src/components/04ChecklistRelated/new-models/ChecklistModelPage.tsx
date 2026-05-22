import { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { Trash3Fill } from "react-bootstrap-icons";
import { useChecklistModels } from "../../../hooks/useChecklistModels";
import type { ChecklistModelInput } from "./ChecklistModelForm";
import CrudPageLayout from "../../Others/CrudPageLayout";
import CrudHeader from "../../Others/CrudHeader";
import CrudList from "../../Others/CrudList";
import CrudModal from "../../Others/CrudModal";
import SearchInput from "../../forms/SearchInput";
import ChecklistModelCard from "./ChecklistModelCard";
import ChecklistModelForm from "./ChecklistModelForm";

export default function ChecklistModelPage() {

  const {
    checklistModels,

    loading,
    hasMore,

    fetchChecklistModels,
    loadMore,

    createChecklistModel,
    updateChecklistModel,
    deleteChecklistModel,
  } = useChecklistModels();

  // ===== STATES =====

  const [search, setSearch] = useState("");

  const [showAll, setShowAll] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [toDelete, setToDelete] =
    useState<string | null>(null);

  // ===== INITIAL LOAD =====

  useEffect(() => {

    fetchChecklistModels({
      reset: true,

      limit: showAll ? 10 : 5,

      filters: {
        status: "active",
      },
    });

  }, [showAll]);

  // ===== FILTER =====

  const filtered = useMemo(() => {

    return checklistModels.filter(model =>
      (model.name?.toLowerCase() || "")
        .includes(search.toLowerCase())
    );

  }, [checklistModels, search]);

  // ===== ACTIONS =====

  const handleNew = () => {

    setEditingId(null);

    setShowModal(true);

  };

  const handleEdit = (id: string) => {

    setEditingId(id);

    setShowModal(true);

  };

  const handleSave = async (
    data: ChecklistModelInput
  ) => {

    if (editingId) {

      await updateChecklistModel(
        editingId,
        data
      );

    }
    else {

      await createChecklistModel(data);

    }

    await fetchChecklistModels({
      reset: true,

      limit: showAll ? 10 : 5,

      filters: {
        status: "active",
      },
    });

    setShowModal(false);
  };

  const confirmDelete = async () => {

    if (!toDelete) return;

    await deleteChecklistModel(toDelete);

    await fetchChecklistModels({
      reset: true,

      limit: showAll ? 10 : 5,

      filters: {
        status: "active",
      },
    });

    setToDelete(null);
  };

  // ===== EDITING ITEM =====

  const editingItem =
    checklistModels.find(
      c => c.id === editingId
    );

  // ===== JSX =====

  return (
    <>
      <CrudPageLayout

        // ===== HEADER =====

        header={
          <>
              <CrudHeader
                title="Checklist Models"
                subtitle="Gerencie seus modelos"
                onNew={handleNew}

                actions={
                  <button
                    className="btn-custom btn-custom-outline-secondary rounded-3 px-4"
                    onClick={() => setShowAll(prev => !prev)}
                  >
                    {showAll
                      ? "Mostrar menos"
                      : "Mostrar todos"}
                  </button>
                }
              />

            <div className="pb-3">

              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Buscar checklist..."
              />

            </div>
          </>
        }

        // ===== LIST =====

        list={
          <>
            <CrudList>

              {filtered.length === 0 ? (

                <div className="w-100 py-5 text-center border rounded bg-light">

                  <p className="text-muted mb-0">

                    {search
                      ? "Nenhuma checklist modelo corresponde à sua busca."
                      : "Nenhuma checklist modelo encontrada."}

                  </p>

                </div>

              ) : (

                filtered.map((c, index) => (

                  <div key={c.id ?? index}>

                    <ChecklistModelCard
                      checklist={c}

                      onEdit={() => handleEdit(c.id)}

                      onDelete={() => setToDelete(c.id)}
                    />

                  </div>

                ))

              )}

            </CrudList>

            {/* ===== PAGINATION ===== */}

            {showAll && hasMore && !search && (

              <div className="d-flex justify-content-center pt-4">

                <button
                  className="btn-custom btn-custom-outline-primary px-4 rounded-3 shadow-sm"

                  disabled={loading}

                  onClick={loadMore}
                >
                  {loading
                    ? "Carregando..."
                    : "Carregar mais"}
                </button>

              </div>

            )}
          </>
        }

        // ===== MODAL =====

        modal={
          <CrudModal
            show={showModal}

            title="Modelo de Checklist"

            onClose={() => setShowModal(false)}

            edit={!!editingId}
          >

            <ChecklistModelForm
              key={editingId ?? "new"}

              initialData={editingItem}

              onSubmit={handleSave}
            />

          </CrudModal>
        }
      />

      {/* ===== DELETE MODAL ===== */}

      <Modal
        show={!!toDelete}

        onHide={() => setToDelete(null)}

        centered
      >

        <Modal.Body className="text-center p-5">

          <Trash3Fill
            size={50}
            className="text-danger mb-4"
          />

          <h4 className="fw-bold mb-3">
            Excluir modelo de checklist?
          </h4>

          <p className="text-muted mb-5">
            Esta ação não pode ser desfeita.
          </p>

          <div className="d-flex gap-3 justify-content-center">

            <button
              className="btn-custom btn-custom-outline-secondary px-4 rounded-3"

              onClick={() => setToDelete(null)}
            >
              Cancelar
            </button>

            <button
              className="btn-custom btn-custom-outline-primary px-4 rounded-3 shadow-sm"

              onClick={confirmDelete}
            >
              Excluir
            </button>

          </div>

        </Modal.Body>

      </Modal>
    </>
  );
}