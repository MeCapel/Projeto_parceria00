// ===== GERAL IMPORTS =====
import { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import {
  Paperclip,
  Trash3Fill,
  XCircleFill,
} from "react-bootstrap-icons";

import { useOccurrences } from "../../hooks/useOccurrences";
import { useForm } from "../../hooks/useForm";
import { useImageUpload } from "../../hooks/useImageUpload";

import CrudPageLayout from "../Others/CrudPageLayout";
import CrudHeader from "../Others/CrudHeader";
import CrudList from "../Others/CrudList";
import { CrudTable } from "../Others/CrudTable";
import CrudModal from "../Others/CrudModal";

import SearchInput from "../forms/SearchInput";
import FormInput from "../forms/FormInput";
import FormTextarea from "../forms/FormTextarea";
import FormRadioGroup from "../forms/FormRadioGroup";
import FormDatePicker from "../forms/FormDatePicker";

import { formatDateBR } from "../../utils/date";

import type { Timestamp } from "firebase/firestore";

// ===== TYPES =====
interface OccurrenceForm {
  name: string;
  description: string;
  criticity: string;
  image?: string;
  prototypeId: string;
  progress:
    | "pendente"
    | "em andamento"
    | "concluido";

  dueOn: Date | null;

  createdAt?: Date | Timestamp;
}

export default function OccurrencesTab() {

  // ===== HOOK =====
  const {
    occurrences,
    loading,
    hasMore,

    fetchOccurrences,
    loadMore,

    createOccurrence,
    updateOccurrence,
    deleteOccurrence,
  } = useOccurrences();

  // ===== STATES =====
  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<
      "all"
      | "pendente"
      | "em andamento"
      | "concluido"
    >("all");

  const [showModal, setShowModal] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [toDelete, setToDelete] =
    useState<string | null>(null);

  const [isSaving, setIsSaving] =
    useState(false);

  // ===== FORM =====
  const formRef =
    useRef<HTMLFormElement | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const {
    values,
    setValues,
    handleChange,
    reset,
  } = useForm<OccurrenceForm>({
    name: "",
    description: "",
    criticity: "",
    image: "",
    prototypeId: "",
    progress: "pendente",
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
    });

  }, []);

  // ===== SEARCH FILTER =====
  const filtered = useMemo(() => {

    return occurrences.filter((o) => {

      const q =
        search.toLowerCase();

      const matchesSearch =
        o.name
          .toLowerCase()
          .includes(q)

        ||

        o.description
          ?.toLowerCase()
          .includes(q);

      const matchesStatus =
        statusFilter === "all"
          ? true
          : o.progress === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );

    });

  }, [
    occurrences,
    search,
    statusFilter,
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
  const onFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      e.target.files?.[0];

    if (!file) return;

    const base64 =
      await handleImageChange(file);

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

    setShowModal(true);

  };

  const handleEdit = (
    id: string
  ) => {

    const occurrence =
      occurrences.find(
        o => o.id === id
      );

    if (!occurrence) return;

    setEditingId(id);

    setShowModal(true);

    setImage(
      occurrence.image || null
    );

    setValues({
      name: occurrence.name,
      description:
        occurrence.description,

      criticity:
        occurrence.criticity,

      image:
        occurrence.image || "",

      prototypeId:
        occurrence.prototypeId,

      progress:
        occurrence.progress,

      dueOn:
        occurrence.dueOn || null,
    });

  };

  const handleSave = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    const form =
      formRef.current;

    if (!form) return;

    form.classList.add(
      "was-validated"
    );

    if (!form.checkValidity())
    {
      const firstInvalid =
        form.querySelector<HTMLElement>(
          ":invalid"
        );

      if (firstInvalid)
      {
        firstInvalid.focus();
      }

      return;
    }

    try
    {
      setIsSaving(true);

      if (editingId)
      {

        await updateOccurrence(
          editingId,
          values
        );

      }
      else
      {

        await createOccurrence(values);

      }

      await fetchOccurrences({
        reset: true,
        limit: 10,
      });

      setShowModal(false);
    }
    finally
    {
      setIsSaving(false);
    }

  };

  const handleDelete = (
    id: string
  ) => {

    setToDelete(id);

  };

  const confirmDelete = async () => {

    if (!toDelete) return;

    await deleteOccurrence(toDelete);

    await fetchOccurrences({
      reset: true,
      limit: 10,
    });

    setToDelete(null);

  };

  // ===== JSX =====
  return (
    <>
      <CrudPageLayout
        header={
          <>
            <CrudHeader
              title="Ocorrências"
              subtitle="Gerencie as ocorrências"
              onNew={handleNew}
            />

            <div className="d-flex flex-wrap gap-3 pb-3 align-items-center">

              <div
                className="flex-grow-1"
                style={{
                  minWidth: 260,
                }}
              >

                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Pesquisar ocorrência..."
                />

              </div>

              <select
                className="form-select rounded-3"

                style={{
                  width: 220,
                }}

                value={statusFilter}

                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as
                      | "all"
                      | "pendente"
                      | "em andamento"
                      | "concluido"
                  )
                }
              >

                <option value="all">
                  Todos status
                </option>

                <option value="pendente">
                  Pendente
                </option>

                <option value="em andamento">
                  Em andamento
                </option>

                <option value="concluido">
                  Concluído
                </option>

              </select>

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
                      "Status",
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
                          {o.description}
                        </td>

                        <td className="px-4 text-secondary">

                          <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-3">
                            {o.criticity}
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
                            {o.progress}
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