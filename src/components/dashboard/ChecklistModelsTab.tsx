import { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { Trash3Fill } from "react-bootstrap-icons";
import { useChecklistModels } from "../../hooks/useChecklistModels";
import type { ChecklistModelInput } from "../04ChecklistRelated/new-models/ChecklistModelForm";
import CrudPageLayout from "../Others/CrudPageLayout";
import CrudHeader from "../Others/CrudHeader";
import SearchInput from "../forms/SearchInput";
import CrudList from "../Others/CrudList";
import { CrudTable } from "../Others/CrudTable";
import CrudModal from "../Others/CrudModal";
import ChecklistModelForm from "../04ChecklistRelated/new-models/ChecklistModelForm";
import { formatDateBR } from "../../utils/date";

export default function ChecklistModelsTab() {

  const {
    checklistModels,

    loading,
    hasMore,

    fetchChecklistModels,
    loadMore,

    createChecklistModel,
    updateChecklistModel,
    changeChecklistModelStatus,
    deleteChecklistModel,
  } = useChecklistModels();

  // ===== STATES =====

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<"all" | "active" | "disabled">("all");

  // MULTI SELECT VERTICALS
  const [verticalFilters, setVerticalFilters] =
    useState<string[]>([]);

  const [showModal, setShowModal] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [toDelete, setToDelete] =
    useState<string | null>(null);

  // ===== AVAILABLE VERTICALS =====

  const availableVerticals = useMemo(() => {

    const verticals =
      checklistModels.map(c => c.vertical);

    return [...new Set(verticals)];

  }, [checklistModels]);

  // ===== FILTERS =====

  const apiFilters = useMemo(() => {

    return {

      status:
        statusFilter === "all"
          ? undefined
          : statusFilter,

    };

  }, [statusFilter]);

  // ===== INITIAL FETCH =====

  useEffect(() => {

    fetchChecklistModels({
      reset: true,
      limit: 10,
      filters: apiFilters,
    });

  }, [apiFilters]);

  // ===== LOCAL FILTERS =====

  const filtered = useMemo(() => {

    return checklistModels.filter(model => {

      // SEARCH
      const matchesSearch =
        model.name
          ?.toLowerCase()
          .includes(search.toLowerCase());

      // VERTICALS
      const matchesVertical =
        verticalFilters.length === 0
          ? true
          : verticalFilters.includes(model.vertical);

      return (
        matchesSearch &&
        matchesVertical
      );

    });

  }, [
    checklistModels,
    search,
    verticalFilters
  ]);

  // ===== ACTIONS =====

  const handleNew = () => {

    setEditingId(null);

    setShowModal(true);

  };

  const handleEdit = (id: string) => {

    setEditingId(id);

    setShowModal(true);

  };

  const handleStatusChange = async (
    id: string,
    currentStatus: "active" | "disabled"
    ) => {
    const newStatus =
        currentStatus === "active" ? "disabled" : "active";

    await changeChecklistModelStatus(id, newStatus);

    await fetchChecklistModels({
        reset: true,
        limit: 10,
        filters: apiFilters,
    });
    };

  const handleDelete = (id: string) => {

    setToDelete(id);

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
      limit: 10,
      filters: apiFilters,
    });

    setShowModal(false);
  };

  const confirmDelete = async () => {

    if (!toDelete) return;

    await deleteChecklistModel(toDelete);

    await fetchChecklistModels({
      reset: true,
      limit: 10,
      filters: apiFilters,
    });

    setToDelete(null);
  };

  // ===== CHECKBOX FILTER =====

  const toggleVerticalFilter = (
    vertical: string
  ) => {

    setVerticalFilters(prev => {

      if (prev.includes(vertical)) {

        return prev.filter(v => v !== vertical);

      }

      return [...prev, vertical];

    });

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
              subtitle="Gerencie todos os modelos"
              onNew={handleNew}
            />

            {/* ===== FILTERS ===== */}

            <div className="d-flex flex-column gap-3 pb-3">

              {/* TOP ROW */}
              <div className="d-flex flex-wrap gap-3 align-items-start">

                {/* SEARCH */}
                <div
                  className="grow"
                  style={{
                    minWidth: 260
                  }}
                >
                  <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Buscar checklist..."
                  />
                </div>

                {/* STATUS */}
                <select
                  className="form-select rounded-3"

                  style={{
                    width: 220
                  }}

                  value={statusFilter}

                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value as
                        | "all"
                        | "active"
                        | "disabled"
                    )
                  }
                >
                  <option value="all">
                    Todos status
                  </option>

                  <option value="active">
                    Active
                  </option>

                  <option value="disabled">
                    Disabled
                  </option>

                </select>

              </div>

              {/* VERTICAL CHECKBOXES */}
              {availableVerticals.length > 0 && (

                <div className="d-flex flex-wrap gap-3">

                  {availableVerticals.map(vertical => {

                    const checked =
                      verticalFilters.includes(vertical);

                    return (
                      <label
                        key={vertical}
                        className="
                          d-flex
                          align-items-center
                          gap-2
                          border
                          rounded-3
                          px-3
                          py-2
                          bg-white
                          cursor-pointer
                        "
                        style={{
                          cursor: "pointer"
                        }}
                      >

                        <input
                          type="checkbox"

                          checked={checked}

                          onChange={() =>
                            toggleVerticalFilter(vertical)
                          }
                        />

                        <span className="text-secondary">
                          {vertical}
                        </span>

                      </label>
                    );

                  })}

                </div>

              )}

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

                    Nenhuma checklist encontrada.

                  </p>

                </div>

              ) : (

                <div className="w-100">

                  <CrudTable

                    headers={[
                      "Nome",
                      "Vertical",
                      "Versão",
                      "Status",
                      "Categorias",
                      "Criado em",
                    ]}

                    data={filtered}

                    getId={(c) => c.id}

                    renderRow={(c) => (
                      <>

                        {/* NAME */}
                        <td className="px-4 text-secondary">
                          {c.name}
                        </td>

                        {/* VERTICAL */}
                        <td className="px-4 text-secondary">
                          {c.vertical}
                        </td>

                        {/* VERSION */}
                        <td className="px-4 text-secondary">
                          v{c.version}
                        </td>

                        {/* STATUS */}
                        <td className="px-4 text-secondary">

                          <span
                            className={`badge px-3 py-2 rounded-3 ${
                              c.status === "active"
                                ? "bg-success-subtle text-success"
                                : "bg-secondary-subtle text-secondary"
                            }`}
                          >
                            {c.status}
                          </span>

                        </td>

                        {/* CATEGORIES */}
                        <td className="px-4 text-secondary">
                          {c.categories?.length || 0}
                        </td>

                        {/* CREATED */}
                        <td className="px-4 text-secondary">
                          {formatDateBR(c.createdAt!)}
                        </td>

                      </>
                    )}

                    onEdit={handleEdit}

                    onStatusChange={handleStatusChange}

                    onDelete={handleDelete}
                  />

                </div>

              )}

            </CrudList>

            {/* ===== PAGINATION ===== */}

            {hasMore && !search && (

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