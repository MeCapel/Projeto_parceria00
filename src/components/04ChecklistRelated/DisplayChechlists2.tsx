import { useState, useEffect } from "react";
import { type Checklist, getChecklistsModel } from "../../services/checklistServices2";

interface Props {
    inline: boolean;
}

export default function DisplayChecklistsModel({ inline }: Props) {
    const [data, setData] = useState<Checklist[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        try {
            const unsubscribe = getChecklistsModel((items: any) => {
                setData(items);
            });

            return () => unsubscribe();
        } 
        finally {
            setLoading(false);
        }
    }, []);

    if (loading) return <p>Carregando...</p>;

    return (
        <div className="p-3 d-flex flex-column gap-3">
            {inline ? (
                <>
                    <div>
                        <p className="text-custom-black fs-4 fw-bold mb-0">
                            Selecionar modelo
                        </p>
                    </div>

                    <ul className="list-unstyled d-flex flex-column gap-2">
                        {data.length === 0 && <p>Nenhum modelo encontrado.</p>}

                        {data.map((item) => (
                            <li key={item.id} className="d-flex gap-3">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="checklistModel"
                                    id={item.id}
                                    value={item.id}
                                    checked={selectedModel === item.id}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                />
                                <label htmlFor={item.id}>
                                    {item.name} — v{item.version}
                                </label>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <div className="row">
                    <div className="d-flex w-100 gap-3 align-items-start justify-content-center my-3">
                        <ul className="d-flex flex-wrap gap-4 list-unstyled w-100">

                            {data.length === 0 && <p>Nenhum modelo encontrado.</p>}

                            {data.map((item) => (
                                <li key={item.id}>
                                    <div
                                        className="card bg-custom-gray00 text-custom-white mb-3"
                                        style={{ maxWidth: "18rem" }}
                                    >
                                        <div className="card-header d-flex gap-3">
                                            <h4>{item.name}</h4>
                                        </div>

                                        <div className="card-body">
                                            <p className="card-title fs-5">
                                                {item.vertical || "Vertical não definida"} • v{item.version}
                                            </p>

                                            <div
                                                className="overflow-hidden"
                                                style={{ maxHeight: "3rem" }}
                                            >
                                                <p className="text-truncate">
                                                    {item.categories?.length || 0} categorias
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}

                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
