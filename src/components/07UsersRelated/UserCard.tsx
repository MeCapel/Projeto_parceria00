import type { UserProps } from "../../services/authServices"

interface Props {
    user: UserProps
    subtitle?: string
    onDelete?: (userId: string) => void
    children?: React.ReactNode
}

export default function UserCard({ user, subtitle, onDelete, children }: Props) {
    return (
        <div className="card shadow w-100 p-3 p-md-4 rounded-4 d-flex flex-column gap-3 bg-white">

            {/* HEADER */}
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">

                <div className="d-flex gap-3 align-items-center w-100">

                    <div
                        className="rounded-circle border bg-secondary-subtle overflow-hidden flex-shrink-0"
                        style={{ height: "4rem", width: "4rem" }}
                    >
                        {user.profileImage && (
                            <img
                                src={user.profileImage}
                                alt={user.username}
                                className="w-100 h-100 object-fit-cover"
                            />
                        )}
                    </div>

                    <div className="w-100">
                        <p className="mb-0 fs-5 fs-md-4 fw-bold">
                            {user.username}
                        </p>

                        <div className="d-flex flex-column gap-1 small text-break">
                            <span>{user.email}</span>

                            {user.role && (
                                <span>{user.role}</span>
                            )}
                        </div>

                        {subtitle && (
                            <p className="mb-0 text-secondary small">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {onDelete && (
                    <button
                        className="btn-custom btn-custom-outline-primary w-100 w-md-auto"
                        onClick={() => onDelete(user.id)}
                    >
                        Excluir
                    </button>
                )}
            </div>

            {/* CONTEÚDO EXTRA */}
            {children && (
                <div className="bg-white w-100 rounded-3 p-2 p-md-3">
                    {children}
                </div>
            )}
        </div>
    )
}