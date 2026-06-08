// ===== GERAL IMPORTS =====
import { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { ArrowLeftCircleFill, Trash3Fill } from "react-bootstrap-icons";
import { useClients } from "../../hooks/useClients";
import { useForm } from "../../hooks/useForm";
import CrudPageLayout from "../Others/CrudPageLayout";
import CrudHeader from "../Others/CrudHeader";
import SearchInput from "../forms/SearchInput";
import CrudList from "../Others/CrudList";
import { CrudTable } from "../Others/CrudTable";
import CrudModal from "../Others/CrudModal";
import FormInput from "../forms/FormInput";
import FormFoneInput from "../forms/FormInputFone";
import SelectLocation from "../Others/SelectLocation";
import { useNavigate } from "react-router";

// ===== TYPES =====
interface ClientForm {
  name: string;
  clientFone: string;
  revend: string;
  revendFone: string;
  state: string;
  city: string;
  area: string;
}

export default function ClientsTab() {
  const navigate = useNavigate();

  // ===== HOOK =====
  const {
    clients,
    loading,
    hasMore,
    fetchClients,
    loadMore,
    createClient,
    updateClient,
    changeClientStatus,
    deleteClient,
  } = useClients();

  // ===== STATES =====
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "disabled"
  >("all");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<string | null>(null);

  // ===== FORM =====
  const formRef = useRef<HTMLFormElement | null>(null);

  const { values, setValues, handleChange, reset } = useForm<ClientForm>({
    name: "",
    clientFone: "",
    revend: "",
    revendFone: "",
    state: "",
    city: "",
    area: "",
  });

  // ===== API FILTERS =====
  const apiFilters = useMemo(() => {
    return {
      status: statusFilter === "all" ? undefined : statusFilter,
    };
  }, [statusFilter]);

  // ===== INITIAL FETCH =====
  useEffect(() => {
    fetchClients({
      reset: true,
      limit: 10,
      filters: apiFilters,
    });
  }, [apiFilters]);

  // ===== SEARCH FILTER =====
  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const q = search.toLowerCase();

      return (
        c.name.toLowerCase().includes(q) ||
        c.revend.toLowerCase().includes(q)
      );
    });
  }, [clients, search]);

  // ===== ACTIONS =====
  const handleNew = () => {
    reset();
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (id: string) => {
    const client = clients.find((c) => c.id === id);
    if (!client) return;

    setEditingId(id);
    setShowModal(true);

    setValues({
      name: client.name,
      clientFone: client.clientFone,
      revend: client.revend,
      revendFone: client.revendFone,
      state: client.state,
      city: client.city,
      area: client.area,
    });
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

    if (editingId) {
      await updateClient({
        id: editingId,
        ...values,
      });
    } else {
      await createClient(values);
    }

    await fetchClients({
      reset: true,
      limit: 10,
      filters: apiFilters,
    });

    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setToDelete(id);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;

    await deleteClient(toDelete);

    await fetchClients({
      reset: true,
      limit: 10,
      filters: apiFilters,
    });

    setToDelete(null);
  };

  const handleStatusChange = async (
    id: string,
    currentStatus: "active" | "disabled"
  ) => {
    const newStatus =
      currentStatus === "active" ? "disabled" : "active";

    await changeClientStatus(id, newStatus);

    await fetchClients({
      reset: true,
      limit: 10,
      filters: apiFilters,
    });
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
              title="Clientes"
              subtitle="Gerencie seus clientes"
              onNew={handleNew}
            />

            {/* FILTERS */}
            <div className="d-flex flex-wrap gap-3 pb-3 align-items-center">
              <div className="grow" style={{ minWidth: 260 }}>
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Pesquisar cliente ou revenda..."
                />
              </div>

              <select
                className="form-select rounded-3"
                style={{ width: 220 }}
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "all" | "active" | "disabled"
                  )
                }
              >
                <option value="all">Todos status</option>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
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
                    Nenhum cliente encontrado.
                  </p>
                </div>
              ) : (
                <div className="w-100">
                  <CrudTable
                    headers={[
                      "Nome",
                      "Telefone",
                      "Revenda",
                      "Telefone revenda",
                      "Estado",
                      "Cidade",
                      "Área",
                      "Status",
                    ]}
                    data={filtered}
                    getId={(c) => c.id}
                    renderRow={(c) => (
                      <>
                        <td className="px-4 text-secondary">{c.name}</td>
                        <td className="px-4 text-secondary">{c.clientFone}</td>
                        <td className="px-4 text-secondary">{c.revend}</td>
                        <td className="px-4 text-secondary">{c.revendFone}</td>
                        <td className="px-4 text-secondary">{c.state}</td>
                        <td className="px-4 text-secondary">{c.city}</td>
                        <td className="px-4 text-secondary">{c.area}</td>

                        <td className="px-4 text-secondary">
                          <span
                            className={`badge px-3 py-2 rounded-3 ${
                              c.status === "active"
                                ? "bg-success-subtle text-success"
                                : "bg-secondary-subtle text-secondary"
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                      </>
                    )}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
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
                  {loading ? "Carregando..." : "Carregar mais"}
                </button>
              </div>
            )}
          </>
        }
        modal={
          <CrudModal
            show={showModal}
            title={editingId ? "Editar cliente" : "Novo cliente"}
            onClose={() => setShowModal(false)}
            edit={!!editingId}
          >
            <form
              ref={formRef}
              onSubmit={handleSave}
              noValidate
              className="d-flex flex-column gap-3"
            >
              <div className="d-flex gap-3">
                <FormInput
                  label="Nome"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  required
                />

                <FormFoneInput
                  label="Telefone"
                  name="clientFone"
                  value={values.clientFone}
                  onChange={handleChange}
                />
              </div>

              <div className="d-flex gap-3">
                <FormInput
                  label="Revenda"
                  name="revend"
                  value={values.revend}
                  onChange={handleChange}
                  required
                />

                <FormFoneInput
                  label="Telefone revenda"
                  name="revendFone"
                  value={values.revendFone}
                  onChange={handleChange}
                />
              </div>

              <SelectLocation
                stateValue={values.state}
                cityValue={values.city}
                onChangeState={handleChange}
                onChangeCity={handleChange}
              />

              <FormInput
                label="Área"
                name="area"
                value={values.area}
                onChange={handleChange}
                required
              />

              <div className="d-flex justify-content-end mt-4">
                <button
                  type="submit"
                  className="btn-custom btn-custom-success px-4"
                >
                  Salvar
                </button>
              </div>
            </form>
          </CrudModal>
        }
      />

      {/* DELETE MODAL */}
      <Modal
        show={!!toDelete}
        onHide={() => setToDelete(null)}
        centered
      >
        <Modal.Body className="text-center p-5">
          <Trash3Fill size={50} className="text-danger mb-4" />

          <h4 className="fw-bold mb-3">Excluir cliente?</h4>

          <p className="text-muted mb-5">
            Esta ação não pode ser desfeita.
          </p>

          <div className="d-flex gap-3 justify-content-center">
            <button
              className="btn-custom btn-custom-outline-secondary px-4 rounded-3"
              onClick={() => setToDelete(null)}
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