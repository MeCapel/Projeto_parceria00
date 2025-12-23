// ===== GERAL IMPORTS =====
import { useNavigate, useParams } from "react-router"
import { ArrowLeftCircleFill } from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import Layuot from "../00Geral/Layout";
import { db } from '../../firebaseConfig/config'
import { doc, onSnapshot } from 'firebase/firestore'
import MainFrame2 from "../03PrototypeRelated/MainFrame2";
import ProtoMultiForm2 from "../03PrototypeRelated/ProtoMultiForm2";
import { type PrototypeProps } from "../../services/prototypeServices";
import DividedByProgress from "./DividedByProgress";

export default function ProjectItem()
{
    const { projectid } = useParams();
    const navigate = useNavigate();
    const [ projectData, setProjectData ] = useState<PrototypeProps | null>(null);
    const [ currentView, setCurrentView ] = useState<number>(0);

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

    function renderView(current: number)
    {
        switch(current)
        {
            case 0:
                return <MainFrame2 projectId={projectid!}/>
            case 1:
                return <DividedByProgress projectId={projectid!}/>
        }
    }

    return(
        <Layuot>
            <div className="ps-5 pt-5 pb-0 pe-0" onClick={() => navigate(`/projects`)}>
                <div className="text-link-custom d-flex gap-3 align-items-center" style={{ cursor: "pointer" }}>
                    <ArrowLeftCircleFill size={30} />
                    <p className="text-custom-black fs-5 mb-0">
                        voltar
                    </p>
                    {/* <p className='mb-0 text-custom-red fs-5' style={{ cursor: "pointer"}} onClick={() => navigate("/projects")}>Projetos/</p> */}
                </div>
            </div>

            <div className='py-3 px-5'>
                {/* ----- Title div ----- */}

                <div className="d-flex flex-column mb-3">
                    <p className='mb-0 text-custom-black fs-1 fw-bold'>
                        {projectData.name != null ? projectData.name : "Nome do projeto"}
                    </p>
                </div>

                {/* ----- Navigation between inner project pages ----- */}

                <div className="d-flex flex-column align-items-start">
                    <div className="d-flex">
                        <div 
                            className={currentView == 0 ? `d-flex justify-content-center border-bottom border-danger` : `d-flex justify-content-center`}
                            style={{ width: "200px", position: 'relative', bottom: "-2px", cursor: "pointer" }}
                        >
                            <p className='px-3 mb-1 fs-5 text-custom-black' onClick={() => setCurrentView(0)}>Quadro principal</p>
                        </div>
                        <div 
                            className={currentView == 1 ? `d-flex justify-content-center border-bottom border-danger` : `d-flex justify-content-center`}
                            style={{ width: "200px", position: 'relative', bottom: "-2px", cursor: "pointer" }}
                        >
                            <p className='px-3 mb-1 fs-5 text-custom-black' onClick={() => setCurrentView(1)}>Por progresso</p>
                        </div>
                        </div>
                    <div className="w-100" style={{ border: "1px solid var(--gray02)" }}></div>
                    <div className="d-flex align-items-start my-2">
                    </div>
                        {/* <ProtoMultiForm projectId={projectid}/> */}
                        <ProtoMultiForm2 projectId={projectid}/>
                </div>
                    
                <div className="my-3">
                    {renderView(currentView)}
                </div>
            </div>
        </Layuot>
    )
}