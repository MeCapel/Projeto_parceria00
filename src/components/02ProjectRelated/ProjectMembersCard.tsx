import type { UserProps } from "../../services/auth.service"

interface Props {
    user: UserProps
    subtitle?: string
    onDelete?: (userId: string) => void
    children?: React.ReactNode
}

export default function ProjectMembersCard({
    user,
    subtitle,
    onDelete,
    children
}: Props) {

    return (
        <div
            className="w-100 bg-white rounded-4 p-3 p-md-4"
            style={{
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                transition: "all .25s ease"
            }}
        >

            <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">

                {/* LADO ESQUERDO */}
                <div
                    className="d-flex align-items-center justify-content-between gap-3"
                    style={{
                        flex: 1,
                        minWidth: 0
                    }}
                >

                    {/* AVATAR */}
                    <div
                        className="rounded-circle overflow-hidden shrink"
                        style={{
                            width: 72,
                            height: 72,
                            background: "#f3f4f6",
                            border: "2px solid rgba(0,0,0,0.08)"
                        }}
                    >
                        {user.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt={user.username}
                                className="w-100 h-100 object-fit-cover"
                            />
                        ) : (
                            <div
                                className="w-100 h-100 d-flex align-items-center justify-content-center"
                                style={{
                                    fontWeight: 700,
                                    fontSize: "1.4rem",
                                    color: "#555"
                                }}
                            >
                                {user.username?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    {/* INFOS */}
                    <div
                        className="d-flex flex-column justify-content-center"
                        style={{
                            flex: 1,
                            minWidth: 0
                        }}
                    >

                        {/* USERNAME */}
                        <span
                            className="fw-bold text-dark text-truncate"
                            style={{
                                fontSize: "1.15rem",
                                lineHeight: 1.2
                            }}
                        >
                            {user.username}
                        </span>

                        {/* EMAIL */}
                        <span
                            className="text-muted text-truncate"
                            style={{
                                fontSize: ".95rem"
                            }}
                            title={user.email}
                        >
                            {user.email}
                        </span>

                        {/* TAGS */}
                        <div className="d-flex align-items-center gap-2 flex-wrap mt-2">

                            {user.role && (
                                <span
                                    className="px-3 py-1 rounded-pill"
                                    style={{
                                        background: "#111",
                                        color: "#fff",
                                        fontSize: ".72rem",
                                        fontWeight: 600,
                                        whiteSpace: "nowrap"
                                    }}
                                >
                                    {user.role}
                                </span>
                            )}

                            {subtitle && (
                                <span
                                    className="text-secondary"
                                    style={{
                                        fontSize: ".8rem",
                                        whiteSpace: "nowrap"
                                    }}
                                >
                                    {subtitle}
                                </span>
                            )}

                        </div>

                    </div>

                </div>

                {/* BOTÃO */}
                {onDelete && (
                    <div
                        className="shrink"
                    >
                        <button
                            className="btn-custom btn-custom-outline-primary rounded-1 w-100"
                            style={{
                                height: 48,
                                fontWeight: 600
                            }}
                            onClick={() => onDelete(user.id)}
                        >
                            Excluir
                        </button>
                    </div>
                )}

            </div>

            {/* EXTRA */}
            {children && (
                <div
                    className="mt-4 pt-3"
                    style={{
                        borderTop: "1px solid rgba(0,0,0,0.06)"
                    }}
                >
                    {children}
                </div>
            )}

        </div>
    )
}