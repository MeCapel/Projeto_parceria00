// ===== IMPORTS =====
import { useEffect, useMemo, useRef, useState } from "react";
import { usePrototypes } from "../../hooks/usePrototypes";
import { useForm } from "../../hooks/useForm";
import CrudModal from "../Others/CrudModal";
import FormInput from "../forms/FormInput";
import FormTextarea from "../forms/FormTextarea";
import CrudPageLayout from "../Others/CrudPageLayout";
import CrudHeader from "../Others/CrudHeader";
import SearchInput from "../forms/SearchInput";
import CrudList from "../Others/CrudList";
import { CrudTable } from "../Others/CrudTable";
import { formatDateBR } from "../../utils/date";
import { Modal } from "react-bootstrap";
import { ArrowLeftCircleFill, Trash3Fill } from "react-bootstrap-icons";
import { useNavigate } from "react-router";

// ===== TYPES =====
interface PrototypeForm {
  code?: string,
  name: string;
  description: string;
  vertical: string;
  stage: string,
  projectId: string;
  areaSize?: number;
  image: string
}

interface PrototypesTabProps {
  projectId?: string;
}

export default function PrototypesTab({ projectId }: PrototypesTabProps) {
  const navigate = useNavigate();

  // ===== HOOK =====
  const {
    prototypes,
    loading,
    hasMore,
    fetchPrototypes,
    loadMore,
    createPrototype,
    updatePrototype,
    changePrototypeStatus,
    deletePrototype,
  } = usePrototypes({ projectId });

  // ===== STATUS LABEL MAP =====
  const statusLabel: Record<string, string> = {
    active: "Ativo",
    disabled: "Desativado",
  };

  // ===== STATES =====
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "disabled">("all");

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [toDelete, setToDelete] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  // ===== FORM =====
  const formRef = useRef<HTMLFormElement | null>(null);

  const { values, setValues, handleChange, reset,} = useForm<PrototypeForm>({
    name: "",
    description: "",
    stage: "",
    vertical: "",
    projectId: projectId || "",
    areaSize: undefined,
    image: ""
  });

  // ===== API FILTERS =====
  const apiFilters = useMemo(() => {
    return {
      projectId,
      status:
        statusFilter === "all"
          ? undefined
          : statusFilter,
    };
  }, [projectId, statusFilter]);

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

      return (
        p.name
          ?.toLowerCase()
          .includes(q) ||

        p.code
          ?.toLowerCase()
          .includes(q) ||

        p.vertical
          ?.toLowerCase()
          .includes(q)
      );

    });

  }, [
    prototypes,
    search,
  ]);

  // ===== ACTIONS =====
  const handleNew = () => {

    reset();

    setEditingId(null);

    setValues(prev => ({
      ...prev,
      projectId: projectId || "",
    }));

    setShowModal(true);
  };

  const handleNavigate = (id: string) => {
    navigate(`/projects/${projectId}/${id}`);
  };

  const handleSave = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    const form =
      formRef.current;

    if (!form) return;

    form.classList.add(
      "was-validated"
    );

    if (!form.checkValidity())
    {
      const firstInvalid =
        form.querySelector<HTMLElement>(
          ":invalid"
        );

      if (firstInvalid)
      {
        firstInvalid.focus();
      }

      return;
    }

    try
    {
      setIsSaving(true);

      if (editingId)
      {
        await updatePrototype({
          id: editingId,
          ...values,
        });
      }
      else
      {
        await createPrototype(values);
      }

      await fetchPrototypes({
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

            <div className="d-flex flex-wrap gap-3 pb-3 align-items-center">

              <div
                className="grow"
                style={{
                  minWidth: 260
                }}
              >
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Pesquisar protótipo..."
                />
              </div>

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
                  Ativos
                </option>

                <option value="disabled">
                  Desativados
                </option>

              </select>

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
                          {p.vertical}
                        </td>

                        <td className="px-4 text-secondary">
                          {p.stage}
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

        // ===== MODAL =====
        modal={
          <CrudModal
            show={showModal}

            title={
              editingId
                ? "Editar protótipo"
                : "Novo protótipo"
            }

            onClose={() =>
              setShowModal(false)
            }

            edit={!!editingId}
          >

            <form
              ref={formRef}

              onSubmit={handleSave}

              noValidate

              className="d-flex flex-column gap-3"
            >

              <div className="d-flex gap-3">

                <div className="form-floating w-100">
                  <input 
                      name="code"
                      value={values.code}
                      placeholder="Código"
                      onChange={handleChange}
                      minLength={3}
                      maxLength={55}
                      className="form-control"
                  />

                  <label>Código</label>
                </div>

                <FormInput
                  label="Nome"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  required
                />

              </div>

              <FormTextarea
                label="Descrição"
                name="description"
                value={values.description}
                onChange={handleChange}
                required
              />

              <div className="d-flex gap-3">

                <FormInput
                  label="Fase"
                  name="stage"
                  value={values.stage}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Vertical"
                  name="vertical"
                  value={values.vertical}
                  onChange={handleChange}
                  required
                />

              </div>

              <FormInput
                label="Área (ha)"
                name="areaSize"
                type="number"
                value={String(values.areaSize || "")}
                onChange={handleChange}
              />

              <div className="d-flex justify-content-end mt-4">

                <button
                  type="submit"
                  className="btn-custom btn-custom-success px-4"
                  disabled={isSaving}
                >
                  {isSaving ? "Salvando..." : "Salvar"}
                </button>

              </div>

            </form>

          </CrudModal>
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