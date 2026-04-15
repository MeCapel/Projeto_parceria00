import { useRef } from "react";
import { useClients } from "../../hooks/useClients";
import type { ClientForm } from "../../pages/Clients";
import { useForm } from "../../hooks/useForm";
import CrudModal from "../Others/CrudModal";
import type { ClientProps } from "../../services/clientServices";

interface Props {
  show: boolean;
  onClose: () => void;
  onCreated?: (client: ClientProps) => void;
}

export default function NewClientModal({ show, onClose, onCreated }: Props) {
  const { createClient } = useClients();
  const formRef = useRef<HTMLFormElement | null>(null);

  const { values, reset } = useForm<ClientForm>({
    name: "",
    revend: "",
    fone: "",
    state: "",
    city: "",
    area: "",
  });

    async function handleNew(e: React.FormEvent) {
        e.preventDefault();

        const form = formRef.current;
        if (!form) return;

        form.classList.add("was-validated");

        if (!form.checkValidity()) {
            const firstInvalid = form.querySelector<HTMLElement>(":invalid");
            firstInvalid?.focus();
            return;
        }

        const newClient = await createClient(values);

        if (newClient) {
            onCreated?.(newClient);
            onClose(); // fecha o modal só se deu certo
        }

        reset();
    }

  return (
    <CrudModal show={show} title="Novo cliente" onClose={onClose}>
      <form ref={formRef} onSubmit={handleNew} noValidate>

        {/* seus inputs aqui */}

        <button type="submit" className="btn btn-success">
          Salvar
        </button>

      </form>
    </CrudModal>
  );
}