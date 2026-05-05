import { useEffect, useState } from "react"
import {
    getProjectMembers,
    removeProjectMember
} from "../../services/projectMembers.service"
import UserCard from "./UserCard"
import { People, XCircleFill } from "react-bootstrap-icons"
import { Modal } from "react-bootstrap"
import { getCurrentUser, type UserProps } from "../../services/auth.service"

// ===== TYPES =====

interface Props {
    projectId: string
}

export default function DisplayProjectMembersModal({ projectId }: Props) {

    const [isOpen, setIsOpen] = useState(false)
    const [members, setMembers] = useState<UserProps[]>([])
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)

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

    // Carrega membros quando abre
    useEffect(() => {
        if (!isOpen || !projectId) return

        const fetchMembers = async () => {
            const data = await getProjectMembers(projectId)

            const formatted = data.map((member: any) => ({
                id: member.userId,
                username: member.username || "Sem nome",
                email: member.email || "",
                profileImage: member.profileImage || undefined,
                status: member.status || "Ativo",
                role: member.role || "Técnico de campo"
            }))

            setMembers(formatted)
        }

        fetchMembers()
    }, [projectId, isOpen])

    // Remover membro
    const handleRemove = async (userId: string) => {
        if (userId === currentUserId) return

        await removeProjectMember(projectId, userId)

        // Atualiza lista após remoção
        setMembers(prev => prev.filter(m => m.id !== userId))
    }

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
                                    Membros
                                </h2>
                            </div>

                            <XCircleFill
                                size={25}
                                style={{ cursor: "pointer" }}
                                onClick={closeModal}
                            />
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

                                return (
                                    <UserCard
                                        key={member.id}
                                        user={member}
                                        onDelete={
                                            !isSelf ? handleRemove : undefined
                                        }
                                        subtitle={
                                            isSelf ? "Você" : undefined
                                        }
                                    />
                                )
                            })}

                        </div>

                    </div>

                </Modal.Body>
            </Modal>
        </>
    )
}