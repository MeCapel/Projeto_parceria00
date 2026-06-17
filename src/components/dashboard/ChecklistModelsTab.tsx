import { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { ArrowLeftCircleFill, Trash3Fill } from "react-bootstrap-icons";
import { useChecklistModels } from "../../hooks/useChecklistModels";
import type { ChecklistModelInput } from "../04ChecklistRelated/new-models/ChecklistModelForm";
import CrudPageLayout from "../Others/CrudPageLayout";
import CrudHeader from "../Others/CrudHeader";
import SearchInput from "../forms/SearchInput";
import MultiCheckFilter from "../forms/MultiCheckFilter";
import CrudList from "../Others/CrudList";
import { CrudTable } from "../Others/CrudTable";
import CrudModal from "../Others/CrudModal";
import ChecklistModelForm from "../04ChecklistRelated/new-models/ChecklistModelForm";
import { formatDateBR } from "../../utils/date";
import { useNavigate } from "react-router";

export default function ChecklistModelsTab() {
  const navigate = useNavigate();

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

  // ===== STATUS LABEL MAP =====
  const statusLabel: Record<string, string> = {
    active: "Ativo",
    disabled: "Desativado",
  };

  // ===== STATES =====

  const [search, setSearch] = useState("");

  const [statusFilters, setStatusFilters] = useState<string[]>([]);

  // Filters
  const [verticalFilters, setVerticalFilters] = useState<string[]>([]);
  const [versionFilters, setVersionFilters] = useState<string[]>([]);

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [toDelete, setToDelete] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  // ===== VERTICAL OPTIONS =====

  const verticalOptions = useMemo(() => {

    const verticals = [...new Set(checklistModels.map(c => c.vertical))];

    return verticals.map(v => ({ label: v, value: v }));

  }, [checklistModels]);

  // ===== VERSION OPTIONS =====
  const versionOptions = useMemo(() => {

    const versions = [...new Set(checklistModels.map(c => String(c.version)))];

    return versions.map(v => ({ label: `v${v}`, value: v }));

  }, [checklistModels]);

  // ===== FILTERS =====

  const apiFilters = useMemo(() => {

    let status: "active" | "disabled" | undefined;
    if (statusFilters.length === 0 || statusFilters.length === 2) {
      status = undefined;
    } else {
      status = statusFilters[0] as "active" | "disabled";
    }

    return { status };

  }, [statusFilters]);

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

      // VERSIONS
      const matchesVersion =
        versionFilters.length === 0
          ? true
          : versionFilters.includes(String(model.version));

      return (
        matchesSearch &&
        matchesVertical &&
        matchesVersion
      );

    });

  }, [
    checklistModels,
    search,
    verticalFilters,
    versionFilters
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

    try
    {
      setIsSaving(true);

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
    }
    finally
    {
      setIsSaving(false);
    }
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

  // ===== EDITING ITEM =====

  const editingItem =
    checklistModels.find(
      c => c.id === editingId
    );

  // ===== JSX =====

  return (
    <>
      <div className="ps-5 pt-5 pb-0 pe-0">
          <button 
              className="btn-custom btn-custom-link d-flex gap-3 align-items-center border-0 bg-transparent p-0" 
              onClick={() => navigate(`/admin-dashboard`)}
          >
              <ArrowLeftCircleFill size={30} className="text-custom-black" />
              <p className="text-custom-black fs-5 mb-0 fw-semibold">
                  voltar
              </p>
          </button>
      </div>

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

            <div className="d-flex flex-wrap gap-3 pb-3">

              <div className="flex-grow-1">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Buscar checklist..."
                />
              </div>

              <MultiCheckFilter
                label="Status"
                options={[
                  { label: "Ativos", value: "active" },
                  { label: "Desativados", value: "disabled" },
                ]}
                selected={statusFilters}
                onChange={setStatusFilters}
              />

              <MultiCheckFilter
                label="Vertical"
                options={verticalOptions}
                selected={verticalFilters}
                onChange={setVerticalFilters}
              />

              <MultiCheckFilter
                label="Versão"
                options={versionOptions}
                selected={versionFilters}
                onChange={setVersionFilters}
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
                          {c.verticalLabel}
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
                            {statusLabel[c.status ?? ""] ?? c.status}
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

              loading={isSaving}
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