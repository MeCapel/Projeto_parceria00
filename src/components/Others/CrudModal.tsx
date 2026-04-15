import { type ReactNode } from "react";
import { Modal } from "react-bootstrap";

interface Props {
    show: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
    edit?: boolean;
}

export default function CrudModal({
    show,
    title,
    onClose,
    children,
    edit
}: Props) {
    return (
        <Modal show={show} onHide={onClose} centered size="lg">
            
            <Modal.Header closeButton className="border-0 mt-3 mx-3" />

            <Modal.Body className="px-5 pb-5 pt-0">
                
                <div className="mb-4">
                    <p className='fs-5 mb-0 text-custom-red'>
                        {edit ? "Editar" : "Adicionar"}
                    </p>
                    <h1 className='text-custom-black fw-bold mb-1'>
                        {title}
                    </h1>
                </div>

                <div className="d-flex flex-column gap-3">
                    {children}
                </div>

            </Modal.Body>
        </Modal>
    );
}