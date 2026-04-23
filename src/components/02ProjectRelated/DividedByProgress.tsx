import { useMemo, useState } from "react";
import { CaretDown, CaretUp, Trash3Fill } from "react-bootstrap-icons";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router";
import { usePrototypeWithProgress } from "../../hooks/usePrototyteWProgress";
import { CrudTable } from "../Others/CrudTable";

interface Props {
    projectId: string;
}

export default function DividedByProgress({ projectId }: Props) {
    const { prototypes, loading } = usePrototypeWithProgress(projectId);
    const [open, setOpen] = useState<Record<number, boolean>>({
        1: false,
        2: false,
        3: false
    });

    const [prototypeToDelete, setPrototypeToDelete] = useState<string | null>(null);

    const navigate = useNavigate();

    const toggleItem = (id: number) => {
        setOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleNavigate = (id: string) => {
        navigate(`/projects/${projectId}/${id}`);
    };

    const handleDelete = (id: string) => {
        setPrototypeToDelete(id);
    };

    const confirmDelete = async () => {
        if (!prototypeToDelete) return;
        // chamar seu deletePrototype aqui
        setPrototypeToDelete(null);
    };

    const statusConfig = [
        { id: 1, label: "Pendentes", color: "var(--red00)", key: "pendente" },
        { id: 2, label: "Em andamento", color: "var(--various03)", key: "em_andamento" },
        { id: 3, label: "Concluído", color: "var(--success01)", key: "concluido" },
    ] as const;

    const grouped = useMemo(() => {
        const result = {
            pendente: [] as typeof prototypes,
            em_andamento: [] as typeof prototypes,
            concluido: [] as typeof prototypes
        };

        prototypes.forEach(p => {
            if (p.progress === 0) result.pendente.push(p);
            else if (p.progress === 100) result.concluido.push(p);
            else result.em_andamento.push(p);
        });

        return result;
    }, [prototypes]);

    if (loading) return <p>Carregando o projeto...</p>;
    if (!prototypes || prototypes.length === 0)
        return <p>Nenhum protótipo encontrado!</p>;

    return (
        <>
            {statusConfig.map(status => (
                <div key={status.id} className="d-flex flex-column gap-3 mb-4">

                    {/* HEADER */}
                    <div
                        className="d-flex gap-3 align-items-center"
                        onClick={() => toggleItem(status.id)}
                        style={{ cursor: "pointer" }}
                    >
                        {open[status.id] ? (
                            <CaretUp size={22} color={status.color} />
                        ) : (
                            <CaretDown size={22} color={status.color} />
                        )}

                        <p className="mb-0 fw-semibold" style={{ color: status.color }}>
                            {status.label} ({grouped[status.key].length})
                        </p>
                    </div>

                    {/* TABELA */}
                    {open[status.id] && (
                        grouped[status.key].length === 0 ? (
                            <p className="text-center text-muted">
                                Nenhum protótipo nesta categoria
                            </p>
                        ) : (
                            <CrudTable
                                headers={["Nome", "Descrição", "Etapa", "Vertical", "Progresso"]}
                                data={grouped[status.key]}
                                getId={(p) => p.id!}

                                renderRow={(p) => (
                                    <>
                                        <td className="px-4">{p.name}</td>
                                        <td className="px-4">
                                            {
                                                p.description.length > 35 ? p.description.substring(0, 35) + "..." : p.description 
                                            }
                                        </td>

                                        <td className="px-4">
                                            <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-3">
                                                {p.stage}
                                            </span>
                                        </td>

                                        <td className="px-4">{p.vertical}</td>

                                        <td className="px-4">
                                            <span className="badge bg-custom-gray00">
                                                {p.progress}%
                                            </span>
                                        </td>
                                    </>
                                )}

                                onEdit={handleNavigate}
                                onDelete={handleDelete}
                            />
                        )
                    )}
                </div>
            ))}

            {/* MODAL DELETE */}
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
                            className="btn-custom btn-custom-outline-secondary px-4"
                            onClick={() => setPrototypeToDelete(null)}
                        >
                            Cancelar
                        </button>

                        <button
                            className="btn-custom btn-custom-outline-primary px-4"
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