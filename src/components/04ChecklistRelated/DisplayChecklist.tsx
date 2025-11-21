import { useState, useEffect } from "react"
// import { getChecklist, type Checklist } from "../services/dbService";
import { getChecklist, type Checklist } from "../../services/checklistServices";

interface DisplayChecklistProps {
    id: string
}

export default function DisplayChecklist({ id } : DisplayChecklistProps)
{
    // const [ data, setData ] = useState<Checklist | null>();
    const [ data, setData ] = useState<Checklist[] | null>();
    const [ checklist, setChecklist ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(true);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try
    //         {
    //             const data = await getChecklist(id);
    //             setData(data);
    //         }
    //         catch (err)
    //         {
    //             console.error(err);
    //         }
    //         finally
    //         {
    //             setLoading(false);
    //         }
    //     }

    //     fetchData();
    // }, [id]);

    useEffect(() => {
        try
        {

            const unsub = getChecklist((data: any) => {  
                setData(data);
            });
            
            return () => unsub();
        }
        catch (err)
        {
            console.error(err);
        }
        finally
        {
            setLoading(false);
        }
    }, [id]);

    if (loading) return <p>Carregando...</p>;

    if (!data) return <p>Nenhum item encontrado!</p>;

    return(
        <>
            {/* <h1>{data.name ? data.name : "nothing here!!"}</h1>
            <h1>{data.dueDate ? data.dueDate : "nothing here!!"}</h1> */}

            <form className="container" >

            {/* 🔵 Radio select div */}
                <div className="row">
                    <div className="col">
                        <fieldset className="col d-flex flex-column mt-5 p-3 align-items-start border rounded-2">
                            <div className="d-flex py-1 px-3 align-items-start justify-content-center rounded-5 position-relative border bg-custom-gray00" 
                                    style={{ top: '-2.5rem' }}>
                                <legend className='mb-0 text-white fs-5'>
                                    Status atual
                                </legend>
                            </div>

                            <div className="d-flex w-100 gap-3 align-items-start justify-content-center position-relative" style={{ top: '-0.75rem' }}>
                                <ul className="d-flex flex-wrap gap-4 justify-content-center list-unstyled w-100">
                                    {data.map((item) => (
                                        <li key={item.id}>
                                            <div className="card bg-custom-gray00 text-custom-white mb-3" style={{ maxWidth: "18rem" }}>
                                                <div className="card-header d-flex gap-3">
                                                    <label htmlFor={item.id} className="d-flex gap-2 form-check-label w-100">
                                                        <input className='form-check-input' type="radio" name="checklist" id={item.id} value={item.name}
                                                            checked={checklist === item.name} onChange={(e) => setChecklist(e.target.value)} />
                                                        {item.whichP ? item.whichP : "Qual P"}
                                                    </label>
                                                </div>
                                                <div className="card-body">
                                                    <h5 className="card-title">{item.name} • {item.dueDate}</h5>
                                                    <div className="overflow-hidden" style={{ maxHeight: "3rem" }}>
                                                        <ul className="d-flex flex-column gap-1">
                                                            <li>hellow</li>
                                                            <li>one more time</li>
                                                            <li>one more time</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                
                                
                            </div>
                        </fieldset>
                    </div>
                </div>

            {/* <ul>
                {data.items.map((item) => (
                    <li key={item.id}>{item.name}</li>
                    ))}
                    </ul> */}
            </form>
        </>
    )
}