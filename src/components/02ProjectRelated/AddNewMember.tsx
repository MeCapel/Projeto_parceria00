// ===== GERAL IMPORTS =====
import { useEffect, useRef, useState } from "react";
import { type UserProps } from "../../services/authServices";
import { getUsersNotInProject, linkProjectUser } from "../../services/projectServices";
import { CaretDown, CaretUp } from "react-bootstrap-icons";

// ===== INTERFACE TYPES =====
interface Props {
    projectId: string;
}

// ===== MAIN COMPONENT =====
// ----- Componente responsável por exibir usuários cadastrados e não presentes em determinado projeto, permitindo selecionna-los e assim adiciona-los ao projeto atual -----
export default function AddNewMember({ projectId }: Props) {
    const [users, setUsers] = useState<UserProps[]>([]);
    const [openUserId, setOpenUserId] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const unsubscribe = getUsersNotInProject(projectId, (usersData) => {

            const formatted = (usersData ?? []).map(user => ({
                ...user,
                role: "Membro" as UserProps["role"], // default role
            }));

            setUsers(formatted);
        });

        return () => unsubscribe();
    }, [projectId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if(dropdownRef.current && !dropdownRef.current.contains(event.target as Node))
            {
                setOpenUserId(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])

    const handleNewMember = async (user: UserProps) => {

        if (!user.id) return;

        const result = await linkProjectUser(projectId, {
            id: user.id,
            username: user.username || "Sem nome",
            email: user.email || "",
            image: user.profileImage
        }, user.role as "admin" | "membro" | "owner"); 

        if (!result.success) {
            console.error("Erro ao adicionar um novo membro ao projeto!");
        }
    };

    const toggleDropdown = (userId: string) => {
        setOpenUserId(prev => (prev === userId ? null : userId));
    };

    const handleRoleChange = (userId: string, role: UserProps["role"]) => {
        setUsers(prev =>
            prev.map(user =>
                user.id === userId ? { ...user, role } : user
            )
        );
    };

 return (
    <div
        className="d-flex flex-column overflow-auto mt-2"
        style={{ maxHeight: "50vh" }}
    >
        <ul className="list-unstyled d-flex flex-column gap-3">

            {users.map(user => {

                if (!user.id) return null;

                return (
                    <li
                        key={user.id}
                        className="d-flex align-items-center justify-content-between border rounded p-2"
                    >

                        {/* ESQUERDA */}
                        <div className="d-flex flex-column" style={{ minWidth: 0 }}>
                            <span className="fw-semibold">
                                {user.username || "Sem nome"}
                            </span>

                            <span
                                className="text-muted text-truncate"
                                style={{ fontSize: "0.9rem", maxWidth: "180px" }}
                            >
                                {user.email}
                            </span>
                        </div>

                        {/* DIREITA */}
                        <div
                            className="d-flex align-items-center gap-2 position-relative"
                            ref={openUserId === user.id ? dropdownRef : null}
                        >

                            {/* SELECT ROLE */}
                            <div
                                className="d-flex align-items-center gap-1 pointer"
                                onClick={() => toggleDropdown(user.id)}
                                style={{
                                    cursor: "pointer",
                                    minWidth: "90px"
                                }}
                            >
                                <span style={{ fontSize: "0.9rem" }}>
                                    {user.role}
                                </span>

                                {openUserId === user.id
                                    ? <CaretUp size={16} />
                                    : <CaretDown size={16} />
                                }
                            </div>

                            {/* DROPDOWN */}
                            {openUserId === user.id && (
                                <div
                                    className="d-flex flex-column gap-2 p-2 border rounded shadow-sm bg-white"
                                    style={{
                                        position: "absolute",
                                        top: "2.5rem",
                                        right: "90px",
                                        zIndex: 100,
                                        minWidth: "120px"
                                    }}
                                >
                                    {["Membro", "Admin"].map(role => (
                                        <label
                                            key={role}
                                            className="d-flex gap-2 align-items-center"
                                        >
                                            <input
                                                type="radio"
                                                value={role}
                                                name={`role-${user.id}`}
                                                checked={user.role === role}
                                                onChange={() =>
                                                    handleRoleChange(
                                                        user.id,
                                                        role as UserProps["role"]
                                                    )
                                                }
                                            />

                                            {role}
                                        </label>
                                    ))}
                                </div>
                            )}

                            {/* BOTÃO */}
                            <button
                                type="button"
                                onClick={() => handleNewMember(user)}
                                className="btn btn-danger btn-sm"
                            >
                                Adicionar
                            </button>

                        </div>

                    </li>
                );

            })}

        </ul>
    </div>
);
}