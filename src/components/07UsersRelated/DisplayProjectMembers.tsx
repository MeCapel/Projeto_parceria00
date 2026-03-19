import { useEffect, useState } from "react"
import { changeMemberRole, dropMember, getProjectMembers, getUserRole } from "../../services/projectServices"
import UserCard from "./UserCard"
import { getCurrentUser } from "../../services/authServices"
import { People } from "react-bootstrap-icons"
import { Modal } from "react-bootstrap"

interface FullMember {
    id: string,
    username: string,
    email: string,
    image?: string,
    role: "admin" | "membro" | "owner",
}

interface Props {
    projectId: string
}

export default function DisplayProjectMembersModal({ projectId }: Props) {

    const [isOpen, setIsOpen] = useState(false)
    const [members, setMembers] = useState<FullMember[]>([])
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)

    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)

    // 🔐 pega user atual
    useEffect(() => {
        const user = getCurrentUser()
        setCurrentUserId(user?.uid || null)
    }, [])

    // 🔐 pega role do user atual no projeto
    useEffect(() => {
        if (!projectId) return

        getUserRole(projectId).then(setCurrentUserRole)
    }, [projectId])

    // 📡 carrega membros (só quando abre)
    useEffect(() => {
        if (!isOpen) return

        const unsubscribe = getProjectMembers(projectId, (members) => {

            const fullMembers = members.map(member => ({
                id: member.userId,
                username: member.username || "Sem nome",
                email: member.email || "",
                image: member.image || undefined,
                role: member.role
            }))

            setMembers(fullMembers)
        })

        return () => unsubscribe()
    }, [projectId, isOpen])

    const canManage =
        currentUserRole === "admin" || currentUserRole === "owner"

    // 🧨 remover membro
    const handleRemove = async (userId: string) => {
        if (!canManage) return
        if (userId === currentUserId) return

        await dropMember(projectId, userId)
    }

    // 🔄 mudar role
    const handleChangeRole = async (userId: string, role: string) => {
        if (!canManage) return
        if (userId === currentUserId) return

        await changeMemberRole(projectId, userId, role as "admin" | "editor" | "viewer")
    }

    return (
        <>
            {/* BOTÃO */}
            <button
                className="btn-custom btn-custom-outline-primary px-4"
                onClick={openModal}
            >
                <div className="mb-0 fs-6 d-flex gap-2 align-items-center fw-bold">
                    Gerenciar membros <People size={20} />
                </div>
            </button>

            {/* MODAL */}
            <Modal
                show={isOpen}
                onHide={closeModal}
                centered
                size="lg"
                className="p-0"
            >
                <Modal.Header
                    closeButton
                    className="border-0 mt-3 mx-3"
                />

                <Modal.Body>

                    <div className="px-5 pb-4">

                        {/* HEADER */}
                        <div>
                            <p className="fs-5 mb-0 text-custom-red">
                                Projeto
                            </p>
                            <h1 className="text-custom-black fw-bold mb-3">
                                Membros
                            </h1>
                        </div>

                        {/* LISTA */}
                        <div className="d-flex flex-column gap-3 mt-4">

                            {members.length === 0 && (
                                <p className="text-muted">
                                    Nenhum membro encontrado
                                </p>
                            )}

                            {members.map(member => {

                                const isSelf = member.id === currentUserId
                                const isOwner = member.role === "owner"

                                return (
                                    <UserCard
                                        key={member.id}
                                        user={member}
                                        onDelete={
                                            canManage && !isSelf && !isOwner
                                                ? handleRemove
                                                : undefined
                                        }
                                        subtitle={
                                            isSelf ? "Você" : undefined
                                        }
                                    >
                                        <div className="d-flex justify-content-between align-items-center">

                                            <p className="mb-0 fw-bold">
                                                Função
                                            </p>

                                            <select
                                                value={member.role}
                                                disabled={
                                                    !canManage ||
                                                    isSelf ||
                                                    isOwner
                                                }
                                                onChange={(e) =>
                                                    handleChangeRole(
                                                        member.id,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="viewer">Visualizador</option>
                                                <option value="editor">Editor</option>
                                                <option value="admin">Administrador</option>
                                                <option value="owner">Dono</option>
                                            </select>

                                        </div>
                                    </UserCard>
                                )
                            })}

                        </div>

                    </div>

                </Modal.Body>
            </Modal>
        </>
    )
}