import { Modal } from "react-bootstrap";
import StepTracker from "./Steps/StepTracker";
import { usePrototypeForm, type PrototypeFormValues } from "../../hooks/usePrototypeForm";
import { useRef, useState } from "react";

import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";

interface Props {
    projectId: string
}

export interface StepProps {
  values: PrototypeFormValues
  errors: Record<string, string>
  onChange: (name: string, value: string | string[]) => void
  isFieldRequired: (name: string) => boolean
}

export default function ProtoMultiForm({ projectId }: Props) {
    const [show, setShow] = useState(false);
    const formRef = useRef<HTMLFormElement | null>(null);

    const {
        values,
        errors,
        currentStep,
        totalSteps,
        isFieldRequired,
        handleChange,
        nextStep,
        prevStep,
        handleSubmit,
        reset
    } = usePrototypeForm(projectId);

    const steps = [Step1, Step2, Step3];
    const stepsLabels = ["Geral", "Local", "Requisitos"];

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === totalSteps - 1;

    function openModal() {
        setShow(true);
    }

    function closeModal() {
        setShow(false);
        reset();
    }

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        const form = formRef.current;
        if (!form) return;

        form.classList.add("was-validated");

        if (!form.checkValidity()) {
            const firstInvalid = form.querySelector<HTMLElement>(":invalid");
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        handleSubmit(() => {
            setShow(false);
        });
    }

    return (
        <>
            <button className="btn-custom btn-custom-primary" onClick={openModal}>
                <p className="mb-0 fs-5 text-custom-white">Novo protótipo</p>
            </button>

            <Modal show={show} onHide={closeModal} centered size="lg">
                <Modal.Header closeButton className="border-0 mt-3 mx-3" />

                <Modal.Body className="px-5 pb-5 pt-0">

                    <div className="pt-3">
                        <StepTracker 
                            currentStep={currentStep} 
                            stepsList={stepsLabels} 
                            totalSteps={totalSteps}
                        />
                    </div>

                    <form ref={formRef} onSubmit={onSubmit} noValidate>

                        <div className="mb-4">
                            <p className='fs-5 mb-0 text-custom-red'>Cadastro</p>
                            <p className='text-custom-black display-6 fw-bold mb-1'>Cadastro do protótipo</p>
                            <p className='text-custom-black'>*Campos obrigatórios</p>
                        </div>

                        {steps.map((Step, index) => (
                            <fieldset
                                key={index}
                                disabled={index !== currentStep}
                                style={{ display: index === currentStep ? "block" : "none" }}
                            >
                                <Step
                                values={values}
                                errors={errors}
                                onChange={handleChange}
                                isFieldRequired={isFieldRequired}
                                />
                            </fieldset>
                            ))}

                        <div className="mt-5 d-flex align-items-center justify-content-center gap-5">

                            {!isFirstStep && (
                                <button type="button" className="btn btn-secondary ml-auto" onClick={prevStep}>
                                    Voltar
                                </button>
                            )}

                            {!isLastStep && (
                                <button type="button" className="btn btn-success" 
                                    onClick={() => {
                                        const form = formRef.current;
                                        if (!form) return;

                                        form.classList.add("was-validated");

                                        if (!form.checkValidity()) {
                                        const firstInvalid = form.querySelector<HTMLElement>(":invalid");
                                        if (firstInvalid) firstInvalid.focus();
                                        return;
                                        }

                                        form.classList.remove("was-validated");

                                        nextStep();
                                }}>
                                    Próximo
                                </button>
                            )}

                            {isLastStep && (
                                <button type="submit" className="btn btn-success">
                                    Finalizar
                                </button>
                            )}

                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
}