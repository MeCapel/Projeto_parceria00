// ===== GERAL IMPORTS =====
import { Timestamp } from "firebase/firestore";

// ===== TYPE INTERFACE =====
interface Props {
    name: string
    description: string
    criticity: "A" | "B" | "C"
    createdAt: string | Timestamp | { toDate: () => Date }
    image?: string
    onDelete?: () => void
    onEdit?: () => void
}

// ===== MAIN COMPONENT =====
// ----- This is the occurrence card -----
export default function OccurrenceCard({ name, description, criticity, image, createdAt, onEdit, onDelete } : Props)
{
    // ---- This describes the 3 possible styes -----
    const criticityStyles = {
        A: "border-danger bg-danger-subtle text-danger",
        B: "border-warning bg-warning-subtle text-warning",
        C: "border-info bg-info-subtle text-info"
    }

    return(
        <div className="card-custom card-custom-hover p-0 overflow-hidden">
            
            {image ? (
                <div style={{ height: "8rem", overflow: "hidden" }} >
                    <img src={image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
            ) : (
                <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: "8rem" }}>
                    <span className="text-muted small">Sem imagem</span>
                </div>
            )}

            <div className="p-3 d-flex flex-column grow justify-content-between">
                
                <div className="d-flex flex-column gap-1">
                    <div className="d-flex align-items-center justify-content-between mb-1">

                        {/* // ----- Here goes the name of the occurence ----- */}
                        <h6 className="mb-0 fw-bold text-truncate text-custom-black" style={{ maxWidth: "10rem" }}>
                            {name}
                        </h6>

                        {/* // ----- Here goes the criticity of the given occurrence */}
                        <span className={`rounded-pill px-2 py-0 border fw-bold small ${criticityStyles[criticity]}`} style={{ fontSize: '0.8rem' }} >
                            {criticity}
                        </span>
                    
                    </div>

                    {/* // ----- Here goes the date that the occurence was created ----- */}
                    <small className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>
                        {typeof createdAt === "string"
                            ? createdAt
                            : (createdAt && typeof createdAt.toDate === 'function')
                                ? createdAt.toDate().toLocaleDateString()
                                : ""}
                    </small>
                    
                    {/* // ----- Here goes the description */}
                    <p className="text-secondary small overflow-hidden" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", fontSize: '0.9rem' }}>
                        {description}
                    </p>
                </div>

                {/* // ----- Buttons delete and edit ----- */}
                <div className="d-flex justify-content-between gap-2 mt-2">
                    <button className="btn-custom btn-custom-outline-secondary btn-sm grow" onClick={onEdit}>Editar</button>
                    <button className="btn-custom btn-custom-primary btn-sm grow" onClick={onDelete}>Deletar</button>
                </div>
            </div>
        </div>
    )
}