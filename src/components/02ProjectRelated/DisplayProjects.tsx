// ===== GERAL IMPORTS =====

import { Link, useNavigate } from 'react-router'
import ProjectCard from './ProjectCard'
import { useState, useEffect } from 'react'
import MembersCircles from './MembersCircles'
import NewProjectModal from './NewProjectModal'
import { getCurrentUser } from '../../services/authService'
import { getUserProjects } from '../../services/projectServices'
import type { PrototypeProps } from '../../services/prototypeServices'

// ===== PROPS =====

interface Props {
    displayAll: boolean;
}

export default function DisplayProjects({ displayAll } : Props)
{
    const navigate = useNavigate();
    const [ projects, setProjects ] = useState<PrototypeProps[]>([]);

    useEffect(() => {
        const userData = getCurrentUser();
        if (!userData) return;
        
        const unsubscribe = getUserProjects(userData.uid, (projects) => {
            setProjects(projects ?? []);
        });

        return () => unsubscribe()
    }, []);

    const membersList = [{ id: 1, img: '/vite.svg', name: "Maria"},
                          { id: 2, img: '/vite.svg', name: "Pedro"},
                          { id: 3, img: '/vite.svg', name: "Irene"},
                          { id: 4, img: '/vite.svg', name: "Dejair"},
                          { id: 5, img: '/vite.svg', name: "Nicolas"},
                          { id: 6, img: '/vite.svg', name: "Elen"}]


    return(
        <div className='p-5 mx-3'>
            <div className="d-flex row">
                {displayAll ? (
                    <>
                        <div className="d-flex flex-column col-12 col-md-10">
                            <p 
                                style={{ cursor: "pointer" }}
                                className='mb-0 text-custom-red fs-5'
                                onClick={() => navigate(`/projects`)}
                            >
                                Projetos
                            </p>
                            <p className='mb-0 text-custom-black fs-1 fw-bold'>Todos os projetos</p>
                        </div>
                        <div className="d-flex align-items-start justify-content-end col-12 col-md-2 my-3 my-md-0">
                            <NewProjectModal />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="d-flex flex-column col-10">
                            <p 
                                style={{ cursor: "pointer" }}
                                className='mb-0 text-custom-red fs-5'
                                onClick={() => navigate(`/projects`)}
                            >
                                Projetos
                            </p>
                            <p className='mb-0 text-custom-black fs-1 fw-bold'>Visitados recentemente</p>
                        </div>
                        <div className="d-flex align-items-start justify-content-end col-2">
                            <Link to={"/projects"} >
                                <p className='mb-0 fs-5 text-custom-black'><u>Ver todos</u></p>
                            </Link>
                        </div>
                    </>
                )}
                
            </div>
            <div className="d-flex gap-4 my-4 flex-wrap">
                {displayAll ? 
                    (
                        <>
                            {projects!.map((project: PrototypeProps) => (
                                <div key={project.id}>
                                    <ProjectCard 
                                        id={project.id!} 
                                        projectName={project.name} 
                                        location={`/projects/${project.id}`}
                                        projectDescription={project.description} 
                                        element={<MembersCircles membersList={membersList} />} 
                                    />
                                </div>
                            ))}
                        </>
                    ) : 
                    (
                        <>
                            {projects!.slice(0, 5).map((project: PrototypeProps) => (
                                <div key={project.id}>
                                    <ProjectCard 
                                        id={project.id!} 
                                        projectName={project.name} 
                                        location={`/projects/${project.id}`}
                                        projectDescription={project.description} 
                                        element={<MembersCircles membersList={membersList} />} 
                                    />
                                </div>
                            ))}
                        </>
                    )
                }
            </div>
        </div>
    )
}