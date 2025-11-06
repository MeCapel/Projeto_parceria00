import React, { useState, useEffect } from "react"
import Modal from 'react-bootstrap/Modal';
import { CheckLg } from 'react-bootstrap-icons';

export default function ProtoMultiForm()
{
    const [ show, setShow ] = useState(false);
    const [ step, setStep ] = useState<number>(1);
    const totalSteps = 3;

    useEffect(() => {
        const header = document.querySelector('.showOrHide') as HTMLElement | null;

        if (!header) return;

        header.classList.toggle("hidden-header", show);
    }, [show]);

    const openModal = () => setShow(true);
    const closeModal = () => setShow(false);

    // const items = [
    //     { id: 1, label: 'Geral', status: 'active' },
    //     { id: 2, label: 'Status', status: 'pending' },
    //     { id: 3, label: 'Fotos', status: 'pending' },
    // ]

    const labels = ["Geral", "Status", "Fotos"];

    function handlePrev()
    {
        if (step > 1) setStep((step) => step - 1);
    }

    function handleNext()
    {
        if (step < totalSteps) setStep((step) => step + 1);
    }

    function handleCreate()
    {
        console.log("create a new prototype!");
    }

    const renderStep = (step: number) => {
        switch (step)
        {
            case 1: 
                return <NewProtoForm01 />;
            case 2: 
                return <NewProtoForm02 />;
            case 3: 
                return <NewProtoForm03 />;
            default:
                return null;
        }
    }

    return (
        <>
            <button className="btn-custom btn-custom-primary" onClick={openModal}>
                <p className="mb-0 fs-5 text-custom-white">Novo protótipo</p>
            </button>

      <Modal show={show} onHide={closeModal} dialogClassName="modal-fullscreen" className="p-0">
        <Modal.Header closeButton className="mb-0 mx-5 border-0 my-3" />
        <Modal.Body className="d-flex flex-column align-items-center justify-content-center">
          
          {/* --- Step Tracker --- */}
          <div className="d-flex align-items-center justify-content-center my-4">
            {labels.map((label, i) => {
              const id = i + 1;
              const status = id < step ? "done" :
                             id === step ? "active" :
                             "pending";

              return (
                <div key={id}>
                  <div className="d-flex align-items-center gap-2">
                    {status === "done" ? (
                        <>
                            <div className="d-flex flex-column align-items-center gap-2">
                            <div className="d-flex align-items-center justify-content-center rounded-circle bg-custom-success01"
                                style={{ height: "50px", width: "50px" }} >
                                <CheckLg className="text-white" size={20} />
                            </div>
                                <p className={`mb-0 text-custom-black fs-6" }`} >{label}</p>
                            </div>
                            {id < totalSteps && (
                                <div className="position-relative mx-2" style={{ width: "5rem", border: "1px solid var(--gray00)", top: "-1rem"}}></div>
                            )}
                        </>
                    ) : status === "active" ? (
                        <>
                            <div className="d-flex flex-column align-items-center gap-2">
                            <div className="d-flex align-items-center justify-content-center rounded-circle bg-custom-gray00 text-white"
                                style={{ height: "50px", width: "50px" }} >
                                <span>{id}</span>
                            </div>
                            <p className={`mb-0 text-custom-black fs-6 fw-semibold`} >{label}</p>
                            </div>
                            {id < totalSteps && (
                                <div className="position-relative mx-2" style={{ width: "5rem", border: "1px solid var(--gray00)", top: "-1rem"}}></div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="d-flex flex-column align-items-center gap-2">
                            <div className="d-flex align-items-center justify-content-center rounded-circle bg-white text-dark"
                                style={{ height: "50px", width: "50px", border: "2px solid var(--gray00)" }} >
                                <span>{id}</span>
                            </div>
                            <p className={`mb-0 text-custom-black fs-6`} >{label}</p>
                            </div>
                            
                            {id < totalSteps && (
                                <div className="position-relative mx-2" style={{ width: "5rem", border: "1px solid var(--gray00)", top: "-1rem"}}></div>
                            )}
                        </>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

          {/* --- Step content --- */}
          {renderStep(step)}

        {/* --- Navigation buttons --- */}
        <div className="d-flex gap-5" style={{ position: "relative", top: "-10rem"}}>

            {step > 1 && (
                <button className="btn btn-custom-success" type="button" onClick={handlePrev}>Anterior</button>
            )}
            {step < totalSteps && (
                <button className="btn btn-custom-success" type="button" onClick={handleNext}>Próximo</button>
            )}
            {step === totalSteps && (
                <button className="btn btn-custom-success" type="button" onClick={handleCreate}>Cadastrar</button>
            )}

        </div>
        </Modal.Body>
      </Modal>
    </>
    )
}

function NewProtoForm01()
{
    const [ numSerie, setNumSerie ] = useState("");
    const [ numProtoName, setProtoName ] = useState("");
    const [ numProtoDescription, setProtoDescription ] = useState("");

    return(
        <>
            <Modal.Body className="container-fluid d-flex flex-column align-items-center m-auto"> 

                {/* --- 🔴 Inner content div --- */}
                <form className="">

                    {/* --- Title div --- */}
                    <div className="">
                        <p className='fs-5 mb-0 text-custom-red'>Cadastro</p>
                        <p className='text-custom-black display-6 fw-bold mb-1'>Cadastro do protótipo</p>
                        <p className='text-custom-black'>*Campos obrigatórios</p>
                    </div>

                    {/* 🔵 Radio select div */}
                    <fieldset className="d-flex flex-column mt-5 p-3 align-items-start border rounded-2">
                        <div className="d-flex py-1 px-3 align-items-start justify-content-center rounded-5 position-relative border bg-custom-gray00" 
                                style={{ top: '-2.5rem' }}>
                            <legend className='mb-0 text-white fs-5'>
                                A qual P pertence?*
                            </legend>
                        </div>

                        <div className="d-flex w-100 gap-3 align-items-start justify-content-center position-relative" style={{ top: '-0.75rem' }}>
                            <label htmlFor="preparo" className="d-flex gap-2"><input type="radio" name="radio" id="preparo" />Preparo</label>
                            <label htmlFor="plantio" className="d-flex gap-2"><input type="radio" name="radio" id="plantio" />Plantio</label>
                            <label htmlFor="pulverizacao" className="d-flex gap-2"><input type="radio" name="radio" id="pulverizacao" />Pulverização</label>
                        </div>
                        
                    </fieldset>

                    {/* --- 🔵 Inputs div --- */}
                    <div className="d-flex flex-column my-4 gap-3">
                        <input type="text" placeholder='N° de série' className='text-custom-black py-1 px-3 fs-5 border rounded-2' 
                                required onChange={(e) => setNumSerie(e.target.value)}/>
                        <input type="text" placeholder='Nome do protótipo' className='text-custom-black py-1 px-3 fs-5 border rounded-2' 
                                required onChange={(e) => setProtoName(e.target.value)}/>
                        {/* <input type="text" placeholder='Convide alguém' className='text-custom-black py-1 px-3 fs-5 border rounded-2' required/> */}
                        <input type="text" placeholder='Descrição do protótipo' className='text-custom-black py-1 px-3 fs-5 border rounded-2' 
                                required onChange={(e) => setProtoDescription(e.target.value)}/>
                    </div>

                    {/* --- 🔵 Button div --- */}
                    {/* <div className="d-flex align-items-center justify-content-end">
                        <button className='btn-custom btn-custom-success rounded-1 px-4' type='submit'>Próximo</button>
                    </div> */}
                </form>
            </Modal.Body>
        </>
    )
}

function NewProtoForm02()
{
    const [ onFieldStatus, setOnFieldStatus ] = useState("");
    const [ onFieldCulture, setOnFieldCulture ] = useState("");

    const handleCheckOnFieldStatus = (e) => {
        setOnFieldStatus(e.target.value);
    }

    const handleCheckOnFieldCulture = (e) => {
        setOnFieldCulture(e.target.value);
    }

    return(
        <>
            <Modal.Body className="container-fluid d-flex flex-column align-items-center m-auto"> 

                {/* --- 🔴 Inner content div --- */}
                <form className="">

                    {/* --- Title div --- */}
                    <div className="">
                        <p className='fs-5 mb-0 text-custom-red'>Cadastro</p>
                        <p className='text-custom-black display-6 fw-bold mb-1'>Cadastro do protótipo</p>
                        <p className='text-custom-black'>*Campos obrigatórios</p>
                    </div>

                    {/* 🔵 Radio select div status */}
                    <fieldset className="d-flex flex-column mt-5 p-3 align-items-start border rounded-2">
                        <div className="d-flex py-1 px-3 align-items-start justify-content-center rounded-5 position-relative border bg-custom-gray00" 
                                style={{ top: '-2.5rem' }}>
                            <legend className='mb-0 text-white fs-5'>
                                Status atual*
                            </legend>
                        </div>

                        <div className="d-flex w-100 gap-3 align-items-start justify-content-center position-relative" style={{ top: '-0.75rem' }}>
                            <label htmlFor="fabricacao" className="d-flex gap-2">
                                <input type="radio" value="fabricacao" name="radio" id="fabricacao" checked={onFieldStatus === "fabricacao"} onChange={handleCheckOnFieldStatus}/>
                                Fabricação
                            </label>

                            <label htmlFor="montagem" className="d-flex gap-2">
                                <input type="radio" value="montagem" name="radio" id="montagem" checked={onFieldStatus === "montagem"} onChange={handleCheckOnFieldStatus}/>
                                Montagem
                            </label>

                            <label htmlFor="validacao" className="d-flex gap-2">
                                <input type="radio" value="validacao" name="radio" id="validacao" checked={onFieldStatus === "validacao"} onChange={handleCheckOnFieldStatus} />
                                Validação de campo
                            </label>
                        </div>
                        
                    </fieldset>

                    {/* --- 🔵 Inputs div --- */}
                    {onFieldStatus === "validacao" && (

                        <div className="d-flex flex-column my-4 gap-3" style={{ height: '50vh', overflow: "auto"}}>

                            <div className="d-flex justify-content-between gap-3">
                                <select className="form-select py-1 px-3" style={{ border: '1px solid var(--gray00)', outline: "none" }} name="estado" id="estado">
                                    <option defaultValue={"Estado*"}>Estado*</option>
                                    <option value="es">ES</option>
                                    <option value="mg">MG</option>
                                    <option value="rj">RJ</option>
                                    <option value="sp">SP</option>
                                </select>
                                <input type="text" placeholder='Cidade*' className='text-custom-black py-1 px-3 fs-5 border rounded-2' 
                                    required onChange={(e) => (e.target.value)}/>
                            </div>

                            {/* <input type="text" placeholder='Convide alguém' className='text-custom-black py-1 px-3 fs-5 border rounded-2' required/> */}
                            <input type="text" placeholder='Área' className='text-custom-black py-1 px-3 fs-5 border rounded-2' 
                                    required onChange={(e) => (e.target.value)}/>

                            {/* 🔵 Radio select div cultures */}
                            <fieldset className="d-flex flex-column mt-4 p-3 align-items-start border rounded-2">
                                <div className="d-flex py-1 px-3 align-items-start justify-content-center rounded-5 position-relative border bg-custom-gray00" 
                                        style={{ top: '-2.5rem' }}>
                                    <legend className='mb-0 text-white fs-5'>
                                        Culturas*
                                    </legend>
                                </div>

                                <div className="d-flex w-100 gap-3 align-items-start justify-content-center position-relative" style={{ top: '-0.75rem' }}>
                                    <label htmlFor="fabricacao" className="d-flex gap-2">
                                        <input type="radio" value="fabricacao" name="radio" id="fabricacao" />
                                        Fabricação
                                    </label>

                                    <label htmlFor="montagem" className="d-flex gap-2">
                                        <input type="radio" value="montagem" name="radio" id="montagem" />
                                        Montagem
                                    </label>

                                    <label htmlFor="validacao" className="d-flex gap-2">
                                        <input type="radio" value="validacao" name="radio" id="validacao" />
                                        Validação de campo
                                    </label>
                                </div>
                                
                            </fieldset>
                        </div>
                    )}

                    {/* --- 🔵 Button div --- */}
                    {/* <div className="d-flex align-items-center justify-content-end">
                        <button className='btn-custom btn-custom-success rounded-1 px-4' type='submit'>Próximo</button>
                    </div> */}
                </form>
            </Modal.Body>
        </>
    )
}

function NewProtoForm03()
{
    return(
        <>
                <Modal.Body className="container-fluid d-flex flex-column align-items-center m-auto"> 

                    {/* --- 🔴 Inner content div --- */}
                    <form className="">

                        {/* --- Title div --- */}
                        <div className="">
                            <p className='fs-5 mb-0 text-custom-red'>Cadastro</p>
                            <p className='text-custom-black display-6 fw-bold mb-1'>Cadastro do protótipo</p>
                            <p className='text-custom-black'>*Campos obrigatórios</p>
                        </div>

                        {/* 🔵 Radio select div */}
                        <fieldset className="d-flex flex-column mt-5 p-3 align-items-start border rounded-2">
                            <div className="d-flex py-1 px-3 align-items-start justify-content-center rounded-5 position-relative border bg-custom-gray00" 
                                 style={{ top: '-2.5rem' }}>
                                <legend className='mb-0 text-white fs-5'>
                                    Status atual*
                                </legend>
                            </div>

                            <div className="d-flex w-100 gap-3 align-items-start justify-content-center position-relative" style={{ top: '-0.75rem' }}>
                                <label htmlFor="fabricacao" className="d-flex gap-2"><input type="radio" name="radio" id="fabricacao" />Fabricação</label>
                                <label htmlFor="montagem" className="d-flex gap-2"><input type="radio" name="radio" id="montagem" />Montagem</label>
                                <label htmlFor="validacao" className="d-flex gap-2"><input type="radio" name="radio" id="validacao" />Validação de campo</label>
                            </div>
                            
                        </fieldset>

                        {/* --- 🔵 Inputs div --- */}
                        <div className="d-flex flex-column my-4 gap-3">

                            <div className="d-flex justify-content-between gap-3">
                                <select className="form-select py-1 px-3" style={{ border: '1px solid var(--gray00)', outline: "none" }} name="estado" id="estado">
                                    <option defaultValue={"Estado*"}>Estado*</option>
                                    <option value="es">ES</option>
                                    <option value="mg">MG</option>
                                    <option value="rj">RJ</option>
                                    <option value="sp">SP</option>
                                </select>
                                <input type="text" placeholder='Cidade*' className='text-custom-black py-1 px-3 fs-5 border rounded-2' 
                                    required onChange={(e) => (e.target.value)}/>
                            </div>

                            {/* <input type="text" placeholder='Convide alguém' className='text-custom-black py-1 px-3 fs-5 border rounded-2' required/> */}
                            <input type="text" placeholder='Área' className='text-custom-black py-1 px-3 fs-5 border rounded-2' 
                                   required onChange={(e) => (e.target.value)}/>
                        </div>

                        {/* --- 🔵 Button div --- */}
                        {/* <div className="d-flex align-items-center justify-content-end">
                            <button className='btn-custom btn-custom-success rounded-1 px-4' type='submit'>Próximo</button>
                        </div> */}
                    </form>
                </Modal.Body>
        </>
    )
}