import { useEffect, useMemo, useState } from "react";
import { listenPrototypesForProjectWProgress, type PrototypeProps } from "../../services/prototypeServices";
import { CaretDown, CaretUp, PencilSquare } from "react-bootstrap-icons";
import { useNavigate } from "react-router";
import type { ChecklistProps } from "../../services/checklistServices";

interface Props {
    projectId: string,
}

export default function DividedByProgress({ projectId }: Props) {
    const [prototypesList, setPrototypesList] = useState<PrototypeProps[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState<Record<number, boolean>>({ 1: false, 2: false, 3: false });
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

    // RESPONSIVO SEM LIB
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleItem = (id: number) => {
        setOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const statusConfig = [
        { id: 1, label: "Pendentes", color: "var(--red00)", key: "pendente" },
        { id: 2, label: "Em andamento", color: "var(--various03)", key: "em_andamento" },
        { id: 3, label: "Concluído", color: "var(--success01)", key: "concluido" },
    ] as const;

    useEffect(() => {
        if (!projectId) return;
        setLoading(true);

        const unsubscribe = listenPrototypesForProjectWProgress(projectId, (data) => {
            setPrototypesList(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [projectId]);

    const prototypesByStatus = useMemo(() => {
        if (!prototypesList) return null;

        const grouped: Record<ProgressStatus, PrototypeProps[]> = {
            pendente: [],
            em_andamento: [],
            concluido: []
        };

        prototypesList.forEach(p => {
            const progress = calculatePrototypeProgressWeighted(p.checklists);
            const status = getStatusByProgress(progress);
            grouped[status].push(p);
        });

        return grouped;
    }, [prototypesList]);

    if (loading) return <p>Carregando o projeto...</p>;
    if (!prototypesList || prototypesList.length === 0) return <p>Nenhum protótipo encontrado!</p>;

    return (
        <>
            {statusConfig.map(status => (
                <div key={status.id} className="d-flex flex-column gap-3">
                    
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

                        <p
                            className="mb-0 fw-semibold"
                            style={{ color: status.color, fontSize: isMobile ? 16 : 20 }}
                        >
                            {status.label} ({prototypesByStatus?.[status.key].length})
                        </p>
                    </div>

                    {/* LISTA */}
                    {open[status.id] && prototypesByStatus && (
                        <PrototypesTable
                            projectId={projectId}
                            prototypes={prototypesByStatus[status.key]}
                            isMobile={isMobile}
                        />
                    )}
                </div>
            ))}
        </>
    );
}

// ================= HELPERS =================

function calculatePrototypeProgressWeighted(checklists?: ChecklistProps[]): number {
    if (!checklists || checklists.length === 0) return 0;

    let totalItems = 0;
    let checkedItems = 0;

    checklists.forEach(c =>
        c.categories.forEach(cat => {
            totalItems += cat.items.length;
            checkedItems += cat.items.filter(i => i.checked).length;
        })
    );

    return totalItems === 0 ? 0 : Math.round((checkedItems / totalItems) * 100);
}

type ProgressStatus = "pendente" | "em_andamento" | "concluido";

function getStatusByProgress(progress: number): ProgressStatus {
    if (progress === 0) return "pendente";
    if (progress === 100) return "concluido";
    return "em_andamento";
}

// ================= TABLE / CARDS =================

interface PrototypesTableProps {
    projectId: string;
    prototypes: PrototypeProps[];
    isMobile: boolean;
}

function PrototypesTable({ projectId, prototypes, isMobile }: PrototypesTableProps) {
    const navigate = useNavigate();

    if (prototypes.length === 0) {
        return <p className="text-center">Nenhum protótipo nesta área!</p>;
    }

    // ================= MOBILE =================
    if (isMobile) {
        return (
            <div className="d-flex flex-column gap-3">
                {prototypes.map(p => (
                    <div
                        key={p.id}
                        className="card shadow-sm border-0 p-3"
                        onClick={() => navigate(`/projects/${projectId}/${p.id}`)}
                        style={{ cursor: "pointer", borderLeft: "4px solid var(--red01)" }}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong>{p.name}</strong>
                            <PencilSquare size={18} />
                        </div>

                        <small className="text-muted mb-2">{p.description}</small>

                        <div className="d-flex flex-wrap gap-2">
                            <span className="badge bg-light text-dark">{p.vertical}</span>
                            <span className="badge bg-light text-dark">{p.stage}</span>
                            <span className="badge bg-success">
                                {calculatePrototypeProgressWeighted(p.checklists)}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // ================= DESKTOP =================
    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th className="d-none d-md-table-cell">Descrição</th>
                        <th>Vertical</th>
                        <th>Etapa</th>
                        <th>Progresso</th>
                    </tr>
                </thead>

                <tbody>
                    {prototypes.map(p => (
                        <tr
                            key={p.id}
                            onClick={() => navigate(`/projects/${projectId}/${p.id}`)}
                            style={{ cursor: "pointer" }}
                        >
                            <td className="d-flex gap-2 align-items-center">
                                <button className="btn btn-sm btn-outline-success">
                                    <PencilSquare size={18} />
                                </button>
                                {p.name}
                            </td>

                            <td className="d-none d-md-table-cell">
                                {p.description}
                            </td>

                            <td>{p.vertical}</td>
                            <td>{p.stage}</td>
                            <td>{calculatePrototypeProgressWeighted(p.checklists)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}