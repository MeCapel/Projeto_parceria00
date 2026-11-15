import { useState } from "react"
import { CrudTable } from "../Others/CrudTable";
import { Modal } from "react-bootstrap";
import { Trash3Fill } from "react-bootstrap-icons";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { createPortal } from "react-dom";
import type { PrototypeProps } from "../../services/prototypes.service";

interface ImagePreview {
    src: string;
    alt: string;
    top: number;
    left: number;
}

interface MainFrameProps {
    projectId: string;
    prototypes: PrototypeProps[];
    loading: boolean;
    onDelete: (id: string) => Promise<void>;
}

export default function MainFrame({ projectId, prototypes, loading, onDelete } : MainFrameProps)
{
    const [ prototypeToDelete, setPrototypeToDelete] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<ImagePreview | null>(null);
    const navigate = useNavigate();

    const showImagePreview = (image: HTMLImageElement, src: string, alt: string) => {
        const bounds = image.getBoundingClientRect();
        const previewWidth = 264;
        const previewHeight = 204;

        setImagePreview({
            src,
            alt,
            left: Math.max(12, Math.min(bounds.right + 12, window.innerWidth - previewWidth - 12)),
            top: Math.max(12, Math.min(bounds.top, window.innerHeight - previewHeight - 12)),
        });
    };

    const handleNavigate = (id: string) => {
        navigate(`/projects/${projectId}/${id}`);
    };

    const handleDelete = (id: string) => {
        setPrototypeToDelete(id);
    };

    const confirmDelete = async () => {
        if (!prototypeToDelete) return;

        await onDelete(prototypeToDelete);
        setPrototypeToDelete(null);
    };

    if (loading) return <p>Carregando protótipos...</p>;

    return(
        <div className="">
            {!prototypes || prototypes.length === 0 ? (

                <div className="w-100 py-5 text-center border rounded bg-light">
                    <p className="text-muted mb-0">Nenhum protótipo encontrado.</p>
                </div>

            ) : (

                <>
                    <CrudTable
                        headers={["Prévia", "Nome", "Descrição", "Etapa", "Vertical"]}

                        data={prototypes}

                        getId={(p) => p.id!} 
                        onRowClick={(p) => handleNavigate(p.id)}

                        renderRow={(p) => (
                            <>
                                <td className="px-4">
                                    {p.image ? (
                                        <img
                                            src={p.image}
                                            alt={`Prévia de ${p.name}`}
                                            loading="lazy"
                                            className="rounded border object-fit-cover"
                                            style={{ width: "72px", height: "52px" }}
                                            tabIndex={0}
                                            onMouseEnter={(event) => showImagePreview(event.currentTarget, p.image!, p.name)}
                                            onMouseLeave={() => setImagePreview(null)}
                                            onFocus={(event) => showImagePreview(event.currentTarget, p.image!, p.name)}
                                            onBlur={() => setImagePreview(null)}
                                        />
                                    ) : (
                                        <div
                                            className="rounded border bg-light d-flex align-items-center justify-content-center text-muted small"
                                            style={{ width: "72px", height: "52px" }}
                                            aria-label="Sem imagem de prévia"
                                        >
                                            Sem imagem
                                        </div>
                                    )}
                                </td>
                                <td className="px-4">
                                    <Link
                                        to={`/projects/${projectId}/${p.id}`}
                                        className="text-secondary text-decoration-none"
                                        onClick={(event) => event.stopPropagation()}
                                    >
                                        {p.name}
                                    </Link>
                                </td>
                                <td className="px-4 text-secondary">{p.description && p.description.length > 25 ? p.description.substring(0, 25) + "..." : p.description}</td>
                                <td className="px-4 text-secondary">
                                    <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-3">
                                        {p.stageLabel}
                                    </span>
                                </td>
                                <td className="px-4 text-secondary">{p.verticalLabel}</td>
                            </>
                        )}

                        onEdit={handleNavigate}
                        onDelete={handleDelete}
                    />

                    {imagePreview && createPortal(
                        <div
                            className="rounded border bg-white p-2 shadow-lg"
                            style={{
                                position: "fixed",
                                top: imagePreview.top,
                                left: imagePreview.left,
                                width: "264px",
                                height: "204px",
                                zIndex: 1100,
                                pointerEvents: "none",
                            }}
                            aria-hidden="true"
                        >
                            <img
                                src={imagePreview.src}
                                alt={imagePreview.alt}
                                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                            />
                        </div>,
                        document.body
                    )}

                    <Modal
                        show={!!prototypeToDelete} 
                        onHide={() => setPrototypeToDelete(null)} 
                        centered
                    >
                        <Modal.Body className="text-center p-5">
                            <Trash3Fill size={50} className="text-danger mb-4" />

                            <h4 className="fw-bold mb-3">Desativar protótipo?</h4>
                            <p className="text-muted mb-5">
                                Este protótipo será desativado.
                            </p>

                            <div className="d-flex gap-3 justify-content-center">
                                <button 
                                    className="btn-custom btn-custom-outline-secondary px-4 rounded-3"
                                    onClick={() => setPrototypeToDelete(null)}
                                >
                                    Cancelar
                                </button>

                                <button 
                                    className="btn-custom btn-custom-outline-primary px-4 rounded-3 shadow-sm"
                                    onClick={confirmDelete}
                                >
                                    Excluir
                                </button>
                            </div>
                        </Modal.Body>
                    </Modal>
                </>
            )}
        </div>
    )
}
