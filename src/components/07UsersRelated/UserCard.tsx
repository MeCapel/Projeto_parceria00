import type { UserProps } from "../../services/authServices"

interface Props {
    user: UserProps
    subtitle?: string
    onDelete?: (userId: string) => void
    children?: React.ReactNode
}

export default function UserCard({ user, subtitle, onDelete, children }: Props) {
    return (
        <div className="card shadow w-100 p-4 shadow rounded-4 d-flex flex-column gap-3 bg-white">

            {/* HEADER */}
            <div className="d-flex align-items-center justify-content-between">

                <div className="d-flex gap-3 align-items-center">

                    <div
                        className="rounded-circle border bg-secondary-subtle overflow-hidden"
                        style={{ height: "5rem", width: "5rem" }}
                    >
                        {user.profileImage && (
                            <img
                                src={user.profileImage}
                                alt={user.username}
                                className="w-100 h-100 object-fit-cover"
                            />
                        )}
                    </div>

                    <div>
                        <p className="mb-0 fs-4 fw-bold">
                            {user.username}
                        </p>

                        <div className="d-flex flex-column gap-2 small">
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
                        className="btn-custom btn-custom-outline-primary"
                        onClick={() => onDelete(user.id)}
                    >
                        Excluir
                    </button>
                )}
            </div>

            {/* CONTEÚDO EXTRA */}
            {children && (
                <div className="bg-white w-100 rounded-3 p-3">
                    {children}
                </div>
            )}
        </div>
    )
}