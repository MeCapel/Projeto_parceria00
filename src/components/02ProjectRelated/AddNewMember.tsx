// ===== GERAL IMPORTS =====
import { useEffect, useRef, useState } from "react";
import { type UserProps } from "../../services/auth.service";
import { addProjectMember, getUsersNotInProject } from "../../services/projectMembers.service";

// ===== INTERFACE TYPES =====
interface Props {
    projectId: string;
}

// ===== MAIN COMPONENT =====
// ----- Componente responsável por exibir usuários cadastrados e não presentes em determinado projeto, permitindo selecionna-los e assim adiciona-los ao projeto atual -----
export default function AddNewMember({ projectId }: Props) {
    const [users, setUsers] = useState<UserProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [openUserId, setOpenUserId] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsersNotInProject(projectId);
                setUsers(data || []);
            } catch (err) {
                console.error("Erro ao buscar usuários:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
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
        const userId = user.id;

        if (!userId) return;

        try {
            await addProjectMember(projectId, userId);

            // remove da lista após adicionar
            setUsers(prev => prev.filter(u => u.id !== userId));

        } catch (err) {
            console.error("Erro ao adicionar membro:", err);
        }
    };

 return (
    <div
        className="d-flex flex-column overflow-auto mt-2"
        style={{ maxHeight: "50vh" }}
    >
        {loading && <p>Carregando...</p>}

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