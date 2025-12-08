import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { 
    createNewChecklistVersion, 
    deleteChecklistModel, 
    getChecklistModel, 
    type Categories, 
    type CheckboxItem, 
    type Checklist 
} from "../../services/checklistServices2";

import { 
    ThreeDotsVertical, 
    PencilSquare, 
    Trash3Fill, 
    Dash, 
    PlusLg 
} from "react-bootstrap-icons";

import { Modal } from "react-bootstrap";

interface Props {
    checklistId: string,
    inline?: boolean,
}

export default function ChecklistCard({ checklistId, inline } : Props)
{
    const navigate = useNavigate();
    const menuRef = useRef<HTMLDivElement | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);

    const [loading, setLoading] = useState(false);
    const [moreOptions, setMoreOptions] = useState(false);

    const [checklist, setChecklist] = useState<Checklist>({
        id: "",
        name: "",
        vertical: "",
        categories: [],
        version: 0,
        originalModel: "",
        createdAt: "",
    });

    // ✨ NOVO: Estado separado para edição
    const [editChecklist, setEditChecklist] = useState<Checklist | null>(null);

    const [itemInputs, setItemInputs] = useState<Record<number, string>>({});
    const [newCategoryName, setNewCategoryName] = useState("");

    const [show1, setShow1] = useState<boolean>(false);
    const [show2, setShow2] = useState<boolean>(false);

    // -------- MODAL EDIT --------
    const openModal1 = () => {
        setEditChecklist(structuredClone(checklist));  // cópia profunda
        setItemInputs({});
        setNewCategoryName("");
        setShow1(true);
    };

    const closeModal1 = () => {
        if (formRef.current) formRef.current.classList.remove("was-validated");
        setShow1(false);
    };

    // -------- MODAL DELETE --------
    const openModal2 = () => setShow2(true);
    const closeModal2 = () => setShow2(false);

    // Load checklist
    useEffect(() => {
        if (!checklistId) return;

        async function fetchData() {
            const data = await getChecklistModel(checklistId!);
            if (data) setChecklist(data);
        }
        
        fetchData();
    }, [checklistId]);

    // Click outside menu
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const modalOpen = show1 || show2;
            if (modalOpen) return;

            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMoreOptions(false);
            }
        }

        if (moreOptions) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [moreOptions, show1, show2]);

    // ==============================
    //      LÓGICA DE EDIÇÃO
    // ==============================

    const handleNewCategory = () => {
        if (!newCategoryName.trim() || !editChecklist) return;

        const newCat: Categories = {
            name: newCategoryName.trim(),
            items: []
        };

        setEditChecklist(prev => ({
            ...prev!,
            categories: [...prev!.categories, newCat]
        }));

        setNewCategoryName("");
    };

    const handleNewItem = (catIndex: number) => {
        if (!editChecklist) return;

        const itemName = itemInputs[catIndex]?.trim();
        if (!itemName) return;

        const newItem: CheckboxItem = {
            id: crypto.randomUUID(),
            label: itemName,
            checked: false
        };

        setEditChecklist(prev => {
            const updatedCats = structuredClone(prev!.categories);
            updatedCats[catIndex].items.push(newItem);

            return { ...prev!, categories: updatedCats };
        });

        setItemInputs(prev => ({ ...prev, [catIndex]: "" }));
    };

    const handleDropItem = (catIndex: number, itemId: string) => {
        if (!editChecklist) return;

        setEditChecklist(prev => {
            const updated = structuredClone(prev!.categories);
            updated[catIndex].items = updated[catIndex].items.filter(i => i.id !== itemId);
            return { ...prev!, categories: updated };
        });
    };

    const handleDropCategory = (catIndex: number) => {
        if (!editChecklist) return;

        setEditChecklist(prev => {
            const updated = prev!.categories.filter((_, i) => i !== catIndex);

            const newInputs: Record<number, string> = {};
            updated.forEach((_, newIndex) => {
                newInputs[newIndex] = itemInputs[newIndex] || "";
            });

            setItemInputs(newInputs);

            return { ...prev!, categories: updated };
        });
    };

    // DELETE
    const handleDelete = async () => {
        await deleteChecklistModel(checklistId!);
        closeModal2();
        navigate("/home");
    }

    // SAVE (create new version)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editChecklist) return;

        if (!editChecklist.name ||
            !editChecklist.vertical ||
            editChecklist.categories.length === 0 ||
            editChecklist.categories.some(cat => cat.items.length === 0)
        ) {
            alert("Preencha todos os campos, categorias e itens.");
            return;
        }

        setLoading(true);

        try {
            await createNewChecklistVersion(editChecklist, checklistId);

            // Atualiza card depois que salva
            setChecklist(editChecklist);

            closeModal1();
            navigate("/home");
        } catch (err) {
            console.error("Erro ao criar checklist modelo:", err);
        } finally {
            setLoading(false);
        }
    };

    // ==============================
    //           RENDER
    // ==============================

    return (
        <>
            {inline ?
                (
                    <div
                        key={checklist.id}
                        className="w-100 d-flex align-items-center justify-content-between px-4 py-3 rounded-3 shadow-sm border bg-white"
                        style={{
                            // minWidth: "200px",
                            // maxWidth: "250px",
                            flex: "1 1 auto",
                            cursor: "pointer"
                        }}

                    >
                        <div className="d-flex flex-column">
                            <span className="fw-bold text-custom-black">{checklist.name}</span>
                            <small className="text-muted">{checklist.categories.length} categoria(as)</small>
                        </div>

                        <span 
                            className="badge bg-custom-red00 text-white"
                            style={{ padding: "0.45rem 0.75rem" }}
                        >
                            v{checklist.version}
                        </span>

                        <div className="d-flex gap-3">
                            <button onClick={openModal1} className="btn-custom btn-custom-secondary w-100 d-flex gap-2 align-items-center">
                                <PencilSquare size={18} className=""/>
                                <span className="">Editar</span>
                            </button>

                            <button onClick={openModal2} className="btn btn-danger w-100 d-flex gap-2 align-items-center">
                                <Trash3Fill size={18} className=""/>
                                <span className="">Excluir</span>
                            </button>
                        </div>
                    </div>
                ) : 
                (
                    <div
                        className="card shadow border rounded-3 h-auto"
                        style={{
                            width: "18rem",
                            maxWidth: "18rem",
                            background: "#fff",
                            overflow: "hidden",
                            padding: "1.2rem"
                        }}
                    >

                        {/* Topo: Título + menu */}
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            
                            <h5
                                className="text-custom-black fw-bold fs-4 m-0"
                            >
                                {checklist.name} • v{checklist.version}
                            </h5>

                            <div style={{ position: "relative" }}>
                                <div 
                                    onClick={() => setMoreOptions(!moreOptions)}
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ padding: "0.5rem", borderRadius: "8px", cursor: "pointer" }}
                                >
                                    <ThreeDotsVertical size={22} className="text-secondary" />
                                </div>

                                {moreOptions && (
                                    <div
                                        ref={menuRef}
                                        style={{ top: "1.8rem", right: 0, minWidth: "12rem" }}
                                        className="position-absolute rounded-3 shadow-sm p-2 bg-white z-3 border"
                                    >
                                        <button onClick={openModal1} className="btn w-100 d-flex gap-2 align-items-center text-start">
                                            <PencilSquare size={18} className="text-danger"/>
                                            <span className="text-dark">Editar</span>
                                        </button>

                                        <button onClick={openModal2} className="btn w-100 d-flex gap-2 align-items-center text-start">
                                            <Trash3Fill size={18} className="text-danger"/>
                                            <span className="text-dark">Excluir</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Subtítulo (vertical + versão) */}
                        <div
                            className="mb-2"
                        >
                            <h6 className="text-muted m-0">
                                {checklist.vertical || "Vertical não definida"}
                            </h6>
                        </div>

                        {/* Quantidade de categorias */}
                        <div
                            onClick={() => navigate(location)}
                            className="mt-1"
                        >
                            <p className="fs-5 mb-0" style={{ color: "var(--red00)" }}>
                                {checklist.categories.length} categorias
                            </p>
                        </div>

                    </div>
                )
            }

            {/* ======================== */}
            {/*   MODAL DE EDIÇÃO        */}
            {/* ======================== */}

            <Modal show={show1} onHide={closeModal1} centered size="lg">
                <Modal.Header closeButton className="border-0 mt-3 mx-3" />
                <Modal.Body className="d-flex flex-column align-items-center mb-4">

                {editChecklist && (
                    <form onSubmit={handleSubmit} className="w-100 mt-0 py-0 px-5 d-flex flex-column">

                        {/* título */}
                        <div className="test-start">
                            <p className='fs-5 mb-0 text-custom-red'>Editar</p>
                            <h1 className='text-custom-black fw-bold mb-1'>{editChecklist.name}</h1>
                        </div>

                        <div className="d-flex flex-column my-4 gap-3">

                            <div className="form-floating mb-3">
                                <input
                                    id="checklistName"
                                    type="text"
                                    required
                                    value={editChecklist.name}
                                    className="form-control"
                                    onChange={e => setEditChecklist(prev => ({ ...prev!, name: e.target.value }))}
                                />
                                <label htmlFor="checklistName">Nome da checklist</label>
                            </div>

                            {/* Vertical */}
                            <fieldset className="col d-flex flex-column mt-3 align-items-start border rounded-2">
                                <div className="d-flex py-1 px-3 align-items-center justify-content-center rounded-5 border bg-custom-gray00"
                                     style={{ top: "-1.75rem", position: "relative" }}>
                                    <legend className='mb-0 text-white fs-5'>Vertical</legend>
                                </div>

                                <div className="d-flex w-100 gap-5 align-items-start justify-content-center"
                                     style={{ position: "relative", top: "-1rem" }}>

                                    {["Preparo", "Plantio", "Pulverização"].map(v => (
                                        <label key={v} className="d-flex gap-2 form-check-label">
                                            <input
                                                value={v}
                                                type="radio"
                                                name="vertical"
                                                className='form-check-input'
                                                checked={editChecklist.vertical === v}
                                                onChange={(e) => setEditChecklist(prev => ({ ...prev!, vertical: e.target.value }))}
                                            />
                                            {v}
                                        </label>
                                    ))}
                                </div>
                            </fieldset>

                            {/* Nova categoria */}
                            <h3 className="text-center fw-bold text-custom-black mt-2">Adicionar categoria</h3>

                            <div className="d-flex gap-3">
                                <div className="form-floating mb-3 w-100">
                                    <input
                                        type="text"
                                        id="categoryName"
                                        value={newCategoryName}
                                        className="form-control"
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                    />
                                    <label htmlFor="categoryName">Nome da nova categoria</label>
                                </div>

                                <button
                                    type="button"
                                    style={{ height: "3.5rem" }}
                                    onClick={handleNewCategory}
                                    className="btn-custom btn-custom-outline-success d-flex align-items-center justify-content-center"
                                >
                                    <PlusLg size={18}/>
                                </button>
                            </div>

                            {/* Lista de categorias */}
                            <div className="d-flex flex-column gap-4 mt-4 scroll-area">
                                {editChecklist.categories.length === 0 && (
                                    <p className="text-center">Adicione categorias ao checklist...</p>
                                )}

                                {editChecklist.categories.map((cat, catIndex) => (
                                    <div key={catIndex} className="border rounded p-3 mb-3">
                                        <h5 className="d-flex justify-content-between">
                                            {cat.name}
                                            <button
                                                type="button"
                                                className="btn btn-danger"
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
                                                    className="btn btn-outline-danger"
                                                >
                                                    <Dash size={18}/>
                                                </button>
                                            </div>
                                        ))}

                                        {/* input novo item */}
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
                                                className="btn btn-custom-outline-success"
                                            >
                                                <PlusLg size={18}/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* Submit */}
                        <div className="d-flex align-items-center justify-content-between">
                            <button type="button" className="btn-custom btn-custom-primary" onClick={openModal2}>
                                Excluir
                            </button>
                            <button className="btn-custom btn-custom-success" type="submit" disabled={loading}>
                                {loading ? "Salvando..." : "Salvar"}
                            </button>
                        </div>
                    </form>
                )}

                </Modal.Body>
            </Modal>

            {/* ======================== */}
            {/*     MODAL DELETE         */}
            {/* ======================== */}

            <Modal show={show2} onHide={closeModal2} centered>
                <Modal.Header closeButton className="mt-3 mx-3 fs-5 fw-semibold">Confirmação</Modal.Header>
                <Modal.Body className="text-center mb-4">
                    <p className="mb-5 fs-4">
                        Tem certeza de que deseja 
                        <span className="text-danger"> excluir </span> 
                        este modelo de checklist?
                    </p>

                    <div className="d-flex gap-3 align-items-center justify-content-center">
                        <button type="button" className="btn-custom btn-custom-outline-secondary" onClick={closeModal2}>
                            Cancelar
                        </button>

                        <button 
                            type="button" 
                            className="btn-custom btn-custom-outline-primary"
                            onClick={handleDelete}
                        >
                            Excluir
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
