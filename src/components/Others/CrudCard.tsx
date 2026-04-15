interface CrudCardProps {
    title: string;
    description?: string;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function CrudCard({ title, description, onEdit, onDelete }: CrudCardProps) {
    return (
        <div className="col-md-4">
            <div className="card h-100">
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{title}</h5>
                    {description && <p className="card-text">{description}</p>}
                    <div className="mt-auto d-flex gap-2">
                        {onEdit && <button className="btn btn-sm btn-warning" onClick={onEdit}>Editar</button>}
                        {onDelete && <button className="btn btn-sm btn-danger" onClick={onDelete}>Excluir</button>}
                    </div>
                </div>
            </div>
        </div>
    );
}