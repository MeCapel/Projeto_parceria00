// ===== GERAL IMPORTS =====

import { useState } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router";
import DisplayChecklistsModel from "./DisplayChecklists2";
import { Trash3Fill, PlusLg, Dash } from "react-bootstrap-icons";
import { createChecklistModel, type Checklist, type Categories, type CheckboxItem } from "../../services/checklistServices2";

// ===== MAIN COMPONENT =====

export default function AddChecklistModel() {
    
    // ===== DECLARING & INITIALIZING VARIABLES =====

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);

    const openModal = () => setShow(true);
    const closeModal = () => {
        resetForm();
        setShow(false);
    };

    const [checklist, setChecklist] = useState<Checklist>({
        name: "",
        vertical: "",
        categories: [],
        version: 1,
        createdAt: ""
    });

    const [itemInputs, setItemInputs] = useState<Record<number, string>>({});
    const [newCategoryName, setNewCategoryName] = useState("");

    const resetForm = () => {
        setChecklist({
            name: "",
            vertical: "",
            categories: [],
            version: 1,
            createdAt: ""
        });

        setItemInputs({});
        setNewCategoryName("");
    };

    // Criar categoria
    const handleNewCategory = () => {
        if (!newCategoryName.trim()) return;

        const newCat: Categories = {
            name: newCategoryName.trim(),
            items: []
        };

        setChecklist(prev => ({
            ...prev,
            categories: [...prev.categories, newCat]
        }));

        setNewCategoryName("");
    };

    // Criar item dentro da categoria certa
    const handleNewItem = (catIndex: number) => {
        const itemName = itemInputs[catIndex]?.trim();
        if (!itemName) return;

        const newItem: CheckboxItem = {
            id: crypto.randomUUID(),
            label: itemName,
            checked: false
        };

        setChecklist(prev => {
            const updatedCats = [...prev.categories];
            updatedCats[catIndex].items.push(newItem);
            return { ...prev, categories: updatedCats };
        });

        // limpar input do item
        setItemInputs(prev => ({ ...prev, [catIndex]: "" }));
    };

    // Remover item
    const handleDropItem = (catIndex: number, itemId: string) => {
        setChecklist(prev => {
            const updated = [...prev.categories];
            updated[catIndex].items = updated[catIndex].items.filter(i => i.id !== itemId);
            return { ...prev, categories: updated };
        });
    };

    // Remover categoria
    const handleDropCategory = (catIndex: number) => {
        setChecklist(prev => {
            const updated = prev.categories.filter((_, i) => i !== catIndex);

            // Realinha os itemInputs
            const newInputs: Record<number, string> = {};
            updated.forEach((_, newIndex) => {
                newInputs[newIndex] = itemInputs[newIndex] || "";
            });

            setItemInputs(newInputs);

            return { ...prev, categories: updated };
        });
    };

    // Submit final
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validações
        if (
            !checklist.name ||
            !checklist.vertical ||
            checklist.categories.length === 0 ||
            checklist.categories.some(cat => cat.items.length === 0)
        ) {
            alert("Preencha todos os campos, categorias e itens.");
            return;
        }

        setLoading(true);

        try {
            await createChecklistModel({
                ...checklist,
                createdAt: new Date().toISOString()
            });

            closeModal();
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
                
                <div className="d-flex flex-column col-12 col-md-10" >
                    <p 
                        style={{ cursor: "pointer" }}
                        className='mb-0 text-custom-red fs-5'
                        onClick={() => navigate(`/checklists`)}
                    >
                        Modelos de Checklist
                    </p>
                    <p className='mb-0 text-custom-black fs-1 fw-bold'>Gerenciar modelos</p>
                </div>

                <div className="d-flex gap-3 align-items-end justify-content-end col-12 col-md-2 my-3 my-md-0">
                    <button className='btn-custom btn-custom-success' onClick={openModal}>
                        <PlusLg size={30}/>
                    </button>
                </div>
            </div>

            <DisplayChecklistsModel inline={false} />

            <Modal show={show} onHide={closeModal} dialogClassName="" centered className='p-0' size="lg">
                <Modal.Header closeButton className="border-0 mt-3 mx-3"></Modal.Header>

                <Modal.Body className="d-flex flex-column align-items-center mb-4">
                    <form onSubmit={handleSubmit} className="w-100 mt-0 pt-0 px-5 modal-custom">

                        {/* --- Title div --- */}
                        <div className="">
                            <p className='fs-5 mb-0 text-custom-red'>Adicionar</p>
                            <h1 className='text-custom-black fw-bold mb-1'>Novo modelo de checklist</h1>
                        </div>

                        <div className="d-flex flex-column my-4 gap-3">

                            <div className="form-floating mb-3">

                                <input
                                    id="checklistName"
                                    type="text"
                                    required
                                    value={checklist.name}
                                    className="form-control"
                                    placeholder="Nome do checklist..."
                                    onChange={e => setChecklist(prev => ({ ...prev, name: e.target.value }))}
                                />
                                <label htmlFor="checklistName">Nome da checklist</label>
                            </div>

                            {/* Vertical */}
                            <fieldset className="col d-flex flex-column mt-3 p-2 align-items-start border rounded-2">

                                <div className="d-flex py-1 px-3 align-items-start justify-content-center rounded-5 border bg-custom-gray00"
                                    style={{ top: "-1.75rem", position: "relative" }}>
                                    <legend className='mb-0 text-white fs-5'>Vertical</legend>
                                </div>

                                <div className="d-flex w-100 gap-5 align-items-start justify-content-center" style={{ position: "relative", top: "-1rem" }}>

                                    {["Preparo", "Plantio", "Pulverização"].map(v => (
                                        <label key={v} className="d-flex gap-2 form-check-label">
                                            <input
                                                value={v}
                                                type="radio"
                                                name="vertical"
                                                className='form-check-input'
                                                checked={checklist.vertical === v}
                                                onChange={(e) => setChecklist(prev => ({ ...prev, vertical: e.target.value }))}
                                            />
                                            {v}
                                        </label>
                                    ))}

                                </div>

                            </fieldset>

                            {/* Nova categoria */}
                            <h3 className="text-center fw-bold text-custom-black my-3">Adicionar categoria</h3>
                            
                            <div className="d-flex gap-3">
                                <div className="form-floating mb-3 w-100">
                                        <input
                                            type="text"
                                            id="categoryName"
                                            value={newCategoryName}
                                            className="form-control"
                                            placeholder="Nome da categoria..."
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                        />
                                    <label htmlFor="categoryName" className="d-flex flex-column gap-3">Nome da nova categoria</label>
                                </div>

                                <button 
                                    style={{ height: "3.5rem" }}
                                    type="button" onClick={handleNewCategory}
                                    className="btn-custom btn-custom-outline-success d-flex align-items-center justify-content-center" 
                                >
                                    <PlusLg size={18}/>
                                </button>
                            </div>

                            {/* Lista de categorias */}
                            <div className="d-flex flex-column gap-4 mt-4 modal-custom-body-inner">
                                {checklist.categories.length === 0 && (
                                    <p className="text-center">Adicione categorias ao checklist...</p>
                                )}

                                {checklist.categories.map((cat, catIndex) => (
                                    <div key={catIndex} className="border rounded p-3 mb-3">
                                        <h5 className="d-flex justify-content-between">
                                            {cat.name}
                                            <button
                                                type="button"
                                                className="btn btn-danger d-flex align-items-center justify-content-center"
                                                onClick={() => handleDropCategory(catIndex)}
                                            >
                                                <Trash3Fill size={18}/>
                                            </button>
                                        </h5>

                                        {/* Items */}
                                        {cat.items.map(item => (
                                            <div key={item.id} className="d-flex align-items-center justify-content-between gap-2 py-1 ps-3">
                                                <div className="d-flex gap-3">
                                                    <input type="checkbox" checked={item.checked} readOnly />
                                                    <span>{item.label}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDropItem(catIndex, item.id)}
                                                    className="py-2 btn btn-outline-danger d-flex align-items-center justify-content-center"
                                                >
                                                    <Dash size={18}/>
                                                </button>
                                            </div>
                                        ))}

                                        {/* Input de item */}
                                        <div className="d-flex gap-2 mt-2">
                                            <input
                                                type="text"
                                                placeholder="adicione um item..."
                                                className="form-control"
                                                value={itemInputs[catIndex] || ""}
                                                onChange={(e) =>
                                                    setItemInputs(prev => ({
                                                        ...prev,
                                                        [catIndex]: e.target.value
                                                    }))
                                                }
                                            />

                                            <button
                                                type="button"
                                                onClick={() => handleNewItem(catIndex)}
                                                className="btn btn-custom-outline-success d-flex align-items-center justify-content-center"
                                            >
                                                <PlusLg size={18}/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Submit */}
                        <div className="d-flex align-items-center justify-content-end">
                            <button className="btn-custom btn-custom-success" type="submit" disabled={loading}>
                                {loading ? "Adicionando..." : "Criar modelo"}
                            </button>
                        </div>
                        
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
