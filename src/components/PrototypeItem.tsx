// import { CalendarEvent } from 'react-bootstrap-icons';

import { useState,  useEffect, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router"
import { getPrototypeData, updatePrototype } from "../services/dbService";
import { movePrototypeToTrash } from "../services/dbService";

interface PrototypeDataProps {
    projectId?: string,
    code: string,
    name: string,
    status: string,
    description: string,
    whichP: string,
    state?: string,
    city?: string,
    area?: string,
}

export default function PrototypeItem()
{
    // const [ prototypeData, setPrototypeData ] = useState<any>(null);
    const [ prototypeData, setPrototypeData ] = useState<PrototypeDataProps | null>(null);
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
                    setPrototypeData(data);

                    setProjectId(data.projectId);
                    setCode(data.code || "");
                    setName(data.name || "");
                    setStatus(data.status || "");
                    setDescription(data.description || "");
                    setWhichP(data.whichP || "");
                    setState(data.state || "");
                    setCity(data.city || "");
                    setArea(data.area || "");
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

    }, [prototypeid]);


    function handleSubmit(e:FormEvent)
    {
        e.preventDefault();

        if (!prototypeid) return;

        
        const formData = { 
            protoCode: code, 
            protoName: name, 
            protoDescription: description, 
            protoP: whichP, 
            protoStatus: status, 
            state: state, 
            city: city, 
            area: area,
        };

        updatePrototype(prototypeid, formData)

        navigate(`/projects/${projectId}`);
    }

    const handleMoveProjectToTrash = async (projectId: string, prototypeId: string) => {
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
                <div className="mb-5">
                    <p className='fs-5 mb-0 text-custom-red'>Edição</p>
                    <p className='text-custom-black display-6 fw-bold mb-1'>{name}</p>
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
                                    <input className='form-check-input' type="radio" name="status" id="fabricacao" value={status}
                                           checked={status === "fabricacao"} onChange={(e) => setStatus(e.target.value)} />
                                    Fabricação
                                </label>
                                <label htmlFor="montagem" className="d-flex gap-2 form-check-label">
                                    <input className='form-check-input' type="radio" name="status" id="montagem" value={status}
                                    checked={status === "montagem"} onChange={(e) => setStatus(e.target.value)} />
                                    Montagem
                                </label>
                                <label htmlFor="validacao" className="d-flex gap-2 form-check-label">
                                    <input className='form-check-input' type="radio" name="status" id="validacao" value={status}
                                    checked={status === "validacao"} onChange={(e) => setStatus(e.target.value)} />
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
                                    <input className='form-check-input' type="radio" name="whichP" id="preparo" value={whichP}
                                    checked={whichP === "preparo"} onChange={(e) => setWhichP(e.target.value)} />
                                    Preparo
                                </label>
                                <label htmlFor="plantio" className="d-flex gap-2 form-check-label">
                                    <input className='form-check-input' type="radio" name="whichP" id="plantio" value={whichP}
                                    checked={whichP === "plantio"} onChange={(e) => setWhichP(e.target.value)} />
                                    Plantio
                                </label>
                                <label htmlFor="pulverizacao" className="d-flex gap-2 form-check-label">
                                    <input className='form-check-input' type="radio" name="whichP" id="pulverizacao" value={whichP}
                                    checked={whichP === "pulverizacao"} onChange={(e) => setWhichP(e.target.value)} />
                                    Pulverização
                                </label>
                            </div>
                        </fieldset>
                    </div>
                </div>

                {/* <div className="row"> */}
                    {/* <div className="col">
                        <fieldset className="col d-flex flex-column mt-5 p-3 align-items-start border rounded-2">
                            <div className="d-flex py-1 px-3 align-items-start justify-content-center rounded-5 position-relative border bg-custom-gray00" 
                                    style={{ top: '-2.5rem' }}>
                                <legend className='mb-0 text-white fs-5'>
                                    Culturas
                                </legend>
                            </div>

                            <div className="d-flex w-100 gap-3 align-items-start justify-content-center position-relative" style={{ top: '-0.75rem' }}>
                                <label htmlFor="preparo" className="d-flex gap-2 form-check-label">
                                    <input className='form-check-input' type="radio" name="radio" id="preparo" />
                                    Preparo
                                </label>
                                <label htmlFor="preparo" className="d-flex gap-2 form-check-label">
                                    <input className='form-check-input' type="radio" name="radio" id="preparo" />
                                    Preparo
                                </label>
                                <label htmlFor="preparo" className="d-flex gap-2 form-check-label">
                                    <input className='form-check-input' type="radio" name="radio" id="preparo" />
                                    Preparo
                                </label>
                            </div>
                        </fieldset>
                    </div> */}

                    {/* <div className="col">
                        <fieldset className="col d-flex flex-column mt-5 px-3 align-items-start border rounded-2">
                            <div className="d-flex mt-4 px-3 align-items-start justify-content-center rounded-5 position-relative border bg-custom-gray00" 
                                    style={{ top: '-2.5rem' }}>
                                <legend className='mb-0 text-white fs-5'>
                                    Disponibilidade
                                </legend>
                            </div>

                            <div className="row d-flex pb-1 px-2 w-100 gap-3 position-relative" style={{ top: '-1rem' }}>
                                <input className="col py-1 d-flex align-items-center gap-3 border rounded form-control" value={"00/00/0000"} />
                                <input className="col py-1 d-flex align-items-center gap-3 border rounded form-control" value={"+1212121212"} />
                                
                            </div>
                        </fieldset>
                    </div>
                </div> */}

                {/* --- 🔵 Inputs div --- */}
                <div className="row mt-4">
                    <div className="col d-flex flex-column gap-3">
                        <select name="estado" id="estado" className='form-select'
                                onChange={(e) => setState(e.target.value)} value={state} >
                            <option value="">Selecione...</option>
                            <option value="es">ES</option>
                            <option value="mg">MG</option>
                            <option value="rj">RJ</option>
                            <option value="sp">SP</option>
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

                {/* --- 🔵 Button div --- */}
                <div className="d-flex align-items-center justify-content-between mt-5">
                    <button className='btn-custom btn-custom-outline-primary rounded-1 px-4' type='button' 
                        onClick={() => handleMoveProjectToTrash(projectId, prototypeid)}>Deletar</button>
                    <button className='btn-custom btn-custom-success rounded-1 px-4' type='submit'>Salvar</button>
                </div>
                
            </form>
        </div>
    )
}