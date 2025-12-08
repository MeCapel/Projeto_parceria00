import { useState, useEffect } from "react";
import ChecklistCard from "./ChecklistCard";
import { type Checklist, getChecklistsModel } from "../../services/checklistServices2";
import { useNavigate } from "react-router";

interface Props {
    inline: boolean;
}

export default function DisplayChecklistsModel({ inline }: Props) {
    const [data, setData] = useState<Checklist[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = getChecklistsModel((items: Checklist[]) => {
            setData(items);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <p>Carregando...</p>;

    return (
        <div className="pt-3 d-flex flex-column gap-3">
            {inline ? (
                <div className="p-5">
                    <div className="d-flex flex-column mb-4">
                        <p 
                            style={{ cursor: "pointer" }}
                            className="mb-0 text-custom-red fs-5"
                            onClick={() => navigate(`/checklists`)}
                        >
                            Modelos de Checklist
                        </p>
                        <p className="mb-0 text-custom-black fs-1 fw-bold">Gerenciar modelos</p>
                    </div>

                    {/* LISTA MODERNA EM LINHA */}
                    <ul className="list-unstyled d-flex flex-wrap gap-3">
                        {data.length === 0 && (
                            <p className="text-muted">Nenhum modelo encontrado.</p>
                        )}

                        {data.map(item => (
                            <div key={item.id} className="w-100">
                                <ChecklistCard  
                                    checklistId={item.id!}
                                    inline={true}
                                />
                            </div>
                        ))}
                    </ul>
                </div>

            ) : (
                <div className="row">
                    <div className="d-flex w-100 gap-3 align-items-start justify-content-center my-3">
                        <ul className="d-flex flex-wrap gap-4 list-unstyled w-100">

                            {data.length === 0 && <p>Nenhum modelo encontrado.</p>}

                            {data.map(item => (
                                <div key={item.id}>
                                    <ChecklistCard  
                                        checklistId={item.id!}
                                        inline={false}
                                    />
                                </div>
                            ))}

                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
