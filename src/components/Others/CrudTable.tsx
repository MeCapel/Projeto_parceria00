import type React from "react";
import { PencilSquare, Trash3Fill } from "react-bootstrap-icons";

export type Status = "active" | "disabled";

interface CrudTableProps<T> {
    headers: string[];
    data: T[];
    renderRow: (item: T) => React.ReactNode;

    onEdit?: (id: string) => void;
    onRowClick?: (item: T) => void;
    onStatusChange?: (id: string, currentStatus: Status) => void;
    onDelete?: (id: string) => void;

    renderActions?: (id: string, item: T) => React.ReactNode;

    getId: (item: T) => string;
}

export function CrudTable<T>({
    headers,
    data,
    renderRow,
    onEdit,
    onRowClick,
    onStatusChange,
    onDelete,
    renderActions,
    getId
}: CrudTableProps<T>) {
    return (
        <div className="table-responsive rounded-3 border">
            <table className="table table-hover align-middle mb-0">
                
                {/* HEADER */}
                <thead className="table-light">
                    <tr>
                        {headers.map((h, i) => (
                            <th key={i} className="py-3 px-4 fw-bold">
                                {h}
                            </th>
                        ))}

                        {(onEdit || onDelete) && (
                            <th className="py-3 px-4 fw-bold">Ações</th>
                        )}
                    </tr>
                </thead>

                {/* BODY */}
                <tbody>
                    {data.map((item) => {
                        const id = getId(item);

                        return (
                            <tr
                                key={id}
                                tabIndex={onRowClick ? 0 : undefined}
                                style={{ cursor: onRowClick ? "pointer" : undefined }}
                                onClick={onRowClick ? (event) => {
                                    const target = event.target as HTMLElement;
                                    if (target.closest("button, a, input, select, textarea, [role='button']")) return;
                                    onRowClick(item);
                                } : undefined}
                                onKeyDown={onRowClick ? (event) => {
                                    if (event.target !== event.currentTarget) return;
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        onRowClick(item);
                                    }
                                } : undefined}
                            >

                                {/* Conteúdo dinâmico */}
                                {renderRow(item)}

                                {/* AÇÕES */}
                                {(onEdit || onDelete) && (
                                    <td className="px-4">
                                        <div className="d-flex gap-2">

                                            {onEdit && (
                                                <button
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        onEdit(id);
                                                    }}
                                                    className="btn-custom btn-custom-inside-primary px-2 py-1 border-0 bg-transparent"
                                                >
                                                    <PencilSquare />
                                                </button>
                                            )}

                                            {onStatusChange && (
                                                <button
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        const status = (item as unknown as { status?: "active" | "disabled" }).status;
                                                        if (!status) return;

                                                        onStatusChange(id, status);
                                                    }}
                                                    className="btn-custom btn-custom-inside-primary px-2 py-1 border-0 bg-transparent"
                                                    title="Alternar status"
                                                >
                                                    <div className="form-check form-switch m-0">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            role="switch"
                                                            checked={
                                                                (item as unknown as { status?: "active" | "disabled" }).status === "active"
                                                            }
                                                            readOnly
                                                        />
                                                    </div>
                                                </button>
                                            )}

                                            {onDelete && (
                                                <button
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        onDelete(id);
                                                    }}
                                                    className="btn-custom btn-custom-inside-primary px-2 py-1 border-0 bg-transparent"
                                                >
                                                    <Trash3Fill />
                                                </button>
                                            )}

                                            {renderActions && renderActions(id, item)}

                                        </div>
                                    </td>
                                )}

                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}