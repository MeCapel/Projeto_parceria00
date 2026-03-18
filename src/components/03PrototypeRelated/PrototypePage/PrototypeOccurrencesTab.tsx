// ===== GERAL IMPORTS =====
import type { OccurrenceProps } from "../../../services/occurrenceServices"
import OccurenceGrid from "../../OccurrenceRelated/OccurrenceGrid"

// ===== TYPE INTERFACES =====

interface Props {
    occurrences: OccurrenceProps[]
    onEdit?: (id: string) => void
    onDelete?: (id: string) => void
    children?: React.ReactNode
}

// ===== MAIN COMPONENT =====
export default function PrototypeOccurrencesTab({ occurrences, onEdit, onDelete, children } : Props )
{
    const hasOccurrences = occurrences.length > 0;

    return(
        <section className="">

            {/* header da seção */}
            <div className="d-flex align-items-center justify-content-between mb-3">

                <div>
                <h4 className="fw-bold text-custom-black mb-0">
                    Ocorrências
                </h4>

                <small className="text-muted">
                    Possíveis defeitos encontrados no protótipo
                </small>
                </div>

                {children}

            </div>

            {/* conteúdo */}

            {hasOccurrences ? (

                <OccurenceGrid
                occurrences={occurrences}
                onDelete={onDelete}
                onEdit={onEdit}
                />

            ) : (

                <div
                    className="d-flex flex-column align-items-center justify-content-center text-center border rounded-3 p-5"
                    style={{ minHeight: "12rem" }}
                    >

                    <h5 className="text-muted mb-2">
                        Nenhuma ocorrência cadastrada
                    </h5>

                    <p className="text-muted small mb-0">
                        Adicione ocorrências para registrar possíveis defeitos do protótipo.
                    </p>

                </div>

            )}

        </section>
    )
}