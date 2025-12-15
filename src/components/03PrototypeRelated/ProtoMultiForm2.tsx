import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router";
import { useState, type FormEvent } from "react";
import type { PrototypeProps } from '../../services/prototypeServices2';
import { createPrototype, addChecklistToPrototype  } from "../../services/prototypeServices2";
import StepTracker from './Steps/StepTracker';

import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";

export interface StepProps {
  values: PrototypeProps;
  errors: Record<string, string>;
  onChange: (name: string, value: any) => void;
}

interface MultiFormProps {
    projectId: string,
}

export default function ProtoMultiForm2({ projectId } : MultiFormProps) {
    const navigate = useNavigate();

    // Configuração dos steps e campos para validação
    const formSteps = [
        {
        fields: [
            { name: "code", label: "Código", required: false },
            { name: "name", label: "Nome", required: true },
            { name: "description", label: "Descrição", required: true },
        ],
        component: Step1,
        },
        {
        fields: [
            { name: "stage", label: "Etapa", required: true },
            { name: "state", label: "Estado", required: false },
            { name: "city", label: "Cidade", required: false },
            { name: "areaSize", label: "Tamanho da área", required: false },
        ],
        component: Step2,
        },
        {
        fields: [
            { name: "vertical", label: "Vertical", required: true },
        ],
        component: Step3,
        }
    ];

    const stepsLabels = [ "Geral", "Local", "Requisitos"];
    const totalSteps = formSteps.length;

    const [currentStep, setCurrentStep] = useState(0);
    const defaultValues: PrototypeProps & { checklistsIds: string[] } = {
        projectId: projectId,
        code: "",
        name: "",
        description: "",
        stage: "",
        state: "",
        city: "",
        areaSize: "",
        vertical: "",
        editedAt: [],
        createdAt: undefined,
        checklistsIds: [],
    }
    const [formValues, setFormValues] = useState<PrototypeProps& { checklistsIds: string[] }>(defaultValues);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [show, setShow ] = useState(false);
    const openModal = () => setShow(true);
    const closeModal = () => {
        setShow(false);
        cleanAllFields();
        setCurrentStep(0);
    };

    // 🔥 validação por step
    function validateStep(step: number) {
        const fields = formSteps[step].fields;
        const newErrors: Record<string, string> = {};
        let valid = true;

        // Valida campos obrigatórios do step
        fields.forEach(field => {
            if (field.required && !formValues[field.name as keyof PrototypeProps]) {
                newErrors[field.name] = `O campo "${field.label}" é obrigatório`;
                valid = false;
            }
        });

        // Validação extra do Step 3: pelo menos uma checklist selecionada
        if (step === 2 && (!formValues.checklistsIds || formValues.checklistsIds.length === 0)) {
            newErrors["checklistsIds"] = "Selecione ao menos uma checklist";
            valid = false;
        }

        setErrors(prev => ({ ...prev, ...newErrors }));
        return valid;
    }


    // 🔥 troca de inputs
    function handleInputChange(name: string, value: any) 
    {
        setFormValues(prev => ({
        ...prev,
        [name]: value
        }));

        // limpa erro do campo alterado
        setErrors(prev => ({
        ...prev,
        [name]: ""
        }));
    }

    // navegação 
    function HandlePrev() 
    {
        setCurrentStep(prev => prev - 1);
    }

    function HandleNext() 
    {
        if (!validateStep(currentStep)) return;
        setCurrentStep(prev => prev + 1);
    }

    function cleanAllFields()
    {
        setFormValues(prev => ({
            ...prev,
            code: "",
            name: "",
            description: "",
            stage: "",
            state: "",
            city: "",
            areaSize: "",
            vertical: "",
            checklistsIds: [],
        }));
        setErrors({});
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!validateStep(currentStep)) return;

        const prototypeId = await createPrototype(formValues);
        if (!prototypeId) return;

        // Cria instâncias de checklist para cada checklistId selecionada
        await Promise.all(
            (formValues.checklistsIds || []).map(id => addChecklistToPrototype(prototypeId, id))
        );

        console.log("OBJETO FINAL:", formValues);
        closeModal();
        navigate(`/projects/${projectId}`);
    }

    // step atual baseado no array
    const StepComponent = formSteps[currentStep].component;

    return (
        <>
            <button className="btn-custom btn-custom-primary" onClick={openModal}>
                        <p className="mb-0 fs-5 text-custom-white">Novo protótipo</p>
            </button>

            <Modal show={show} onHide={closeModal} dialogClassName="modal-fullscreen" className="p-0">
                <Modal.Header closeButton className="mb-0 mx-5 border-0 my-3" />
                <Modal.Body className="d-flex flex-column align-items-center justify-content-center">

                    <StepTracker currentStep={currentStep} stepsList={stepsLabels} totalSteps={totalSteps}/>

                    <form onSubmit={handleSubmit}>

                        {/* --- Title div --- */}
                        <div className="mb-5">
                            <p className='fs-5 mb-0 text-custom-red'>Cadastro</p>
                            <p className='text-custom-black display-6 fw-bold mb-1'>Cadastro do protótipo</p>
                            <p className='text-custom-black'>*Campos obrigatórios</p>
                        </div>

                        <StepComponent values={formValues} errors={errors} onChange={handleInputChange} />

                        <div className="mt-5 d-flex align-items-center justify-content-center gap-5">
                            {currentStep > 0 && (
                                <button type="button" className="btn btn-secondary ml-auto" onClick={HandlePrev}>Voltar</button>
                            )}

                            {currentStep < totalSteps - 1 && (
                                <button type="button" className="btn btn-success" onClick={HandleNext}>Próximo</button>
                            )}

                            {currentStep === totalSteps - 1 && (
                                <button type="submit" className="btn btn-success">Finalizar</button>
                            )}
                        </div>
                    </form>

                </Modal.Body>
            </Modal>
        </>
    );
}
