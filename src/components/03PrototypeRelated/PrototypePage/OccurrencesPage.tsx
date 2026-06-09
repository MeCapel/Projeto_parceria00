import { useRef, useState } from "react"
import { FiletypeDocx, Paperclip, Trash3Fill, XCircleFill } from "react-bootstrap-icons"
import { Modal } from "react-bootstrap"
import type { Timestamp } from "firebase/firestore"
import { useOccurrences } from "../../../hooks/useOccurrences"
import { useForm } from "../../../hooks/useForm"
import { useImageUpload } from "../../../hooks/useImageUpload"
import CrudHeader from "../../Others/CrudHeader"
import { CrudTable } from "../../Others/CrudTable"
import { formatDateBR } from "../../../utils/date"
import { showErrorToast } from "../../../utils/errorToast"
import { generateOccurrenceReport } from "../../../services/reports.service"
import CrudModal from "../../Others/CrudModal"
import FormInput from "../../forms/FormInput"
import FormTextarea from "../../forms/FormTextarea"
import FormRadioGroup from "../../forms/FormRadioGroup"
import FormDatePicker from "../../forms/FormDatePicker"

export interface OccurrenceForm {
    name: string;
    description: string;
    criticity: string;
    criticityLabel: string;
    image?: string;
    prototypeId: string;
    progress: "pendente" | "em andamento" | "concluido",
    progressLabel: string;
    actions: string;
    results: string;
    dueOn: Date | null,
    createdAt: Date | Timestamp;
}

interface Props {
    prototypeId: string
}

export default function OccurrencesPage({ prototypeId }: Props)
{
    const criticityArray = [    
        {label: "A", value: "a"},
        {label: "B", value: "b"},
        {label: "C", value: "c"},
    ];

    const statusArray = [    
        {label: "Pendente", value: "pendente"},
        {label: "Em andamento", value: "em andamento"},
        {label: "Concluído", value: "concluido"},
    ];

    const { occurrences, createOccurrence, updateOccurrence, deleteOccurrence } = useOccurrences({ prototypeId, status: "active" });

    const [showModal, setShowModal] = useState(false);
    const [editingOccurrenceId, setEditingOccurrence] = useState<string | null>(null);
    const [occurrenceToDelete, setOccurrenceToDelete] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [generatingId, setGeneratingId] = useState<string | null>(null);

    const formRef = useRef<HTMLFormElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { values, setValues, handleChange, reset } = useForm<Omit<OccurrenceForm, "createdAt">>({
        name: "",
        description: "",
        criticity: "",
        criticityLabel: "",
        image: "",
        prototypeId,
        progress: "pendente",
        progressLabel: "Pendente",
        actions: "",
        results: "",
        dueOn: null,
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

        setValues({
            name: "",
            description: "",
            criticity: "",
            criticityLabel: "",
            image: "",
            prototypeId,
            progress: "pendente",
            progressLabel: "Pendente",
            actions: "",
            results: "",
            dueOn: null,
        });

        clearImage();
        setEditingOccurrence(null);
        setShowModal(true);
    };

    // ================= EDIT =================
    const handleEdit = (id: string) => {
        const occurrence = occurrences.find(o => o.id === id);
        if (!occurrence) return;

        setEditingOccurrence(id);
        setShowModal(true);
        setImage(occurrence.image || null);

        setValues({
            name: occurrence.name,
            description: occurrence.description,
            criticity: occurrence.criticity,
            criticityLabel: occurrence.criticityLabel,
            prototypeId: occurrence.prototypeId || "",
            progress: occurrence.progress,
            progressLabel: occurrence.progressLabel,
            actions: occurrence.actions,
            results: occurrence.results,
            dueOn: occurrence.dueOn || null,
        });
    };

    // ================= SAVE =================
    const saveOccurrence = async () => {
        const payload = {
            ...values,
            // Keep dueOn as Date object for API
        };
        
        if (editingOccurrenceId) return updateOccurrence(editingOccurrenceId, payload);
        
        return createOccurrence(payload);
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

    // ================= DOWNLOAD =================
    function downloadBlob(blob: Blob, filename: string) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    // ================= GENERATE REPORT =================
    const handleGenerateReport = async (occurrenceId: string) => {
        try {
            setGeneratingId(occurrenceId);

            const response = await generateOccurrenceReport(occurrenceId);

            const disposition = response.headers["content-disposition"] || "";
            const match = disposition.match(/filename=([^;]+)/);
            const filename = match?.[1] || `Relatorio_${occurrenceId}.docx`;

            downloadBlob(response.data, filename);
        } catch (err: any) {
            if (err.response?.data instanceof Blob) {
                try {
                    const text = await err.response.data.text();
                    const json = JSON.parse(text);
                    showErrorToast(new Error(json.message || "Erro ao gerar relatório"));
                } catch {
                    showErrorToast(err);
                }
            } else {
                showErrorToast(err);
            }
        } finally {
            setGeneratingId(null);
        }
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

                data={occurrences}

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

                        <td className="px-4 text-secondary">{o.progressLabel}</td>

                        <td className="px-4 text-secondary">
                            {formatDateBR(o.createdAt!)}
                        </td>

                        <td className="px-4 text-secondary">
                            {formatDateBR(o.dueOn)}
                        </td>
                    </>
                )}

                onEdit={handleEdit}
                onDelete={handleDelete}
                renderActions={(id) => (
                    <button
                        onClick={() => handleGenerateReport(id)}
                        disabled={generatingId === id}
                        className="btn-custom btn-custom-inside-primary px-2 py-1 border-0 bg-transparent"
                        title="Gerar laudo"
                    >
                        <FiletypeDocx size={18} />
                    </button>
                )}
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
                            options={criticityArray}
                            required
                        />

                        <FormRadioGroup
                            label="Status"
                            name="progress"
                            value={values.progress}
                            onChange={handleChange}
                            options={statusArray}
                            required
                        />

                        <FormTextarea
                            label="Ações necessárias"
                            name="actions"
                            value={values.actions}
                            onChange={handleChange}
                            required
                        />

                        <FormTextarea
                            label="Resultados esperados"
                            name="results"
                            value={values.results}
                            onChange={handleChange}
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