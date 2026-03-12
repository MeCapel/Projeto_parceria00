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

        const result = await linkProjectUser(projectId, user.id, user.role);

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
                            className="d-flex align-items-center justify-content-between gap-3"
                        >

                            <label className="form-check-label">
                                {user.email}
                            </label>

                            <div className="d-flex align-items-center gap-3 bg-custom-outline-secondary position-relative" ref={openUserId === user.id ?  dropdownRef : null}>

                                {/* caret button */}
                                <div
                                    className="pointer p-2"
                                    onClick={() => toggleDropdown(user.id!)}
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
                                                    checked={user.role === role}
                                                    onChange={() =>
                                                        handleRoleChange(
                                                            user.id!,
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

                                <p className="mb-0">Como {user.role}</p>
                                
                                {/* add button */}
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