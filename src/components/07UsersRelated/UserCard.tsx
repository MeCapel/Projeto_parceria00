import type { UserProps } from "../../services/authServices"

interface Props {
    user: UserProps
    subtitle?: string
    onDelete?: (userId: string) => void
    children?: React.ReactNode
}

export default function UserCard({ user, subtitle, onDelete, children }: Props) {
    return (
        <div className="p-4 w-100 shadow rounded-4 d-flex flex-column gap-3 bg-custom-black00">

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center">

                <div className="d-flex gap-3 align-items-center">

                    <div
                        className="rounded-circle bg-white overflow-hidden"
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
                        <p className="mb-0 fs-4 fw-bold text-white">
                            {user.username}
                        </p>

                        <div className="d-flex gap-2 text-white small">
                            <span>{user.email}</span>

                            {user.role && (
                                <>
                                    <span>|</span>
                                    <span>{user.role}</span>
                                </>
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