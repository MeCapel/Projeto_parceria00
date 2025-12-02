import { useState, useEffect, type FormEvent } from "react";
import { XLg } from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router";
import { getPrototype, type PrototypeProps, updatePrototype, deletePrototype, addChecklistToPrototype, deletePrototypeChecklist,} from '../../services/prototypeServices2';
import ManageChecklistsModal from "./ManageChecklists";
import { type Checklist } from "../../services/checklistServices2";
import DisplayPrototypeChecklists from "../04ChecklistRelated/DisplayPrototypeCheklists";

export default function PrototypeInner() {
    const { prototypeid } = useParams();
    const navigate = useNavigate();

    const [prototype, setPrototype] = useState<PrototypeProps & { id?: string; checklists?: Checklist[] }>({
        projectId: "",
        code: "",
        name: "",
        description: "",
        stage: "",
        state: "",
        city: "",
        areaSize: "",
        vertical: "",
        editedAt: [],
        createdAt: undefined,
        checklists: [],
    });

    const [originalChecklists, setOriginalChecklists] = useState<Checklist[]>([]);
    const [selectedChecklists, setSelectedChecklists] = useState<Checklist[]>([]);
    const [cityError, setCityError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!prototypeid) return;

        async function fetchData() {
            const data = await getPrototype(prototypeid!);
            if (data) {
                console.log(data);
                // garante que todos os campos obrigatórios existem
                const proto: PrototypeProps & { id?: string; checklists?: Checklist[] } = {
                    projectId: data.projectId || "",
                    code: data.code || "",
                    name: data.name || "",
                    description: data.description || "",
                    stage: data.stage || "",
                    vertical: data.vertical || "",
                    state: data.state || "",
                    city: data.city || "",
                    areaSize: data.areaSize || "",
                    editedAt: data.editedAt || [],
                    createdAt: data.createdAt,
                    checklists: data.checklists || [],
                    id: prototypeid,
                };
                setPrototype(proto);
                setOriginalChecklists(proto.checklists || []);
                setSelectedChecklists(proto.checklists || []);
            }
            setLoading(false);
        }

        fetchData();
    }, [prototypeid]);

    function updateField<K extends keyof PrototypeProps>(name: K, value: PrototypeProps[K]) {
        setPrototype(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleChecklistUpdate = (updatedChecklist: Checklist) => {
        setPrototype(prev => ({
            ...prev,
            checklists: prev.checklists!.map(cl => 
                cl.id === updatedChecklist.id ? updatedChecklist : cl
            )
        }));
    };

    async function handleSave(e: FormEvent) {
        e.preventDefault();
        if (!prototype.id) return;

        // 1️⃣ Salva dados do protótipo
        const result = await updatePrototype(prototype as PrototypeProps & { id: string });
        if (!result) return;

        // 2️⃣ Atualiza checklists do protótipo
        const toAdd = selectedChecklists.filter(sc => !originalChecklists.some(oc => oc.id === sc.id));
        const toRemove = originalChecklists.filter(oc => !selectedChecklists.some(sc => sc.id === oc.id));

        for (const checklist of toAdd) {
            await addChecklistToPrototype(prototype.id, checklist.id);
        }
        for (const checklist of toRemove) {
            await deletePrototypeChecklist(prototype.id, checklist.id);
        }

        navigate(`/projects/${prototype.projectId}`);
    }

    async function handleDelete() {
        if (!prototype.id) return;

        const confirmDelete = confirm("Tem certeza que deseja deletar este protótipo?");
        if (!confirmDelete) return;

        const result = await deletePrototype(prototype.id);
        if (result) {
            alert("Protótipo deletado com sucesso!");
            navigate(`/projects/${prototype.projectId}`);
        }
    }

    if (loading) return <p>Carregando...</p>;

    return (
        <div className="container-fluid d-flex flex-column align-items-center m-auto my-5 pt-5">
            <form onSubmit={handleSave}>
                {/* --- Título --- */}
                <div className="mb-5 d-flex align-items-center justify-content-between">
                    <div>
                        <p className='fs-5 mb-0 text-custom-red'>Edição</p>
                        <p className='text-custom-black display-6 fw-bold mb-1'>{prototype.name}</p>
                    </div>
                    <div className="btn-custom">
                        <XLg size={25} onClick={() => navigate(`/projects/${prototype.projectId}`)} />
                    </div>
                </div>

                {/* --- Inputs principais --- */}
                <div className="row">
                    <div className="col">
                        <input type="text" placeholder='N° de série' className='form-control text-custom-black py-1 px-3 fs-5 border rounded-2'
                            required value={prototype.code} onChange={(e) => updateField("code", e.target.value)} />
                    </div>
                    <div className="col">
                        <input type="text" placeholder='Nome do protótipo' className='form-control text-custom-black py-1 px-3 fs-5 border rounded-2'
                            required value={prototype.name} onChange={(e) => updateField("name", e.target.value)} />
                    </div>
                </div>

                {/* --- Radio status e vertical --- */}
                <div className="row mt-4">
                    <div className="col">
                        <fieldset className="d-flex flex-column mt-5 p-3 align-items-start border rounded-2">
                            <div className="d-flex py-1 px-3 align-items-start justify-content-center rounded-5 position-relative border bg-custom-gray00"
                                style={{ top: '-2.5rem' }}>
                                <legend className='mb-0 text-white fs-5'>Etapa</legend>
                            </div>
                            <div className="d-flex w-100 gap-3 align-items-start justify-content-center position-relative" style={{ top: '-0.75rem' }}>
                                {["Fabricação", "Montagem", "Validação de campo"].map(s => (
                                    <label key={s} className="d-flex gap-2 form-check-label">
                                        <input className='form-check-input' type="radio" name="status" value={s}
                                            checked={prototype.stage === s} onChange={(e) => updateField("stage", e.target.value)} />
                                        {s}
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                    </div>

                    <div className="col">
                        <fieldset className="d-flex flex-column mt-5 p-3 align-items-start border rounded-2">
                            <div className="d-flex py-1 px-3 align-items-start justify-content-center rounded-5 position-relative border bg-custom-gray00"
                                style={{ top: '-2.5rem' }}>
                                <legend className='mb-0 text-white fs-5'>Vertical</legend>
                            </div>
                            <div className="d-flex w-100 gap-3 align-items-start justify-content-center position-relative" style={{ top: '-0.75rem' }}>
                                {["Preparo", "Plantio", "Pulverização"].map(p => (
                                    <label key={p} className="d-flex gap-2 form-check-label">
                                        <input className='form-check-input' type="radio" name="vertical" value={p}
                                            checked={prototype.vertical === p} onChange={(e) => updateField("vertical", e.target.value)} />
                                        {p}
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <DisplayPrototypeChecklists checklists={prototype.checklists!} prototypeId={prototypeid!} onUpdate={handleChecklistUpdate} />
                    </div>

                </div>

                {/* --- Inputs adicionais --- */}
                <div className="row mt-4">
                    <div className="col d-flex flex-column gap-3">
                        <select name="estado" className='form-select' value={prototype.state} onChange={(e) => updateField("state", e.target.value)}>
                            <option value="">Selecione...</option>
                            <option value="ES">ES</option>
                            <option value="MG">MG</option>
                            <option value="RJ">RJ</option>
                            <option value="SP">SP</option>
                        </select>
                        
                        <input 
                            type="text" 
                            placeholder='Cidade' 
                            className='text-custom-black py-1 px-3 fs-5 border rounded-2'
                            value={prototype.city} 
                            onChange={(e) => {
                                if (!prototype.state) {
                                    setCityError("Escolha um estado primeiro");
                                    return;
                                }
                                setCityError("");
                                updateField("city", e.target.value);
                            }} 
                        />
                        {cityError && <p style={{ color: "red" }}>{cityError}</p>}

                        <input type="text" placeholder='Tamanho da área...' className='text-custom-black py-1 px-3 fs-5 border rounded-2'
                            value={prototype.areaSize} onChange={(e) => updateField("areaSize", e.target.value)} />
                    </div>
                    <div className="col">
                        <textarea className='form-control' rows={6} value={prototype.description} onChange={(e) => updateField("description", e.target.value)}></textarea>
                    </div>
                </div>

                {/* --- Botões --- */}
                <div className="d-flex align-items-center justify-content-between mt-5">
                    <button type="button" className='btn-custom btn-custom-outline-primary rounded-1 px-4' onClick={handleDelete}>
                        Deletar
                    </button>

                    <ManageChecklistsModal
                        prototypeId={prototype.id!}
                        vertical={prototype.vertical}
                        selectedChecklists={selectedChecklists}
                        onClose={() => {}}
                        onUpdate={(newList) => setSelectedChecklists(newList)}
                    />

                    <button type="submit" className='btn-custom btn-custom-success rounded-1 px-4'>
                        Salvar
                    </button>
                </div>
            </form>
        </div>
    );
}
