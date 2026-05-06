import { useState } from "react";
import { useChecklistModels } from "../../../hooks/useChecklistModels";
import type { ChecklistModelInput } from "./ChecklistModelForm";
import CrudPageLayout from "../../Others/CrudPageLayout";
import CrudHeader from "../../Others/CrudHeader";
import SearchInput from "../../forms/SearchInput";
import ChecklistModelCard from "./ChecklistModelCard";
import CrudModal from "../../Others/CrudModal";
import ChecklistModelForm from "./ChecklistModelForm";
import { Modal } from "react-bootstrap";
import { Trash3Fill } from "react-bootstrap-icons";
import CrudList from "../../Others/CrudList";

export default function ChecklistModelPage() {
  const { checklistModels, createChecklistModel, updateChecklistModel, deleteChecklistModel } = useChecklistModels();

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<string | null>(null);

  const filtered = checklistModels.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleNew = () => {
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowModal(true);
  };

  const handleSave = async (data: ChecklistModelInput) => {
    if (editingId) {
      await updateChecklistModel(editingId, data);
    } else {
      await createChecklistModel(data);
    }

    setShowModal(false);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    await deleteChecklistModel(toDelete);
    setToDelete(null);
  };

  const editingItem = checklistModels.find(c => c.id === editingId);

  return (
    <>
      <CrudPageLayout
        header={
          <>
            <CrudHeader
              title="Checklist Models"
              subtitle="Gerencie seus modelos"
              onNew={handleNew}
            />

            <div className="pb-3">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Buscar checklist..."
              />
            </div>
          </>
        }

        list={
          <CrudList>
            {filtered.length === 0 ? ( // Usamos a lista filtrada aqui
                <div className="w-100 py-5 text-center border rounded bg-light">
                    <p className="text-muted mb-0">
                        {search ? "Nenhuma checklist modelo corresponde à sua busca." : "Nenhuma checklist modelo encontrado."}
                    </p>
                </div>
            ) : (
                filtered.map(c => ( // E aqui também
                    <div className="" key={c.id}>
                        <ChecklistModelCard
                            checklist={c}
                            onEdit={() => handleEdit(c.id)}
                            onDelete={() => setToDelete(c.id)}
                        />
                    </div>
                ))
            )}
          </CrudList>
        }

        modal={
          <CrudModal
            show={showModal}
            title="Modelo de Checklist"
            onClose={() => setShowModal(false)}
            edit={!!editingId}
          >
            <ChecklistModelForm
              key={editingId ?? "new"}
              initialData={editingItem}
              onSubmit={handleSave}
            />
          </CrudModal>
        }
      />

      <Modal
        show={!!toDelete}
        onHide={() => setToDelete(null)}
        centered
      >
        <Modal.Body className="text-center p-5">
          <Trash3Fill size={50} className="text-danger mb-4" />

          <h4 className="fw-bold mb-3">Excluir modelo de checklist?</h4>
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
