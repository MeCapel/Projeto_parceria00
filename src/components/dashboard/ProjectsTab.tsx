// ===== GERAL IMPORTS =====
import { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { ArrowLeftCircleFill, Trash3Fill } from "react-bootstrap-icons";
import { useProjects } from "../../hooks/useProjects";
import { useForm } from "../../hooks/useForm";
import CrudPageLayout from "../Others/CrudPageLayout";
import CrudHeader from "../Others/CrudHeader";
import SearchInput from "../forms/SearchInput";
import MultiCheckFilter from "../forms/MultiCheckFilter";
import CrudList from "../Others/CrudList";
import { CrudTable } from "../Others/CrudTable";
import CrudModal from "../Others/CrudModal";
import FormInput from "../forms/FormInput";
import { formatDateBR } from "../../utils/date";
import { useNavigate } from "react-router";

// ===== TYPES =====
interface ProjectForm {
  name: string;
  description: string;
  leader: string
}

export default function ProjectsTab() {
  const navigate = useNavigate();

  // ===== HOOK =====
  const {
    projects,
    loading,
    hasMore,
    fetchProjects,
    loadMore,
    createProject,
    updateProject,
    changeProjectStatus,
    deleteProject,
  } = useProjects();

  // ===== STATUS LABEL MAP =====
  const statusLabel: Record<string, string> = {
    active: "Ativo",
    disabled: "Desativado",
  };

  // ===== STATES =====
  const [search, setSearch] = useState("");

  const [statusFilters, setStatusFilters] = useState<string[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // ===== FORM =====
  const formRef = useRef<HTMLFormElement | null>(null);

  const {
    values,
    setValues,
    handleChange,
    reset,
  } = useForm<ProjectForm>({
    name: "",
    description: "",
    leader: ""
  });

  // ===== API FILTERS =====
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

    fetchProjects({
      reset: true,
      limit: 10,
      filters: apiFilters,
    });

  }, [apiFilters]);

  // ===== SEARCH FILTER =====
  const filtered = useMemo(() => {

    return projects.filter((p) => {

      const q =
        search.toLowerCase();

      return (
        p.name
          .toLowerCase()
          .includes(q)

        ||

        p.description
          ?.toLowerCase()
          .includes(q)
      );

    });

  }, [projects, search]);

  // ===== ACTIONS =====

  const handleNew = () => {
    reset();
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (id: string) => {

    const project = projects.find((p) => p.id === id);

    if (!project) return;

    setEditingId(id);
    setShowModal(true);
    setValues({
      name: project.name,
      description: project.description || "",
      leader: project.leader
    });

  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = formRef.current;

    if (!form) return;

    form.classList.add("was-validated");

    if (!form.checkValidity())
    {
      const firstInvalid = form.querySelector<HTMLElement>(":invalid");

      if (firstInvalid) firstInvalid.focus();

      return;
    }

    try
    {
      setIsSaving(true);

      // ===== UPDATE =====
      if (editingId)
      {
        await updateProject({ id: editingId, ...values });
      }

      // ===== CREATE =====
      else
      {
        await createProject(values);
      }

      await fetchProjects({
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

  const handleDelete = (id: string) => { setToDelete(id) };

  const confirmDelete = async () => {

    if (!toDelete) return;

    await deleteProject(toDelete);

    await fetchProjects({
      reset: true,
      limit: 10,
      filters: apiFilters,
    });

    setToDelete(null);
  };

  const handleStatusChange = async (id: string, currentStatus: "active" | "disabled") => {
    const newStatus = currentStatus === "active"
        ? "disabled"
        : "active";

    await changeProjectStatus(id, newStatus);

    await fetchProjects({
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

        // ===== HEADER =====
        header={
          <>
            <CrudHeader
              title="Projetos"
              subtitle="Gerencie seus projetos"
              onNew={handleNew}
            />

            {/* ===== FILTERS ===== */}
            <div className="d-flex flex-wrap gap-3 pb-3">

              <div className="flex-grow-1">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Pesquisar projeto..."
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
                    Nenhum projeto encontrado.
                  </p>

                </div>

              ) : (

                <div className="w-100">

                  <CrudTable

                    headers={[
                      "Nome",
                      "Descrição",
                      "Membros",
                      "Protótipos",
                      "Criado em",
                      "Status",
                    ]}

                    data={filtered}

                    getId={(p) => p.id}

                    renderRow={(p) => (
                      <>

                        {/* NAME */}
                        <td className="px-4 text-secondary">
                          {p.name}
                        </td>

                        {/* DESCRIPTION */}
                        <td className="px-4 text-secondary">
                          {p.description || "-"}
                        </td>

                        {/* MEMBERS */}
                        <td className="px-4 text-secondary">
                          {p.membersCount}
                        </td>

                        {/* PROTOTYPES */}
                        <td className="px-4 text-secondary">
                          {p.prototypesCount}
                        </td>

                        {/* CREATED */}
                        <td className="px-4 text-secondary">
                          {formatDateBR(
                            p.createdAt
                          )}
                        </td>

                        {/* STATUS */}
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

                      </>
                    )}

                    onEdit={handleEdit}

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
                ? "Editar projeto"
                : "Novo projeto"
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

              <FormInput
                label="Nome"
                name="name"
                value={values.name}
                onChange={handleChange}
                required
              />

              <FormInput
                label="Descrição"
                name="description"
                value={values.description}
                onChange={handleChange}
              />

              <FormInput
                label="Líder"
                name="leader"
                value={values.leader}
                onChange={handleChange}
                required
                minLength={3}
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
            Excluir projeto?
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