import { useEffect, useRef, useState } from "react";
import { type UserProps } from "../../services/authServices";
import { getUsersNotInProject, linkProjectUser } from "../../services/projectServices";
import { CaretDown, CaretUp } from "react-bootstrap-icons";

interface Props {
    projectId: string;
}

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
    <div className="d-flex flex-column overflow-auto" style={{ maxHeight: "50vh" }}>
        <ul className="list-unstyled d-flex flex-column gap-2">

            {users.map(user => {

                if (!user.id) return null;

                return (
                    <li
                        key={user.id}
                        className="d-flex align-items-center gap-2"
                        style={{ width: "100%" }}
                    >

                        {/* EMAIL */}
                        <div
                            className="text-truncate"
                            style={{ flex: 1, minWidth: 0 }}
                        >
                            {user.email}
                        </div>

                        {/* DIREITA */}
                        <div
                            className="d-flex align-items-center gap-2 shrink-0 position-relative"
                            ref={openUserId === user.id ? dropdownRef : null}
                        >

                            {/* caret */}
                            <div
                                className="pointer p-1"
                                onClick={() => toggleDropdown(user.id)}
                            >
                                {openUserId === user.id
                                    ? <CaretUp size={16} />
                                    : <CaretDown size={16} />
                                }
                            </div>

                            {/* dropdown */}
                            {openUserId === user.id && (
                                <div
                                    className="d-flex flex-column gap-2 p-2 border rounded shadow-sm bg-white"
                                    style={{
                                        position: "absolute",
                                        top: "2rem",
                                        right: "0",
                                        zIndex: 100,
                                        minWidth: "120px"
                                    }}
                                >
                                    {["Membro", "Admin"].map(role => (
                                        <label
                                            key={role}
                                            className="d-flex gap-2 align-items-center form-check-label"
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
                                                className="form-check-input"
                                            />
                                            {role}
                                        </label>
                                    ))}
                                </div>
                            )}

                            {/* TEXTO */}
                            <span style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                                {user.role}
                            </span>

                            {/* BOTÃO */}
                            <button
                                type="button"
                                onClick={() => handleNewMember(user)}
                                className="btn-custom btn-custom-outline-success px-2 py-1"
                                style={{ whiteSpace: "nowrap" }}
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