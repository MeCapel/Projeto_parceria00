import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import type { Cliente } from '../../types'; 
import { createCliente, updateCliente, getClientes, deleteCliente } from '../../services/clienteServices';

export default function DisplayClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [show, setShow] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);

  const [nome, setNome] = useState("");
  const [revenda, setRevenda] = useState("");
  const [telefone, setTelefone] = useState("");
  const [area, setArea] = useState("");

  useEffect(() => {
    const unsubscribe = getClientes((dados) => {
      setClientes(dados);
    });
    return () => unsubscribe();
  }, []);

  const handleShow = (cliente?: Cliente) => {
    if (cliente) {
      setClienteEditando(cliente);
      setNome(cliente.nome);
      setRevenda(cliente.revenda);
      setTelefone(cliente.telefone);
      setArea(cliente.area);
    } else {
      setClienteEditando(null);
      setNome(""); setRevenda(""); setTelefone(""); setArea("");
    }
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleSave = async () => {
    if (clienteEditando) {
      await updateCliente(clienteEditando.id, nome, revenda, telefone, area);
    } else {
      await createCliente(nome, revenda, telefone, area);
    }
    handleClose();
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Clientes</h1>
        <button className="btn-custom btn-custom-success px-4" onClick={() => handleShow()}>
          + Novo Cliente
        </button>
      </div>

      {clientes.length === 0 ? (
        <div className="bg-light p-5 rounded-3 text-center border">
          <p className="fs-4 mb-0">Nenhum cliente cadastrado.</p>
        </div>
      ) : (
        <div className="table-responsive bg-light p-3 rounded-3 border">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Revenda</th>
                <th>Telefone</th>
                <th>Área</th>
                <th className="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td className="fw-bold">{cliente.nome}</td>
                  <td>{cliente.revenda}</td>
                  <td>{cliente.telefone}</td>
                  <td>{cliente.area}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleShow(cliente)}>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteCliente(cliente.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">
            {clienteEditando ? 'Editar Cliente' : 'Novo Cliente'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4">
          <div className="row g-4">
            <div className="col-md-6 d-flex flex-column gap-2">
              <label className="fw-semibold">Nome</label>
              <input type="text" className="py-2 px-3 rounded-2 border" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="col-md-6 d-flex flex-column gap-2">
              <label className="fw-semibold">Revenda</label>
              <input type="text" className="py-2 px-3 rounded-2 border" value={revenda} onChange={(e) => setRevenda(e.target.value)} />
            </div>
            <div className="col-md-6 d-flex flex-column gap-2">
              <label className="fw-semibold">Telefone</label>
              <input type="text" className="py-2 px-3 rounded-2 border" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
            </div>
            <div className="col-md-6 d-flex flex-column gap-2">
              <label className="fw-semibold">Área</label>
              <input type="text" className="py-2 px-3 rounded-2 border" value={area} onChange={(e) => setArea(e.target.value)} />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 px-4 pb-4">
          <Button variant="light" onClick={handleClose}>Cancelar</Button>
          <button className="btn-custom btn-custom-success px-4" onClick={handleSave}>
            Salvar
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}