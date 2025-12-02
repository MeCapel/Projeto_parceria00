import { useState, useEffect } from "react"
import { useNavigate } from "react-router";
import { PencilSquare } from "react-bootstrap-icons";
import { listenPrototypesForProject } from "../../services/prototypeServices2";

interface MainFrameProps {
    projectId?: string;
}

export default function MainFrame({ projectId } : MainFrameProps)
{
    const [ prototypesList, setPrototypesList ] = useState<any[] | null>(null);
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();

    const fields = [ "Nome", "Descrição", "Status", "Qual é o P?"];

    useEffect(() => {
        if (!projectId) return;

        setLoading(true);

        // Inicia o listener em tempo real
        const unsubscribe = listenPrototypesForProject(projectId, (data) => {
            setPrototypesList(data); // sempre atualiza ao mudar no Firestore
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
        <>
            {/* <h1>Prototypes from project {projectId}</h1> */}
            <table className="table table-bordered table-striped p-0 m-0 rounded-2 overflow-hidden">
                {renderTable(5, prototypesList.length)}
                <thead>
                    <tr>
                        {fields.map((field, i) => (
                            <th key={i} className="border py-2 px-4 text-custom-black text-center">{field}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {prototypesList.map((item, i) => (
                        <tr key={i} onClick={() => navigate(`/projects/${projectId}/${item.id}`)} style={{ cursor: "pointer"}}>
                            <td className="d-flex gap-3 align-items-center">
                                <button className="btn-custom btn-custom-outline-success">
                                    <PencilSquare size={25}/>
                                </button>
                                {item.name}
                            </td>
                            <td>{item.description}</td>
                            <td>{item.stage}</td>
                            <td>{item.vertical}</td>
                        </tr>
                    ))}
                </tbody>
                {/* {prototypesList.map((item) => (
                    <li key={item.id}>
                        <strong>{item.name}</strong> - {item.status}
                        <p>{item.description}</p>
                    </li>
                ))} */}
            </table>
        </>
    )
}

function renderTable(rows: number, cols: number)
{
    for (let i = 0; i < rows; i++)
    {
        for (let j = 0; j < cols; j++)
        {
            (<tr>
                <th>{j}</th>
            </tr>)
        }
    }

    return(
        <>
          
        </>
    )
}