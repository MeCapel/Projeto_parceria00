import { PlusLg } from "react-bootstrap-icons"
import { Modal } from "react-bootstrap"
import { useRef, useState } from "react"
import AddNewMember from "./AddNewMember";

interface Props {
    projectId: string;
}

export default function NewMemberModal({ projectId }: Props)
{
    const [isOpen, setIsOpen] = useState(false);
    const formRef = useRef<HTMLFormElement | null>(null);

    const openModal = () => setIsOpen(true);

    const closeModal = () => {
        if (formRef.current) formRef.current.classList.remove("was-validated");
        setIsOpen(false);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const form = formRef.current;
        if (!form) return;

        form.classList.add("was-validated");

        if (!form.checkValidity()) {
            const firstInvalid = form.querySelector<HTMLElement>(":invalid");
            firstInvalid?.focus();
            return;
        }

        closeModal();
    }

    return (
        <>
            <button className="btn-custom btn-custom-outline-black px-4 shadow-sm" onClick={openModal}>
                <div className="mb-0 fs-6 d-flex gap-2 align-items-center fw-bold">
                    <PlusLg size={20} />
                    Adicionar membro
                </div>
            </button>

            <Modal show={isOpen} onHide={closeModal} centered dialogClassName="custom-modal">
                <Modal.Header closeButton className="border-0 mt-3 mx-3" />
                <Modal.Body>
                    <form ref={formRef} className="w-100 px-3 px-lg-5" onSubmit={handleSubmit} noValidate>

                        <div className="pb-3">
                            <p className="fs-5 mb-0 text-custom-red">Adicionar</p>
                            <h1 className="text-custom-black fw-bold fs-3">Novo membro</h1>
                        </div>

                        <AddNewMember projectId={projectId} />

                    </form>
                </Modal.Body>
            </Modal>
        </>
    )
}