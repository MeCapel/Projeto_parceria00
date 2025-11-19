import { useState } from "react";
import { type Checklist, type CheckboxItem, createChecklist } from "../services/dbService";
import { useNavigate } from "react-router";
import { Modal } from "react-bootstrap";
import DisplayChecklists from "./DisplayChecklists";

export default function AddChecklist()
{
    const [ checklistName, setChecklistName ] = useState<string>("");
    const [ whichP, setWhichP ] = useState<string>("");
    const [ dueDate, setDueDate ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ maxReached, setMaxReached ] = useState<boolean>(false);
    const navigate = useNavigate();

    const [ show, setShow ] = useState(false);

    const openModal = () => setShow(true);
    const closeModal = () => {setShow(false)};

    const max = 5;

    const [ itemName, setItemName ] = useState<string>("");

    const [ checklist, setChecklist ] = useState<Checklist>({
        name: "",
        whichP: "",
        dueDate: "",
        items: [],
    })

    const toggleItem = (id: string) => {
        setChecklist(prev => ({
            ...prev,
            items: prev.items.map((it) => it.id === id.toString() ? {
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
            id: (Date.now() + Math.floor(Math.random() * 100)).toString(),
            name: itemName.trim(),
            checked: false
        };

        setChecklist(prev => ({
            ...prev,
            items: [...prev.items, newItem],
        }));

        setItemName("");
    }

    const handleDropItem = (id: string) => {
        setChecklist((prev) => ({
            ...prev,
            items: prev.items.filter(it => it.id !== id),
        }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        try 
        {
            if (!checklist.items || checklist.items.length == 0)
            {
                // alert("A checklist deve possuir ao menos um item!");
                return;
            }

            createChecklist(checklistName, whichP, checklist.items, dueDate);
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
        <div className="px-5 mx-3">
            <div className="d-flex row">
                <div className="d-flex flex-column col-12 col-md-10">
                    <p className='mb-0 text-custom-red fs-5'>Checklists</p>
                    <p className='mb-0 text-custom-black fs-1 fw-bold'>Gerenciar checklists</p>
                </div>
                <div className="d-flex align-items-end justify-content-end col-12 col-md-2 my-3 my-md-0">
                    <button className='btn-custom btn-custom-primary' onClick={openModal} >
                        <p className='mb-0 fs-5 text-custom-white'>Adicionar</p>
                    </button>
                </div>

                <DisplayChecklists inline={false} />
            </div>

            <Modal show={show} onHide={closeModal} dialogClassName="modal-fullscreen" className='p-0'>
                <Modal.Header closeButton className="mb-0 mx-5 border-0 my-3"></Modal.Header>

                <Modal.Body className="container-fluid d-flex flex-column align-items-center m-auto"> 

                <div className="d-flex p-5 align-items-center justify-content-center">
                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                        <h1 className="text-custom-red00">Adicionar checklist</h1>
                        <input type="text" placeholder="nome do checklist..." required className="form-control"
                            onChange={(e) => setChecklistName(e.target.value)} value={checklistName}/>
                        
                        <div className="col">
                            <fieldset className="col d-flex flex-column mt-4 p-3 align-items-start border rounded-2">
                                <div className="d-flex py-1 px-3 align-items-start justify-content-center rounded-5 position-relative border bg-custom-gray00" 
                                        style={{ top: '-2.5rem' }}>
                                    <legend className='mb-0 text-white fs-5'>
                                        A qual P pertence?
                                    </legend>
                                </div>

                                <div className="d-flex w-100 gap-3 align-items-start justify-content-center position-relative" style={{ top: '-0.75rem' }}>
                                    <label htmlFor="preparo" className="d-flex gap-2 form-check-label">
                                        <input className='form-check-input' type="radio" name="whichP" id="preparo" value="Preparo"
                                        checked={whichP === "Preparo"} onChange={(e) => setWhichP(e.target.value)} />
                                        Preparo
                                    </label>
                                    <label htmlFor="plantio" className="d-flex gap-2 form-check-label">
                                        <input className='form-check-input' type="radio" name="whichP" id="plantio" value="Plantio"
                                        checked={whichP === "Plantio"} onChange={(e) => setWhichP(e.target.value)} />
                                        Plantio
                                    </label>
                                    <label htmlFor="pulverizacao" className="d-flex gap-2 form-check-label">
                                        <input className='form-check-input' type="radio" name="whichP" id="pulverizacao" value="Pulverização"
                                        checked={whichP === "Pulverização"} onChange={(e) => setWhichP(e.target.value)} />
                                        Pulverização
                                    </label>
                                </div>
                            </fieldset>
                        </div>

                        <input type="date" placeholder="data de vencimento..." required className="form-control"
                            onChange={(e) => setDueDate(e.target.value)} value={dueDate}/>
                        
                        <label htmlFor="newItem" className="d-flex flex-column gap-3">
                            <h3 className="mb-0 text-center fw-bold text-custom-black">
                                Adicione items
                            </h3>
                            <input type="text" placeholder="adicione um novo item..." id="newItem" name="newItem"
                            onChange={(e) => setItemName(e.target.value)} value={itemName} className="form-control"/>
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
                                    <li className="d-flex gap-3 align-items-center justify-content-between" key={item.id}>
                                        <div className="d-flex gap-3">
                                            <input type="checkbox" id={item.id.toString()} name={item.name} 
                                                onChange={() => toggleItem(item.id)} checked={item.checked} />
                                            <label htmlFor={(item.id).toString()}>{item.name}</label>
                                        </div>
                                        <button className="btn btn-outline-danger rounded-circle d-flex align-items-center justify-content-center"
                                                style={{ height: '25px', width: '25px' }} onClick={() => handleDropItem(item.id)}>
                                            -
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button className="btn-custom btn-custom-success" type="submit" disabled={loading} >
                            {loading ? "Adicionando..." : "Adicionar checklist"}
                        </button>
                    </form>
                </div>
                </Modal.Body>
            </Modal>
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