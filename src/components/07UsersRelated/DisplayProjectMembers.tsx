import { useEffect, useState } from "react"
import { changeMemberRole, dropMember, getProjectMembers, getUserRole } from "../../services/projectServices"
import UserCard from "./UserCard"
import { getCurrentUser } from "../../services/authServices"
import { People, XCircleFill } from "react-bootstrap-icons"
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

    // pega user atual
    useEffect(() => {
        const user = getCurrentUser()
        setCurrentUserId(user?.uid || null)
    }, [])

    // pega role do user atual no projeto
    useEffect(() => {
        if (!projectId) return

        getUserRole(projectId).then(setCurrentUserRole)
    }, [projectId])

    // carrega membros (só quando abre)
    useEffect(() => {
        if (!isOpen) return

        const unsubscribe = getProjectMembers(projectId, (members) => {

            const fullMembers = members.map(member => ({
                id: member.userId,
                username: member.username || "Sem nome",
                email: member.email || "",
                profileImage: member.image || undefined, // Nome correto esperado pelo UserCard
                role: member.role
            }))

            setMembers(fullMembers as any)
        })

        return () => unsubscribe()
    }, [projectId, isOpen])

    const canManage =
        currentUserRole === "admin" || currentUserRole === "owner"

    // remover membro
    const handleRemove = async (userId: string) => {
        if (!canManage) return
        if (userId === currentUserId) return

        await dropMember(projectId, userId)
    }

    // mudar role
    const handleChangeRole = async (userId: string, role: string) => {
        if (!canManage) return
        if (userId === currentUserId) return

        await changeMemberRole(projectId, userId, role as "admin" | "editor" | "viewer")
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
                            <div className="">
                                <p className="fs-6 mb-0 text-custom-red">
                                    Projeto
                                </p>
                                <h2 className="text-custom-black fw-bold mb-1 h4">
                                    Membros
                                </h2>
                            </div>

                            <div className="">
                                <XCircleFill 
                                    size={25} 
                                    style={{ cursor: "pointer" }} 
                                    onClick={closeModal} 
                                />
                            </div>
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

                                            <div className="col-12 col-md-4 w-100">
                                                <div className="form-floating">
                                                    <select
                                                        name="role"
                                                        className="form-select"
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
                                                        {/* <option value="">Escolha o papél</option> */}
                                                        <option value="membro">Membro</option>
                                                        <option value="admin">Administrador</option>
                                                        <option value="owner">Proprietário</option>
                                                    </select>
                                                    <label>Função</label>
                                                </div>
                                        </div>

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