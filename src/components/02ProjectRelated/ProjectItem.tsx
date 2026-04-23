// ===== GERAL IMPORTS =====
import { useNavigate, useParams } from "react-router"
import { ArrowLeftCircleFill } from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import { db } from '../../firebaseConfig/config'
import { doc, onSnapshot } from 'firebase/firestore'
import MainFrame from "../03PrototypeRelated/MainFrame";
import ProtoMultiForm from "../03PrototypeRelated/ProtoMultiForm";
import DividedByProgress from "./DividedByProgress";
import NewMemberModal from "./NewMemberModal";
import type { ProjectProps } from "../../services/projectServices";
import DisplayProjectMembers from "../07UsersRelated/DisplayProjectMembers";

export default function ProjectItem()
{
    const { projectid } = useParams();
    const navigate = useNavigate();
    const [ projectData, setProjectData ] = useState<ProjectProps | null>(null);
    const [ currentView, setCurrentView ] = useState<number>(0);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        if (!projectid) {
            setLoading(false);
            return;
        }

        const unsub = onSnapshot(doc(db, "projects", projectid), (docSnap) => {
            if (docSnap.exists()) {
                setProjectData({ id: docSnap.id, ...docSnap.data() } as ProjectProps);
            } else {
                setProjectData(null);
            }
            setLoading(false);
        }, (error) => {
            console.error("Erro ao carregar projeto:", error);
            setLoading(false);
        });

        return () => unsub();
    }, [projectid]);

    if (loading) {
        return <div className="p-5 text-center"><div className="spinner-border text-danger"></div></div>;
    }

    if (!projectid || !projectData) {
        return (
            <div className="p-5 text-center">
                <h3>Projeto não encontrado</h3>
                <button className="btn btn-danger mt-3" onClick={() => navigate('/projects')}>
                    Voltar para Projetos
                </button>
            </div>
        );
    }

    function renderView(current: number)
    {
        switch(current)
        {
            case 0:
                return <MainFrame projectId={projectid!}/>
            case 1:
                return <DividedByProgress projectId={projectid!}/>
            default:
                return <MainFrame projectId={projectid!}/>
        }
    }

    return(
        <>
            <div className="ps-5 pt-5 pb-0 pe-0">
                <button 
                    className="btn-custom btn-custom-link d-flex gap-3 align-items-center border-0 bg-transparent p-0" 
                    onClick={() => navigate(`/projects`)}
                >
                    <ArrowLeftCircleFill size={30} className="text-custom-black" />
                    <p className="text-custom-black fs-5 mb-0 fw-semibold">
                        voltar
                    </p>
                </button>
            </div>

            <div className='py-3 px-5'>
                {/* ----- Title div ----- */}

                <div className="header-responsive d-flex justify-content-between align-items-center mb-4">
                    <p className='mb-0 text-custom-black fs-1 fw-bold'>
                        {projectData.name || "Nome do projeto"}
                    </p>

                    <div className="actions d-flex gap-3">
                        <NewMemberModal projectId={projectid!} />
                        <DisplayProjectMembers projectId={projectid!} />
                    </div>
                </div>

                {/* ----- Navigation between inner project pages ----- */}

                <div className="d-flex flex-column align-items-start mb-4">
                    <div className="d-flex gap-2">
                        <button
                            className={`btn-custom px-4 py-2 border-0 rounded-0 border-bottom ${currentView === 0 ? 'border-danger text-danger fw-bold' : 'border-transparent text-muted'}`}
                            style={{ transition: 'all 0.3s' }}
                            onClick={() => setCurrentView(0)}
                        >
                            Quadro principal
                        </button>
                        <button
                            className={`btn-custom px-4 py-2 border-0 rounded-0 border-bottom ${currentView === 1 ? 'border-danger text-danger fw-bold' : 'border-transparent text-muted'}`}
                            style={{ transition: 'all 0.3s' }}
                            onClick={() => setCurrentView(1)}
                        >
                            Por progresso
                        </button>
                    </div>
                    <div className="w-100" style={{ borderBottom: "1px solid var(--gray02)", marginTop: "-1px" }}></div>
                    
                    <div className="mt-4 w-100">
                         <ProtoMultiForm projectId={projectid}/>
                    </div>
                </div>

                <div className="my-3">
                    {renderView(currentView)}
                </div>
            </div>
        </>
    )
}