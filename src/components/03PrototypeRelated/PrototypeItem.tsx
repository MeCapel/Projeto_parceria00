import { Modal } from "react-bootstrap";
import { XLg } from "react-bootstrap-icons";
// import DisplayChecklist from "./DisplayChecklist"
import { useNavigate, useParams } from "react-router"
import { useState,  useEffect, type FormEvent } from "react";
import { getPrototypeData, updatePrototype, movePrototypeToTrash, type EditPrototypeProps } from "../../services/prototypeServices";
import { updateChecklistItems, type CheckboxItem, type Checklist, getChecklistsByP, getChecklist, dropPrototypeChecklist } from "../../services/checklistServices";
// import { getPrototypeData, updateChecklistItems, updatePrototype, type CheckboxItem, type Checklist, getChecklistsByP, getChecklist } from "../services/dbService";

// interface PrototypeDataProps {
//     projectId?: string,
//     code: string,
//     name: string,
//     status: string,
//     description: string,
//     whichP: string,
//     state?: string,
//     city?: string,
//     area?: string,
// }

export default function PrototypeItem()
{
    // const [ prototypeData, setPrototypeData ] = useState<any>(null);
    const [ prototypeData, setPrototypeData ] = useState<EditPrototypeProps | null>(null);
    const [ checklistData, setChecklistData] = useState<Checklist | null>(null);
    const [ checklist, setChecklist] = useState<string | null>(null);
    const [ itemsData, setItemsData] = useState<CheckboxItem[]>([]);
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();
    const { prototypeid } = useParams();
    
    const [ projectId, setProjectId ] = useState("");
    const [ code, setCode ] = useState("");
    const [ name, setName ] = useState("");
    const [ status, setStatus ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ whichP, setWhichP ] = useState("");
    const [ state, setState ] = useState("");
    const [ city, setCity ] = useState("");
    const [ area, setArea ] = useState("");

    useEffect(() => {
        if (!prototypeid) return;

        const fetchData = async () => {
            try{
                const data = await getPrototypeData(prototypeid);
                
                if (data) 
                {
                    setPrototypeData(data.prototypeData || null);
                    setChecklistData(data.checklistData || null);
                    setItemsData(data.itemsData);
                    
                    const p = data.prototypeData;

                    setProjectId(p.projectId);
                    setCode(p.code || "");
                    setName(p.name || "");
                    setStatus(p.status || "");
                    setDescription(p.description || "");
                    setWhichP(p.whichP || "");
                    setState(p.state || "");
                    setCity(p.city || "");
                    setArea(p.area || "");
                    setChecklist(p.checklistId || "");
                }
            }
            catch (err)
            {
                console.log(err);
            }
            finally
            {
                setLoading(false);
            }
        }

        fetchData();

    }, []);

    useEffect(() => {
        if (!checklist) return;

        const fetchNewChecklist = async () => {
            try {
                const data = await getChecklist(checklist);
                if (data) {
                    setChecklistData(data);
                    setItemsData(data.items);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchNewChecklist();
}, [checklist]);

    async function dropChecklist()
    {
        const oldChecklistId = checklist;

        setChecklist(null);
        setChecklistData(null);
        setItemsData([]);

        if (oldChecklistId)
        {
            await dropPrototypeChecklist(prototypeid!, oldChecklistId);
        }
        else
        {
            const formData = { 
                code: code, 
                name: name, 
                description: description, 
                whichP: whichP, 
                status: status, 
                state: state, 
                city: city, 
                area: area,
                checklistId: null
            };
            
            await updatePrototype(prototypeid!, formData);
        }
    }

    function handleItemToggle(itemId: string)
    {
        setItemsData(prev => 
            prev.map(item =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
            )
        )
    }

    async function handleSubmit(e:FormEvent)
    {
        e.preventDefault();

        if (!prototypeid) return;

        const formData = { 
            code: code, 
            name: name, 
            description: description, 
            whichP: whichP, 
            status: status, 
            state: state, 
            city: city, 
            area: area,
            checklistId: checklist
        };

        await updatePrototype(prototypeid, formData);

        if (checklist)
        {
            await updateChecklistItems(checklist, itemsData);
        }

        navigate(`/projects/${projectId}`);
    }

    const handleDeletePrototype = async (projectId: string, prototypeId: string) => {
        movePrototypeToTrash(projectId, prototypeId);
        navigate(`/projects/${projectId}`);
    }

    if (loading) return <p>Carrengando...</p>
    if (!prototypeData) return <p>Protótipo não encontrado!</p>;

    return(
        <div className="container-fluid d-flex flex-column align-items-center m-auto my-5 pt-5" >
            {/* --- 🔴 Inner content div --- */}
            <form className="" onSubmit={handleSubmit}>

                {/* --- Title div --- */}
                <div className="mb-5 d-flex align-items-center justify-content-between">
                    <div className="">
                        <p className='fs-5 mb-0 text-custom-red'>Edição</p>
                        <p className='text-custom-black display-6 fw-bold mb-1'>{name}</p>
                    </div>
                    <div className="btn-custom">
                        <XLg size={25} onClick={() => navigate(`/projects/${projectId}`)}/>
                    </div>
                </div>

                <div className="row">

                    <div className="col">
                        <input type="text" placeholder='N° de série' className='form-control text-custom-black py-1 px-3 fs-5 border rounded-2' 
                        required value={code} onChange={(e) => setCode(e.target.value)} />
                    </div>

                    <div className="col">
                        <input type="text" placeholder='Nome do protótipo' className='form-control text-custom-black py-1 px-3 fs-5 border rounded-2' 
                        required value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>

                </div>
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
                                <label htmlFor="fabricacao" className="d-flex gap-2 form-check-label">
                                    <input className='form-check-input' type="radio" name="status" id="fabricacao" value="Fabricação"
                                           checked={status === "Fabricação"} onChange={(e) => setStatus(e.target.value)} />
                                    Fabricação
                                </label>
                                <label htmlFor="montagem" className="d-flex gap-2 form-check-label">
                                    <input className='form-check-input' type="radio" name="status" id="montagem" value="Montagem"
                                    checked={status === "Montagem"} onChange={(e) => setStatus(e.target.value)} />
                                    Montagem
                                </label>
                                <label htmlFor="validacao" className="d-flex gap-2 form-check-label">
                                    <input className='form-check-input' type="radio" name="status" id="validacao" value="Validação de campo"
                                    checked={status === "Validação de campo"} onChange={(e) => setStatus(e.target.value)} />
                                    Validação de campo
                                </label>
                            </div>
                        </fieldset>
                    </div>
                    <div className="col">
                        <fieldset className="col d-flex flex-column mt-5 p-3 align-items-start border rounded-2">
                            <div className="d-flex py-1 px-3 align-items-start justify-content-center rounded-5 position-relative border bg-custom-gray00" 
                                    style={{ top: '-2.5rem' }}>
                                <legend className='mb-0 text-white fs-5'>
                                    A qual P pertence?
                                </legend>
                            </div>

                            <div className="d-flex w-100 gap-3 align-items-start justify-content-center position-relative" style={{ top: '-0.75rem' }}>
                                <label htmlFor="preparo" className="d-flex gap-2 form-check-label">
                                    <input className='form-check-input' type="radio" name="whichP" id="preparo" value="Preparo"
                                    checked={whichP === "Preparo"} onChange={(e) => {
                                            setWhichP(e.target.value);
                                            dropChecklist();
                                        }} />
                                    Preparo
                                </label>
                                <label htmlFor="plantio" className="d-flex gap-2 form-check-label">
                                    <input className='form-check-input' type="radio" name="whichP" id="plantio" value="Plantio"
                                    checked={whichP === "Plantio"} onChange={(e) => {
                                            setWhichP(e.target.value);
                                            dropChecklist();
                                        }} />
                                    Plantio
                                </label>
                                <label htmlFor="pulverizacao" className="d-flex gap-2 form-check-label">
                                    <input className='form-check-input' type="radio" name="whichP" id="pulverizacao" value="Pulverização"
                                    checked={whichP === "Pulverização"} onChange={(e) => {
                                            setWhichP(e.target.value);
                                            dropChecklist();
                                        }} />
                                    Pulverização
                                </label>
                            </div>
                        </fieldset>
                    </div>
                </div>

                {/* --- 🔵 Inputs div --- */}
                <div className="row mt-4">
                    <div className="col d-flex flex-column gap-3">
                        <select name="estado" id="estado" className='form-select'
                                onChange={(e) => setState(e.target.value)} value={state} >
                            <option value="">Selecione...</option>
                            <option value="ES">ES</option>
                            <option value="MG">MG</option>
                            <option value="RJ">RJ</option>
                            <option value="SP">SP</option>
                        </select>
                        <input type="text" placeholder='Cidade' className='text-custom-black py-1 px-3 fs-5 border rounded-2' 
                                value={city} onChange={(e) => setCity(e.target.value)}/>
                        {/* <input type="text" placeholder='Convide alguém' className='text-custom-black py-1 px-3 fs-5 border rounded-2' required/> */}
                        <input type="text" placeholder='Área...' className='text-custom-black py-1 px-3 fs-5 border rounded-2' 
                                value={area} onChange={(e) => setArea(e.target.value)}/>
                    </div>

                    <div className="col">
                        <textarea className='form-control' name="descricao" id="decricao" rows={6} 
                                  value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>

                </div>

                {checklistData && (
                    <div className="d-flex flex-column align-items-center justify-content-center">
                        {/* <DisplayChecklist id={checklistId} /> */}
                        <div className="my-3">
                                <p className='text-custom-black fs-4 fw-bold mb-0'>{checklistData.name}</p>
                                <p className='fs-5 mb-0 text-custom-red'>{whichP}</p>
                        </div>

                        <ul className="list-unstyled d-flex flex-column gap-2">
                            {itemsData.map((item) => (
                                <li key={item.id} className="d-flex gap-3">
                                    <input className='form-check-input' type="checkbox" id={item.id} value={item.id}
                                        checked={item.checked} onChange={() => handleItemToggle(item.id)}/>
                                    <label htmlFor={item.id}>{item.name}</label>
                                </li>
                            ))} 
                        </ul>
                    </div>
                )}

                {/* --- 🔵 Button div --- */}
                <div className="d-flex align-items-center justify-content-between mt-5">
                    <button className='btn-custom btn-custom-outline-primary rounded-1 px-4' type='button' 
                        onClick={() => handleDeletePrototype(projectId, prototypeid!)}>Deletar</button>

                    {<ChooseChecklists whichP={whichP} onValueChange={setChecklist} checklistId={checklist!} prototypeId={prototypeid!} />}
                    
                    <button className='btn-custom btn-custom-success rounded-1 px-4' type='submit'>Salvar</button>
                </div>
                
            </form>
        </div>
    )
}

interface Props {
    prototypeId: string,
    checklistId: string,
    whichP: string,
    onValueChange: (value: string) => void;
}

function ChooseChecklists({ prototypeId, whichP, onValueChange, checklistId } : Props)
{
    const [ data, setData ] = useState<Checklist[]>([]);
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ show, setShow ] = useState(false);

    const openModal = () => setShow(true);
    const closeModal = () => {setShow(false)};

    const handleChange = async (e: any) => {
        const newValue = e.target.value;
        const prev = checklistId;

        if (prev && prev !== newValue)
        {
            await dropPrototypeChecklist(prototypeId, prev);
        }

        onValueChange(newValue);
    }

    const handleDelete = async () => {
        if (!checklistId) return
        
        await dropPrototypeChecklist(prototypeId, checklistId);
        onValueChange("");
        closeModal();
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
        
    }, [whichP, checklistId]);

    if (loading) return <p>Carregando...</p>;

    // if (!data) return <p>Nenhum item encontrado!</p>;

    return(
        <>
            <button className='btn-custom btn-custom-secondary' onClick={openModal} type="button">
                <p className='mb-0 fs-5 text-custom-white'>Gerenciar checklist</p>
            </button>

            <Modal show={show} onHide={closeModal} dialogClassName="modal-fullscreen" className='p-0'>
            <Modal.Header closeButton className="mb-0 mx-5 border-0 my-3"></Modal.Header>
            
                <Modal.Body className="container-fluid d-flex flex-column align-items-center m-auto gap-3">
                    <div className="p-3 d-flex flex-column gap-3 border">
                        <div className="">
                            <p className='text-custom-black fs-4 fw-bold mb-0'>Adicionar checklist</p>
                            <p className='fs-5 mb-0 text-custom-red'>{whichP}</p>
                        </div>

                        <ul className="list-unstyled d-flex flex-column gap-2">
                            {data.map((item) => (
                                <li key={item.id} className="d-flex gap-3">
                                    <input className='form-check-input' type="radio" name="checklist" id={item.id} value={item.id}
                                        checked={checklistId === item.id} onChange={handleChange} />
                                    <label htmlFor={item.id}>{item.name}</label>
                                </li>
                            ))} 
                        </ul>
                    </div>

                    <div className="d-flex gap-5">
                        <button className="btn-custom btn-custom-success" onClick={handleDelete}>Excluir</button>
                        <button className="btn-custom btn-custom-success" onClick={closeModal}>Adicionar</button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}