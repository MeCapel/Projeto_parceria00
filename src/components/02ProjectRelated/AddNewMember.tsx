import { useEffect, useRef, useState } from "react";
import { type UserProps } from "../../services/authServices";
import { linkProjectUser } from "../../services/projectServices";
import { CaretDown, CaretUp } from "react-bootstrap-icons";

interface Props {
    projectId: string;
    usuarios: UserProps[];
}

export default function AddNewMember({ projectId, usuarios }: Props) {

    const [openUserId, setOpenUserId] = useState<string | null>(null);
    const [roles, setRoles] = useState<{ [key: string]: UserProps["role"] }>({});
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // fechar dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenUserId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleNewMember = async (user: UserProps) => {
        if (!user.id) return;

        const role = roles[user.id] || "Membro";

        const result = await linkProjectUser(
            projectId,
            {
                id: user.id,
                username: user.username || "Sem nome",
                email: user.email || "",
                image: user.profileImage
            },
            role.toLowerCase() as "admin" | "membro" | "owner"
        );

        if (!result.success) {
            console.error("Erro ao adicionar um novo membro ao projeto!");
        }
    };

    const toggleDropdown = (userId: string) => {
        setOpenUserId(prev => (prev === userId ? null : userId));
    };

    const handleRoleChange = (userId: string, role: UserProps["role"]) => {
        setRoles(prev => ({
            ...prev,
            [userId]: role
        }));
    };

    return (
        <div className="d-flex flex-column overflow-auto" style={{ maxHeight: "50vh" }}>
            <ul className="list-unstyled d-flex flex-column gap-2">

                {usuarios.map(user => {

                    if (!user.id) return null;

                    const currentRole = roles[user.id] || "Membro";

                    return (
                        <li
                            key={user.id}
                            className="d-flex align-items-center justify-content-between gap-3"
                        >

                            <label className="form-check-label">
                                {user.email}
                            </label>

                            <div
                                className="d-flex align-items-center gap-3 bg-custom-outline-secondary position-relative"
                                ref={openUserId === user.id ? dropdownRef : null}
                            >

                                {/* caret */}
                                <div
                                    className="pointer p-2"
                                    onClick={() => toggleDropdown(user.id)}
                                >
                                    {openUserId === user.id
                                        ? <CaretUp size={20} />
                                        : <CaretDown size={20} />
                                    }
                                </div>

                                {/* dropdown */}
                                {openUserId === user.id && (
                                    <div
                                        className="d-flex flex-column gap-2 p-2 border rounded shadow-sm bg-white"
                                        style={{
                                            position: "absolute",
                                            top: "2.2rem",
                                            left: "0",
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
                                                    checked={currentRole === role}
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

                                <p className="mb-0">Como {currentRole}</p>

                                {/* botão adicionar */}
                                <button
                                    type="button"
                                    onClick={() => handleNewMember(user)}
                                    className="btn-custom btn-custom-outline-success d-flex align-items-center justify-content-center gap-2"
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