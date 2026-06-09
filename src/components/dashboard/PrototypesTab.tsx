// ===== IMPORTS =====
import { useEffect, useMemo, useState } from "react";
import { usePrototypes } from "../../hooks/usePrototypes";
import { useProjects } from "../../hooks/useProjects";
import CrudPageLayout from "../Others/CrudPageLayout";
import CrudHeader from "../Others/CrudHeader";
import SearchInput from "../forms/SearchInput";
import MultiCheckFilter from "../forms/MultiCheckFilter";
import CrudList from "../Others/CrudList";
import { CrudTable } from "../Others/CrudTable";
import { formatDateBR } from "../../utils/date";
import { Modal } from "react-bootstrap";
import { ArrowLeftCircleFill, Trash3Fill } from "react-bootstrap-icons";
import { useNavigate } from "react-router";
import ProtoMultiForm from "../03PrototypeRelated/ProtoMultiForm";

interface PrototypesTabProps {
  projectId?: string;
}

export default function PrototypesTab({ projectId }: PrototypesTabProps) {
  const navigate = useNavigate();

  // ===== HOOKS =====
  const {
    prototypes,
    loading,
    hasMore,
    fetchPrototypes,
    loadMore,
    changePrototypeStatus,
    deletePrototype,
  } = usePrototypes({ projectId });

  const {
    projects: allProjects,
  } = useProjects({});

  // ===== STATUS LABEL MAP =====
  const statusLabel: Record<string, string> = {
    active: "Ativo",
    disabled: "Desativado",
  };

  // ===== STATES =====
  const [search, setSearch] = useState("");

  const [statusFilters, setStatusFilters] = useState<string[]>([]);

  const [verticalFilters, setVerticalFilters] = useState<string[]>([]);

  const [stageFilters, setStageFilters] = useState<string[]>([]);

  const verticalOptions = useMemo(() => {
    const values = [...new Set(prototypes.map(p => p.vertical).filter(Boolean))] as string[];
    return values.map(v => ({ label: v, value: v }));
  }, [prototypes]);

  const stageOptions = useMemo(() => {
    const values = [...new Set(prototypes.map(p => p.stage).filter(Boolean))] as string[];
    return values.map(v => ({ label: v, value: v }));
  }, [prototypes]);

  const [showProtoForm, setShowProtoForm] = useState(false);

  const [toDelete, setToDelete] = useState<string | null>(null);

  // ===== PROJECT OPTIONS =====
  const projectOptions = useMemo(() =>
    allProjects.map(p => ({ value: p.id, label: p.name })),
    [allProjects]
  );

  // ===== API FILTERS =====
  const apiFilters = useMemo(() => {
    let status: "active" | "disabled" | undefined;
    if (statusFilters.length === 0 || statusFilters.length === 2) {
      status = undefined;
    } else {
      status = statusFilters[0] as "active" | "disabled";
    }
    return { projectId, status };
  }, [projectId, statusFilters]);

  // ===== INITIAL FETCH =====
  useEffect(() => {
    fetchPrototypes({
      reset: true,
      limit: 10,
      filters: apiFilters,
    });

  }, [apiFilters]);

  // ===== SEARCH FILTER =====
  const filtered = useMemo(() => {
    return prototypes.filter(p => {

      const q = search.toLowerCase();

      const matchesSearch =
        p.name
          ?.toLowerCase()
          .includes(q) ||

        p.code
          ?.toLowerCase()
          .includes(q) ||

        p.vertical
          ?.toLowerCase()
          .includes(q);

      const matchesVertical =
        verticalFilters.length === 0
          || (p.vertical && verticalFilters.includes(p.vertical));

      const matchesStage =
        stageFilters.length === 0
          || (p.stage && stageFilters.includes(p.stage));

      return (
        matchesSearch &&
        matchesVertical &&
        matchesStage
      );

    });

  }, [
    prototypes,
    search,
    verticalFilters,
    stageFilters,
  ]);

  // ===== ACTIONS =====
  const handleNew = () => {
    setShowProtoForm(true);
  };

  const handleNavigate = (id: string) => {
    navigate(`/admin-prototype/${id}`);
  };

  const handleDelete = (
    id: string
  ) => {

    setToDelete(id);

  };

  const confirmDelete = async () => {

    if (!toDelete) return;

    await deletePrototype(
      toDelete
    );

    await fetchPrototypes({
      reset: true,
      limit: 10,
      filters: apiFilters,
    });

    setToDelete(null);
  };

  const handleStatusChange = async (
    id: string,
    currentStatus: "active" | "disabled"
  ) => {

    const newStatus =
      currentStatus === "active"
        ? "disabled"
        : "active";

    await changePrototypeStatus(
      id,
      newStatus
    );

    await fetchPrototypes({
      reset: true,
      limit: 10,
      filters: apiFilters,
    });
  };

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

        header={
          <>
            <CrudHeader
              title="Protótipos"
              subtitle="Gerencie os protótipos"
              onNew={handleNew}
            />

            <div className="d-flex flex-wrap gap-3 pb-3">

              <div className="flex-grow-1">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Pesquisar protótipo..."
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
                label="Etapa"
                options={stageOptions}
                selected={stageFilters}
                onChange={setStageFilters}
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
                    Nenhum protótipo encontrado.
                  </p>

                </div>

              ) : (

                <div className="w-100">

                  <CrudTable

                    headers={[
                      "Nome",
                      "Vertical",
                      "Etapa",
                      "Status",
                      "Criado em",
                    ]}

                    data={filtered}

                    getId={(p) => p.id}

                    renderRow={(p) => (
                      <>
                        <td className="px-4 text-secondary">
                          {p.name}
                        </td>

                        <td className="px-4 text-secondary">
                          {p.verticalLabel}
                        </td>

                        <td className="px-4 text-secondary">
                          {p.stageLabel}
                        </td>

                        <td className="px-4 text-secondary">

                          <span
                            className={`badge px-3 py-2 rounded-3 ${
                              p.status === "active"
                                ? "bg-success-subtle text-success"
                                : "bg-secondary-subtle text-secondary"
                            }`}
                          >
                            {statusLabel[p.status ?? ""] ?? p.status}
                          </span>

                        </td>

                        <td className="px-4 text-secondary">
                          {formatDateBR(p.createdAt!)}
                        </td>

                      </>
                    )}

                    onEdit={handleNavigate}

                    onDelete={handleDelete}

                    onStatusChange={
                      handleStatusChange
                    }
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

      />

      {/* ===== PROTO MULTI FORM (creation) ===== */}
      <ProtoMultiForm
        show={showProtoForm}
        onClose={() => setShowProtoForm(false)}
        projectOptions={projectOptions}
        onSuccess={() =>
          fetchPrototypes({
            reset: true,
            limit: 10,
            filters: apiFilters,
          })
        }
      />

      {/* ===== DELETE MODAL ===== */}
      <Modal
        show={!!toDelete}

        onHide={() =>
          setToDelete(null)
        }

        centered
      >

        <Modal.Body className="text-center p-5">

          <Trash3Fill
            size={50}
            className="text-danger mb-4"
          />

          <h4 className="fw-bold mb-3">
            Excluir protótipo?
          </h4>

          <p className="text-muted mb-5">
            Esta ação não pode ser desfeita.
          </p>

          <div className="d-flex gap-3 justify-content-center">

            <button
              className="btn-custom btn-custom-outline-secondary px-4 rounded-3"

              onClick={() =>
                setToDelete(null)
              }
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