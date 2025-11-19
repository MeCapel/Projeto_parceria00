import { useState, useEffect } from "react"
import { getChecklists, type Checklist } from "../services/dbService";

// const unsub = getChecklistsByP((data: any) =>{  
        //     setData(data);
        // });
        
        // return () => unsub();

interface Props {
    inline: boolean,
}

export default function DisplayChecklists({ inline } : Props)
{
    const [ data, setData ] = useState<Checklist[]>([]);
    const [ checklist, setChecklist ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(true);

    useEffect(() => {

        const fetchData = async () => {
            try 
            {
                const unsubscribe = getChecklists((data: any) => {
                    setData(data);
                });

                return () => unsubscribe();
            }
            catch (err)
            {
                console.error(err);
            }
            finally
            {
                setLoading(false);
            }
        }

        fetchData();
        
    }, []);

    if (loading) return <p>Carregando...</p>;

    // if (!data) return <p>Nenhum item encontrado!</p>;

    return(
        <>
            <div className="p-3 d-flex flex-column gap-3">
                {inline ? (
                    <>
                        <div className="">
                            <p className='text-custom-black fs-4 fw-bold mb-0'>Adicionar checklist</p>
                        </div>

                        <ul className="list-unstyled d-flex flex-column gap-2">
                            {data.map((item) => (
                                <li key={item.id} className="d-flex gap-3">
                                    <input className='form-check-input' type="radio" name="checklist" id={item.id} value={item.id}
                                        checked={checklist === item.id} onChange={(e) => setChecklist(e.target.value)} />
                                    <label htmlFor={item.id}>{item.name}</label>
                                </li>
                            ))} 
                        </ul>
                    </>
            ) : 
            (
                <div className="row">
                    <div className="d-flex w-100 gap-3 align-items-start justify-content-center my-3">
                        <ul className="d-flex flex-wrap gap-4 list-unstyled w-100">
                            {data.map((item) => (
                                <li key={item.id}>
                                    <div className="card bg-custom-gray00 text-custom-white mb-3" style={{ maxWidth: "18rem" }}>
                                        <div className="card-header d-flex gap-3">
                                            <h4>
                                                {item.name}
                                            </h4>
                                        </div>
                                        <div className="card-body">
                                            <p className="card-title fs-5">{item.whichP ? item.whichP : "Qual P"} • {item.dueDate}</p>
                                            <div className="overflow-hidden" style={{ maxHeight: "3rem" }}>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )
            }
        </div>
        </>
    )
}