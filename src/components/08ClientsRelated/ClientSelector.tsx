import { useState } from "react";
import { useClients } from "../../hooks/useClients";
import NewClientModal from "./NewClientModal";
import { PlusLg } from "react-bootstrap-icons";
import type { ClientProps } from "../../services/clients.service";

interface Props {
  value?: string; // clientId
  onSelect: (client: ClientProps) => void;
  hideNewClientButton?: boolean;
  error?: string;
  required?: boolean;
}

export default function ClientSelector({ value, onSelect, hideNewClientButton, error, required }: Props) {
  const { clients, createClient } = useClients();

  const [showModal, setShowModal] = useState(false);

  return (
    <fieldset className={`w-100 mt-4 p-3 border rounded-3 position-relative ${error ? "border-danger" : ""}`}>

      <legend
        className="w-auto py-1 px-3 text-white fs-6 position-absolute bg-custom-gray00 rounded-pill"
        style={{ top: "-1rem", left: "1rem" }}
      >
        Cliente
      </legend>

      <div className="d-flex gap-3 justify-content-start align-items-start mt-3 flex-row flex-wrap">

        {clients.length === 0 && (
          <p className="text-muted text-center w-100 mb-0 py-2">Nenhum cliente encontrado</p>
        )}

        {clients.map((client, index) => (
          <label
            key={client.id}
            className="d-flex flex-column px-3 py-2 border rounded-3 w-100 w-md-auto"
            style={{ cursor: "pointer", minWidth: "220px" }}
          >
            <div className="d-flex align-items-center gap-2">
              <input
                type="radio"
                name="clientId"
                value={client.id}
                checked={value === client.id}
                onChange={() => onSelect(client)}
                className={`form-check-input ${error ? "is-invalid" : ""}`}
                required={required && index === 0}
              />
              <span className="fw-semibold">{client.name}</span>
            </div>
            <div className="ms-4 small text-muted">
              {client.revend} &bull; {client.city}/{client.state}
            </div>
          </label>
        ))}

      </div>

      <div className="invalid-feedback d-block">
        {error || "Selecione um cliente"}
      </div>

      {!hideNewClientButton && (
        <button
          type="button"
          className="btn-custom btn-custom-outline-black w-100 d-flex align-items-center justify-content-center gap-2 mt-3"
          onClick={() => setShowModal(true)}
        >
          <PlusLg size={18} />
          Novo cliente
        </button>
      )}

      <NewClientModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onCreated={(client) => {
          onSelect(client);
          setShowModal(false);
        }}
        createClient={createClient}
      />

    </fieldset>
  );
}
