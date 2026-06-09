// ===== GERAL IMPORTS =====
import { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { ArrowLeftCircleFill, Trash3Fill } from "react-bootstrap-icons";

import { useUsers } from "../../hooks/useUsers";
import { useForm } from "../../hooks/useForm";

import CrudPageLayout from "../Others/CrudPageLayout";
import CrudHeader from "../Others/CrudHeader";
import SearchInput from "../forms/SearchInput";
import MultiCheckFilter from "../forms/MultiCheckFilter";
import CrudList from "../Others/CrudList";
import { CrudTable } from "../Others/CrudTable";
import CrudModal from "../Others/CrudModal";
import FormInput from "../forms/FormInput";
import InviteUserModal from "../01LoginRelated/RegisterForm";
import { useNavigate } from "react-router";

// ===== TYPES =====
interface UserForm {
  username: string;
  email: string;
  role: string;
}

// ===== COMPONENT =====
export default function UsersTab() {

  const navigate = useNavigate();

  // ===== HOOK =====
  const {
    users,

    loading,
    hasMore,

    fetchUsers,
    loadMore,

    inviteUser,
    updateUser,

    changeUserStatus,
    deleteUser
  } = useUsers();

  // ===== STATUS LABEL MAP =====
  const statusLabel: Record<string, string> = {
    active: "Ativo",
    disabled: "Desativado",
  };

  // ===== STATES =====
  const [search, setSearch] =
    useState("");

  const [statusFilters, setStatusFilters] =
    useState<string[]>([]);

  const [roleFilters, setRoleFilters] =
    useState<string[]>([]);

  const roleLabels: Record<string, string> = {
    "admin": "Administrador",
    "coordenador de validacao": "Coordenador de validação",
    "po": "PO",
    "tecnico de campo": "Técnico de campo",
    "tecnico de desenvolvimento de producao": "Integrador",
  };

  const roleOptions = useMemo(() => {
    const roles = [...new Set(users.map(u => u.role))];
    return roles.map(r => ({ label: roleLabels[r] ?? r, value: r }));
  }, [users]);

  const [showInviteModal, setShowInviteModal] =
    useState(false);

  const [showModal, setShowModal] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [toDisable, setToDisable] =
    useState<string | null>(null);

  // ===== FORM =====
  const formRef =
    useRef<HTMLFormElement | null>(null);

    const [toDelete, setToDelete] = useState<string | null>(null);

    const [isSaving, setIsSaving] = useState(false);

  const {
    values,
    setValues,
    handleChange,
  } = useForm<UserForm>({
    username: "",
    email: "",
    role: "tecnico de campo",
  });

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

  // ===== INITIAL FETCH =====
  useEffect(() => {

    fetchUsers({
      reset: true,
      limit: 10,
      filters: apiFilters,
    });

  }, [apiFilters]);

  // ===== SEARCH FILTER =====
  const filtered = useMemo(() => {

    return users.filter((u) => {

      const q =
        search.toLowerCase();

      const matchesSearch =
        u.username
          .toLowerCase()
          .includes(q)

        ||

        u.email
          .toLowerCase()
          .includes(q)

        ||

        u.role
          .toLowerCase()
          .includes(q);

      const matchesRole =
        roleFilters.length === 0
          || roleFilters.includes(u.role);

      return (
        matchesSearch &&
        matchesRole
      );

    });

  }, [users, search, roleFilters]);

  // ===== ACTIONS =====
  const handleNew = () => {
    setShowInviteModal(true);
  };

  const handleEdit = (
    id: string
  ) => {

    const user =
      users.find(
        (u) => u.id === id
      );

    if (!user) return;

    setEditingId(id);

    setShowModal(true);

    setValues({
      username:
        user.username,

      email:
        user.email,

      role:
        user.role,
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

      // ===== UPDATE =====
      if (editingId)
      {

        await updateUser({
          id: editingId,
          username: values.username,
        });

      }

      // ===== CREATE =====
      else
      {

        await inviteUser({
          username: values.username,
          email: values.email,
          role: values.role,
        });

      }

      await fetchUsers({
        reset: true,
        limit: 10,
        filters: apiFilters,
      });

      setShowModal(false);
    }
    finally
    {
      setIsSaving(false);
    }

  };

  const handleStatusChange = async (
    id: string,
    currentStatus:
      | "active"
      | "disabled"
  ) => {

    const newStatus =
      currentStatus === "active"
        ? "disabled"
        : "active";

    setToDisable(id);

    await changeUserStatus(
      id,
      newStatus
    );

    await fetchUsers({
      reset: true,
      limit: 10,
      filters: apiFilters,
    });

    setToDisable(null);

  };

    const handleDelete = (id: string) => {
        setToDelete(id);
    };

    const confirmDelete = async () => {
        if (!toDelete) return;

        await deleteUser(toDelete);

        await fetchUsers({
            reset: true,
            limit: 10,
            filters: apiFilters,
        });

        setToDelete(null);
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

        // ===== HEADER =====
        header={
          <>
            <CrudHeader
              title="Usuários"
              subtitle="Gerencie os usuários"
              onNew={handleNew}
            />

            {/* ===== FILTERS ===== */}
            <div className="d-flex flex-wrap gap-3 pb-3">

              <div className="flex-grow-1">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Pesquisar usuário..."
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
                label="Função"
                options={roleOptions}
                selected={roleFilters}
                onChange={setRoleFilters}
              />

            </div>
          </>
        }

        // ===== LIST =====
        list={
          <>
            <CrudList>

              {filtered.length === 0 ? (

                <div className="w-100 py-5 text-center border rounded bg-light">

                  <p className="text-muted mb-0">
                    Nenhum usuário encontrado.
                  </p>

                </div>

              ) : (

                <div className="w-100">

                  <CrudTable

                    headers={[
                      "Username",
                      "E-mail",
                      "Função",
                      "Status",
                    ]}

                    data={filtered}

                    getId={(u) => u.id}

                    renderRow={(u) => (
                      <>

                        {/* USERNAME */}
                        <td className="px-4 text-secondary">
                          {u.username}
                        </td>

                        {/* EMAIL */}
                        <td className="px-4 text-secondary">
                          {u.email}
                        </td>

                        {/* ROLE */}
                        <td className="px-4 text-secondary">
                          {u.role}
                        </td>

                        {/* STATUS */}
                        <td className="px-4 text-secondary">

                          <span
                            className={`badge px-3 py-2 rounded-3 ${
                              u.status === "active"
                                ? "bg-success-subtle text-success"
                                : "bg-secondary-subtle text-secondary"
                            }`}
                          >
                            {statusLabel[u.status ?? ""] ?? u.status}
                          </span>

                        </td>

                      </>
                    )}

                    onEdit={handleEdit}

                    onStatusChange={
                      handleStatusChange
                    }

                    onDelete={handleDelete}
                  />

                </div>

              )}

            </CrudList>

            {/* ===== PAGINATION ===== */}
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

        // ===== MODAL =====
        modal={
          <CrudModal
            show={showModal}

            title={
              editingId
                ? "Editar usuário"
                : "Novo usuário"
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
                label="Username"

                name="username"

                value={values.username}

                onChange={handleChange}

                required
              />

              <FormInput
                label="Email"

                name="email"

                value={values.email}

                onChange={handleChange}

                required
              />

              <div className="d-flex flex-column gap-2">

                <label className="fw-semibold small text-custom-black">
                  Função
                </label>

                <select
                  className="form-select rounded-3"

                  name="role"

                  value={values.role}

                  onChange={handleChange}

                  disabled={!!editingId}
                >

                  <option value="admin">
                    Admin
                  </option>

                  <option value="coordenador de validacao">
                    Coordenador de validação
                  </option>

                  <option value="po">
                    PO
                  </option>

                  <option value="tecnico de campo">
                    Técnico de campo
                  </option>

                  <option value="tecnico de desenvolvimento de producao">
                    Técnico de desenvolvimento de produção
                  </option>

                </select>

              </div>

              <div className="d-flex justify-content-end mt-4">

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
        }
      />

      {/* ===== STATUS MODAL ===== */}
      <Modal
        show={!!toDisable}

        onHide={() =>
          setToDisable(null)
        }

        centered
      >

        <Modal.Body className="text-center p-5">

          <Trash3Fill
            size={50}
            className="text-warning mb-4"
          />

          <h4 className="fw-bold mb-3">
            Alterar status do usuário?
          </h4>

          <p className="text-muted mb-5">
            Esta ação poderá impedir o acesso do usuário ao sistema.
          </p>

          <div className="d-flex gap-3 justify-content-center">

            <button
              className="btn-custom btn-custom-outline-secondary px-4 rounded-3"

              onClick={() =>
                setToDisable(null)
              }
            >
              Cancelar
            </button>

            <button
              className="btn-custom btn-custom-outline-primary px-4 rounded-3 shadow-sm"

              onClick={() =>
                setToDisable(null)
              }
            >
              Fechar
            </button>

          </div>

        </Modal.Body>

      </Modal>

      {/* DELETE MODAL */}
      <Modal
        show={!!toDelete}
        onHide={() => setToDelete(null)}
        centered
      >
        <Modal.Body className="text-center p-5">
          <Trash3Fill size={50} className="text-danger mb-4" />

          <h4 className="fw-bold mb-3">Excluir usuário?</h4>

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

      {/* INVITE MODAL */}
      <InviteUserModal
        show={showInviteModal}
        onClose={() => {
          setShowInviteModal(false);
          fetchUsers({ reset: true });
        }}
      />
    </>
  );
}