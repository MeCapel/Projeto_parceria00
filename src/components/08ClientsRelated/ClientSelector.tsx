import { useState } from "react";
import { useClients } from "../../hooks/useClients";
import type { ClientProps } from "../../services/clientServices";
import NewClientModal from "./NewClientModal";
import { PlusLg, CaretDownFill } from "react-bootstrap-icons";

interface Props {
  value?: string; // clientId
  onSelect: (client: ClientProps) => void;
}

export default function ClientSelector({ value, onSelect }: Props) {
  const { clients } = useClients();

  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const selectedClient = clients.find(c => c.id === value);

  return (
    <div className="mt-4 p-4 border rounded-3 bg-light shadow-sm">

        <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
            <h5 className="fw-bold mb-0 text-custom-black">Dados do cliente</h5>
            <small className="text-muted">Selecione ou cadastre um cliente</small>
        </div>
        </div>

        <div className="d-flex flex-column gap-3 w-100">

            <div className="d-flex gap-3 align-items-center">

                
                {/* SELECT */}
                <div className="position-relative w-100">

                    <div
                        className={`
                            form-control d-flex justify-content-between align-items-center
                            px-3 py-2 cursor-pointer transition
                            ${open ? "shadow-sm" : ""}
                        `}
                        style={{ cursor: "pointer" }}
                        onClick={() => setOpen(prev => !prev)}
                    >
                        <span className={selectedClient ? "text-dark" : "text-muted"}>
                            {selectedClient
                            ? `${selectedClient.name} • ${selectedClient.city}/${selectedClient.state}`
                            : "Selecione um cliente"}
                        </span>

                        <span
                            style={{
                            transition: "0.2s",
                            transform: open ? "rotate(180deg)" : "rotate(0deg)"
                            }}
                        >
                            <CaretDownFill size={18}/>
                        </span>
                    </div>

                    {/* DROPDOWN */}
                    {open && (
                    <div className="position-absolute w-100 bg-white border rounded-3 mt-2 shadow z-3">

                        <ul className="list-unstyled m-0 p-2 d-flex flex-column gap-2">

                        {clients.length === 0 && (
                            <li className="text-center text-muted p-2">
                            Nenhum cliente encontrado
                            </li>
                        )}

                        {clients.map(c => (
                            <li
                            key={c.id}
                            className="d-flex gap-3 align-items-center justify-content-between p-3 border rounded-3 hover-shadow cursor-pointer transition"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                onSelect(c);
                                setOpen(false);
                            }}
                            >
                                <div className="d-flex justify-content-between gap-1">
                                    <p className="mb-0 fw-semibold">Nome:</p>
                                    <span>{c.name}</span>
                                </div>
                                <div className="d-flex justify-content-between gap-1">
                                    <p className="mb-0 fw-semibold">Telefone do cliente:</p>
                                    <span>{c.clientFone}</span>
                                </div>
                                <div className="d-flex justify-content-between gap-1">
                                    <p className="mb-0 fw-semibold">Revenda:</p>
                                    <span>{c.revend}</span>
                                </div>
                                <div className="d-flex justify-content-between gap-1">
                                    <p className="mb-0 fw-semibold">Telefone da revenda:</p>
                                    <span>{c.revendFone}</span>
                                </div>
                                <div className="d-flex justify-content-between gap-1">
                                    <p className="mb-0 fw-semibold">Localização:</p>
                                    <span>{c.city} - {c.state}</span>
                                </div>
                                
                            </li>
                        ))}

                        </ul>

                    </div>
                    )}

            </div>

            {/* ACTION */}
            <div className="p-2">
                <button
                    type="button"
                    className="btn-custom btn-custom-outline-black w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => setShowModal(true)}
                >
                    <span style={{ fontSize: "18px" }}><PlusLg size={18}/></span>
                    Novo cliente
                </button>
            </div>
        </div>

        {/* PREVIEW DO CLIENTE */}
        {selectedClient && (
            <div className="table-responsive rounded-3 border">
                <table className="table table-hover align-middle mb-0">

                    {/* HEADER */}
                    <thead className="table-light">
                        <tr>
                            <th className="py-3 px-4 text-custom-black fw-bold">Nome</th>
                            <th className="py-3 px-4 text-custom-black fw-bold">Telefone do cliente</th>
                            <th className="py-3 px-4 text-custom-black fw-bold">Revenda</th>
                            <th className="py-3 px-4 text-custom-black fw-bold">Telefone da revenda</th>
                            <th className="py-3 px-4 text-custom-black fw-bold">Cidade / Estado</th>
                            <th className="py-3 px-4 text-custom-black fw-bold">Área</th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                        <tr>
                            <td className="px-4">
                                {selectedClient.name}
                            </td>

                            <td className="px-4 text-muted">
                                {selectedClient.clientFone}
                            </td>
                            <td className="px-4 text-muted">
                                {selectedClient.revend}
                            </td>
                            <td className="px-4 text-muted">
                                {selectedClient.revendFone}
                            </td>

                            <td className="px-4 text-muted">
                                {selectedClient.city} - {selectedClient.state}
                            </td>

                            <td className="px-4 text-muted">
                                Área: {selectedClient.area}
                            </td>
                        </tr>
                    </tbody>

                </table>
            </div>
        )}

        </div>

        {/* MODAL */}
        <NewClientModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onCreated={(client) => {
            onSelect(client);
            setShowModal(false);
            setOpen(false);
        }}
        />

    </div>
    );
}