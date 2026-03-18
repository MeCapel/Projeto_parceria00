import { useEffect, useState } from "react";
import PrototypeGeralInfosTab from "./PrototypeGeralInfosTab";
import PrototypeChecklistsTab from "./PrototypeChecklistsTab";
import { deletePrototype, getPrototype, getPrototypeChecklists, updatePrototype, type PrototypeProps } from "../../../services/prototypeServices";
import { TrashFill, Floppy2Fill } from "react-bootstrap-icons";
import type { ChecklistProps } from "../../../services/checklistServices";
import PrototypeOccurrencesTab from "./PrototypeOccurrencesTab";
import { deleteOccorrence, listOccourenciesByPrototype, type OccurrenceProps } from "../../../services/occurrenceServices";
import NewOccurenceModal from "../../06OccurrenceRelated/NewOccurrenceModal";
import { useParams } from "react-router";
import EditOccurrenceModal from "../../06OccurrenceRelated/EditOccurrenceModal";

export default function PrototypePage() {
    const { prototypeid } = useParams();
    const [currentView, setCurrentView] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [prototype, setPrototype] = useState<PrototypeProps | null>(null);
    const [occurrences, setOccurrences] = useState<OccurrenceProps[]>([]);
    const [selectedOccurrenceId, setSelectedOccurrenceId] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        if (!prototypeid) 
        {
            return;
        }

        async function fetchData() {
            const data = await getPrototype(prototypeid!);
            const checklists = await getPrototypeChecklists(prototypeid!);

            if (data) {
                setPrototype({
                    ...data,
                    id: prototypeid,
                    checklists: checklists // AGORA CORRETO
                });
            }

            setLoading(false);
        }

        fetchData();
    }, [prototypeid]);

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

    // UPDATE CHECKLIST ITEM (edição dentro do modal)
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

    // UPDATE LIST (gerenciar checklists)
    function handleChecklistListUpdate(newChecklists: ChecklistProps[]) {
        setPrototype(prev => prev ? {
            ...prev,
            checklists: newChecklists
        } : prev);
    }

    // SALVAR (COM LIMPEZA)
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

            console.log("SALVANDO:", payload);

            await updatePrototype(payload);

        } catch (err) {
            console.error(err);
        }
    }

    async function handleDelete() {
        if (!prototype?.id) return;
        if (!confirm("Tem certeza?")) return;

        await deletePrototype(prototype.id);
    }

    const handleEditOccurrence = (id: string) => {
        setSelectedOccurrenceId(id);
        setShowEditModal(true);
    };

    const handleDeleteOccurrence = async (id: string) => {
        await deleteOccorrence(id);
    };

    if (loading || !prototype) return <p>Carregando...</p>;

    const componentsMap = [
        {
            label: "Informações gerais",
            component: (
                <PrototypeGeralInfosTab
                    prototype={prototype}
                    onChange={handleChange}
                />
            ),
            i: 0,
        },
        {
            label: "Checklists",
            component: (
                <PrototypeChecklistsTab
                    prototypeId={prototype.id!}
                    vertical={prototype.vertical}
                    checklists={prototype.checklists || []}
                    onUpdate={handleChecklistUpdate}
                    onListUpdate={handleChecklistListUpdate}
                />
            ),
            i: 1,
        },
        {
            label: "Ocorrências",
            component: (
                <PrototypeOccurrencesTab 
                    occurrences={occurrences}
                    onDelete={handleDeleteOccurrence}
                    onEdit={handleEditOccurrence}
                >
                    <NewOccurenceModal prototypeId={prototype.id!} />
                 </PrototypeOccurrencesTab>
            ),
            i: 2,
        },
    ];

    return (
        <div className="p-3 p-md-5 d-flex flex-column gap-4 gap-md-5">

            <header className="d-flex align-items-center justify-content-between">

                <div>
                    <p className="fs-6 text-custom-red mb-0">Edição</p>
                    <p className="fs-3 fw-bold mb-0">{prototype.name}</p>
                </div>

                <div className="d-flex flex-wrap gap-2">
                    {componentsMap.map(c => (
                        <button
                            key={c.i}
                            onClick={() => setCurrentView(c.i)}
                            className={`btn-custom rounded-5 px-3 ${
                                currentView === c.i
                                    ? "btn-custom-black text-white"
                                    : "btn-custom-outline-black"
                            }`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>

                <div className="d-flex gap-2">
                    <button onClick={handleDelete} className="btn-custom btn-custom-outline-primary d-flex gap-2 align-items-center" >
                        <TrashFill size={20} />
                        Deletar
                    </button>

                    <button onClick={handleSave} className="btn-custom btn-custom-success d-flex gap-2 align-items-center" >
                        <Floppy2Fill size={20} />
                        Salvar
                    </button>
                </div>
            </header>

            {componentsMap.find(c => c.i === currentView)?.component}

            <EditOccurrenceModal
                occurrenceId={selectedOccurrenceId}
                show={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedOccurrenceId(null);
                }}
            />
        </div>
    );
}

