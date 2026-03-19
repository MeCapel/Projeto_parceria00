import { useEffect, useState } from "react";
import PrototypeGeralInfosTab from "./PrototypeGeralInfosTab";
import PrototypeChecklistsTab from "./PrototypeChecklistsTab";
import { deletePrototype, getPrototype, getPrototypeChecklists, updatePrototype, type PrototypeProps } from "../../../services/prototypeServices";
import { TrashFill, Floppy2Fill, ArrowLeftCircleFill } from "react-bootstrap-icons";
import type { ChecklistProps } from "../../../services/checklistServices";
import PrototypeOccurrencesTab from "./PrototypeOccurrencesTab";
import { deleteOccorrence, listOccourenciesByPrototype, type OccurrenceProps } from "../../../services/occurrenceServices";
import NewOccurenceModal from "../../06OccurrenceRelated/NewOccurrenceModal";
import { useParams, useNavigate } from "react-router";
import EditOccurrenceModal from "../../06OccurrenceRelated/EditOccurrenceModal";

import { toast } from "react-toastify";

export default function PrototypePage() {
    const { prototypeid, projectid } = useParams();
    const navigate = useNavigate();
    const [currentView, setCurrentView] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [prototype, setPrototype] = useState<PrototypeProps | null>(null);
    const [occurrences, setOccurrences] = useState<OccurrenceProps[]>([]);
    const [selectedOccurrenceId, setSelectedOccurrenceId] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        if (!prototypeid) return;

        async function fetchData() {
            setLoading(true);
            try {
                // Busca protótipo e ocorrências em paralelo
                const [data, checklists] = await Promise.all([
                    getPrototype(prototypeid!),
                    getPrototypeChecklists(prototypeid!)
                ]);

                if (data) {
                    setPrototype({
                        ...data,
                        id: prototypeid,
                        checklists: checklists
                    });
                } else {
                    toast.error("Protótipo não encontrado!");
                    navigate(`/projects/${projectid}`);
                }
            } catch (err) {
                console.error("Erro ao carregar protótipo:", err);
                toast.error("Erro ao carregar dados do protótipo");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [prototypeid, projectid, navigate]);

    useEffect(() => {
        if (!prototype?.id) return;

        const unsubscribe = listOccourenciesByPrototype(
            prototype.id,
            (data) => setOccurrences(data)
        );

        return unsubscribe;
    }, [prototype?.id]);

    function handleChange(updatedData: Partial<PrototypeProps>) {
        setPrototype(prev => prev ? { ...prev, ...updatedData } : prev);
    }

    function handleChecklistUpdate(updatedChecklist: ChecklistProps) {
        setPrototype(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                checklists: prev.checklists!.map(cl =>
                    cl.id === updatedChecklist.id ? updatedChecklist : cl
                )
            };
        });
    }

    function handleChecklistListUpdate(newChecklists: ChecklistProps[]) {
        setPrototype(prev => prev ? {
            ...prev,
            checklists: newChecklists
        } : prev);
    }

    async function handleSave() {
        if (!prototype?.id) return;

        try {
            const payload = {
                ...prototype,
                createdAt: prototype.createdAt || undefined,
                checklists: (prototype.checklists || []).map(cl => ({
                    ...cl,
                    categories: (cl.categories || []).map(cat => ({
                        ...cat,
                        items: (cat.items || []).map(item => ({
                            id: item.id,
                            label: item.label,
                            checked: item.checked
                        }))
                    }))
                }))
            };

            await updatePrototype(payload);
        } catch (err) {
            console.error(err);
        }
    }

    async function handleDelete() {
        if (!prototype?.id) return;
        if (!confirm("Tem certeza que deseja excluir este protótipo?")) return;

        await deletePrototype(prototype.id);
        navigate(`/projects/${projectid}`);
    }

    const handleEditOccurrence = (id: string) => {
        setSelectedOccurrenceId(id);
        setShowEditModal(true);
    };

    const handleDeleteOccurrence = async (id: string) => {
        await deleteOccorrence(id);
    };

    if (loading || !prototype) return <div className="p-5 text-center"><div className="spinner-border text-danger"></div></div>;

    const tabs = [
        { label: "Informações gerais", i: 0 },
        { label: "Checklists", i: 1 },
        { label: "Ocorrências", i: 2 },
    ];

    function renderView() {
        if (!prototype) return null; // Garantia para o TS

        switch (currentView) {
            case 0:
                return <PrototypeGeralInfosTab prototype={prototype} onChange={handleChange} />;
            case 1:
                return (
                    <PrototypeChecklistsTab
                        prototypeId={prototype.id!}
                        vertical={prototype.vertical}
                        checklists={prototype.checklists || []}
                        onUpdate={handleChecklistUpdate}
                        onListUpdate={handleChecklistListUpdate}
                    />
                );
            case 2:
                return (
                    <PrototypeOccurrencesTab 
                        occurrences={occurrences}
                        onDelete={handleDeleteOccurrence}
                        onEdit={handleEditOccurrence}
                    >
                        <NewOccurenceModal prototypeId={prototype.id!} />
                    </PrototypeOccurrencesTab>
                );
            default:
                return null;
        }
    }

    return (
        <>
            <div className="ps-5 pt-5 pb-0 pe-0">
                <button 
                    className="btn-custom btn-custom-link d-flex gap-3 align-items-center border-0 bg-transparent p-0" 
                    onClick={() => navigate(`/projects/${projectid}`)}
                >
                    <ArrowLeftCircleFill size={30} className="text-custom-black" />
                    <p className="text-custom-black fs-5 mb-0 fw-semibold">
                        voltar ao projeto
                    </p>
                </button>
            </div>

            <div className="py-3 px-5 d-flex flex-column gap-4">
                <header className="d-flex align-items-center justify-content-between mb-2">
                    <div>
                        <p className="fs-6 text-custom-red mb-0 fw-bold text-uppercase">Protótipo</p>
                        <h1 className="text-custom-black fw-bold mb-0">{prototype.name}</h1>
                    </div>

                    <div className="d-flex gap-3">
                        <button onClick={handleDelete} className="btn-custom btn-custom-outline-primary px-4 d-flex gap-2 align-items-center fw-bold" >
                            <TrashFill size={18} />
                            Excluir
                        </button>

                        <button onClick={handleSave} className="btn-custom btn-custom-success px-4 d-flex gap-2 align-items-center fw-bold shadow-sm" >
                            <Floppy2Fill size={18} />
                            Salvar
                        </button>
                    </div>
                </header>

                <div className="d-flex flex-column align-items-start mb-2">
                    <div className="d-flex gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.i}
                                className={`btn-custom px-4 py-2 border-0 rounded-0 border-bottom ${currentView === tab.i ? 'border-danger text-danger fw-bold' : 'border-transparent text-muted'}`}
                                style={{ transition: 'all 0.3s' }}
                                onClick={() => setCurrentView(tab.i)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="w-100" style={{ borderBottom: "1px solid var(--gray02)", marginTop: "-1px" }}></div>
                </div>

                <div className="mt-2">
                    {renderView()}
                </div>

                <EditOccurrenceModal
                    occurrenceId={selectedOccurrenceId}
                    show={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedOccurrenceId(null);
                    }}
                />
            </div>
        </>
    );
}
