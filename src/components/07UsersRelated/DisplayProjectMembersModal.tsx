import { useEffect, useState } from "react"
import { People, XCircleFill } from "react-bootstrap-icons"
import { Modal } from "react-bootstrap"
import { getCurrentUser } from "../../services/auth.service"
import AddNewMember from "../02ProjectRelated/AddNewMember"
import ProjectMembersCard from "../02ProjectRelated/ProjectMembersCard"
import { useProjectMembers } from "../../hooks/useProjectMembers"

// ===== TYPES =====

interface Props {
    projectId: string
}

export default function DisplayProjectMembersModal({ projectId }: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<"members" | "add">("members")
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)

    const {
        members,
        removeProjectMember
    } = useProjectMembers(projectId);
    
    const canManage = currentUserRole === "admin";

    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)

    // Pega usuário atual
    useEffect(() => {
        const fetchUser = async () => {
            const user = await getCurrentUser()
            setCurrentUserId(user?.id || null)
        }

        fetchUser()
    }, [])

    // pega role do user atual
    useEffect(() => {
        const fetchUserData = async () => {
            try
            {
                const data = await getCurrentUser();
                setCurrentUserRole(data.role);
            }
            catch (error)
            {
                console.error("Erro ao buscar dados do usuário atual: ", error);
            }
        };

        fetchUserData();
    }, [currentUserRole]);

    // Remover membro
    const handleRemove = async (userId: string) => {
        if (userId === currentUserId) return;

        try 
        {
            await removeProjectMember(userId);
        } 
        catch (error) 
        {
            console.error("Erro ao remover membro:", error);
        }
    };

    return (
        <>
            {/* BOTÃO */}
            <button
                className="btn-custom btn-custom-outline-black px-4"
                onClick={openModal}
            >
                <div className="mb-0 fs-6 d-flex gap-2 align-items-center fw-bold">
                    <People size={20} />
                    Gerenciar membros
                </div>
            </button>

            {/* MODAL */}
            <Modal
                show={isOpen}
                onHide={closeModal}
                centered
                dialogClassName="custom-modal-custom"
            >
                <Modal.Body className="p-5 overflow-auto" style={{ maxHeight: "80vh" }}>

                    <div className="w-100">

                        {/* HEADER */}
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <p className="fs-6 mb-0 text-custom-red">
                                    Projeto
                                </p>
                                <h2 className="text-custom-black fw-bold mb-1 h4">
                                    Gerenciar membros 
                                </h2>
                            </div>

                            <XCircleFill 
                                size={25} 
                                style={{ cursor: "pointer" }} 
                                onClick={closeModal} 
                            />
                        </div>

                        {/* TABS */}
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

                        {/* CONTEÚDO */}
                        <div className="mt-4">

                            {/* LISTA */}
                            {activeTab === "members" && (
                                <div className="d-flex flex-column gap-3">

                                    {members.length === 0 && (
                                        <p className="text-muted">
                                            Nenhum membro encontrado
                                        </p>
                                    )}

                                    {members.map((member: any) => {

                                        const isSelf = member.userId === currentUserId

                                        return (
                                            <div key={member.userId}>
                                                <ProjectMembersCard
                                                    key={member.id}
                                                    user={{
                                                        id: member.userId,
                                                        username: member.username,
                                                        email: member.email,
                                                        role: member.role,
                                                        profileImage: member.profileImage,
                                                        status: member.status
                                                    }}
                                                    onDelete={
                                                        canManage && !isSelf
                                                        ? handleRemove
                                                        : undefined
                                                    }
                                                    subtitle={
                                                        isSelf ? "Você" : undefined
                                                    }
                                                >
                                                </ProjectMembersCard>
                                            </div>
                                        )
                                    })}

                                </div>
                            )}

                            {/* ADICIONAR MEMBRO */}
                            {activeTab === "add" && canManage && (
                                <AddNewMember projectId={projectId} />
                            )}

                        </div>

                    </div>

                </Modal.Body>
            </Modal>
        </>
    )
}