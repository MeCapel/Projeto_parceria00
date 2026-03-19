import { useState, useEffect } from "react"
import { useNavigate } from "react-router";
import { PencilSquare } from "react-bootstrap-icons";
import { listenPrototypesForProject, type PrototypeProps } from "../../services/prototypeServices";

interface MainFrameProps {
    projectId: string;
}

export default function MainFrame({ projectId } : MainFrameProps)
{
    const [ prototypesList, setPrototypesList ] = useState<PrototypeProps[] | null>(null);
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();

    const fields = [ "Nome", "Descrição", "Etapa", "Vertical"];

    useEffect(() => {
        if (!projectId) return;

        setLoading(true);

        // Inicia o listener em tempo real
        const unsubscribe = listenPrototypesForProject(projectId, (data) => {
            setPrototypesList(data);
            setLoading(false);
        });

        // Remove o listener quando mudar de projeto ou desmontar componente
        return () => {
            unsubscribe();
        };
    }, [projectId]);

    if (loading)
    {
        return <p>Carrengando o projeto...</p>
    }

    if (!prototypesList || prototypesList.length === 0)
    {
        return <p>Nenhum protótipo encontrado!</p>;
    }

    return(
        <div className="table-responsive rounded-3 border">
            <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                    <tr>
                        {fields.map((field, i) => (
                            <th key={i} className="py-3 px-4 text-custom-black fw-bold">{field}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {prototypesList.map((item, i) => (
                        <tr key={i} onClick={() => navigate(`/projects/${projectId}/${item.id}`)} style={{ cursor: "pointer"}}>
                            <td className="px-4">
                                <div className="d-flex gap-3 align-items-center">
                                    <div className="text-success d-flex align-items-center justify-content-center">
                                        <PencilSquare size={18}/>
                                    </div>
                                    <span className="fw-semibold">{item.name}</span>
                                </div>
                            </td>
                            <td className="px-4 text-secondary">{item.description}</td>
                            <td className="px-4">
                                <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill">
                                    {item.stage}
                                </span>
                            </td>
                            <td className="px-4">{item.vertical}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}