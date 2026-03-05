// ===== GERAL IMPORTS =====
import type React from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from 'react-router'
import { Archive, ThreeDotsVertical, Trash3Fill, PencilSquare } from "react-bootstrap-icons";
import { useState, useRef, useEffect } from "react";
import { deleteProjectNPrototypes, updateProject } from "../../services/projectServices";

// ===== PROPS =====
interface Props {
    id: string, 
    projectName: string, 
    projectDescription: string, 
    subtitle?: string | number, 
    element?: React.ReactNode, 
    location: string;
}

// ===== MAIN COMPONENT =====
export default function ProjectCard({ id, projectName, subtitle, projectDescription, element, location } : Props)
{
    const navigate = useNavigate();
    const menuRef = useRef<HTMLDivElement | null>(null);

    const [ show1, setShow1 ] = useState<boolean>(false);
    const [ show2, setShow2 ] = useState<boolean>(false);
    const [ moreOptions, setMoreOptions ] = useState(false);

    const formRef = useRef<HTMLFormElement | null>(null);
    const [ name, setName ] = useState(projectName);
    const [ description, setDescription ] = useState(projectDescription);

    const openModal1 = () => setShow1(true);
    const closeModal1 = () => {
        setShow1(false);
        setName(projectName);
        setDescription(projectDescription);
    };
    const openModal2 = () => setShow2(true);
    const closeModal2 = () => setShow2(false);

    const handleProjectEdition = async (e: React.FormEvent, id: string) => {
        e.preventDefault();
        const form = formRef.current;
        if (!form || !form.checkValidity()) {
            form?.classList.add("was-validated");
            return;
        }
        await updateProject(id, name, description);
        closeModal1();
        setMoreOptions(false);
    }

    const handleMoveProjectToTrash = async (id: string) => {
        closeModal2();
        deleteProjectNPrototypes(id);
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMoreOptions(false);
            }
        }
        if (moreOptions) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [moreOptions]);

    return(
        <>
            <div 
                key={id}
                className="card shadow-sm border rounded-4 position-relative hover-card" 
                style={{ 
                    width: "16rem",
                    minHeight: "220px", // Reduzido para ser mais compacto
                    background: "#fff",
                    transition: "all 0.2s ease-in-out",
                    cursor: "pointer"
                }}
                onClick={() => navigate(location)}
            >
                {/* Menu de Opções */}
                <div 
                    className="position-absolute" 
                    style={{ top: "8px", right: "8px", zIndex: 10 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div 
                        onClick={() => setMoreOptions(!moreOptions)}
                        className="btn btn-link p-1 text-muted"
                        style={{ cursor: "pointer" }}
                    >
                        <ThreeDotsVertical size={18} />
                    </div>

                    {moreOptions && (
                        <div 
                            ref={menuRef}
                            style={{ top: "25px", right: 0, minWidth: "9rem", zIndex: 100 }}
                            className="position-absolute rounded-3 shadow-lg p-2 bg-white border"
                        >
                            <button onClick={openModal1} className="btn btn-sm w-100 d-flex gap-2 align-items-center text-start py-2">
                                <PencilSquare className="text-danger"/>
                                <span>Editar</span>
                            </button>
                            <button onClick={openModal2} className="btn btn-sm w-100 d-flex gap-2 align-items-center text-start py-2">
                                <Trash3Fill className="text-danger"/>
                                <span>Excluir</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="card-body p-3 d-flex flex-column align-items-center text-center">
                    
                    {/* Ícone Reduzido */}
                    <div 
                        className="rounded-circle d-flex align-items-center justify-content-center mb-2"
                        style={{ width: "50px", height: "50px", backgroundColor: "#fdeef1" }}
                    >
                        <Archive size={24} className="text-danger" />
                    </div>

                    {/* Título */}
                    <h6 className="text-custom-black fw-bold mb-1 text-truncate w-100 px-2" style={{ fontSize: "1rem" }}>
                        {projectName}
                    </h6>

                    {/* Descrição Compacta (Limite de 2 linhas) */}
                    <p 
                        className="text-secondary mb-2 overflow-hidden" 
                        style={{ 
                            fontSize: "0.7rem",
                            display: "-webkit-box", 
                            WebkitLineClamp: 2, 
                            WebkitBoxOrient: "vertical",
                            minHeight: "30px", // Altura exata para 2 linhas de texto pequeno
                            lineHeight: "1.2"
                        }}
                    >
                        {projectDescription}
                    </p>

                    {/* Círculos de Membros (Sem border-top para economizar espaço se preferir) */}
                    <div className="w-100 mt-2 d-flex justify-content-center align-items-center">
                        {element}
                    </div>
                </div>
            </div>

            <style>{`
                .hover-card:hover {
                    transform: translateY(-4px);
                    border-color: var(--red00) !important;
                    box-shadow: 0 8px 15px rgba(228, 13, 44, 0.1) !important;
                }
            `}</style>

            {/* MODAIS (MANTIDOS IGUAIS) */}
            <Modal show={show1} onHide={closeModal1} centered size="lg">
                <Modal.Header closeButton className="border-0 px-4 pt-4"></Modal.Header>
                <Modal.Body className="px-5 pb-5 pt-0">
                    <form ref={formRef} onSubmit={(e) => handleProjectEdition(e, id)} noValidate>
                        <div className="mb-4 text-center">
                            <p className='fs-6 mb-1 text-custom-red fw-bold'>GERENCIAMENTO</p>
                            <h2 className='text-custom-black fw-bold'>Editar Projeto</h2>
                        </div>
                        <div className="form-floating mb-3">
                            <input id='name' required value={name} type="text" className='form-control' placeholder='Nome' onChange={(e) => setName(e.target.value)} />
                            <label htmlFor="name">Nome do projeto</label>
                        </div>
                        <div className="form-floating mb-4">
                            <textarea required id="desc" value={description} className='form-control' placeholder='Descrição' style={{ height: "120px" }} onChange={(e) => setDescription(e.target.value)} />
                            <label htmlFor="desc">Descrição do projeto</label>
                        </div>
                        <div className="d-grid">
                            <button type='submit' className='btn btn-danger btn-lg rounded-pill shadow-sm'>Salvar Alterações</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            <Modal show={show2} onHide={closeModal2} centered>
                <Modal.Body className="text-center p-5">
                    <Trash3Fill size={50} className="text-danger mb-4" />
                    <h4 className="fw-bold mb-3">Excluir Projeto?</h4>
                    <p className="text-muted mb-5">Esta ação não pode ser desfeita.</p>
                    <div className="d-flex gap-2 justify-content-center">
                        <button className="btn btn-light px-4 rounded-pill" onClick={closeModal2}>Cancelar</button>
                        <button className="btn btn-danger px-4 rounded-pill shadow-sm" onClick={() => handleMoveProjectToTrash(id)}>Excluir</button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}
