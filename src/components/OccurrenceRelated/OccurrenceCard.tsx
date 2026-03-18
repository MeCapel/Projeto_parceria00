// ===== GERAL IMPORTS =====
import { Card } from "react-bootstrap";

// ===== TYPE INTERFACE =====
interface Props {
    name: string
    description: string
    criticity: "A" | "B" | "C"
    createdAt: string
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
        A: "border border-danger bg-danger-subtle",
        B: "border border-warning bg-warning-subtle",
        C: "border border-info bg-info-subtle"
    }

    return(
        <Card className="shadow border p-2" style={{ height: "18rem", width: '18rem' }}>
            
            {image && (
                <div style={{ height: "8rem", overflow: "hidden" }} >
                    <Card.Img src={image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
            )}

            <Card.Body className="d-flex flex-column justify-content-between">
                
                <div className="d-flex flex-column gap-2">
                    <div className="d-flex align-items-center gap-2 mb-2">

                        {/* // ----- Here goes the criticity of the given occurrence */}
                        <span className={`rounded-5 px-3 py-1 border fw-semibold text-black ${criticityStyles[criticity]}`} >
                            {criticity}
                        </span>
                        
                        {/* // ----- Here goes the name of the occurence ----- */}
                        <Card.Title className="mb-0 fs-6 fw-bold text-truncate" style={{ maxWidth: "9rem" }}>
                            {name}
                        </Card.Title>
                    
                    </div>

                    {/* // ----- Here goes the date that the occurence was created ----- */}
                    <small className="text-muted mb-2">
                        {typeof createdAt === "string"
                            ? createdAt
                            : createdAt?.toDate?.().toLocaleDateString()}
                    </small>
                    
                    {/* // ----- Here goes the description */}
                    <Card.Text>{description}</Card.Text>
                </div>

                {/* // ----- Buttons delete and edit ----- */}
                <div className="d-flex justify-content-between">
                    <button className="btn-custom btn-custom-outline-primary rounded-2 px-3" onClick={onDelete}>Deletar</button>
                    <button className="btn-custom btn-custom-outline-secondary rounded-3 px-3" onClick={onEdit}>Editar</button>
                </div>
            </Card.Body>
        </Card>
    )
}