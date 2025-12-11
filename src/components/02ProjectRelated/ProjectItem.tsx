// ===== GERAL IMPORTS =====
import { useNavigate, useParams } from "react-router"
import { CaretUp, CaretDown, ArrowLeftCircleFill } from "react-bootstrap-icons";
import React, { useEffect, useState } from "react";
import Layuot from "../00Geral/Layout";
import { db } from '../../firebaseConfig/config'
import { doc, onSnapshot } from 'firebase/firestore'
import MainFrame2 from "../03PrototypeRelated/MainFrame2";
import ProtoMultiForm2 from "../03PrototypeRelated/ProtoMultiForm2";
import type { PrototypeProps } from "../../services/prototypeServices2";

export default function ProjectItem()
{
    const { projectid } = useParams();
    const navigate = useNavigate();
    const [ projectData, setProjectData ] = useState<PrototypeProps | null>(null);
    const [ render, setRender ] = useState<React.ReactNode>(<MainFrame2 projectId={projectid} />);

    // console.log("This one is the id: ", projectid);
 
    useEffect(() => {
        if (!projectid) return;

        const unsub = onSnapshot(doc(db, "projects", projectid), (docSnap) => {

            if (docSnap.exists())
            {
                setProjectData({ id: docSnap.id, ...docSnap.data() } as PrototypeProps);
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

    if (!projectid)
    {
        window.alert("Id do projeto invalido!")
        return;
    } 

    function handleMainFrame()
    {
        setRender(<MainFrame2 projectId={projectid} />);
    } 

    function handleProgressFrame()
    {
        setRender(<DividedByProgress />);
    }

    return(
        <Layuot>
            <div className="ps-5 pt-5 pb-0 pe-0" onClick={() => navigate(`/projects`)}>
                <div className="text-link-custom d-flex gap-3 align-items-center" style={{ cursor: "pointer" }}>
                    <ArrowLeftCircleFill size={30} />
                    <p className="text-custom-black fs-5 mb-0">
                        voltar
                    </p>
                </div>
            </div>

            <div className='py-3 px-5'>
                {/* ----- Title div ----- */}

                <div className="d-flex flex-column mb-3">
                    <p className='mb-0 text-custom-red fs-5'>Projetos/</p>
                    <p className='mb-0 text-custom-black fs-1 fw-bold'>
                        {projectData.name != null ? projectData.name : "Nome do projeto"}
                    </p>
                </div>

                {/* ----- Navigation between inner project pages ----- */}

                <div className="d-flex flex-column align-items-start">
                    <div className="d-flex">
                        <div className="d-flex justify-content-center" style={{ width: "200px", borderBottom: "2px solid var(--red00)", position: 'relative', bottom: "-2px", cursor: "pointer" }}>
                            <p className='px-3 mb-0 fs-5 text-custom-black' onClick={handleMainFrame}>Quadro principal</p>
                        </div>
                        <div className="d-flex justify-content-center" style={{ width: "200px", position: 'relative', bottom: "-2px", cursor: "pointer" }}>
                            <p className='px-3 mb-0 fs-5 text-custom-black' onClick={handleProgressFrame}>Por progresso</p>
                        </div>
                        </div>
                    <div className="w-100" style={{ border: "1px solid var(--gray02)" }}></div>
                    <div className="d-flex align-items-start my-2">
                    </div>
                        {/* <ProtoMultiForm projectId={projectid}/> */}
                        <ProtoMultiForm2 projectId={projectid}/>
                </div>
                    
                <div className="my-3">
                    {render}
                </div>
            </div>
        </Layuot>
    )
}

function DividedByProgress()
{
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

    const fields = ["Nome", "Qual P", "Prazo", "Status", "Progresso"];

    const status = [
        { id: 1, label: "Pendentes", color: "var(--red00)", rows: 5 },
        { id: 2, label: "Em andamento", color: "var(--various03)", rows: 0 },
        { id: 3, label: "Concluído", color: "var(--success01)", rows: 0 }
    ]

    return(
        <>
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
        </>
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