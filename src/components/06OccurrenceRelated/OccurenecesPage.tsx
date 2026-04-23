import type { Timestamp } from "firebase/firestore"
import usePrototypeOccurrences from "../../hooks/usePrototypeOccurrences"
import { useRef, useState } from "react"
import { useForm } from "../../hooks/useForm"
import { useImageUpload } from "../../hooks/useImageUpload"
import CrudHeader from "../Others/CrudHeader"
import { CrudTable } from "../Others/CrudTable"
import { formatDateBR } from "../../utils/date"
import CrudModal from "../Others/CrudModal"
import FormInput from "../forms/FormInput"
import FormTextarea from "../forms/FormTextarea"
import FormRadioGroup from "../forms/FormRadioGroup"
import { Paperclip, Trash3Fill, XCircleFill } from "react-bootstrap-icons"
import { Modal } from "react-bootstrap"
import FormDatePicker from "../forms/FormDatePicker"

interface OccurrenceForm {
    name: string
    description: string
    criticity: string
    image?: string
    prototypeId: string
    status: "Pendente" | "Em andamento" | "Concluído" ,
    dueOn: Date | null,
    createdAt: string | Timestamp
}

interface Props {
    prototypeId: string
}

export default function OccurrencesPage({ prototypeId }: Props)
{
    const { protoOccurrences, createOccurrence, updateOccurrence, deleteOccurrence } = usePrototypeOccurrences(prototypeId);

    const [showModal, setShowModal] = useState(false);
    const [editingOccurrenceId, setEditingOccurrence] = useState<string | null>(null);
    const [occurrenceToDelete, setOccurrenceToDelete] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const formRef = useRef<HTMLFormElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { values, setValues, handleChange, reset } = useForm<OccurrenceForm>({
        name: "",
        description: "",
        criticity: "",
        image: "",
        prototypeId,
        status: "Pendente",
        dueOn: null,
        createdAt: new Date().toISOString()
    });

    const {
        image: selectedImage,
        setImage,
        handleImageChange,
        clearImage
    } = useImageUpload();

    // ================= IMAGE =================
    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const base64 = await handleImageChange(file);

        setValues(prev => ({
            ...prev,
            image: base64
        }));
    };

    // ================= NEW =================
    const handleNew = () => {
        reset();

        setValues(prev => ({
            ...prev,
            prototypeId,
            createdAt: new Date().toISOString()
        }));

        clearImage();
        setEditingOccurrence(null);
        setShowModal(true);
    };

    // ================= EDIT =================
    const handleEdit = (id: string) => {
        const occurrence = protoOccurrences.find(o => o.id === id);
        if (!occurrence) return;

        setEditingOccurrence(id);
        setShowModal(true);

        setImage(occurrence.image || null);

        setValues(prev => ({
            ...prev,
            dueOn: occurrence.dueOn ? occurrence.dueOn.toDate() : null,
        }));
    };

    // ================= SAVE =================
    const saveOccurrence = async () => {
        if (editingOccurrenceId) {
            return updateOccurrence({
                id: editingOccurrenceId,
                ...values
            });
        }

        return createOccurrence(values);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = formRef.current;
        if (!form) return;

        form.classList.add("was-validated");

        if (!form.checkValidity()) {
            const firstInvalid = form.querySelector<HTMLElement>(":invalid");
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        try {
            setIsSaving(true);
            await saveOccurrence();
            setShowModal(false);
        } finally {
            setIsSaving(false);
        }
    };

    // ================= DELETE =================
    const handleDelete = (id: string) => {
        setOccurrenceToDelete(id);
    };

    const confirmDelete = async () => {
        if (!occurrenceToDelete) return;

        await deleteOccurrence(occurrenceToDelete);
        setOccurrenceToDelete(null);
    };

    // ================= RENDER =================
    return (
        <div>
            <CrudHeader
                title="Ocorrências do protótipo"
                subtitle="Gerencie as ocorrências"
                onNew={handleNew}
            />

            <CrudTable
                headers={["Nome", "Descrição", "Criticidade", "Status", "Data", "Data de vencimento"]}

                data={protoOccurrences}

                getId={(o) => o.id!}

                renderRow={(o) => (
                    <>
                        <td className="px-4 text-secondary">{o.name}</td>
                        <td className="px-4 text-secondary">{o.description}</td>

                        <td className="px-4 text-secondary">
                            <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-3">
                                {o.criticity}
                            </span>
                        </td>

                        <td className="px-4 text-secondary">{o.status}</td>

                        <td className="px-4 text-secondary">
                            {formatDateBR(o.createdAt!)}
                        </td>

                        <td className="px-4 text-secondary">
                            {formatDateBR(o.dueOn!)}
                        </td>
                    </>
                )}

                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* ================= MODAL ================= */}
            <CrudModal
                show={showModal}
                title={editingOccurrenceId ? "Editar ocorrência" : "Nova ocorrência"}
                onClose={() => setShowModal(false)}
                edit={!!editingOccurrenceId}
            >
                <form
                    ref={formRef}
                    onSubmit={handleSave}
                    noValidate
                    className="d-flex flex-column gap-3"
                >
                    <div className="d-flex flex-column my-4 gap-3">

                        <FormInput
                            label="Nome da ocorrência"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            required
                        />

                        <FormTextarea
                            label="Descrição da ocorrência"
                            name="description"
                            value={values.description}
                            onChange={handleChange}
                            required
                        />

                        <FormRadioGroup
                            label="Criticidade"
                            name="criticity"
                            value={values.criticity}
                            onChange={handleChange}
                            options={["A", "B", "C"]}
                            required
                        />

                        <FormRadioGroup
                            label="Status"
                            name="status"
                            value={values.status}
                            onChange={handleChange}
                            options={["Pendente", "Em andamento", "Concluído"]}
                            required
                        />

                        <FormDatePicker
                            label="Data limite"
                            value={values.dueOn}
                            onChange={(date) =>
                                setValues(prev => ({
                                    ...prev,
                                    dueOn: date
                                }))
                            }
                        />

                        {/* IMAGE */}
                        <div className="d-flex flex-column gap-2">
                            <label className="text-custom-black fw-semibold small">
                                Anexar Imagem
                            </label>

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
                                    onChange={onFileChange}
                                />

                                {selectedImage && (
                                    <div className="position-relative">
                                        <img
                                            src={selectedImage}
                                            alt="Preview"
                                            className="rounded border"
                                            style={{
                                                width: "60px",
                                                height: "60px",
                                                objectFit: "cover"
                                            }}
                                        />

                                        <XCircleFill
                                            className="position-absolute text-danger bg-white rounded-circle"
                                            style={{
                                                top: "-8px",
                                                right: "-8px",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => {
                                                clearImage();
                                                setValues(prev => ({
                                                    ...prev,
                                                    image: ""
                                                }));
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between mt-4">
                        <button
                            type="button"
                            className="btn-custom btn-custom-outline-primary px-4"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-custom btn-custom-success px-4"
                            disabled={isSaving}
                        >
                            {isSaving ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                </form>
            </CrudModal>

            {/* ================= DELETE MODAL ================= */}
            <Modal
                show={!!occurrenceToDelete}
                onHide={() => setOccurrenceToDelete(null)}
                centered
            >
                <Modal.Body className="text-center p-5">
                    <Trash3Fill size={50} className="text-danger mb-4" />

                    <h4 className="fw-bold mb-3">Excluir ocorrência?</h4>

                    <p className="text-muted mb-5">
                        Esta ação não pode ser desfeita.
                    </p>

                    <div className="d-flex gap-3 justify-content-center">
                        <button
                            className="btn-custom btn-custom-outline-secondary px-4"
                            onClick={() => setOccurrenceToDelete(null)}
                        >
                            Cancelar
                        </button>

                        <button
                            className="btn-custom btn-custom-outline-primary px-4"
                            onClick={confirmDelete}
                        >
                            Excluir
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}