import { useState, useEffect } from "react";
import { type PrototypeProps } from "../../../services/prototypeServices";
import { getClientes, createCliente } from "../../../services/clienteServices";
import type { Cliente } from "../../../types";
import { Modal, Button } from "react-bootstrap";
import FormInput from "../../forms/FormInput";
import FormRadioGroup from "../../forms/FormRadioGroup";
import FormTextarea from "../../forms/FormTextarea";

interface Props {
  prototype: PrototypeProps;
  onChange: (data: Partial<PrototypeProps>) => void;
  onVerticalChange: (id: string) => void;
}

export default function PrototypeGeralInfosTab({
  prototype,
  onChange,
  onVerticalChange,
}: Props) {
  const [allClients, setAllClients] = useState<Cliente[]>([]);
  const [showClientModal, setShowClientModal] = useState(false);

  // Estados para o novo cliente no Modal
  const [newClientName, setNewClientName] = useState("");
  const [newClientRevenda, setNewClientRevenda] = useState("");
  const [newClientTelefone, setNewClientTelefone] = useState("");
  const [newClientArea, setNewClientArea] = useState("");

  // Carrega clientes em tempo real 📡
  useEffect(() => {
    const unsubscribe = getClientes((data) => {
      setAllClients(data);
    });
    return () => unsubscribe();
  }, []);

  function handleFieldChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    onChange({ [name]: value });
  }

  function handleStateChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onChange({
      state: e.target.value,
      city: "", // Reset cidade ao trocar estado
    });
  }

  async function handleQuickCreateClient() {
    if (!newClientName) return;
    
    // Agora enviando Nome, Revenda, Telefone e Área
    const id = await createCliente(
      newClientName, 
      newClientRevenda, 
      newClientTelefone, 
      newClientArea
    );

    if (id) {
      onChange({ clientId: id });
      setShowClientModal(false);
      // Limpa os campos após salvar
      setNewClientName("");
      setNewClientRevenda("");
      setNewClientTelefone("");
      setNewClientArea("");
    }
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h4 className="fw-bold text-custom-black mb-0">Informações gerais</h4>
          <small className="text-muted">Gestão do protótipo e localização</small>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <FormInput
              label="N° de série"
              name="code"
              value={prototype.code ?? ""}
              onChange={handleFieldChange}
            />
          </div>
          <div className="col-12 col-md-6">
            <FormInput
              label="Nome do protótipo"
              name="name"
              value={prototype.name}
              onChange={handleFieldChange}
            />
          </div>
        </div>

        <div className="row g-3 mt-2">
          <div className="col-12 col-md-6">
            <FormRadioGroup
              label="Etapa"
              name="stage"
              value={prototype.stage}
              options={["Fabricação", "Montagem", "Validação de campo"]}
              onChange={handleFieldChange}
            />
          </div>
          <div className="col-12 col-md-6">
            <FormRadioGroup
              label="Vertical"
              name="vertical"
              value={prototype.vertical}
              options={["Preparo", "Plantio", "Pulverização"]}
              onChange={(e) => {
                handleFieldChange(e);
                onVerticalChange(prototype.id!);
              }}
            />
          </div>
        </div>

        {/* Seção Condicional: Validação de Campo 🌾 */}
        {prototype.stage === "Validação de campo" && (
          <div className="mt-4 p-3 border rounded bg-light shadow-sm">
            <h6 className="fw-bold mb-3 text-success">Dados de Validação</h6>

            <div className="mb-3">
              <label className="form-label fw-semibold">Cliente / Parceiro</label>
              <div className="d-flex gap-2">
                <select
                  name="clientId"
                  className="form-select"
                  value={prototype.clientId ?? ""}
                  onChange={handleFieldChange}
                >
                  <option value="">Selecione um cliente</option>
                  {allClients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome} ({c.revenda})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-success px-3"
                  onClick={() => setShowClientModal(true)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-4">
                <div className="form-floating">
                  <select
                    name="state"
                    className="form-select"
                    value={prototype.state}
                    onChange={handleStateChange}
                  >
                    <option value="">Escolha o estado</option>
                    <option value="AC">AC</option>
                    <option value="AL">AL</option>
                    <option value="AP">AP</option>
                    <option value="AM">AM</option> 
                    <option value="BA">BA</option>
                    <option value="CE">CE</option>
                    <option value="DF">DF</option> 
                    <option value="ES">ES</option>
                    <option value="GO">GO</option>
                    <option value="MA">MA</option> 
                    <option value="MT">MT</option>
                    <option value="MS">MS</option>
                    <option value="MG">MG</option> 
                    <option value="PA">PA</option>
                    <option value="PB">PB</option>
                    <option value="PR">PR</option> 
                    <option value="PE">PE</option>
                    <option value="PI">PI</option>
                    <option value="RJ">RJ</option> 
                    <option value="RN">RN</option>
                    <option value="RS">RS</option>
                    <option value="RO">RO</option>
                    <option value="RR">RR</option>
                    <option value="SC">SC</option>
                    <option value="SP">SP</option>
                    <option value="SE">SE</option>
                    <option value="TO">TO</option>
                  </select>
                  <label>Estado</label>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    name="city"
                    placeholder="Cidade"
                    className="form-control"
                    value={prototype.city}
                    onChange={handleFieldChange}
                  />
                  <label>Cidade</label>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <FormInput
                  label="Área (ha)"
                  name="areaSize"
                  value={prototype.areaSize ?? ""}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-3">
          <FormTextarea
            label="Descrição"
            name="description"
            value={prototype.description}
            onChange={handleFieldChange}
          />
        </div>
      </form>

      {/* Modal Completo para Novo Cliente 👥 */}
      <Modal show={showClientModal} onHide={() => setShowClientModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold text-success">Novo Cliente / Parceiro</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-bold">Nome do Cliente</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ex: João Silva"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold">Nome da Revenda</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ex: Revenda Matão"
                value={newClientRevenda}
                onChange={(e) => setNewClientRevenda(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold">Telefone</label>
              <input
                type="text"
                className="form-control"
                placeholder="(00) 00000-0000"
                value={newClientTelefone}
                onChange={(e) => setNewClientTelefone(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold">Área da Propriedade</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ex: 500 ha"
                value={newClientArea}
                onChange={(e) => setNewClientArea(e.target.value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="light" onClick={() => setShowClientModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" className="px-4" onClick={handleQuickCreateClient}>
            Salvar e Selecionar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}