import { useState } from "react";
import { addChecklistToPrototype, createPrototype } from "../services/prototypeServices";

export interface PrototypeFormValues {
  projectId: string;
  code: string;
  name: string;
  description: string;
  stage: string;
  state?: string;
  city?: string;
  areaSize?: string;
  vertical: string;
  checklistsIds: string[];
}

export function usePrototypeForm(projectId: string) {

  // ----- Variables and states -----
  const [currentStep, setCurrentStep] = useState(0);

  const [values, setValues] = useState<PrototypeFormValues>({
    projectId,
    code: "",
    name: "",
    description: "",
    stage: "",
    state: "",
    city: "",
    areaSize: "",
    vertical: "",
    checklistsIds: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ----- Seting up step configs (what each step will be responsable for) -----
  const steps = [
    {
      id: "general",
      fields: [
        { name: "name", required: true },
        { name: "description", required: true },
      ],
    },
    {
      id: "location",
      fields: [
        { name: "stage", required: true },

        {
          name: "state",
          required: (values: PrototypeFormValues) =>
            values.stage === "Validação de campo"
        },
        {
          name: "city",
          required: (values: PrototypeFormValues) =>
            values.stage === "Validação de campo"
        },
        {
          name: "areaSize",
          required: (values: PrototypeFormValues) =>
            values.stage === "Validação de campo"
        },
      ],
    },
    {
      id: "checklists",
      fields: [
        { name: "vertical", required: true },
      ],
    },
  ];

  const totalSteps = steps.length;

  // ----- Functions to handle actions -----
  function handleChange(name: string, value: string | string[]) {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    // errors clean up
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  }

  // ----- Validations, on each step and at final -----
  function isFieldRequired(name: string) {
    const step = steps[currentStep];

    const field = step.fields.find(f => f.name === name);
    if (!field) return false;

    return typeof field.required === "function"
      ? field.required(values)
      : field.required;
  }
  
  function validateStep(stepIndex: number) {
    const step = steps[stepIndex];
    const newErrors: Record<string, string> = {};
    let valid = true;

    step.fields.forEach(field => {
      const value = values[field.name as keyof PrototypeFormValues];

      const isRequired =
        typeof field.required === "function"
          ? field.required(values)
          : field.required;

      if (isRequired && (!value || (Array.isArray(value) && value.length === 0))) {
        newErrors[field.name] = "Campo obrigatório";
        valid = false;
      }
    });

    if (step.id === "checklists" && values.checklistsIds.length === 0) {
      newErrors["checklistsIds"] = "Selecione ao menos uma checklist";
      valid = false;
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return valid;
  }

  function validateAll() {
    return steps.every((_, i) => validateStep(i));
  }

  // ----- Navigation between steps -----
  function nextStep() {
    if (!validateStep(currentStep)) return;

    setErrors({}); // limpa erros visuais
    setCurrentStep(prev => prev + 1);
  }

  function prevStep() {
    setCurrentStep(prev => prev - 1);
  }

  function goToStep(step: number) {
    setCurrentStep(step);
  }

  // ----- Function to reset all prototype data fields -----
  function reset() {
    setValues({
      projectId,
      code: "",
      name: "",
      description: "",
      stage: "",
      state: "",
      city: "",
      areaSize: "",
      vertical: "",
      checklistsIds: [],
    });

    setErrors({});
    setCurrentStep(0);
  }

  // ----- Submit function ----- 
  async function handleSubmit(onSuccess?: (id: string) => void) {
    if (!validateAll()) return;

    try {
      const prototypeId = await createPrototype(values);

      await Promise.all(
        values.checklistsIds.map(id =>
          addChecklistToPrototype(prototypeId!, id)
        )
      );

      onSuccess?.(prototypeId!);
      reset();

    } catch (err) {
      console.error("Erro ao criar protótipo:", err);
    }
  }

  return {
    // states
    values,
    errors,
    currentStep,
    totalSteps,

    // actions
    isFieldRequired,
    handleChange,
    nextStep,
    prevStep,
    goToStep,
    handleSubmit,
    reset,
  };
}