// ===== IMPORTS =====
import { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Trash3Fill } from "react-bootstrap-icons";
import { useProjects } from "../hooks/useProjects";
import { useForm } from "../hooks/useForm";
import { getCurrentUser } from "../services/auth.service";
import CrudPageLayout from "../components/Others/CrudPageLayout";
import CrudHeader from "../components/Others/CrudHeader";
import CrudList from "../components/Others/CrudList";
import CrudModal from "../components/Others/CrudModal";
import ProjectCard from "../components/02ProjectRelated/ProjectCard";
import FormInput from "../components/forms/FormInput";
import FormTextarea from "../components/forms/FormTextarea";
import SearchInput from "../components/forms/SearchInput";
import type { ProjectProps } from "../services/projects.service";

// ===== TYPES =====
interface ProjectForm {
  name: string;
  description: string;
  leader: string
}

export default function ProjectsPage() {

  // ===== USER =====
  const [userId, setUserId] = useState<string | null>(null);

  const [loadingUser, setLoadingUser] = useState(true);

  // ===== LOAD USER =====
  useEffect(() => {

    const loadUser = async () => {
      try
      {
        const user = await getCurrentUser();
        setUserId(user.id);
      }
      catch (err)
      {
        console.error("Erro ao buscar usuário:", err);
      }
      finally
      {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, []);

  // ===== HOOK =====
  const {
    projects,
    createProject,
    updateProject,
    deleteProject,
  } = useProjects({ userId: userId ?? undefined, skip: !userId, status: "active" });

  // ===== STATES =====
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  // ===== FORM =====
  const formRef = useRef<HTMLFormElement | null>(null);

  const {
    values,
    setValues,
    handleChange,
    reset
  } = useForm<ProjectForm>({ name: "", description: "", leader: "" });

  // ===== FILTERED PROJECTS =====
  const filteredProjects =
    projects.filter((p): p is ProjectProps => Boolean(p)).filter(p => {
      const query = search.toLowerCase();

      return ((p.name ?? "").toLowerCase().includes(query) || (p.description ?? "").toLowerCase().includes(query));
    });

  // ===== ACTIONS =====

  // NEW
  const handleNew = () => {
    reset();
    setEditing(false);
    setEditingProjectId(null);
    setShowModal(true);
  };

  // EDIT
  const handleEdit = (id: string) => {
    setEditing(true);

    const project = projects.find(p => p.id === id);

    if (!project) return;

    setEditingProjectId(id);
    setShowModal(true);
    setValues({
      name: project.name ?? "",
      description: project.description ?? "",
      leader: project.leader ?? "",
    });
  };

  // SAVE
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

      if (editingProjectId)
      {
        await updateProject({ id: editingProjectId, ...values });
      }
      else
      {
        await createProject(values);
      }

      setShowModal(false);
      reset();
      setEditing(false);
      setEditingProjectId(null);
    }
    finally
    {
      setIsSaving(false);
    }
  };

  // DELETE
  const handleDelete = (id: string) => { setProjectToDelete(id) };

  // CONFIRM DELETE
  const confirmDelete = async () => {
    if (!projectToDelete) return;

    await deleteProject(projectToDelete);

    setProjectToDelete(null);
  };

  // ===== LOADING USER =====
  if (loadingUser)
  {
    return (
      <div className="py-5 text-center">
        <p className="text-muted">
          Carregando projetos...
        </p>
      </div>
    );
  }

  // ===== NO USER =====
  if (!userId)
  {
    return (
      <div className="py-5 text-center">
        <p className="text-danger">
          Usuário não encontrado.
        </p>
      </div>
    );
  }

  // ===== JSX =====
  return (
    <>

      <CrudPageLayout

        // ===== HEADER =====
        header={
          <>
            <CrudHeader
              title="Projetos"
              subtitle="Gerencie seus projetos"
              onNew={handleNew}
            />

            <div className="pb-3">

              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Pesquisar projetos..."
              />

            </div>
          </>
        }

        // ===== LIST =====
        list={
          <CrudList>

            {filteredProjects.length === 0 ? (

              <div className="w-100 py-5 text-center border rounded bg-light">

                <p className="text-muted mb-0">

                  {search
                    ? "Nenhum projeto corresponde à sua busca."
                    : "Nenhum projeto encontrado."}

                </p>

              </div>

            ) : (

              filteredProjects.map(project => (

                <div
                  key={project.id}
                >

                  <ProjectCard
                    projectName={
                      project.name ?? ""
                    }

                    projectDescription={
                      project.description ?? ""
                    }

                    location={
                      `/projects/${project.id}`
                    }

                    onEdit={() =>
                      handleEdit(project.id)
                    }

                    onDelete={() =>
                      handleDelete(project.id)
                    }
                  />

                </div>

              ))

            )}

          </CrudList>
        }

        // ===== MODAL =====
        modal={
          <CrudModal
            show={showModal}

            title={
              editingProjectId
                ? "Editar Projeto"
                : "Novo Projeto"
            }

            onClose={() => {

              setShowModal(false);

              setEditing(false);

              setEditingProjectId(null);

            }}

            edit={editing}
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
                minLength={3}
              />

              <FormTextarea
                label="Descrição"
                name="description"
                value={values.description}
                onChange={handleChange}
                required
                minLength={3}
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
                  className="
                    btn-custom
                    btn-custom-success
                    px-4
                  "
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
        show={!!projectToDelete}

        onHide={() =>
          setProjectToDelete(null)
        }

        centered
      >

        <Modal.Body className="text-center p-5">

          <Trash3Fill
            size={50}
            className="text-danger mb-4"
          />

          <h4 className="fw-bold mb-3">
            Excluir Projeto?
          </h4>

          <p className="text-muted mb-5">
            Esta ação não pode ser desfeita.
          </p>

          <div className="d-flex gap-3 justify-content-center">

            <button
              className="
                btn-custom
                btn-custom-outline-secondary
                px-4
              "

              onClick={() =>
                setProjectToDelete(null)
              }
            >
              Cancelar
            </button>

            <button
              className="
                btn-custom
                btn-custom-outline-primary
                px-4
                shadow-sm
              "

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