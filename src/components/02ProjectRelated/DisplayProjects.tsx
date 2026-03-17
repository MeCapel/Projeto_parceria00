// ===== GERAL IMPORTS =====
import { Link, useNavigate } from 'react-router'
import ProjectCard from './ProjectCard'
import { useState, useEffect, useContext } from 'react'
import MembersCircles from './MembersCircles'
import NewProjectModal from './NewProjectModal'
import { AuthContext } from '../../context/AuthContext'
import { getUserProjects, type ProjectProps } from '../../services/projectServices'
import { getUsers, type UserDocument } from '../../services/authServices'

// ===== PROPS =====
interface Props {
    displayAll: boolean;
}

export default function DisplayProjects({ displayAll } : Props)
{
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [ projects, setProjects ] = useState<ProjectProps[]>([]);
    const [ allUsers, setAllUsers ] = useState<UserDocument[]>([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        if (!user) return;

        // 1. Carrega todos os usuários para pegar as fotos
        const unsubUsers = getUsers((users: UserDocument[]) => {
            setAllUsers(users);
        });

        // 2. Carrega os projetos
        const unsubProjects = getUserProjects(user.uid, (projectsList) => {
            setProjects(projectsList || []);
            setLoading(false);
        });

        return () => {
            unsubUsers();
            unsubProjects();
        };
    }, [user]);

    if (loading && user) {
        return <div className="p-5 text-center"><div className="spinner-border text-danger"></div></div>;
    }

    return(
        <div className='p-5 mx-3'>
            <div className="d-flex row align-items-center mb-4">
                <div className="col-10">
                    <p className='mb-0 text-custom-red fs-5' style={{ cursor: "pointer" }} onClick={() => navigate(`/projects`)}>
                        Projetos
                    </p>
                    <h1 className='mb-0 text-custom-black fw-bold'>
                        {displayAll ? "Todos os projetos" : "Visitados recentemente"}
                    </h1>
                </div>
                <div className="col-2 d-flex justify-content-end gap-3">
                    <NewProjectModal />
                    {!displayAll && (
                        <Link to={"/projects"} className='btn-custom btn-custom-outline-black text-decoration-none'>
                            <p className='mb-0 p-1'>Ver todos</p>
                        </Link>
                    )}
                </div>
            </div>

            <div className="d-flex gap-4 flex-wrap">
                {projects.length === 0 ? (
                    <div className="w-100 py-5 text-center border rounded bg-light">
                        <p className="text-muted mb-0">Nenhum projeto encontrado.</p>
                    </div>
                ) : (
                    (displayAll ? projects : projects.slice(0, 5)).map((project: ProjectProps) => {
                        
                        // Lista de IDs de membros (ou apenas o dono se members não existir)
                        const rawMembers = project.members || (project.owner ? [project.owner] : [user?.uid]);

                        // Mapeia para objetos detalhados com FOTOS
                        const projectMembers = rawMembers.map((memberId: string | undefined) => {
                            // Busca o usuário na lista global carregada, forçando comparação de string
                            const foundUser = allUsers.find(u => String(u.id) === String(memberId));
                            
                            return {
                                id: memberId || "",
                                name: foundUser?.username || "Colaborador",
                                img: foundUser?.profileImage || undefined // Aqui está a foto em Base64
                            };
                        });

                        return (
                            <div key={project.id}>
                                <ProjectCard
                                    id={project.id!}
                                    projectName={project.name}
                                    location={`/projects/${project.id}`}
                                    projectDescription={project.description}
                                    element={<MembersCircles membersList={projectMembers} />}
                                />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    )
}