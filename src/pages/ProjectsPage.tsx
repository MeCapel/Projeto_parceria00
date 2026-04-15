import { useRef, useState } from "react";
import { useProjects } from "../hooks/useProjects";
import { useForm } from "../hooks/useForm";
import CrudPageLayout from "../components/Others/CrudPageLayout";
import CrudHeader from "../components/Others/CrudHeader";
import CrudList from "../components/Others/CrudList";
import ProjectCard from "../components/02ProjectRelated/ProjectCard";
import CrudModal from "../components/Others/CrudModal";
import FormInput from "../components/forms/FormInput";
import FormTextarea from "../components/forms/FormTextarea";
import { Modal } from "react-bootstrap";
import { Trash3Fill } from "react-bootstrap-icons";

interface ProjectForm {
    name: string;
    description: string;
}

export default function ProjectsPage() {
    const { userProjects, createProject, updateProject, deleteProject } = useProjects();

    const [showModal, setShowModal] = useState(false);
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

    const formRef = useRef<HTMLFormElement | null>(null);
    const { values, setValues, handleChange, reset } = useForm<ProjectForm>({
        name: "",
        description: "",
    });
    const [ editing, setEditing ] = useState<boolean>(false);

    const handleNew = () => {
        reset();
        setEditingProjectId(null);
        setShowModal(true);
    };

    const handleEdit = (id: string) => {
        setEditing(true);
        const project = userProjects.find(p => p.id === id);
        if (!project) return;

        setEditingProjectId(id);
        setShowModal(true);

        setValues({
            name: project.name,
            description: project.description,
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = formRef.current;
        if (!form) return;

        form.classList.add("was-validated");

        if(!form.checkValidity())
        {
            const firstInvalid = form.querySelector<HTMLElement>(":invalid");
            if(firstInvalid) firstInvalid.focus();
            return;
        }

        if (editingProjectId) {
            await updateProject({
                id: editingProjectId,
                ...values
            });
        } else {
            await createProject(values);
        }

        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        setProjectToDelete(id);
    };

    const confirmDelete = async () => {
        if (!projectToDelete) return;

        await deleteProject(projectToDelete);
        setProjectToDelete(null);
    };

    return (
        <>
            <CrudPageLayout
                header={
                    <CrudHeader
                        title="Projetos"
                        subtitle="Gerencie seus projetos"
                        onNew={handleNew}
                    />
                }

                list={
                    <CrudList>
                        {userProjects.length === 0 ? (
                            <div className="w-100 py-5 text-center border rounded bg-light">
                                <p className="text-muted mb-0">
                                    Nenhum projeto encontrado.
                                </p>
                            </div>
                        ) : (
                            userProjects.map(p => (
                                <div className="" key={p.id}>

                                <ProjectCard
                                    projectName={p.name}
                                    projectDescription={p.description}
                                    location={`/projects/${p.id}`}
                                    element={null} // pode colocar MembersCircles depois
                                    onEdit={() => handleEdit(p.id)}
                                    onDelete={() => handleDelete(p.id)}
                                />
                                </div>
                            ))
                        )}
                    </CrudList>
                }

                modal={
                    <CrudModal
                        show={showModal}
                        title={editingProjectId ? "Editar Projeto" : "Novo Projeto"}
                        onClose={() => setShowModal(false)}
                        edit={editing}
                    >
                        <form ref={formRef} onSubmit={handleSave} noValidate className="d-flex flex-column gap-3">
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

                            <div className="d-flex justify-content-end mt-4">
                                <button 
                                    type="submit"
                                    className='btn-custom btn-custom-success px-4'
                                >
                                    Salvar
                                </button>
                            </div>

                        </form>
                    </CrudModal>
                }
            />

            <Modal 
                show={!!projectToDelete} 
                onHide={() => setProjectToDelete(null)} 
                centered
            >
                <Modal.Body className="text-center p-5">
                    <Trash3Fill size={50} className="text-danger mb-4" />

                    <h4 className="fw-bold mb-3">Excluir Projeto?</h4>
                    <p className="text-muted mb-5">
                        Esta ação não pode ser desfeita.
                    </p>

                    <div className="d-flex gap-2 justify-content-center">
                        <button 
                            className="btn-custom btn-custom-outline-secondary px-4 rounded-pill"
                            onClick={() => setProjectToDelete(null)}
                        >
                            Cancelar
                        </button>

                        <button 
                            className="btn-custom btn-custom-primary px-4 rounded-pill shadow-sm"
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