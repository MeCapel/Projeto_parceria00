import { useState } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router";
import DisplayChecklistsModel from "./DisplayChechlists2";
import {
    createChecklistModel,
    type Checklist,
    type Categories,
    type CheckboxItem
} from "../../services/checklistServices2";

export default function AddChecklistModel() {
    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const openModal = () => setShow(true);
    const closeModal = () => {
        resetForm();
        setShow(false);
    };

    const [loading, setLoading] = useState(false);

    // CHECKLIST MODEL STATE
    const [checklist, setChecklist] = useState<Checklist>({
        name: "",
        vertical: "",
        categories: [],
        version: 1,
        createdAt: ""
    });

    const resetForm = () => {
        setChecklist({
            name: "",
            vertical: "",
            categories: [],
            version: 1,
            createdAt: ""
        });

        setNewCategoryName("");
    };

    // Campo de nova categoria
    const [newCategoryName, setNewCategoryName] = useState("");

    // Adicionar Categoria
    const handleNewCategory = () => {
        if (!newCategoryName.trim()) return;

        const newCat: Categories = {
            name: newCategoryName.trim(),
            items: [],
            newItemName: "" // campo local por categoria
        };

        setChecklist(prev => ({
            ...prev,
            categories: [...prev.categories, newCat]
        }));

        setNewCategoryName("");
    };

    // Adicionar Item dentro da categoria correta
    const handleNewItem = (catIndex: number) => {
        const itemName = checklist.categories[catIndex].newItemName?.trim();
        if (!itemName) return;

        const newItem: CheckboxItem = {
            id: Date.now().toString(),
            label: itemName,
            checked: false
        };

        setChecklist(prev => {
            const updated = [...prev.categories];
            updated[catIndex].items.push(newItem);
            updated[catIndex].newItemName = ""; // limpa input dessa categoria
            return { ...prev, categories: updated };
        });
    };

    // Remover Item
    const handleDropItem = (catIndex: number, itemId: string) => {
        setChecklist(prev => {
            const updated = [...prev.categories];
            updated[catIndex].items = updated[catIndex].items.filter(it => it.id !== itemId);
            return { ...prev, categories: updated };
        });
    };

    // Remover Categoria
    const handleDropCategory = (catIndex: number) => {
        setChecklist(prev => ({
            ...prev,
            categories: prev.categories.filter((_, i) => i !== catIndex)
        }));
    };

    // Submit final
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validações completas:
        if (
            !checklist.name ||
            !checklist.vertical ||
            checklist.categories.length === 0 ||
            checklist.categories.some(cat => cat.items.length === 0)
        ) {
            alert("Preencha todos os campos e adicione ao menos uma categoria com ao menos um item.");
            return;
        }

        setLoading(true);

        try {
            await createChecklistModel({
                ...checklist,
                createdAt: new Date().toISOString()
            });

            navigate("/home");
        } catch (err) {
            console.error("Erro ao criar checklist modelo:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-5 mx-3">
            <div className="d-flex row">
                <div className="d-flex flex-column col-12 col-md-10">
                    <p className='mb-0 text-custom-red fs-5'>Modelos de Checklist</p>
                    <p className='mb-0 text-custom-black fs-1 fw-bold'>Gerenciar modelos</p>
                </div>

                <div className="d-flex align-items-end justify-content-end col-12 col-md-2 my-3 my-md-0">
                    <button className='btn-custom btn-custom-primary' onClick={openModal}>
                        <p className='mb-0 fs-5 text-custom-white'>Adicionar</p>
                    </button>
                </div>
            </div>

            <DisplayChecklistsModel inline={false} />

            {/* ========= MODAL ========= */}
            <Modal show={show} onHide={closeModal} dialogClassName="modal-fullscreen" className='p-0'>
                <Modal.Header closeButton className="mb-0 mx-5 border-0 my-3"></Modal.Header>

                <Modal.Body className="container-fluid d-flex flex-column align-items-center m-auto">

                    <div className="d-flex p-5 align-items-center justify-content-center">
                        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">

                            <h1 className="text-custom-red00">Adicionar modelo de checklist</h1>

                            {/* NOME DO CHECKLIST */}
                            <input
                                type="text"
                                placeholder="Nome do checklist..."
                                required
                                className="form-control"
                                value={checklist.name}
                                onChange={e => setChecklist(prev => ({ ...prev, name: e.target.value }))}
                            />

                            {/* VERTICAL */}
                            <fieldset className="col d-flex flex-column mt-4 p-3 align-items-start border rounded-2">
                                <div className="d-flex py-1 px-3 align-items-start justify-content-center rounded-5 position-relative border bg-custom-gray00" 
                                    style={{ top: '-2.5rem' }}>
                                    <legend className='mb-0 text-white fs-5'>Vertical</legend>
                                </div>

                                <div className="d-flex w-100 gap-3 align-items-start justify-content-center position-relative" style={{ top: '-0.75rem' }}>
                                    
                                    {["Preparo","Plantio","Pulverização"].map(v => (
                                        <label key={v} className="d-flex gap-2 form-check-label">
                                            <input
                                                className='form-check-input'
                                                type="radio"
                                                name="vertical"
                                                value={v}
                                                checked={checklist.vertical === v}
                                                onChange={(e) =>
                                                    setChecklist(prev => ({ ...prev, vertical: e.target.value }))
                                                }
                                            />
                                            {v}
                                        </label>
                                    ))}

                                </div>
                            </fieldset>

                            {/* ADICIONAR CATEGORIA */}
                            <label className="d-flex flex-column gap-3">
                                <h3 className="mb-0 text-center fw-bold text-custom-black">
                                    Adicionar categoria
                                </h3>

                                <input
                                    type="text"
                                    placeholder="Nome da categoria..."
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    className="form-control"
                                />
                            </label>

                            <button className="btn-custom btn-custom-outline-primary" type="button" onClick={handleNewCategory}>
                                Adicionar categoria
                            </button>

                            {/* LISTA DE CATEGORIAS */}
                            <div className="d-flex flex-column gap-4 mt-4">

                                {checklist.categories.length === 0 && (
                                    <p>Adicione categorias ao checklist...</p>
                                )}

                                {checklist.categories.map((cat, catIndex) => (
                                    <div key={catIndex} className="border rounded p-3 mb-3">

                                        <h5 className="d-flex justify-content-between">
                                            {cat.name}
                                            <button type="button" className="btn btn-sm btn-danger"
                                                onClick={() => handleDropCategory(catIndex)}>
                                                Remover
                                            </button>
                                        </h5>

                                        {/* LISTA DE ITENS */}
                                        {cat.items.map(item => (
                                            <div key={item.id} className="d-flex align-items-center gap-2">
                                                <input type="checkbox" checked={item.checked} readOnly />
                                                <span>{item.label}</span>

                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger ms-2"
                                                    onClick={() => handleDropItem(catIndex, item.id)}
                                                >
                                                    X
                                                </button>
                                            </div>
                                        ))}

                                        {/* INPUT DE ITEM */}
                                        <div className="d-flex gap-2 mt-2">
                                            <input
                                                type="text"
                                                placeholder="adicione um item..."
                                                className="form-control"
                                                value={cat.newItemName || ""}
                                                onChange={(e) =>
                                                    setChecklist(prev => {
                                                        const updated = [...prev.categories];
                                                        updated[catIndex].newItemName = e.target.value;
                                                        return { ...prev, categories: updated };
                                                    })
                                                }
                                            />

                                            <button
                                                className="btn btn-primary"
                                                type="button"
                                                onClick={() => handleNewItem(catIndex)}
                                            >
                                                Adicionar
                                            </button>
                                        </div>

                                    </div>
                                ))}

                            </div>

                            {/* SUBMIT */}
                            <button className="btn-custom btn-custom-success" type="submit" disabled={loading}>
                                {loading ? "Adicionando..." : "Criar modelo"}
                            </button>

                        </form>
                    </div>

                </Modal.Body>
            </Modal>
        </div>
    );
}
