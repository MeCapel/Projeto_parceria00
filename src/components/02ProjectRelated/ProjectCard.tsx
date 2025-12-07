// ===== GERAL IMPORTS =====

import type React from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from 'react-router'
import { Archive } from "react-bootstrap-icons";
import { useState, useRef, useEffect } from "react";
import { ThreeDotsVertical, Trash3Fill, PencilSquare } from 'react-bootstrap-icons'
import { deleteProjectNPrototypes, updateProject } from "../../services/projectServices";

// ===== PROPS =====

interface Props {
    id: string, 
    // imgUrl?: string, 
    projectName: string, 
    projectDescription: string, 
    subtitle?: string | number, 
    element?: React.ReactNode, 
    location: string;
}

// ===== MAIN COMPONENT =====

export default function ProjectCard({ id, projectName, subtitle, projectDescription, element, location } : Props)
{
    // ===== Declaring & initializing variables =====

    const navigate = useNavigate();
    const menuRef = useRef<HTMLDivElement | null>(null);

    const [ show1, setShow1 ] = useState<boolean>(false);
    const [ show2, setShow2 ] = useState<boolean>(false);
    const [ moreOptions, setMoreOptions ] = useState(false);

    const formRef = useRef<HTMLFormElement | null>(null);
    
    const [ name, setName ] = useState(projectName);
    const [ description, setDescription ] = useState(projectDescription);

    // ===== Modais =====

    const openModal1 = () => setShow1(true);
    const closeModal1 = () => {
        if (formRef.current) formRef.current.classList.remove("was-validated");
        setShow1(false);
        setName(projectName);
        setDescription(projectDescription);
    };
    const openModal2 = () => setShow2(true);
    const closeModal2 = () => setShow2(false);

    // ===== UPDATE PROJECT FUNCTION =====

    const handleProjectEdition = async (e: React.FormEvent ,id:string) => {
        
        // ===== Form validation =====

        e.preventDefault();

        const form = formRef.current;
        if (!form) return;

        form.classList.add("was-validated");
        
        if (!form.checkValidity()) {
            const firstInvalid = form.querySelector<HTMLElement>(":invalid");
            if (firstInvalid) firstInvalid.focus();
            return;
        }
        
        // ===== Once validated then the project is updated =====

        await updateProject(id, name, description);

        // ===== Finally close the modal and more options div =====

        closeModal1();
        setMoreOptions(false);
    }

    // ===== Delete function =====
    const handleMoveProjectToTrash = async (id: string) => {
        closeModal2();
        deleteProjectNPrototypes(id);
    }

    // ===== Fechar o more options ao clicar fora =====

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const modalOpen = show1 || show2;
            if (modalOpen) return;

            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMoreOptions(false);
            }
        }

        if (moreOptions) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [moreOptions, show1, show2]);

    return(
        <>
        
            <div 
                key={id}
                className="card shadow border rounded-3 h-auto" 
                style={{ 
                    width: "18rem",
                    maxWidth: "18rem",
                    background: "#fff"
                }}
            >
                <div className="row p-4">

                    {/* Ícone */}
                    <div 
                        onClick={() => navigate(location)}
                        className="col-12 col-md-3 d-flex align-items-start justify-content-center mb-3 mb-md-0"
                        style={{ cursor: "pointer" }}
                    >
                        <Archive size={35} color="var(--red00)" />
                    </div>

                    {/* Conteúdo */}
                    <div className="col-12 col-md-9 position-relative">

                        {/* Título + menu */}
                        <div className="d-flex align-items-start justify-content-between">

                            {/* 🔥 NOME COM overflow-hidden (para evitar quebrar o card) */}
                            <h5 
                                className="text-custom-black fw-bold fs-4 mb-1"
                                style={{ 
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "10rem"  // limite ideal dentro de 18rem
                                }}
                                onClick={() => navigate(location)}
                            >
                                {projectName}
                            </h5>

                            {/* Menu */}
                            <div style={{ position: "relative" }}>
                                <div 
                                    onClick={() => setMoreOptions(!moreOptions)}
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ padding: "0.5rem", borderRadius: "8px", cursor: "pointer" }}
                                >
                                    <ThreeDotsVertical size={22} className="text-secondary" />
                                </div>

                                {moreOptions && (
                                    <div 
                                        ref={menuRef}
                                        style={{ top: "2rem", right: 0, minWidth: "12rem" }}
                                        className="position-absolute rounded-3 shadow-sm p-2 bg-white z-3 border"
                                    >
                                        <button onClick={openModal1} className="btn w-100 d-flex gap-2 align-items-center text-start">
                                            <PencilSquare size={18} className="text-danger"/>
                                            <span className="text-dark">Editar</span>
                                        </button>

                                        <button onClick={openModal2} className="btn w-100 d-flex gap-2 align-items-center text-start">
                                            <Trash3Fill size={18} className="text-danger"/>
                                            <span className="text-dark">Excluir</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Subtítulo */}
                        <div 
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(location)}
                            className="mt-1"
                        >
                            {subtitle && (
                                <h6 className="text-muted mb-1">{subtitle}</h6>
                            )}

                            <p className="text-secondary fs-5 mb-2">
                                {projectDescription}
                            </p>

                            {/* 🔥 CÍRCULOS NÃO DEVEM SER CORTADOS (SEM overflow hidden AQUI) */}
                            {element && (
                                <div className="d-flex align-items-center">
                                    {element}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* MODAL EDIT */}
            <Modal show={show1} onHide={closeModal1} dialogClassName="" centered className='p-0' size="lg">
                <Modal.Header closeButton className="mt-3 mx-3 border-0 fs-5 fw-semibold" />
                <Modal.Body className="mb-4">

                    <form ref={formRef} className="w-100 mt-0 pt-0 px-5" onSubmit={(e) => handleProjectEdition(e, id)} noValidate>

                        <p className='fs-5 mb-0 text-custom-red'>Edição</p>
                        <h1 className='text-custom-black fw-bold mb-1'>Editar projeto</h1>

                        <div className="d-flex flex-column my-4 gap-3">

                            <div className="form-floating mb-3">
                                <input 
                                    id='input1'
                                    required 
                                    value={name}
                                    type="text" 
                                    minLength={3}
                                    maxLength={25}
                                    className='form-control' 
                                    placeholder='Nome do projeto*' 
                                    onChange={(e) => setName(e.target.value)} 
                                />
                                <label htmlFor="input1">Nome do projeto</label>
                            </div>
                            
                            <div className="form-floating">
                                <textarea 
                                    required
                                    id="input2" 
                                    minLength={3}
                                    maxLength={150}
                                    value={description}  
                                    className='form-control'
                                    placeholder='Descrição do projeto*'
                                    style={{ resize: "none", height: "100px" }}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <label htmlFor="input2">Descrição do projeto</label>
                            </div>

                        </div>

                        <div className="d-flex align-items-center justify-content-end">
                            <button type='submit' className='btn-custom btn-custom-success rounded-1 px-4'>
                                Salvar
                            </button>
                        </div>
                    </form>

                </Modal.Body>
            </Modal>

            {/* MODAL DELETE */}
            <Modal show={show2} onHide={closeModal2} centered>
                <Modal.Header closeButton className="mt-3 mx-3 fs-5 fw-semibold">Confirmação</Modal.Header>
                <Modal.Body className="text-center mb-4">
                    <p className="mb-5 fs-4">
                        Tem certeza de que deseja 
                        <span className="text-danger"> excluir </span> 
                        este projeto?
                    </p>

                    <div className="d-flex gap-3 align-items-center justify-content-center">
                        <button type="button" className="btn-custom btn-custom-outline-secondary" onClick={closeModal2}>Cancelar</button>
                        <button 
                            type="button" 
                            className="btn-custom btn-custom-outline-primary"
                            onClick={() => handleMoveProjectToTrash(id)}
                        >
                            Excluir
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}