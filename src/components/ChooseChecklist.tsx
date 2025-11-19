import { useState, useEffect } from "react"
import { getChecklistsByP, type Checklist } from "../services/dbService";

// const unsub = getChecklistsByP((data: any) =>{  
        //     setData(data);
        // });
        
        // return () => unsub();

interface Props {
    whichP: string,
    onValueChange: (value: string) => void;
}

export default function ChooseChecklists({ whichP, onValueChange } : Props)
{
    const [ data, setData ] = useState<Checklist[]>([]);
    const [ checklist, setChecklist ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(true);

    const handleChange = (e: any) => {
        const newValue = e.target.value;

        setChecklist(newValue);
        onValueChange(newValue);
    }

    useEffect(() => {

        const fetchData = async () => {
            try 
            {
                const data = await getChecklistsByP(whichP);
                setData(data as any);
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
        
    }, [whichP]);

    if (loading) return <p>Carregando...</p>;

    // if (!data) return <p>Nenhum item encontrado!</p>;

    return(
        <div className="p-3 d-flex flex-column gap-3 border">
            <div className="">
                <p className='text-custom-black fs-4 fw-bold mb-0'>Adicionar checklist</p>
                <p className='fs-5 mb-0 text-custom-red'>{whichP}</p>
            </div>

            <ul className="list-unstyled d-flex flex-column gap-2">
                {data.map((item) => (
                    <li key={item.id} className="d-flex gap-3">
                        <input className='form-check-input' type="radio" name="checklist" id={item.id} value={item.id}
                            checked={checklist === item.id} onChange={handleChange} />
                        <label htmlFor={item.id}>{item.name}</label>
                    </li>
                ))} 
            </ul>
        </div>
    )
}