import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from "react"
import { CheckLg } from 'react-bootstrap-icons';

// OBS: Here we got 'ProtoMultiForm' as a parent component, and ProtoForm01, ProtoForm02, ProtoForm03 are its children. By being a parent, 'ProtoMultiForm' handles and keep track of all its children data.

// ----- DECLARING DATA INTERFACES -----
interface Step1DataProps {
    protoCode: string,
    protoName: string,
    protoDescription: string,
    whichP: string,
}

interface Step2DataProps {
    status: string,
    state?: string,
    city?: string,
    area?: string,
}

interface FormData {
    step1: Step1DataProps,
    step2: Step2DataProps,
}

export default function ProtoMultiForm()
{
    // ----- DECLARING GERAL VARIABLES -----
    const totalSteps = 3;
    const labels = ["Geral", "Status", "Fotos"];

    // ----- SETUP OF useState() REACT HOOKS -----
    const [ show, setShow ] = useState(false);
    const [ step, setStep ] = useState<number>(1);
    const [ formData, setFormData ] = useState({
        step1: { protoCode: "", protoName: "", protoDescription: "", whichP: ''},
        step2: { status: "", state: "", city: "", area: ""},
    });
    const [ stepErrors, setStepErrors ] = useState<Record<number, Record<string, string> | undefined>>({});
    
    // ----- SETTERS TO OPEN OR CLOSE THE MODAL -----
    const openModal = () => setShow(true);
    const closeModal = () => {
        setShow(false);
        cleanAllFields();
        setStep(1);
    };

    // ----- SETUP OF useEffect() REACT HOOK, RENDERS EVERY TIME SHOW CHANGES: -----
    // This one makes sure that when modal is displaying, header does not render, so it do not hide the modal close button
    useEffect(() => {
        const header = document.querySelector('.showOrHide') as HTMLElement | null;

        if (!header) return;

        header.classList.toggle("hidden-header", show);
    }, [show]);

    // ----- FUNCTION TO HANDLE FORM INPUTS -----
    function updateStepFields<T extends keyof FormData>(
        stepKey: T,
        field: keyof FormData[T],
        value: FormData[T][typeof field],
    ) {
        setFormData(prev => ({
            ...prev,
            [stepKey]: {
                ...prev[stepKey],
                [field]: value,
            },
        }));
    };

    // ----- FUNCTION TO VALIDATE STEPS DATA -----
    function validateStepData(stepKey: number) : { valid: boolean; errors?: Record<string, string> } {
        const max = 25;
        const min = 5;
        const message = `Campo necessário! Deve conter entre ${min} - ${max} caracteres`;

        if (stepKey === 1)
        {
            const { protoCode, protoName, protoDescription, whichP } = formData.step1;
            const errors: Record<string, string> = {};

            if (protoCode.trim().length < min || protoCode.trim().length > max) errors.protoCode = message;
            if (protoName.trim().length < min || protoName.trim().length > max) errors.protoName = message;
            if (protoDescription.trim().length < min || protoDescription.trim().length > max) 
                errors.protoDescription = `Campo necessário! Deve conter entre ${5} - ${50} caracteres`;

            if (whichP.length < min || whichP.length > max) errors.whichP = "Campo necerssário!";

            return { valid: Object.keys(errors).length === 0, errors: Object.keys(errors).length ? errors : undefined };
        }

        // if (stepKey === 2)
        // {
        //     const { status, state, city, area } = formData.step2;
        //     const errors: Record<string, string> = {};

        //     if (!status) errors.status = message;

        //     if ( status == "validacao")
        //     {
        //         if (!state) errors.state = message;
        //         if (!city) errors.city = message;
        //         if (!area) errors.area = message;
        //     }

        //     return { valid: Object.keys(errors).length === 0, errors: Object.keys(errors).length ? errors : undefined };
        // }

        return { valid: true };
    }
    
    // ----- FUNCTIONS TO HANDLE FORMS NAVIGATION -----
    
    // This one grabs the current position and sets step by decressing by one its value, then the previous component is rendered
    // OBS: this only occours if step is higher than 1, if not, the step value will be 0, we do not have any form with index 0  
    function handlePrev()
    {
        if (step > 1) setStep((step) => step - 1);
    }

    // This one grabs the current position and sets step by increassing by one its value, then the next component is rendered
    // OBS: this only occours if step is lower than the max of steps, if not, the step value will be more than the total, we do not have any form with index bigger than totalSteps
    function handleNext()
    {
        const { valid, errors } = validateStepData(step);

        if (valid)
        {
            if (step < totalSteps) setStep((step) => step + 1);
        }
        else 
        {
            setStepErrors(prev => ({ ...prev, [step]: errors }));
        }
    }

    // Once all data in forms is up to catch, this function is called and finnaly it create a new prototype by passing all data to another function (db function)
    function handleCreate()
    {
        const { valid, errors } = validateStepData(step);

        if (!valid)
        {
            setStepErrors(prev => ({ ...prev, [step]: errors }));
            return;
        }

        const test = formData.step1.whichP;
        console.log("create a new prototype! Test: " + test);
    }

    function cleanAllFields()
    {
        const stepsNFields = {
            step1: [ "whichP", "protoCode", "protoName", "protoDescription"] as const,
            step2: [ "status", "state", "city", "area" ] as const,
        }

        stepsNFields.step1.forEach((field) => {
            updateStepFields("step1", field, "");
        })

    }

    // This one takes care of which form needs to rander based on the current value of variable step
    const renderStep = (step: number) => {
        switch (step)
        {
            case 1: 
                return <ProtoForm01 data={formData.step1} update={(field, value) => updateStepFields("step1", field, value)} 
                                    errors={stepErrors[1]} maxLength={25} />;
            // case 2: 
            //     return <ProtoForm02 data={formData.step2} update={(field, value) => updateStepFields("step2", field, value)} errors={stepErrors[2]}/>;
            // case 3: 
            //     return <ProtoForm03 />;
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
                <div className="d-flex align-items-center justify-content-center my-3 mx-4">
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
                <div className="d-flex gap-5" style={{ position: "relative", top: "-7rem"}}>

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

interface ProtoForm01Props {
    data: Step1DataProps,
    update: (field: keyof Step1DataProps, value: string) => void,
    errors?: Record<string, string>,
    maxLength: number
}

function ProtoForm01({ data, update, errors, maxLength } : ProtoForm01Props )
{
    return(
        <>
            <Modal.Body className="container-fluid d-flex flex-column align-items-center m-auto"> 

                {/* --- 🔴 Inner content div --- */}
                <form onSubmit={(e) => e.preventDefault()} style={{ height: '60vh', overflow: "auto"}}>

                    {/* --- Title div --- */}
                    <div className="">
                        <p className='fs-5 mb-0 text-custom-red'>Cadastro</p>
                        <p className='text-custom-black display-6 fw-bold mb-1'>Cadastro do protótipo</p>
                        <p className='text-custom-black'>*Campos obrigatórios</p>
                    </div>

                    {/* 🔵 Radio select div */}
                    {/* <fieldset className="d-flex flex-column mt-5 p-3 align-items-start border rounded-2"> */}
                    <fieldset className={errors?.whichP ? 
                                            "d-flex flex-column mt-5 p-3 align-items-start border-custom-red00 rounded-2" : 
                                            "d-flex flex-column mt-5 p-3 align-items-start border rounded-2"}>
                        <div className="d-flex py-1 px-3 align-items-start justify-content-center rounded-5 position-relative border bg-custom-gray00" 
                                style={{ top: '-2.5rem' }}>
                            <legend className='mb-0 text-white fs-5'>
                                A qual P pertence?*
                            </legend>
                        </div>

                        <div className="d-flex w-100 gap-3 align-items-start justify-content-center position-relative" style={{ top: '-0.75rem' }}>
                            <label htmlFor="preparo" className="d-flex gap-2">
                                <input type="radio" name="radio" id="preparo" checked={data.whichP === "preparo"} 
                                       onChange={() => update("whichP", "preparo")}/>
                                Preparo
                            </label>

                            <label htmlFor="plantio" className="d-flex gap-2">
                                <input type="radio" name="radio" id="plantio" checked={data.whichP === "plantio"} 
                                       onChange={() => update("whichP", "plantio")}/>
                                Plantio
                            </label>

                            <label htmlFor="pulverizacao" className="d-flex gap-2">
                                <input type="radio" name="radio" id="pulverizacao" checked={data.whichP === "pulverizacao"} 
                                       onChange={() => update("whichP", "pulverizacao")}/>
                                Pulverização
                            </label>
                        </div>
                        
                    </fieldset>
                        

                    {/* --- 🔵 Inputs div --- */}
                    <div className="d-flex flex-column my-4 gap-3">
                        <input type="text" placeholder='N° de série' className='text-custom-black py-1 px-3 fs-5 border rounded-2' 
                                required onChange={(e) => update("protoCode", e.target.value)} value={data.protoCode} maxLength={maxLength} />
                        {errors?.protoCode && 
                            <div className="position-relative z-3 text-custom-red px-3">
                            {errors.protoCode}
                            </div>
                        }

                        <input type="text" placeholder='Nome do protótipo' className='text-custom-black py-1 px-3 fs-5 border rounded-2' 
                                required onChange={(e) => update("protoName", e.target.value)} value={data.protoName} maxLength={maxLength}/>
                        {errors?.protoName && 
                            <div className="position-relative z-3 text-custom-red px-3">
                                {errors.protoName}
                            </div>
                        }

                        {/* <input type="text" placeholder='Convide alguém' className='text-custom-black py-1 px-3 fs-5 border rounded-2' required/> */}
                        <input type="text" placeholder='Descrição do protótipo' className='text-custom-black py-1 px-3 fs-5 border rounded-2' 
                                required onChange={(e) => update("protoDescription", e.target.value)} value={data.protoDescription} maxLength={50}/>
                        {errors?.protoDescription && 
                            <div className="position-relative z-3 text-custom-red px-3">
                                {errors.protoDescription}
                            </div>
                        }

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

// function ProtoForm02()
// {
//     const [ onFieldStatus, setOnFieldStatus ] = useState("");
//     const [ onFieldCulture, setOnFieldCulture ] = useState("");

//     const handleCheckOnFieldStatus = (e) => {
//         setOnFieldStatus(e.target.value);
//     }

//     const handleCheckOnFieldCulture = (e) => {
//         setOnFieldCulture(e.target.value);
//     }

//     return(
//         <>
//             <Modal.Body className="container-fluid d-flex flex-column align-items-center m-auto"> 

//                 {/* --- 🔴 Inner content div --- */}
//                 <form className="">

//                     {/* --- Title div --- */}
//                     <div className="">
//                         <p className='fs-5 mb-0 text-custom-red'>Cadastro</p>
//                         <p className='text-custom-black display-6 fw-bold mb-1'>Cadastro do protótipo</p>
//                         <p className='text-custom-black'>*Campos obrigatórios</p>
//                     </div>

//                     {/* 🔵 Radio select div status */}
//                     <fieldset className="d-flex flex-column mt-5 p-3 align-items-start border rounded-2">
//                         <div className="d-flex py-1 px-3 align-items-start justify-content-center rounded-5 position-relative border bg-custom-gray00" 
//                                 style={{ top: '-2.5rem' }}>
//                             <legend className='mb-0 text-white fs-5'>
//                                 Status atual*
//                             </legend>
//                         </div>

//                         <div className="d-flex w-100 gap-3 align-items-start justify-content-center position-relative" style={{ top: '-0.75rem' }}>
//                             <label htmlFor="fabricacao" className="d-flex gap-2">
//                                 <input type="radio" value="fabricacao" name="radio" id="fabricacao" checked={onFieldStatus === "fabricacao"} onChange={handleCheckOnFieldStatus}/>
//                                 Fabricação
//                             </label>

//                             <label htmlFor="montagem" className="d-flex gap-2">
//                                 <input type="radio" value="montagem" name="radio" id="montagem" checked={onFieldStatus === "montagem"} onChange={handleCheckOnFieldStatus}/>
//                                 Montagem
//                             </label>

//                             <label htmlFor="validacao" className="d-flex gap-2">
//                                 <input type="radio" value="validacao" name="radio" id="validacao" checked={onFieldStatus === "validacao"} onChange={handleCheckOnFieldStatus} />
//                                 Validação de campo
//                             </label>
//                         </div>
                        
//                     </fieldset>

//                     {/* --- 🔵 Inputs div --- */}
//                     {onFieldStatus === "validacao" && (

//                         <div className="d-flex flex-column my-4 gap-3" style={{ height: '50vh', overflow: "auto"}}>

//                             <div className="d-flex justify-content-between gap-3">
//                                 <select className="form-select py-1 px-3" style={{ border: '1px solid var(--gray00)', outline: "none" }} name="estado" id="estado">
//                                     <option defaultValue={"Estado*"}>Estado*</option>
//                                     <option value="es">ES</option>
//                                     <option value="mg">MG</option>
//                                     <option value="rj">RJ</option>
//                                     <option value="sp">SP</option>
//                                 </select>
//                                 <input type="text" placeholder='Cidade*' className='text-custom-black py-1 px-3 fs-5 border rounded-2' 
//                                     required onChange={(e) => (e.target.value)}/>
//                             </div>

//                             {/* <input type="text" placeholder='Convide alguém' className='text-custom-black py-1 px-3 fs-5 border rounded-2' required/> */}
//                             <input type="text" placeholder='Área' className='text-custom-black py-1 px-3 fs-5 border rounded-2' 
//                                     required onChange={(e) => (e.target.value)}/>

//                             {/* 🔵 Radio select div cultures */}
//                             <fieldset className="d-flex flex-column mt-4 p-3 align-items-start border rounded-2">
//                                 <div className="d-flex py-1 px-3 align-items-start justify-content-center rounded-5 position-relative border bg-custom-gray00" 
//                                         style={{ top: '-2.5rem' }}>
//                                     <legend className='mb-0 text-white fs-5'>
//                                         Culturas*
//                                     </legend>
//                                 </div>

//                                 <div className="d-flex w-100 gap-3 align-items-start justify-content-center position-relative" style={{ top: '-0.75rem' }}>
//                                     <label htmlFor="fabricacao" className="d-flex gap-2">
//                                         <input type="radio" value="fabricacao" name="radio" id="fabricacao" />
//                                         Fabricação
//                                     </label>

//                                     <label htmlFor="montagem" className="d-flex gap-2">
//                                         <input type="radio" value="montagem" name="radio" id="montagem" />
//                                         Montagem
//                                     </label>

//                                     <label htmlFor="validacao" className="d-flex gap-2">
//                                         <input type="radio" value="validacao" name="radio" id="validacao" />
//                                         Validação de campo
//                                     </label>
//                                 </div>
                                
//                             </fieldset>
//                         </div>
//                     )}

//                     {/* --- 🔵 Button div --- */}
//                     {/* <div className="d-flex align-items-center justify-content-end">
//                         <button className='btn-custom btn-custom-success rounded-1 px-4' type='submit'>Próximo</button>
//                     </div> */}
//                 </form>
//             </Modal.Body>
//         </>
//     )
// }

// function ProtoForm03()
// {
//     return(
//         <>
//                 <Modal.Body className="container-fluid d-flex flex-column align-items-center m-auto"> 

//                     {/* --- 🔴 Inner content div --- */}
//                     <form className="">

//                         {/* --- Title div --- */}
//                         <div className="">
//                             <p className='fs-5 mb-0 text-custom-red'>Cadastro</p>
//                             <p className='text-custom-black display-6 fw-bold mb-1'>Cadastro do protótipo</p>
//                             <p className='text-custom-black'>*Campos obrigatórios</p>
//                         </div>

//                         {/* 🔵 Radio select div */}
//                         <fieldset className="d-flex flex-column mt-5 p-3 align-items-start border rounded-2">
//                             <div className="d-flex py-1 px-3 align-items-start justify-content-center rounded-5 position-relative border bg-custom-gray00" 
//                                  style={{ top: '-2.5rem' }}>
//                                 <legend className='mb-0 text-white fs-5'>
//                                     Status atual*
//                                 </legend>
//                             </div>

//                             <div className="d-flex w-100 gap-3 align-items-start justify-content-center position-relative" style={{ top: '-0.75rem' }}>
//                                 <label htmlFor="fabricacao" className="d-flex gap-2"><input type="radio" name="radio" id="fabricacao" />Fabricação</label>
//                                 <label htmlFor="montagem" className="d-flex gap-2"><input type="radio" name="radio" id="montagem" />Montagem</label>
//                                 <label htmlFor="validacao" className="d-flex gap-2"><input type="radio" name="radio" id="validacao" />Validação de campo</label>
//                             </div>
                            
//                         </fieldset>

//                         {/* --- 🔵 Inputs div --- */}
//                         <div className="d-flex flex-column my-4 gap-3">

//                             <div className="d-flex justify-content-between gap-3">
//                                 <select className="form-select py-1 px-3" style={{ border: '1px solid var(--gray00)', outline: "none" }} name="estado" id="estado">
//                                     <option defaultValue={"Estado*"}>Estado*</option>
//                                     <option value="es">ES</option>
//                                     <option value="mg">MG</option>
//                                     <option value="rj">RJ</option>
//                                     <option value="sp">SP</option>
//                                 </select>
//                                 <input type="text" placeholder='Cidade*' className='text-custom-black py-1 px-3 fs-5 border rounded-2' 
//                                     required onChange={(e) => (e.target.value)}/>
//                             </div>

//                             {/* <input type="text" placeholder='Convide alguém' className='text-custom-black py-1 px-3 fs-5 border rounded-2' required/> */}
//                             <input type="text" placeholder='Área' className='text-custom-black py-1 px-3 fs-5 border rounded-2' 
//                                    required onChange={(e) => (e.target.value)}/>
//                         </div>

//                         {/* --- 🔵 Button div --- */}
//                         {/* <div className="d-flex align-items-center justify-content-end">
//                             <button className='btn-custom btn-custom-success rounded-1 px-4' type='submit'>Próximo</button>
//                         </div> */}
//                     </form>
//                 </Modal.Body>
//         </>
//     )
// }