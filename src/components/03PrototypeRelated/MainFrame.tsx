import { useState } from "react"
import { CrudTable } from "../Others/CrudTable";
import { usePrototype } from "../../hooks/usePrototypes";
import { Modal } from "react-bootstrap";
import { Trash3Fill } from "react-bootstrap-icons";
import { useNavigate } from "react-router";

interface MainFrameProps {
    projectId: string;
}

export default function MainFrame({ projectId } : MainFrameProps)
{
    const { prototypes, deletePrototype } = usePrototype(projectId);
    const [ prototypeToDelete, setPrototypeToDelete] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleNavigate = (id: string) => {
        navigate(`/projects/${projectId}/${id}`);
    };

    const handleDelete = (id: string) => {
        setPrototypeToDelete(id);
    };

    const confirmDelete = async () => {
        if (!prototypeToDelete) return;

        await deletePrototype(prototypeToDelete);
        setPrototypeToDelete(null);
    };

    if (!prototypes || prototypes.length === 0)
    {
        return <p>Nenhum protótipo encontrado!</p>;
    }

    return(
        <div className="">
            <CrudTable
                headers={["Nome", "Descrição", "Etapa", "Vertical"]}

                data={prototypes}

                getId={(p) => p.id!} 

                renderRow={(p) => (
                    <>
                        <td className="px-4 text-secondary">{p.name}</td>
                        <td className="px-4 text-secondary">{p.description}</td>
                        <td className="px-4 text-secondary">
                            <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-3">
                                {p.stage}
                            </span>
                        </td>
                        <td className="px-4 text-secondary">{p.vertical}</td>
                    </>
                )}

                onEdit={handleNavigate}
                onDelete={handleDelete}
            />

            <Modal
                show={!!prototypeToDelete} 
                onHide={() => setPrototypeToDelete(null)} 
                centered
            >
                <Modal.Body className="text-center p-5">
                    <Trash3Fill size={50} className="text-danger mb-4" />

                    <h4 className="fw-bold mb-3">Excluir protótipo?</h4>
                    <p className="text-muted mb-5">
                        Esta ação não pode ser desfeita.
                    </p>

                    <div className="d-flex gap-3 justify-content-center">
                        <button 
                            className="btn-custom btn-custom-outline-secondary px-4 rounded-3"
                            onClick={() => setPrototypeToDelete(null)}
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
        </div>
    )
}