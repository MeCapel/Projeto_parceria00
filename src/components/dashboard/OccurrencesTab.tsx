// ===== GERAL IMPORTS =====
import { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import {
  ArrowLeftCircleFill,
  FiletypeDocx,
  Paperclip,
  Trash3Fill,
  XCircleFill,
} from "react-bootstrap-icons";

import { useOccurrences } from "../../hooks/useOccurrences";
import { usePrototypes } from "../../hooks/usePrototypes";
import { useForm } from "../../hooks/useForm";
import { useImageUpload } from "../../hooks/useImageUpload";

import { generateOccurrenceReport } from "../../services/reports.service";

import CrudPageLayout from "../Others/CrudPageLayout";
import CrudHeader from "../Others/CrudHeader";
import CrudList from "../Others/CrudList";
import { CrudTable } from "../Others/CrudTable";
import CrudModal from "../Others/CrudModal";

import SearchInput from "../forms/SearchInput";
import MultiCheckFilter from "../forms/MultiCheckFilter";
import FormInput from "../forms/FormInput";
import FormTextarea from "../forms/FormTextarea";
import FormRadioGroup from "../forms/FormRadioGroup";
import FormDatePicker from "../forms/FormDatePicker";

import { formatDateBR } from "../../utils/date";
import { showErrorToast } from "../../utils/errorToast";

import type { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router";

// ===== TYPES =====
interface OccurrenceForm {
  name: string;
  description: string;
  criticity: string;
  criticityLabel: string;
  image?: string;
  prototypeId: string;
  progress: "pendente" | "em andamento" | "concluido";
  progressLabel: string;
  actions: string;
  results: string;
  dueOn: Date | null;
  createdAt?: Date | Timestamp;
}

export default function OccurrencesTab() {
  const navigate = useNavigate();

  // ===== HOOKS =====
  const {
    occurrences,
    loading,
    hasMore,

    fetchOccurrences,
    loadMore,

    createOccurrence,
    updateOccurrence,
    deleteOccurrence,
    changeOccurrencesStatus,
  } = useOccurrences();

  const {
    prototypes: allPrototypes,
  } = usePrototypes({});

  // ===== PROTOTYPE OPTIONS =====
  const prototypeOptions = useMemo(() =>
    allPrototypes.map(p => ({
      label: `${p.name}${p.code ? ` (${p.code})` : ""}`,
      value: p.id,
    })),
    [allPrototypes]
  );

  // ===== STATES =====
  const [search, setSearch] = useState("");

  const [progressFilters, setProgressFilters] =
    useState<string[]>([]);

  const [criticityFilters, setCriticityFilters] =
    useState<string[]>([]);

  const progressOptions = [
    { label: "Pendente", value: "pendente" },
    { label: "Em andamento", value: "em andamento" },
    { label: "Concluído", value: "concluido" },
  ];

  const criticityOptions = [
    { label: "A", value: "a" },
    { label: "B", value: "b" },
    { label: "C", value: "c" },
  ];

  const [statusFilters, setStatusFilters] =
    useState<string[]>([]);

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [toDelete, setToDelete] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  const [generatingId, setGeneratingId] = useState<string | null>(null);

  // ===== API FILTERS =====
  const apiFilters = useMemo(() => {
    let status: "active" | "disabled" | undefined;
    if (statusFilters.length === 0 || statusFilters.length === 2) {
      status = undefined;
    } else {
      status = statusFilters[0] as "active" | "disabled";
    }
    return { status };
  }, [statusFilters]);

  // ===== FORM =====
  const formRef = useRef<HTMLFormElement | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    values,
    setValues,
    handleChange,
    reset,
  } = useForm<OccurrenceForm>({
    name: "",
    description: "",
    criticity: "",
    criticityLabel: "",
    image: "",
    prototypeId: "",
    progress: "pendente",
    progressLabel: "Pendente",
    actions: "",
    results: "",
    dueOn: null,
  });

  // ===== IMAGE =====
  const {
    image: selectedImage,
    setImage,
    handleImageChange,
    clearImage,
  } = useImageUpload();

  // ===== FILTERS =====
  useEffect(() => {
    fetchOccurrences({
      reset: true,
      limit: 10,
      filters: apiFilters,
    });

  }, [apiFilters]);

  // ===== SEARCH FILTER =====
  const filtered = useMemo(() => {

    return occurrences.filter((o) => {

      const q = search.toLowerCase();

      const matchesSearch = o.name.toLowerCase().includes(q)
        ||
        o.description?.toLowerCase().includes(q);

      const matchesProgress =
        progressFilters.length === 0
          || progressFilters.includes(o.progress);

      const matchesCriticity =
        criticityFilters.length === 0
          || criticityFilters.includes(o.criticity);

      return (
        matchesSearch &&
        matchesProgress &&
        matchesCriticity
      );

    });

  }, [
    occurrences,
    search,
    progressFilters,
    criticityFilters,
  ]);

  // ===== ARRAYS =====
  const criticityArray = [
    {
      label: "A",
      value: "a",
    },
    {
      label: "B",
      value: "b",
    },
    {
      label: "C",
      value: "c",
    },
  ];

  const statusArray = [
    {
      label: "Pendente",
      value: "pendente",
    },
    {
      label: "Em andamento",
      value: "em andamento",
    },
    {
      label: "Concluído",
      value: "concluido",
    },
  ];

  // ===== IMAGE =====
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const base64 = await handleImageChange(file);

    setValues(prev => ({
      ...prev,
      image: base64,
    }));
  };

  // ===== ACTIONS =====
  const handleNew = () => {
    reset();
    clearImage();
    setEditingId(null);
    setValues(prev => ({ ...prev, prototypeId: "" }));
    setShowModal(true);
  };

  const handleEdit = (id: string) => {
    const occurrence =
      occurrences.find(
        o => o.id === id
      );

    if (!occurrence) return;

    setEditingId(id);
    setShowModal(true);
    setImage(occurrence.image || null);

    setValues({
      name: occurrence.name,
      description: occurrence.description,
      criticity: occurrence.criticity,
      criticityLabel: occurrence.criticityLabel,
      image: occurrence.image || "",
      prototypeId: occurrence.prototypeId,
      progress: occurrence.progress,
      progressLabel: occurrence.progressLabel,
      actions: occurrence.actions,
      results: occurrence.results,
      dueOn: occurrence.dueOn || null,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
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

    try
    {
      setIsSaving(true);

      if (editingId)
      {
        await updateOccurrence(editingId, values);
      }
      else
      {
        await createOccurrence(values);
      }

      await fetchOccurrences({ reset: true, limit: 10, filters: apiFilters });
      setShowModal(false);
    }
    finally
    {
      setIsSaving(false);
    }

  };

  const handleStatusChange = async (id: string, currentStatus: "active" | "disabled") => {
    const newStatus = currentStatus === "active" ? "disabled" : "active";
    await changeOccurrencesStatus(id, newStatus);
    await fetchOccurrences({ reset: true, limit: 10, filters: apiFilters });
  };

  const handleDelete = (id: string) => { setToDelete(id)};

  const confirmDelete = async () => {
    if (!toDelete) return;

    await deleteOccurrence(toDelete);
    await fetchOccurrences({ reset: true, limit: 10, filters: apiFilters });

    setToDelete(null);
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

  // ===== JSX =====
  return (
    <>
      <div className="ps-5 pt-5 pb-0 pe-0">
          <button 
              className="btn-custom btn-custom-link d-flex gap-3 align-items-center border-0 bg-transparent p-0" 
              onClick={() => navigate(`/admin-dashboard`)}
          >
              <ArrowLeftCircleFill size={30} className="text-custom-black" />
              <p className="text-custom-black fs-5 mb-0 fw-semibold">
                  voltar
              </p>
          </button>
      </div>

      <CrudPageLayout
        header={
          <>
            <CrudHeader
              title="Ocorrências"
              subtitle="Gerencie as ocorrências"
              onNew={handleNew}
            />

            <div className="d-flex flex-wrap gap-3 pb-3">

              <div className="flex-grow-1">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Pesquisar ocorrência..."
                />
              </div>

              <MultiCheckFilter
                label="Status"
                options={[
                  { label: "Ativos", value: "active" },
                  { label: "Desativados", value: "disabled" },
                ]}
                selected={statusFilters}
                onChange={setStatusFilters}
              />

              <MultiCheckFilter
                label="Progresso"
                options={progressOptions}
                selected={progressFilters}
                onChange={setProgressFilters}
              />

              <MultiCheckFilter
                label="Criticidade"
                options={criticityOptions}
                selected={criticityFilters}
                onChange={setCriticityFilters}
              />

            </div>
          </>
        }

        list={
          <>
            <CrudList>

              {filtered.length === 0 ? (

                <div className="w-100 py-5 text-center border rounded bg-light">

                  <p className="text-muted mb-0">
                    Nenhuma ocorrência encontrada.
                  </p>

                </div>

              ) : (

                <div className="w-100">

                  <CrudTable

                    headers={[
                      "Nome",
                      "Descrição",
                      "Criticidade",
                      "Progresso",
                      "Vencimento",
                      "Criado em",
                    ]}

                    data={filtered}

                    getId={(o) => o.id}

                    renderRow={(o) => (
                      <>

                        <td className="px-4 text-secondary">
                          {o.name}
                        </td>

                        <td className="px-4 text-secondary">
                          {o.description && o.description.length > 25 ? o.description.substring(0, 25) + "..." : o.description}
                        </td>

                        <td className="px-4 text-secondary">

                          <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-3">
                            {o.criticityLabel}
                          </span>

                        </td>

                        <td className="px-4 text-secondary">

                          <span
                            className={`badge px-3 py-2 rounded-3 ${
                              o.progress === "concluido"
                                ? "bg-success-subtle text-success"
                                : o.progress === "em andamento"
                                ? "bg-warning-subtle text-warning"
                                : "bg-secondary-subtle text-secondary"
                            }`}
                          >
                            {o.progressLabel}
                          </span>

                        </td>

                        <td className="px-4 text-secondary">
                          {o.dueOn
                            ? formatDateBR(o.dueOn)
                            : "-"}
                        </td>

                        <td className="px-4 text-secondary">
                          {o.createdAt
                            ? formatDateBR(o.createdAt)
                            : "-"}
                        </td>

                      </>
                    )}

                    onEdit={handleEdit}

                    onDelete={handleDelete}

                    onStatusChange={handleStatusChange}

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

                </div>

              )}

            </CrudList>

            {hasMore && !search && (

              <div className="d-flex justify-content-center pt-4">

                <button
                  className="btn-custom btn-custom-outline-primary px-4 rounded-3 shadow-sm"

                  disabled={loading}

                  onClick={loadMore}
                >
                  {loading
                    ? "Carregando..."
                    : "Carregar mais"}
                </button>

              </div>

            )}

          </>
        }

        modal={
          <CrudModal
            show={showModal}

            title={
              editingId
                ? "Editar ocorrência"
                : "Nova ocorrência"
            }

            onClose={() =>
              setShowModal(false)
            }

            edit={!!editingId}
          >

            <form
              ref={formRef}
              onSubmit={handleSave}
              noValidate
              className="d-flex flex-column gap-3"
            >

              <FormRadioGroup
                label="Protótipo"
                name="prototypeId"
                value={values.prototypeId}
                options={prototypeOptions}
                onChange={handleChange}
                required
                vertical
                scrollableMaxHeight="220px"
              />

              <FormInput
                label="Nome"
                name="name"
                value={values.name}
                onChange={handleChange}
                required
              />

              <FormTextarea
                label="Descrição"
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

              <FormDatePicker
                label="Data limite"
                value={values.dueOn}
                onChange={(date) =>
                  setValues(prev => ({
                    ...prev,
                    dueOn: date,
                  }))
                }
              />

              {/* IMAGE */}
              <div className="d-flex flex-column gap-2">

                <label className="text-custom-black fw-semibold small">
                  Anexar imagem
                </label>

                <div className="d-flex align-items-center gap-3">

                  <button
                    type="button"

                    className="btn-custom btn-custom-outline-secondary d-flex align-items-center gap-2"

                    onClick={() =>
                      fileInputRef.current?.click()
                    }

                    disabled={isSaving}
                  >

                    <Paperclip size={18} />
                    Selecionar foto

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
                          objectFit: "cover",
                        }}
                      />

                      <XCircleFill
                        className="position-absolute text-danger bg-white rounded-circle"

                        style={{
                          top: "-8px",
                          right: "-8px",
                          cursor: "pointer",
                        }}

                        onClick={() => {

                          clearImage();

                          setValues(prev => ({
                            ...prev,
                            image: "",
                          }));

                        }}
                      />

                    </div>

                  )}

                </div>

              </div>

              <div className="d-flex justify-content-end mt-4">

                <button
                  type="submit"

                  className="btn-custom btn-custom-success px-4"

                  disabled={isSaving}
                >
                  {isSaving
                    ? "Salvando..."
                    : "Salvar"}
                </button>

              </div>

            </form>

          </CrudModal>
        }
      />

      {/* ===== DELETE MODAL ===== */}
      <Modal
        show={!!toDelete}

        onHide={() =>
          setToDelete(null)
        }

        centered
      >

        <Modal.Body className="text-center p-5">

          <Trash3Fill
            size={50}
            className="text-danger mb-4"
          />

          <h4 className="fw-bold mb-3">
            Excluir ocorrência?
          </h4>

          <p className="text-muted mb-5">
            Esta ação não pode ser desfeita.
          </p>

          <div className="d-flex gap-3 justify-content-center">

            <button
              className="btn-custom btn-custom-outline-secondary px-4 rounded-3"

              onClick={() =>
                setToDelete(null)
              }
            >
              Cancelar
            </button>

            <button
              className="btn-custom btn-custom-outline-primary px-4 rounded-3 shadow-sm"

              onClick={confirmDelete}
            >
              Excluir
            </button>

          </div>

        </Modal.Body>

      </Modal>
    </>
  );
}