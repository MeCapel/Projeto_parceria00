import { PlusLg } from "react-bootstrap-icons";
import { Modal } from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import AddNewMember from "./AddNewMember";
import { searchUsersNotInProject } from "../../services/projectServices";
import { type UserProps } from "../../services/authServices";

interface Props {
    projectId: string;
}

export default function NewMemberModal({ projectId }: Props) {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [email, setEmail] = useState("");
    const [usuarios, setUsuarios] = useState<UserProps[]>([]);

    const formRef = useRef<HTMLFormElement | null>(null);

    const openModal = () => setIsOpen(true);

    const closeModal = () => {
        if (formRef.current) formRef.current.classList.remove("was-validated");
        setIsOpen(false);
        setEmail("");        // limpa campo
        setUsuarios([]);     // limpa lista
    };

    useEffect(() => {

    const unsubscribe = searchUsersNotInProject(
        projectId,
        email, // pode estar vazio
        setUsuarios
    );

    return () => unsubscribe && unsubscribe();

}, [email, projectId]);

    const handleNewProjectMember = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = formRef.current;
        if (!form) return;

        form.classList.add("was-validated");

        if (!form.checkValidity()) {
            const firstInvalid = form.querySelector<HTMLElement>(":invalid");
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        closeModal();
    };

    return (
        <>
            <button className="btn-custom btn-custom-secondary" onClick={openModal}>
                <p className="mb-0 fs-5 text-custom-white d-flex gap-3 align-items-center">
                    Adicionar membro
                    <PlusLg size={30} />
                </p>
            </button>

            <Modal show={isOpen} onHide={closeModal} centered size="lg">
                <Modal.Header closeButton className="border-0 mt-3 mx-3" />

                <Modal.Body>
                    <form
                        ref={formRef}
                        className="w-100 px-5"
                        onSubmit={handleNewProjectMember}
                        noValidate
                    >
                        <p className="fs-5 mb-0 text-custom-red">Adicionar</p>
                        <h1 className="text-custom-black fw-bold mb-3">
                            Novo membro
                        </h1>

                        {/* INPUT DE BUSCA */}
                        <input
                            type="text"
                            placeholder="Digite o email do usuário"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control mb-3"
                        />

                        {/* LISTA BONITA (AGORA FILTRADA) */}
                        <AddNewMember 
                            projectId={projectId}
                            usuarios={usuarios}
                        />

                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
}