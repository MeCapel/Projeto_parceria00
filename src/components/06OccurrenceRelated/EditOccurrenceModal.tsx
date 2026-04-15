import { useEffect, useRef, useState } from "react";
import { useForm } from "../../hooks/useForm";
import { getOccurrence, updateOccurrence, type OccurrenceProps } from "../../services/occurrenceServices";
import { Modal } from "react-bootstrap";
import { Paperclip, XCircleFill } from "react-bootstrap-icons";
import FormInput from "../forms/FormInput";
import FormTextarea from "../forms/FormTextarea";
import FormRadioGroup from "../forms/FormRadioGroup";

interface EditOccurrenceModalProps {
    occurrenceId: string | null;
    show: boolean;
    onClose: () => void;
    onUpdate: (updated: OccurrenceProps) => void; // NOVO
}

export default function EditOccurrenceModal({ occurrenceId, show, onClose, onUpdate }: EditOccurrenceModalProps)
{
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const emptyObj = {
        id: "",
        name: "",
        description: "",
        criticity: "" ,
        prototypeId: "",
        createdAt: "",
        image: ""
    };

    const { values, setValues, handleChange, reset } = useForm(emptyObj);

    useEffect(() => {
        if (!show) {
            reset();
        }
    }, [show]);

    // carregar dados da ocorrência
    useEffect(() => {
        if (!occurrenceId || !show) return;

        const load = async () => {
            setLoading(true);

            const data = await getOccurrence(occurrenceId);

            if (data) {
                setValues({
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    criticity: data.criticity as "A" | "B" | "C",
                    prototypeId: data.prototypeId,
                    createdAt: "",
                    image: data.image || ""
                });
                setSelectedImage(data.image || null);
            }

            setLoading(false);
        };

        load();
    }, [occurrenceId, show]);

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
                    
                    // Comprime para JPEG com qualidade 0.7 (70%) para garantir que fique abaixo de 1MB
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    setSelectedImage(compressedBase64);
                    setValues({ ...values, image: compressedBase64 });
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = formRef.current;
        if (!form) return;

        form.classList.add("was-validated");

        if (!form.checkValidity()) return;

        try {
            await updateOccurrence(values); // salva no Firebase
            onUpdate(values);               // atualiza local
            onClose();
            reset();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Body className="p-4 m-3">

                {loading ? (
                    <p>Carregando...</p>
                ) : (
                    <form ref={formRef} onSubmit={handleSave} noValidate>

                        <div className="mb-4">
                            <p className='fs-6 mb-0 text-custom-red'>Editar</p>
                            <h2 className='text-custom-black fw-bold mb-1 h4'>Ocorrência</h2>
                        </div>

                        <div className="d-flex flex-column gap-3">

                            <FormInput 
                                label="Nome da ocorrência"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                            />

                            <FormTextarea 
                                label="Descrição"
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

                            {/* --- Image Edit --- */}
                            <div className="d-flex flex-column gap-2">
                                <label className="text-custom-black fw-semibold small">Imagem da Ocorrência</label>
                                <div className="d-flex align-items-center gap-3">
                                    <button 
                                        type="button" 
                                        className="btn-custom btn-custom-outline-secondary d-flex align-items-center gap-2"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Paperclip size={18} />
                                        Alterar Foto
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

                        <div className="d-flex justify-content-between mt-4">

                            <button className="btn-custom btn-custom-outline-primary px-4" type="button" onClick={onClose}>
                                Cancelar
                            </button>
                            <button className="btn-custom btn-custom-success px-4" type="submit">
                                Salvar
                            </button>
                        </div>

                    </form>
                )}

            </Modal.Body>
        </Modal>
    );
}
