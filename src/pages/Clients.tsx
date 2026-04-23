import React, { useRef, useState } from "react";
import { useClients } from "../hooks/useClients";
import { Modal } from "react-bootstrap";
import CrudModal from "../components/Others/CrudModal";
import CrudPageLayout from "../components/Others/CrudPageLayout";
import CrudHeader from "../components/Others/CrudHeader";
import FormInput from "../components/forms/FormInput";
import { Trash3Fill } from "react-bootstrap-icons";
import { useForm } from "../hooks/useForm";
import { CrudTable } from "../components/Others/CrudTable";
import SelectLocation from "../components/Others/SelectLocation";
import FormFoneInput from "../components/forms/FormInputFone";
import SearchInput from "../components/forms/SearchInput"; // Import do SearchInput

export interface ClientForm {
    name: string,
    clientFone: string,
    revend: string,
    revendFone: string,
    state: string,
    city: string,
    area: string,
}

export default function Clients()
{
    const { clients, createClient, updateClient, deleteClient } = useClients();
    // Consulta Clientes pelo searchTerm
    const [search, setSearch] = useState("");
    // Filtra a lista baseada no nome ou na revenda
    // Caso necessário podem ser adicionados mais filtros
    const filteredData = clients.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.revend.toLowerCase().includes(search.toLowerCase())
    );


    const [showModal, setShowModal] = useState<boolean>(false);
    const [editingClientId, setEditingClientId] = useState<string | null>(null);
    const [clientToDelete, setClientToDelete] = useState<string | null>(null);

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

    const handleNew = () => {
        reset();
        setEditingClientId(null);
        setShowModal(true);
    };

    const handleEdit = (id: string) => {
        const client = clients.find(c => c.id === id);
        if(!client) return;

        setEditingClientId(id);
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

        if(!form.checkValidity())
        {
            const firstInvalid = form.querySelector<HTMLElement>(":invalid");
            if(firstInvalid) firstInvalid.focus();
            return;
        }

        if (editingClientId) {
            await updateClient({
                id: editingClientId,
                ...values
            });
        } else {
            await createClient(values);
        }

        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        setClientToDelete(id);
    };

    const confirmDelete = async () => {
        if (!clientToDelete) return;

        await deleteClient(clientToDelete);
        setClientToDelete(null);
    };

    return (
        <>
            <CrudPageLayout
                header={
                <>
                    <CrudHeader
                        title="Clientes"
                        subtitle="Gerencie seus clientes"
                        onNew={handleNew}
                    />
                    <div className="pb-3">
                        <SearchInput 
                            value={search} 
                            onChange={setSearch} 
                            placeholder="Pesquisar cliente ou revenda..." 
                        />
                    </div>
                </>
                }

                list={
                    <CrudTable
                        headers={["Nome", "Telefone do cliente", "Revenda", "Telefone da revenda", "Estado", "Cidade", "Área"]}

                        data={filteredData}

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
                            </>
                        )}

                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                }

                modal={
                    <CrudModal
                        show={showModal}
                        title={editingClientId ? "Editar cliente" : "Novo cliente"}
                        onClose={() => setShowModal(false)}
                        edit={!!editingClientId}
                    >
                        <form ref={formRef} onSubmit={handleSave} noValidate className="d-flex flex-column gap-3">
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
                }
            />

            <Modal 
                show={!!clientToDelete} 
                onHide={() => setClientToDelete(null)} 
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
                            onClick={() => setClientToDelete(null)}
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