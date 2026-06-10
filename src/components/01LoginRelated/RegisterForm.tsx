import { useState, useRef } from "react"
import { inviteUser } from "../../services/auth.service";
import CrudModal from "../Others/CrudModal";
import ShareInviteLink from "../Others/ShareInviteLink";
import FormInput from "../forms/FormInput";
import FormRadioGroup from "../forms/FormRadioGroup";

interface InviteUserModalProps {
  show: boolean;
  onClose: () => void;
}

export default function InviteUserModal({ show, onClose }: InviteUserModalProps) {
  const roleArray = [
    { label: "Administrador", value: "admin" },
    { label: "Coordenador de validação", value: "coordenador de validacao" },
    { label: "Integrador", value: "integrador" },
    { label: "PO", value: "po" },
    { label: "Técnico de campo", value: "tecnico de campo" },
  ];

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const [inviteLink, setInviteLink] = useState("");

  const formRef = useRef<HTMLFormElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    if (name === "email") setEmail(value);
    if (name === "role") setRole(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = formRef.current;
    if (!form) return;

    form.classList.add("was-validated");
    if (!form.checkValidity()) {
      const firstInvalid = form.querySelector<HTMLElement>(":invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    setLoading(true);

    try {
      const data = {
        username: username.trim(),
        email: email.trim(),
        role,
      };

      const result = await inviteUser(data);
      setInviteLink(result.inviteLink);
      setStep("success");
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      switch (err.code) {
        case "auth/email-already-in-use":
          alert("Este email já está em uso.");
          break;
        case "auth/invalid-email":
          alert("O formato do email é inválido.");
          break;
        default:
          alert("Ocorreu um erro ao criar a conta: " + (err.message || "Erro desconhecido"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInviteAnother = () => {
    setStep("form");
    setInviteLink("");
    setUsername("");
    setEmail("");
    setRole("");
  };

  const handleClose = () => {
    setStep("form");
    setInviteLink("");
    setUsername("");
    setEmail("");
    setRole("");
    onClose();
  };

  return (
    <CrudModal
      show={show}
      title={step === "form" ? "Convidar usuário" : "Usuário convidado"}
      onClose={handleClose}
    >
      {step === "form" ? (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="d-flex flex-column gap-3"
        >
          <FormInput
            label="Nome"
            name="username"
            value={username}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />

          <FormRadioGroup
            label="Função"
            name="role"
            value={role}
            onChange={handleChange}
            options={roleArray}
            required
            vertical={true}
          />

          <div className="d-flex justify-content-end mt-4">
            <button
              type="submit"
              className="btn-custom btn-custom-success px-4"
              disabled={loading}
            >
              {loading ? "Convidando..." : "Convidar"}
            </button>
          </div>
        </form>
      ) : (
        <ShareInviteLink
          inviteLink={inviteLink}
          onClose={handleClose}
          onInviteAnother={handleInviteAnother}
        />
      )}
    </CrudModal>
  );
}
