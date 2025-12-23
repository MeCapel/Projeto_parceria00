// ===== GERAL IMPORTS =====

import { ArrowLeftCircleFill } from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router";
import ManageChecklistsModal from "./ManageChecklists";
import { useState, useEffect, type FormEvent } from "react";
import { type Checklist } from "../../services/checklistServices2";
import DisplayPrototypeChecklists from "../04ChecklistRelated/DisplayPrototypeChecklists";
import { getPrototype, 
         type PrototypeProps, 
         updatePrototype, 
         deletePrototype, 
         updatePrototypeChecklists} from '../../services/prototypeServices';
import Layout from "../00Geral/Layout";

// =====  MAIN COMPONENT =====

export default function PrototypeInner() {
    const navigate = useNavigate();
    const { prototypeid } = useParams();

    const [loading, setLoading] = useState(true);
    const [cityError, setCityError] = useState("");

    // const [originalChecklists, setOriginalChecklists] = useState<Checklist[]>([]);

    const [prototype, setPrototype] = useState<PrototypeProps | null>(null);

    // ===== FETCH PROTOTYPE DATA =====

    useEffect(() => {
        if (!prototypeid) 
        {
            return;
        }

        async function fetchData() {
            const data: any = await getPrototype(prototypeid!);

            if (data) {
                const proto: PrototypeProps = {
                    id: prototypeid,
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
                    projectId: data.projectId || "",
                };

                setPrototype(proto);

                // setOriginalChecklists(data.checklists || []);
            }

            setLoading(false);
        }

        fetchData();
    }, [prototypeid]);

    function resetChecklists()
    {
        setPrototype(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                checklists: [], // ou null, mas array vazio é melhor
            };
        });
    }

    // ===== GENERIC FIELD UPDATE =====

    function updateField<K extends keyof PrototypeProps>(key: K, value: PrototypeProps[K]) {
        if (!prototype) return;
        if (key == "id") return;

        if (key == "vertical" && value !== prototype.vertical)
        {
            resetChecklists();
        }

        setPrototype(prev => prev ? { ...prev, [key]: value } : prev);
    }

    // ===== UPDATE CHECKLIST AFTER MODAL EDIT =====

    const handleChecklistUpdate = (updated: Checklist) => {
        if (!prototype) return;

        setPrototype(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                checklists: prev.checklists!.map(cl =>
                    cl.id === updated.id ? updated : cl
                )
            };
        });
    };

    // ===== SAVE PROTOTYPE =====

    async function handleSave(e: FormEvent) {
        e.preventDefault();
        if (!prototype?.id) return;

        try
        {
            await updatePrototype(prototype as PrototypeProps & { id: string });

            await updatePrototypeChecklists(
                prototype.id,
                prototype.checklists ?? []
            );

            navigate(`/projects/${prototype.projectId}`);
        }
        catch (err)
        {
            console.error("Erro ao salvar o protótipo: " + err);
            return;
        }

    }

    // ===== DELETE PROTOTYPE =====

    async function handleDelete() {
        if (!prototype?.id) return;

        if (!confirm("Tem certeza que deseja deletar este protótipo?")) return;

        const result = await deletePrototype(prototype.id);

        if (result) {
            alert("Protótipo deletado com sucesso!");
            navigate(`/projects/${prototype.projectId}`);
        }
    }

    // ===== LOADING MESSAGE =====

    if (loading || !prototype) return <p>Carregando...</p>;

    return (
        <Layout>

        <div className="ps-5 pt-5 pb-0 pe-0" onClick={() => navigate(`/projects/${prototype.projectId}`)}>
            <div className="text-link-custom d-flex gap-3 align-items-center" style={{ cursor: "pointer" }}>
                <ArrowLeftCircleFill size={30} />
                <p className="text-custom-black fs-5 mb-0">
                    voltar
                </p>
            </div>
        </div>

        <div className="container-fluid d-flex flex-column align-items-center m-auto">
            <form onSubmit={handleSave}>

                {/* Título */}
                <div className="mb-5 d-flex align-items-center justify-content-between">
                    <div>
                        <p className='fs-5 mb-0 text-custom-red'>Edição</p>
                        <p className='text-custom-black display-6 fw-bold mb-1'>{prototype.name}</p>
                    </div>
                    
                </div>

                {/* Inputs principais */}
                <div className="row">
                    <div className="col">
                        <input
                            type="text"
                            placeholder='N° de série'
                            className='form-control text-custom-black py-1 px-3 fs-5 border rounded-2'
                            required
                            value={prototype.code}
                            onChange={e => updateField("code", e.target.value)}
                        />
                    </div>

                    <div className="col">
                        <input
                            type="text"
                            placeholder='Nome do protótipo'
                            className='form-control text-custom-black py-1 px-3 fs-5 border rounded-2'
                            required
                            value={prototype.name}
                            onChange={e => updateField("name", e.target.value)}
                        />
                    </div>
                </div>

                {/* Radio etapa + vertical */}
                <div className="row mt-4">

                    {/* ETAPA */}
                    <div className="col">
                        <fieldset className="d-flex flex-column mt-5 p-3 align-items-start border rounded-2">

                            <div className="d-flex py-1 px-3 rounded-5 position-relative border bg-custom-gray00"
                                style={{ top: '-2.5rem' }}>
                                <legend className='mb-0 text-white fs-5'>Etapa</legend>
                            </div>

                            <div className="d-flex w-100 gap-3 align-items-start justify-content-center"
                                style={{ top: '-0.75rem' }}>
                                {["Fabricação", "Montagem", "Validação de campo"].map(s => (
                                    <label key={s} className="d-flex gap-2 form-check-label">
                                        <input
                                            className='form-check-input'
                                            type="radio"
                                            name="step"
                                            value={s}
                                            checked={prototype.stage === s}
                                            onChange={e => updateField("stage", e.target.value)}
                                        />
                                        {s}
                                    </label>
                                ))}
                            </div>

                        </fieldset>
                    </div>

                    {/* VERTICAL */}
                    <div className="col">
                        <fieldset className="d-flex flex-column mt-5 p-3 align-items-start border rounded-2">

                            <div className="d-flex py-1 px-3 rounded-5 position-relative border bg-custom-gray00"
                                style={{ top: '-2.5rem' }}>
                                <legend className='mb-0 text-white fs-5'>Vertical</legend>
                            </div>

                            <div className="d-flex w-100 gap-3 align-items-start justify-content-center"
                                style={{ top: '-0.75rem' }}>
                                {["Preparo", "Plantio", "Pulverização"].map(v => (
                                    <label key={v} className="d-flex gap-2 form-check-label">
                                        <input
                                            className='form-check-input'
                                            type="radio"
                                            name="vertical"
                                            value={v}
                                            checked={prototype.vertical === v}
                                            onChange={(e) => {
                                                updateField("vertical", e.target.value);
                                                updateField("checklists", []); // reset para não sobrar checklists inválidas
                                            }}
                                        />
                                        {v}
                                    </label>
                                ))}
                            </div>

                        </fieldset>

                        {/* ====== Show all checklists related to the prototype and let click on them to display its items ===== */}
                        <DisplayPrototypeChecklists
                            prototypeId={prototype.id!}
                            checklists={prototype.checklists || []}
                            onUpdate={handleChecklistUpdate}
                        />

                    </div>

                </div>

                {/* Inputs adicionais */}
                <div className="row mt-4">

                    <div className="col d-flex flex-column gap-3">
                        <select
                            className='form-select'
                            value={prototype.state}
                            onChange={e => updateField("state", e.target.value)}
                        >
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
                            onChange={e => {
                                if (!prototype.state) {
                                    setCityError("Escolha um estado primeiro");
                                    return;
                                }
                                setCityError("");
                                updateField("city", e.target.value);
                            }}
                        />

                        {cityError && <p style={{ color: "red" }}>{cityError}</p>}

                        <input
                            type="text"
                            placeholder='Tamanho da área...'
                            className='text-custom-black py-1 px-3 fs-5 border rounded-2'
                            value={prototype.areaSize}
                            onChange={e => updateField("areaSize", e.target.value)}
                        />
                    </div>

                    <div className="col">
                        <textarea
                            className='form-control'
                            rows={6}
                            value={prototype.description}
                            onChange={e => updateField("description", e.target.value)}
                        />
                    </div>

                </div>

                {/* Botões */}
                <div className="d-flex align-items-center justify-content-between mt-5">

                    <button
                        type="button"
                        className='btn-custom btn-custom-outline-primary rounded-1 px-4'
                        onClick={handleDelete}
                    >
                        Deletar
                    </button>

                    <ManageChecklistsModal
                        vertical={prototype.vertical}
                        selectedChecklists={prototype.checklists || []}
                        onUpdate={newList => updateField("checklists", newList)}
                        onClose={() => {}}
                    />

                    <button
                        type="submit"
                        className='btn-custom btn-custom-success rounded-1 px-4'
                    >
                        Salvar
                    </button>

                </div>

            </form>
        </div>
        </Layout>
    );
}
