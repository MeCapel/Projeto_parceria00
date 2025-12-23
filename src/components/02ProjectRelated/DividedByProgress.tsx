import { useEffect, useMemo, useState } from "react";
import { listenPrototypesForProjectWProgress, type PrototypeProps } from "../../services/prototypeServices";
import { CaretDown, CaretUp, PencilSquare } from "react-bootstrap-icons";
import { useNavigate } from "react-router";
import type { Checklist } from "../../services/checklistServices2";

interface Props {
    projectId: string,
}

export default function DividedByProgress({ projectId }: Props) {
    const [prototypesList, setPrototypesList] = useState<PrototypeProps[] | null>(null);
    const [loading, setLoading] = useState(true);

    const [open, setOpen] = useState<Record<number, boolean>>({
        1: false,
        2: false,
        3: false,
    });

    const toggleItem = (id: number) => {
        setOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const fields = ["Nome", "Descrição", "Vertical", "Etapa", "Progresso"];

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
            concluido: [],
        };

        prototypesList.forEach(prototype => {
            const progress = calculatePrototypeProgressWeighted(prototype.checklists);
            const status = getStatusByProgress(progress);
            grouped[status].push(prototype);
        });

        return grouped;
    }, [prototypesList]);

    if (loading) return <p>Carregando o projeto...</p>;

    if (!prototypesList || prototypesList.length === 0) {
        return <p>Nenhum protótipo encontrado!</p>;
    }

    return (
        <>
            {statusConfig.map(status => (
                <div className="d-flex flex-column gap-3" key={status.id}>
                    <div
                        className="d-flex gap-3 align-items-center"
                        onClick={() => toggleItem(status.id)}
                        style={{ cursor: "pointer" }}
                    >
                        {open[status.id] ? (
                            <CaretUp size={25} color={status.color} />
                        ) : (
                            <CaretDown size={25} color={status.color} />
                        )}

                        <p
                            className="mb-0 fs-5 fw-semimbold"
                            style={{ color: status.color }}
                        >
                            {status.label} ({prototypesByStatus?.[status.key].length})
                        </p>
                    </div>

                    {open[status.id] && prototypesByStatus && (
                        <div className="mb-4">
                            <PrototypesTable
                                projectId={projectId}
                                fields={fields}
                                prototypes={prototypesByStatus[status.key]}
                            />
                        </div>
                    )}
                </div>
            ))}
        </>
    );
}

function calculatePrototypeProgressWeighted(
    checklists?: Checklist[]
): number {
    if (!checklists || checklists.length === 0) return 0;

    let totalItems = 0;
    let checkedItems = 0;

    checklists.forEach(checklist => {
        checklist.categories.forEach(category => {
            totalItems += category.items.length;
            checkedItems += category.items.filter(item => item.checked).length;
        });
    });

    if (totalItems === 0) return 0;

    return Math.round((checkedItems / totalItems) * 100);
}

type ProgressStatus = "pendente" | "em_andamento" | "concluido";

function getStatusByProgress(progress: number): ProgressStatus {
    if (progress === 0) return "pendente";
    if (progress === 100) return "concluido";
    return "em_andamento";
}

interface PrototypesTableProps {
    projectId: string,
    fields: string[];
    prototypes: PrototypeProps[];
}

function PrototypesTable({ projectId, fields, prototypes }: PrototypesTableProps) {
    const navigate = useNavigate();

    return (
    <>
        {prototypes.length === 0 ? 
            (
                <p className="text-center">Nenhum protótipo nesta área!</p>
            ) : 
            (
                <table className="table table-bordered table-striped p-0 m-0 rounded-2 overflow-hidden">
                    <thead>
                        <tr>
                            {fields.map((field, index) => (
                                <th
                                    key={index}
                                    className="border py-2 px-4 text-custom-black text-center"
                                >
                                    {field}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>

                        {prototypes.map((prototype, i) => (
                            <tr key={i} onClick={() => navigate(`/projects/${projectId}/${prototype.id}`)} style={{ cursor: "pointer"}}>
                                <td className="d-flex gap-3 align-items-center">
                                    <button className="btn-custom btn-custom-outline-success">
                                        <PencilSquare size={25}/>
                                    </button>
                                    {prototype.name}
                                </td>
                                <td>{prototype.description}</td>
                                <td>{prototype.stage}</td>
                                <td>{prototype.vertical}</td>
                                <td className="border py-2 px-4 text-center">
                                    {calculatePrototypeProgressWeighted(prototype.checklists)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )
        }
    </>
    );
}