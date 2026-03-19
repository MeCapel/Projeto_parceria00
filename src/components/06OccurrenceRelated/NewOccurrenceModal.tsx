// ===== GERAL IMPORTS =====

import { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { PlusLg, Paperclip, XCircleFill } from "react-bootstrap-icons";
import { useForm } from "../../hooks/useForm";
import { createOccurrence } from "../../services/occurrenceServices";
import FormInput from "../forms/FormInput";
import FormTextarea from "../forms/FormTextarea";
import FormRadioGroup from "../forms/FormRadioGroup";
import { toast } from "react-toastify";

interface NewOccorenceModalProps {
    prototypeId: string
}

// ===== MAIN COMPONENT =====
export default function NewOccurenceModal({ prototypeId } : NewOccorenceModalProps)
{
    const [ show, setShow ] = useState<boolean>(false);
    const [ isSaving, setIsSaving ] = useState<boolean>(false);
    const [ selectedImage, setSelectedImage ] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const createEmptyOccurrence = () => ({
        id: "",
        name: "",
        description: "",
        criticity: "",
        prototypeId: prototypeId,
        image: ""
    });

    const emptyObj = createEmptyOccurrence();

    const { values, handleChange, reset, setValues } = useForm(emptyObj);

    const openModal = () => setShow(true);
    const closeModal = () => {
        if (formRef.current) formRef.current.classList.remove("was-validated");
        setShow(false);
        setSelectedImage(null);
        reset();
        setIsSaving(false);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.src = reader.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 600;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    
                    // Comprime para JPEG com qualidade 0.7 (70%)
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    setSelectedImage(compressedBase64);
                    setValues({ ...values, image: compressedBase64 });
                };
            };
            reader.readAsDataURL(file);
        }
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
            toast.error("Id do protótipo inválido!");
            return;
        }

        setIsSaving(true);
        
        try {
            const result = await createOccurrence(values);
                
            if (result === "duplicate") {
                toast.warning("Já existe uma ocorrência com este nome!");
                setIsSaving(false);
                return;
            }

            if (!result)
            {
                toast.error("Erro ao criar ocorrência!");
                setIsSaving(false);
                return;
            }

            toast.success("Ocorrência criada com sucesso!");
            closeModal();
        } catch (error) {
            console.error("Erro na criação:", error);
            toast.error("Ocorreu um erro inesperado.");
            setIsSaving(false);
        }
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

                            {/* --- Image Upload --- */}
                            <div className="d-flex flex-column gap-2">
                                <label className="text-custom-black fw-semibold small">Anexar Imagem</label>
                                <div className="d-flex align-items-center gap-3">
                                    <button 
                                        type="button" 
                                        className="btn-custom btn-custom-outline-secondary d-flex align-items-center gap-2"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isSaving}
                                    >
                                        <Paperclip size={18} />
                                        Selecionar Foto
                                    </button>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="d-none" 
                                        accept="image/*" 
                                        onChange={handleImageChange}
                                    />
                                    {selectedImage && (
                                        <div className="position-relative">
                                            <img 
                                                src={selectedImage} 
                                                alt="Preview" 
                                                className="rounded border" 
                                                style={{ width: "60px", height: "60px", objectFit: "cover" }} 
                                            />
                                            <XCircleFill 
                                                className="position-absolute text-danger bg-white rounded-circle" 
                                                style={{ top: "-8px", right: "-8px", cursor: "pointer" }}
                                                onClick={() => {
                                                    setSelectedImage(null);
                                                    setValues({ ...values, image: "" });
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* --- 🔵 Button div --- */}
                        <div className="d-flex align-items-center justify-content-end">
                            <button 
                                type='submit'
                                className='btn-custom btn-custom-success px-4' 
                                disabled={isSaving}
                            >
                                {isSaving ? "Salvando..." : "Adicionar"}
                            </button>
                        </div>
                    </form>

                </Modal.Body>
            </Modal>
        </>
    )
}
