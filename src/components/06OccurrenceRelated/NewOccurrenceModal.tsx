// ===== GERAL IMPORTS =====

import { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { PlusLg } from "react-bootstrap-icons";
import { useForm } from "../../hooks/useForm";
import { createOccurrence } from "../../services/occurrenceServices";
import FormInput from "../forms/FormInput";
import FormTextarea from "../forms/FormTextarea";
import FormRadioGroup from "../forms/FormRadioGroup";

interface NewOccorenceModalProps {
    prototypeId: string
}

// ===== MAIN COMPONENT =====
export default function NewOccurenceModal({ prototypeId } : NewOccorenceModalProps)
{
    const [ show, setShow ] = useState<boolean>(false);
    const formRef = useRef<HTMLFormElement | null>(null);

    const createEmptyOccurrence = () => ({
        id: "",
        name: "",
        description: "",
        criticity: "",
        prototypeId: prototypeId,
    });

    const emptyObj = createEmptyOccurrence();

    const { values, handleChange, reset } = useForm(emptyObj);

    const openModal = () => setShow(true);
    const closeModal = () => {
        if (formRef.current) formRef.current.classList.remove("was-validated");
        setShow(false);
        reset();
    };

    const handleNewOccurence = async ( e: React.FormEvent ) => {
        e.preventDefault();

        const form = formRef.current;
        if (!form) return;

        form.classList.add("was-validated");

        if (!form.checkValidity())
        {
            const firstInvalid = form.querySelector<HTMLElement>(":invalid");
            if (firstInvalid) firstInvalid.focus();
            return;
        }
        
        if (!values.prototypeId)
        {
            console.error("Id do protótipo inválido!");
            return null;
        }
        
        const newOccurenceId = await createOccurrence(values);
            
        if (!newOccurenceId)
        {
            console.error("Erro ao criar ocorrência para o protótipo!");
            return null;
        }

        closeModal();
    }

    return(
        <>
            <button className='btn-custom btn-custom-secondary' onClick={openModal} type="button">
                <PlusLg size={18} />
                Nova ocorrência
            </button>

            <Modal show={show} onHide={closeModal} centered>
                <Modal.Body className="p-4">

                    {/* --- 🔴 Inner content div --- */}
                    <form ref={formRef} className="w-100" onSubmit={handleNewOccurence} noValidate>

                        {/* --- Title div --- */}
                        <div className="mb-4">
                            <p className='fs-6 mb-0 text-custom-red'>Adicionar</p>
                            <h2 className='text-custom-black fw-bold mb-1 h4'>Nova ocorrência</h2>
                        </div>

                        {/* --- 🔵 Inputs div --- */}
                        <div className="d-flex flex-column my-4 gap-3">
                            <FormInput 
                                label="Nome da ocorrência"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                            />

                            <FormTextarea 
                                label="Descrição da ocorrência"
                                name="description"
                                value={values.description}
                                onChange={handleChange}
                            />

                            <FormRadioGroup 
                                label="Criticidade"
                                name="criticity"
                                value={values.criticity}
                                onChange={handleChange}
                                options={["A", "B", "C"]}
                            />

                        </div>

                        {/* --- 🔵 Button div --- */}
                        <div className="d-flex align-items-center justify-content-end">
                            <button 
                                type='submit'
                                className='btn-custom btn-custom-success rounded-1 px-4' 
                            >Adicionar</button>
                        </div>
                    </form>

                </Modal.Body>
            </Modal>
        </>
    )
}