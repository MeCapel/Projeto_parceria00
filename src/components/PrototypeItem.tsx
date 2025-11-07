import Modal from 'react-bootstrap/Modal';
// import { CalendarEvent } from 'react-bootstrap-icons';
import { useState, useEffect } from 'react';

export default function PrototypeItem()
{
    const [ show, setShow ] = useState(false);

    const openModal = () => setShow(true);
    const closeModal = () => setShow(false);

    useEffect(() => {
        const header = document.querySelector('.showOrHide') as HTMLElement | null;

        if (!header) return;

        header.classList.toggle("hidden-header", show);
    }, [show]);


    return(
        <>
            <button className='btn-custom btn-custom-primary' onClick={openModal} >
                <p className='mb-0 fs-5 text-custom-white'>Novo projeto</p>
            </button>

            <Modal show={show} onHide={closeModal} dialogClassName="modal-fullscreen" className='p-0'>
                <Modal.Header closeButton className="mb-0 mx-5 border-0 my-3"></Modal.Header>
                <Modal.Body className="container-fluid d-flex flex-column align-items-center m-auto"> 


                    {/* --- 🔴 Inner content div --- */}
                    <form className="">

                        {/* --- Title div --- */}
                        <div className="mb-5">
                            <p className='fs-5 mb-0 text-custom-red'>Edição</p>
                            <p className='text-custom-black display-6 fw-bold mb-1'>Nome do protótipo</p>
                        </div>

                        <div className="row">

                            <div className="col">
                                <input type="text" placeholder='N° de série' className='form-control text-custom-black py-1 px-3 fs-5 border rounded-2' 
                                required onChange={(e) => (e.target.value)}/>
                            </div>

                            <div className="col">
                                <input type="text" placeholder='Nome do protótipo' className='form-control text-custom-black py-1 px-3 fs-5 border rounded-2' 
                                required onChange={(e) => (e.target.value)}/>
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
                                        <label htmlFor="fabicacao" className="d-flex gap-2 form-check-label">
                                            <input className='form-check-input' type="radio" name="radio" id="fabicacao" />
                                            Fabricação
                                        </label>
                                        <label htmlFor="montagem" className="d-flex gap-2 form-check-label">
                                            <input className='form-check-input' type="radio" name="radio" id="montagem" />
                                            Montagem
                                        </label>
                                        <label htmlFor="validacao" className="d-flex gap-2 form-check-label">
                                            <input className='form-check-input' type="radio" name="radio" id="validacao" />
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
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
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
                            </div>
                            <div className="col">
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
                        </div>

                        {/* --- 🔵 Inputs div --- */}
                        <div className="row mt-4">
                            <div className="col d-flex flex-column gap-3">
                                <select name="estado" id="estado" className='form-select'>
                                    <option value="es">ES</option>
                                    <option value="mg">MG</option>
                                    <option value="rj">RJ</option>
                                    <option value="sp">SP</option>
                                </select>
                                <input type="text" placeholder='Cidade' className='text-custom-black py-1 px-3 fs-5 border rounded-2' 
                                        required onChange={(e) => (e.target.value)}/>
                                {/* <input type="text" placeholder='Convide alguém' className='text-custom-black py-1 px-3 fs-5 border rounded-2' required/> */}
                                <input type="text" placeholder='Área...' className='text-custom-black py-1 px-3 fs-5 border rounded-2' 
                                        required onChange={(e) => (e.target.value)}/>
                            </div>

                            <div className="col">
                                <textarea className='form-control' name="descricao" id="decricao" rows={6} value={"Descrição..."}></textarea>
                            </div>
                        </div>

                        {/* --- 🔵 Button div --- */}
                        <div className="d-flex align-items-center justify-content-end">
                            <button className='btn-custom btn-custom-success rounded-1 px-4' type='submit'>Próximo</button>
                        </div>
                        
                    </form>
                </Modal.Body>
            </Modal>
        </>
    )
}