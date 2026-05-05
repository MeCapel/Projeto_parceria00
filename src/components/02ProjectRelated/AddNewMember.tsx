import { useEffect, useState } from "react";
import { getUsersNotInProject, addProjectMember } from "../../services/projectMembers.service";
import type { UserProps } from "../../services/auth.service";

interface Props {
    projectId: string;
}

export default function AddNewMember({ projectId }: Props) {

    const [users, setUsers] = useState<UserProps[]>([]);
    const [loading, setLoading] = useState(true);

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

    const handleAdd = async (userId: string) => {
        try {
            await addProjectMember(projectId, userId);

            // remove da lista após adicionar
            setUsers(prev => prev.filter(u => u.id !== userId));

        } catch (err) {
            console.error("Erro ao adicionar membro:", err);
        }
    };

    return (
        <div className="d-flex flex-column overflow-auto" style={{ maxHeight: "50vh" }}>

            {loading && <p>Carregando...</p>}

            <ul className="list-unstyled d-flex flex-column gap-2">

                {users.map(user => {

                    if (!user.id) return null;

                    return (
                        <li
                            key={user.id}
                            className="d-flex align-items-center justify-content-between"
                        >

                            {/* EMAIL */}
                            <span className="text-truncate">
                                {user.email}
                            </span>

                            {/* BOTÃO */}
                            <button
                                type="button"
                                onClick={() => handleAdd(user.id)}
                                className="btn-custom btn-custom-outline-black p-2"
                            >
                                Adicionar
                            </button>

                        </li>
                    );
                })}

                {!loading && users.length === 0 && (
                    <p className="text-muted">Nenhum usuário disponível</p>
                )}

            </ul>
        </div>
    );
}