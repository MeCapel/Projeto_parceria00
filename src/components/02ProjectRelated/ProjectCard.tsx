import { useEffect, useRef, useState } from "react";
import { Archive, PencilSquare, ThreeDotsVertical, Trash3Fill } from "react-bootstrap-icons";
import { useNavigate } from "react-router";

interface Props {
    projectName: string,
    projectDescription: string,

    subtitle?: string | number,
    element?: React.ReactNode,
    location: string,

    onEdit?: () => void,
    onDelete?: () => void,
}

export default function ProjectCard({
    projectName,
    projectDescription,
    element,
    location,
    onEdit,
    onDelete
}: Props) {

    const navigate = useNavigate();
    const menuRef = useRef<HTMLDivElement | null>(null);

    const [moreOptions, setMoreOptions] = useState(false);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMoreOptions(false);
            }
        }

        if (moreOptions) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [moreOptions]);

    return (
        <div 
            className="card-custom card-custom-hover position-relative"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(location)}
        >

            {/* MENU */}
            <div 
                className="position-absolute" 
                style={{ top: "8px", right: "8px", zIndex: 10 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div 
                    onClick={() => setMoreOptions(!moreOptions)}
                    className="btn btn-link p-1 text-muted"
                >
                    <ThreeDotsVertical size={18} />
                </div>

                {moreOptions && (
                    <div 
                        ref={menuRef}
                        style={{ top: "25px", right: 0, minWidth: "9rem", zIndex: 100 }}
                        className="position-absolute rounded-3 shadow-lg p-2 bg-white border"
                    >

                        {onEdit && (
                            <button 
                                onClick={onEdit}
                                className="btn-custom btn-custom-inside-primary w-100 d-flex gap-2 align-items-center text-start py-2 border-0 bg-transparent"
                            >
                                <PencilSquare />
                                <span>Editar</span>
                            </button>
                        )}

                        {onDelete && (
                            <button 
                                onClick={onDelete}
                                className="btn-custom btn-custom-inside-primary w-100 d-flex gap-2 align-items-center text-start py-2 border-0 bg-transparent"
                            >
                                <Trash3Fill />
                                <span>Excluir</span>
                            </button>
                        )}

                    </div>
                )}
            </div>

            {/* CONTEÚDO */}
            <div className="d-flex flex-column align-items-center text-center">

                <div 
                    className="rounded-circle d-flex align-items-center justify-content-center mb-2"
                    style={{ width: "50px", height: "50px", backgroundColor: "#fdeef1" }}
                >
                    <Archive size={24} className="text-danger" />
                </div>

                <h6 className="text-custom-black fw-bold mb-1 text-truncate w-100 px-2" style={{ fontSize: "1rem" }}>
                    {projectName}
                </h6>

                <p 
                    className="text-secondary mb-2 overflow-hidden" 
                    style={{ 
                        fontSize: "0.7rem",
                        display: "-webkit-box", 
                        WebkitLineClamp: 2, 
                        WebkitBoxOrient: "vertical",
                        minHeight: "30px",
                        lineHeight: "1.2"
                    }}
                >
                    {projectDescription}
                </p>

                <div className="w-100 mt-2 d-flex justify-content-center align-items-center">
                    {element}
                </div>

            </div>
        </div>
    );
}