import { useEffect, useRef, useState } from "react";
import { useForm } from "../../hooks/useForm";
import { getOccurrence, updateOccurrence, type OccurrenceProps } from "../../services/occurrenceServices";
import { Modal } from "react-bootstrap";
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
    const formRef = useRef<HTMLFormElement | null>(null);

    const emptyObj = {
        id: "",
        name: "",
        description: "",
        criticity: "" ,
        prototypeId: "",
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
                    name: data.name || "",
                    description: data.description || "",
                    criticity: (data.criticity as "A" | "B" | "C") || "A",
                    prototypeId: data.prototypeId || "",
                });
            }

            setLoading(false);
        };

        load();
    }, [occurrenceId, show]);

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
        <Modal show={show} onHide={onClose} centered size="lg">
            <Modal.Header closeButton className="border-0 mt-3 mx-3" />

            <Modal.Body className="px-5 pb-4">

                {loading ? (
                    <p>Carregando...</p>
                ) : (
                    <form ref={formRef} onSubmit={handleSave} noValidate>

                        <div>
                            <p className='fs-5 mb-0 text-custom-red'>Editar</p>
                            <h1 className='text-custom-black fw-bold mb-3'>
                                Ocorrência
                            </h1>

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

                        </div>

                        <div className="d-flex justify-content-end mt-4">

                            <button className="btn-custom btn-custom-success px-4">
                                Salvar
                            </button>
                        </div>

                    </form>
                )}

            </Modal.Body>
        </Modal>
    );
}