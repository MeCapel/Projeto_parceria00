import { useState } from "react";
import { type Checklist, type CheckboxItem, createChecklist } from "../services/dbService";
import { useNavigate } from "react-router";

export default function AddChecklist()
{
    const [ checklistName, setChecklistName ] = useState<string>("");
    const [ dueDate, setDueDate ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ maxReached, setMaxReached ] = useState<boolean>(false);
    const navigate = useNavigate();

    const max = 5;

    const [ itemName, setItemName ] = useState<string>("");

    const [ checklist, setChecklist ] = useState<Checklist>({
        name: "",
        dueDate: "",
        items: [],
    })

    const toggleItem = (id: number) => {
        setChecklist(prev => ({
            ...prev,
            items: prev.items.map((it) => it.id === id ? {
                ...it,
                checked: !it.checked
            } : it)
        }))
    }

    const handleNewItem = () => {
        if (!itemName) return;

        if (checklist.items.length >= max)
        {
            setMaxReached(true);
            return window.alert("Maxxxx!");
        }

        const newItem: CheckboxItem = {
            id: Date.now() + Math.floor(Math.random() * 100),
            name: itemName.trim(),
            checked: false
        };

        setChecklist(prev => ({
            ...prev,
            items: [...prev.items, newItem],
        }));

        setItemName("");
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        try 
        {
            createChecklist(checklistName, checklist.items, dueDate);
        }
        catch (err)
        {
            console.error(err);
        }
        finally
        {
            setLoading(false);
            navigate("/home")
        }
    }

    return(
        <div className="d-flex p-5 align-items-center justify-content-center">
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <h1 className="text-custom-red00">Adicionar checklist</h1>
                <input type="text" placeholder="nome do checklist..." required
                       onChange={(e) => setChecklistName(e.target.value)} value={checklistName}/>
                <input type="date" placeholder="data de vencimento..." required
                       onChange={(e) => setDueDate(e.target.value)} value={dueDate}/>
                
                <label htmlFor="newItem" className="d-flex flex-column gap-3">
                    Nome do novo item
                    <input type="text" placeholder="adicione um novo item..." id="newItem" name="newItem"
                       onChange={(e) => setItemName(e.target.value)} value={itemName}/>
                </label>

                <button className="btn-custom btn-custom-outline-primary" type="button" 
                        onClick={handleNewItem} disabled={maxReached} >
                    Adicionar novo item
                </button>

                <div className="d-flex flex-column gap-3 align-items-center justify-content-center">
                    <h1 className="my-3 text-custom-black">Items da checklist</h1>

                    {checklist.items.length === 0 && (
                        <p>Adicione items a checklist...</p>
                    )}

                    <ul className="list-unstyled">
                        {checklist.items.map((item) => (
                            <li className="d-flex gap-3 align-items-center" key={item.id}>
                                <input type="checkbox" id={item.id.toString()} name={item.name} 
                                    onChange={() => toggleItem(item.id)} checked={item.checked} />
                                <label htmlFor={(item.id).toString()}>{item.name}</label>
                            </li>
                        ))}
                    </ul>
                </div>

                <button className="btn-custom btn-custom-success" type="submit" disabled={loading} >
                    {loading ? "Adicionando..." : "Adicionar checklist"}
                </button>
            </form>
        </div>
    )
}

    // const updateChecklist = () => {
    //     setChecklist(prev => ({
    //         ...prev,
    //         name: checklistName,
    //         dueDate: dueDate || undefined
    //     }));
    // }