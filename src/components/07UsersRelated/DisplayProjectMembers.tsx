import { useEffect, useState } from "react"
import { changeMemberRole, dropMember, getProjectMembers, getUserRole } from "../../services/projectServices"
import UserCard from "./UserCard"
import { getCurrentUser } from "../../services/authServices"
import { People, XCircleFill } from "react-bootstrap-icons"
import { Modal } from "react-bootstrap"
import AddNewMember from "../02ProjectRelated/AddNewMember"

// Interface ajustada
interface FullMember {
    id: string;
    username: string;
    email: string;
    image?: string; 
    role: "admin" | "membro" | "owner";
}

interface Props {
    projectId: string
}

export default function DisplayProjectMembersModal({ projectId }: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<"members" | "add">("members")
    const [members, setMembers] = useState<FullMember[]>([])
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)

    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)

    useEffect(() => {
        const user = getCurrentUser()
        setCurrentUserId(user?.uid || null)
    }, [])

    useEffect(() => {
        if (!projectId) return
        getUserRole(projectId).then(setCurrentUserRole)
    }, [projectId])

    useEffect(() => {
        if (!isOpen) return

        const unsubscribe = getProjectMembers(projectId, (membersData) => {
        const fullMembers: FullMember[] = membersData.map(member => {
            // Referência tipada que aceita campos opcionais como profileImage
            const rawMember = member as Record<string, unknown>;
            
            return {
                id: member.userId,
                username: member.username || "Sem nome",
                email: member.email || "",
                // Agora acessamos com segurança
                image: member.image || (typeof rawMember.profileImage === 'string' ? rawMember.profileImage : undefined),
                role: member.role as "admin" | "membro" | "owner"
            };
        });

        setMembers(fullMembers);
    });

        return () => unsubscribe()
    }, [projectId, isOpen])

    const canManage = currentUserRole === "admin" || currentUserRole === "owner"

    const handleRemove = async (userId: string) => {
        if (!canManage || userId === currentUserId) return
        await dropMember(projectId, userId)
    }

    const handleChangeRole = async (userId: string, role: string) => {
        if (!canManage || userId === currentUserId) return
        await changeMemberRole(projectId, userId, role as "admin" | "editor" | "viewer")
    }

    return (
        <>
            <button className="btn-custom btn-custom-outline-black px-4" onClick={openModal}>
                <div className="mb-0 fs-6 d-flex gap-2 align-items-center fw-bold">
                    <People size={20} />
                    Gerenciar membros 
                </div>
            </button>

            <Modal show={isOpen} onHide={closeModal} centered dialogClassName="custom-modal-custom">
                <Modal.Body className="p-5 overflow-auto" style={{ maxHeight: "80vh" }}>
                    <div className="w-100">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <p className="fs-6 mb-0 text-custom-red">Projeto</p>
                                <h2 className="text-custom-black fw-bold mb-1 h4">Gerenciar membros</h2>
                            </div>
                            <XCircleFill size={25} style={{ cursor: "pointer" }} onClick={closeModal} />
                        </div>

                        <div className="d-flex gap-4 mt-3 border-bottom pb-2">
                            <span
                                style={{ cursor: "pointer" }}
                                className={activeTab === "members" ? "fw-bold text-danger" : "text-muted"}
                                onClick={() => setActiveTab("members")}
                            >
                                Ver membros
                            </span>
                            {canManage && (
                                <span
                                    style={{ cursor: "pointer" }}
                                    className={activeTab === "add" ? "fw-bold text-danger" : "text-muted"}
                                    onClick={() => setActiveTab("add")}
                                >
                                    Adicionar membros
                                </span>
                            )}
                        </div>

                        <div className="mt-4">
                            {activeTab === "members" && (
                                <div className="d-flex flex-column gap-3">
                                    {members.length === 0 && <p className="text-muted text-center py-4">Nenhum membro encontrado</p>}
                                    {members.map(member => {
                                        const isSelf = member.id === currentUserId
                                        const isOwner = member.role === "owner"

                                        return (
                                            /* AJUSTE VISUAL: Adicionado container com borda única arredondada */
                                            <div key={member.id} className="border rounded-3 p-3 bg-white shadow-sm">
                                                <UserCard
                                                    user={member}
                                                    onDelete={canManage && !isSelf && !isOwner ? handleRemove : undefined}
                                                    subtitle={isSelf ? "Você" : undefined}
                                                >
                                                    <div className="col-12 w-100 mt-2">
                                                        <div className="form-floating">
                                                            <select
                                                                name="role"
                                                                className="form-select"
                                                                value={member.role}
                                                                disabled={!canManage || isSelf || isOwner}
                                                                onChange={(e) => handleChangeRole(member.id, e.target.value)}
                                                            >
                                                                <option value="membro">Membro</option>
                                                                <option value="admin">Administrador</option>
                                                                <option value="owner">Proprietário</option>
                                                            </select>
                                                            <label>Função</label>
                                                        </div>
                                                    </div>
                                                </UserCard>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                            {activeTab === "add" && canManage && <AddNewMember projectId={projectId} />}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}