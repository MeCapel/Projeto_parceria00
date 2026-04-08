import { useEffect, useState } from "react";
import PrototypeGeralInfosTab from "./PrototypeGeralInfosTab";
import PrototypeChecklistsTab from "./PrototypeChecklistsTab";
import { deleteAllPrototypeChecklists, deletePrototype, getPrototype, getPrototypeChecklists, updatePrototype, updatePrototypeChecklists, type PrototypeProps } from "../../../services/prototypeServices";
import { TrashFill, Floppy2Fill, Trash3Fill, ArrowLeftCircleFill } from "react-bootstrap-icons";
import type { ChecklistProps } from "../../../services/checklistServices";
import PrototypeOccurrencesTab from "./PrototypeOccurrencesTab";
import { deleteOccorrence, listOccurenciesByPrototype, type OccurrenceProps } from "../../../services/occurrenceServices";
import NewOccurenceModal from "../../06OccurrenceRelated/NewOccurrenceModal";
import { useNavigate, useParams } from "react-router";
import EditOccurrenceModal from "../../06OccurrenceRelated/EditOccurrenceModal";
import { Modal } from "react-bootstrap";

import { toast } from "react-toastify";

export default function PrototypePage() {
    const navigate = useNavigate();
    const { prototypeid } = useParams();
    const [currentView, setCurrentView] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [prototype, setPrototype] = useState<PrototypeProps | null>(null);
    const [occurrences, setOccurrences] = useState<OccurrenceProps[]>([]);
    const [selectedOccurrenceId, setSelectedOccurrenceId] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

    const openModal = () => setOpenDeleteModal(true);
    const closeModal = () => setOpenDeleteModal(false);

    useEffect(() => {
        if (!prototypeid) return;

        async function fetchData() {
            setLoading(true);
            try {
                const data = await getPrototype(prototypeid!);
                const checklists = await getPrototypeChecklists(prototypeid!);

                if (data) {
                    setPrototype({
                        ...data,
                        id: prototypeid,
                        checklists: checklists
                    });
                } else {
                    toast.error("Protótipo não encontrado!");
                    navigate(`/projects/${prototype?.projectId}`);
                }
            } catch (err) {
                console.error("Erro ao carregar protótipo:", err);
                toast.error("Erro ao carregar dados do protótipo");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [prototypeid]);

    useEffect(() => {
        if (!prototype?.id) return;

        const unsubscribe = listOccurenciesByPrototype(
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

    const handleOccurrenceUpdated = (updatedOccurrence: OccurrenceProps) => {
        setOccurrences(prev =>
            prev.map(o => (o.id === updatedOccurrence.id ? updatedOccurrence : o))
        );
    };

    // SALVAR (COM LIMPEZA)
    async function handleSave() {
        if (!prototype?.id) return;

        try {
            const cleanedChecklists = (prototype.checklists || []).map(cl => ({
                ...cl,
                categories: (cl.categories || []).map(cat => ({
                    ...cat,
                    items: (cat.items || []).map(item => ({
                        id: item.id,
                        label: item.label,
                        checked: item.checked
                    }))
                }))
            }));

            const payload = {
                ...prototype,
                createdAt: prototype.createdAt || undefined,
                checklists: cleanedChecklists
            };

            console.log("SALVANDO PROTOTYPE:", payload);

            // salva dados do protótipo
            await updatePrototype(payload);

            // salva SUBCOLLECTION de checklists (ESSENCIAL)
            await updatePrototypeChecklists(
                prototype.id,
                cleanedChecklists
            );

        } catch (err) {
            console.error(err);
        }
    }

    async function handleDelete() {
        if (!prototype?.id) return;

        navigate(`/projects/${prototype.projectId}`);

        await deletePrototype(prototype.id);
    }

    const handleEditOccurrence = (id: string) => {
        setSelectedOccurrenceId(id);
        setShowEditModal(true);
    };

    const handleDeleteOccurrence = async (id: string) => {
        await deleteOccorrence(id);
    };

    async function onVerticalChange()
    {
        if (!prototypeid) throw new Error("Id do protótipo não encontrado!");

        // 1. delete from Firestore
        await deleteAllPrototypeChecklists(prototypeid);

        // 2. clear locally
        setPrototype(prev =>
            prev ? { ...prev, checklists: [] } : prev
        );
    }

    if (loading || !prototype) return <p>Carregando...</p>;

    const componentsMap = [
        {
            label: "Informações gerais",
            component: (
                <PrototypeGeralInfosTab
                    prototype={prototype}
                    onChange={handleChange}
                    onVerticalChange={onVerticalChange}
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
        <>
            <div className="px-3 pt-4">
                <button 
                    className="btn-custom btn-custom-link d-flex gap-3 align-items-center border-0 bg-transparent p-0" 
                    onClick={() => navigate(`/projects/${prototype.projectId}`)}
                >
                    <ArrowLeftCircleFill size={30} className="text-custom-black" />
                    <p className="text-custom-black fs-5 mb-0 fw-semibold">
                        voltar ao projeto
                    </p>
                </button>
            </div>

            <div className="container-fluid px-3 px-md-4 py-4">
                <header className="d-flex align-items-center justify-content-between mb-4">

                    <div>
                        <p className="fs-6 text-custom-red mb-0 fw-bold text-uppercase">Protótipo</p>
                        <h1 className="text-custom-black fw-bold mb-0">{prototype.name}</h1>
                    </div>

                    <div className="d-flex gap-3">
                        <button onClick={openModal} className="btn-custom btn-custom-outline-primary px-4 d-flex gap-2 align-items-center fw-bold" >
                            <TrashFill size={20} />
                            Excluir
                        </button>

                        <button onClick={handleSave} className="btn-custom btn-custom-success px-4 d-flex gap-2 align-items-center fw-bold shadow-sm" >
                            <Floppy2Fill size={20} />
                            Salvar
                        </button>
                    </div>
                </header>

                <div className="d-flex flex-column align-items-start mb-3">
                    <div className="d-flex gap-2 mb-2">
                        {componentsMap.map(c => (
                            <button
                                key={c.i}
                                onClick={() => setCurrentView(c.i)}
                                className={`btn-custom px-4 py-2 border-0 rounded-0 border-bottom ${currentView === c.i ? 'border-danger text-danger fw-bold' : 'border-transparent text-muted'}`}
                                style={{ transition: 'all 0.3s' }}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>

                    <div className="w-100" style={{ borderBottom: "1px solid var(--gray02)", marginTop: "-1px" }}></div>
                
                </div>

                {componentsMap.find(c => c.i === currentView)?.component}

                {/* // Certifique-se de renderizar o modal apenas quando existir ID e showModal = true */}
                {selectedOccurrenceId && showEditModal && (
                    <EditOccurrenceModal
                    occurrenceId={selectedOccurrenceId}
                    show={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedOccurrenceId(null);
                    }}
                    onUpdate={handleOccurrenceUpdated} 
                    />
                )}

                <Modal show={openDeleteModal} onHide={closeModal} centered>
                    <Modal.Body className="text-center p-5">
                        <Trash3Fill size={50} className="text-danger mb-4" />
                        <h4 className="fw-bold mb-3">Excluir protótipo?</h4>
                        <p className="text-muted mb-5">Esta ação não pode ser desfeita.</p>
                        <div className="d-flex gap-2 justify-content-center">
                            <button className="btn btn-light px-4 rounded-pill" onClick={closeModal}>Cancelar</button>
                            <button className="btn btn-danger px-4 rounded-pill shadow-sm" onClick={handleDelete}>Excluir</button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    );
}