import { useParams } from "react-router"
import { useEffect, useState } from "react";
import { CaretUp } from "react-bootstrap-icons";
import { CaretDown } from "react-bootstrap-icons";

import Layuot from "./Layout";
import ProtoMultiForm from './ProtoMultiForm'
import { db } from '../firebaseConfig/config'
// import { getProjectData } from "../services/dbService"
import { doc, onSnapshot } from 'firebase/firestore'

export default function ProjectItem()
{
    const { projectid } = useParams();
    const [ projectData, setProjectData ] = useState<any>(null);

    const [ open, setOpen ] = useState<{ [key: number]: boolean }>({
        1: false,
        2: false,
        3: false
    })

    const toggleItem = (id: number) => {
        setOpen((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // console.log("This one is the id: ", projectid);

    useEffect(() => {
        if (!projectid) return;

        // const fetchData = async () => {
        //     const data = await getProjectData(projectid);
        //     setProjectData(data);
        // }

        // fetchData();

        const unsub = onSnapshot(doc(db, "projects", projectid), (docSnap) => {

            if (docSnap.exists())
            {
                setProjectData({ id: docSnap.id, ...docSnap.data() });
            }
            else
            {
                setProjectData(null);
            }
        });

        return () => unsub();
        
    }, [projectid]);

    if (!projectData)
    {
        return <p>Carregando o projeto...</p>;
    }

    const fields = ["Nome", "Qual P", "Prazo", "Status", "Progresso"];

    const status = [
        { id: 1, label: "Pendentes", color: "var(--red00)", rows: 5 },
        { id: 2, label: "Em andamento", color: "var(--various03)", rows: 0 },
        { id: 3, label: "Concluído", color: "var(--success01)", rows: 0 }
    ]

    return(
        <Layuot>
            {/* <h1>Projeto n°: {projectid}</h1>
            <h2>Nome do projeto: {projectData.projectName}</h2>
            <h2>Descrição do projeto: {projectData.description}</h2> */}

            <div className='p-5 mx-3'>
                {/* ----- Title div ----- */}

                <div className="d-flex flex-column mb-3">
                    <p className='mb-0 text-custom-red fs-5'>Projetos/</p>
                    <p className='mb-0 text-custom-black fs-1 fw-bold'>
                        {projectData.projectName != null ? projectData.projectName : "Nome do projeto"}
                    </p>
                </div>

                {/* ----- Navigation between inner project pages ----- */}

                <div className="d-flex flex-column align-items-start">
                    <div style={{ borderBottom: "2px solid var(--red00)", position: 'relative', bottom: "-2px" }}>
                        <p className='mb-0 fs-5 text-custom-black'>Quadro principal</p>
                    </div>
                    <div className="w-100" style={{ border: "1px solid var(--gray02)" }}></div>
                    <div className="d-flex align-items-start my-2">
                    </div>
                        <ProtoMultiForm />
                </div>
                    
                <div className="my-3">
                    {status.map((item) => (
                        <div className="d-flex flex-column gap-3 " key={item.id}>
                            {open[item.id] ? 
                                (
                                    <div className="d-flex gap-3 align-items-center" onClick={() => toggleItem(item.id)} style={{ cursor: 'pointer'}} >
                                        <CaretUp size={25} color={item.color} />
                                        <p className="mb-0 fs-5 fw-semimbold" style={{ color: `${item.color}`}}>{item.label}</p>
                                    </div>
                                ) : 
                                (
                                    <div className="d-flex gap-3 align-items-center" onClick={() => toggleItem(item.id)} style={{ cursor: 'pointer'}} >
                                        <CaretDown size={25} color={item.color} />
                                        <p className="mb-0 fs-5 fw-semimbold" style={{ color: `${item.color}`}}>{item.label}</p>
                                    </div>
                                )
                            }
                            {open[item.id] && (
                                <div className="mb-4">
                                    {/* {renderTable( status,item.rows, item.fields.length)} */}
                                    <div key={item.id}>
                                        {renderTable(fields, item.rows)}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </Layuot>
    )
}

function renderTable(fields: string[] , rows: number)
{
    const tableHeadings = fields.map((field, index) => (
        <th className="border py-2 px-4 text-custom-black text-center" key={index}>{field}</th>
    ));

    const tableRows = [];

    for (let i = 0; i < rows; i++) {
        const cells = fields.map((_, j) => (
        <td className="border py-2 px-4" key={j}>
            Row {i + 1}, Col {j + 1}
        </td>
    ));
        tableRows.push(<tr key={i}>{cells}</tr>);
    }

    return( 
        <table className="table table-bordered table-striped p-0 m-0 rounded-2 overflow-hidden" >
            <thead>
                <tr>
                    {tableHeadings}
                </tr>
            </thead>
            <tbody style={{ border: '1px solid var(--gray00)', borderRadius: "10px" }} >{tableRows}</tbody>
        </table>
    )
}