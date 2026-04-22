import { useRef } from "react";
import { useClients } from "../../hooks/useClients";
import type { ClientForm } from "../../pages/Clients";
import { useForm } from "../../hooks/useForm";
import CrudModal from "../Others/CrudModal";
import type { ClientProps } from "../../services/clientServices";
import FormInput from "../forms/FormInput";
import SelectLocation from "../Others/SelectLocation";
import FormFoneInput from "../forms/FormInputFone";

interface Props {
  show: boolean;
  onClose: () => void;
  onCreated?: (client: ClientProps) => void;
}

export default function NewClientModal({ show, onClose, onCreated }: Props) {
  const { createClient } = useClients();
  const formRef = useRef<HTMLFormElement | null>(null);

  const { values, handleChange, reset } = useForm<ClientForm>({
    name: "",
    clientFone: "",
    revend: "",
    revendFone: "",
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
          onClose(); 
      }

      reset();
  }

  return (
    <CrudModal show={show} title="Novo cliente" onClose={onClose}>
      <form ref={formRef} onSubmit={handleNew} noValidate className="d-flex flex-column gap-3">
        <div className="d-flex flex-column gap-3">
            <div className="d-flex gap-3">
                <FormInput
                    label="Nome"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    required
                    minLength={3}
                />

                <FormFoneInput
                    label="Telefone do client"
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
                    minLength={3}
                />

                <FormFoneInput
                    label="Telefone da revenda"
                    name="revendFone"
                    value={values.revendFone}
                    onChange={handleChange}
                />
            </div>
        </div>
        
        <SelectLocation
            stateValue={values.state}
            cityValue={values.city}
            onChangeState={handleChange}
            onChangeCity={handleChange}
        />

        <FormInput
            label="Area"
            name="area"
            value={values.area}
            onChange={handleChange}
            required
            minLength={3}
        />

        <div className="d-flex justify-content-end mt-4">
            <button 
                type="submit"
                className='btn-custom btn-custom-success px-4'
            >
                Salvar
            </button>
        </div>

    </form>
    </CrudModal>
  );
}