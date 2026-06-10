import { useState } from "react";
import { createPrototype } from "../services/prototypes.service";

export interface PrototypeFormValues {
  projectId: string;
  code: string;
  name: string;
  description: string;
  image?: string;
  stage: string;
  state?: string;
  city?: string;
  areaSize?: string;
  clientId: string;
  vertical: string;
  checklistsIds: string[];
}

export function usePrototypeForm(projectId?: string) {

  // ----- Variables and states -----
  const [currentStep, setCurrentStep] = useState(0);

  const [values, setValues] = useState<PrototypeFormValues>({
    projectId: projectId ?? "",
    code: "",
    name: "",
    description: "",
    image: "",
    stage: "",
    state: "",
    city: "",
    areaSize: "",
    clientId: "",
    vertical: "",
    checklistsIds: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ----- Seting up step configs (what each step will be responsable for) -----
  const steps = [
    {
      id: "general",
      fields: [
        ...(!projectId ? [{ name: "projectId", required: true }] : []),
        { name: "name", required: true },
        { name: "description", required: true },
      ],
    },
    {
      id: "location",
      fields: [
        { name: "stage", required: true },

        {
          name: "clientId",
          required: (values: PrototypeFormValues) =>
            values.stage === "validacao de campo"
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
      projectId: projectId ?? "",
      code: "",
      name: "",
      description: "",
      image: "",
      stage: "",
      state: "",
      city: "",
      areaSize: "",
      clientId: "",
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
      // Transform data to match API schema expectations
      const payload: any = {
        projectId: values.projectId,
        code: values.code,
        name: values.name,
        description: values.description,
        image: values.image,
        stage: values.stage.toLowerCase(), // API expects lowercase
        clientId: values.clientId || undefined,
        vertical: values.vertical,
        checklistModelIds: values.checklistsIds, // Add checklist models to create with prototype
      };

      // Nest state and city inside location object
      if (values.state || values.city) {
        payload.location = {
          state: values.state || undefined,
          city: values.city || undefined,
        };
      }

      // Convert areaSize to number if present
      if (values.areaSize) {
        payload.areaSize = Number(values.areaSize);
      }

      const prototypeResult = await createPrototype(payload);
      const prototypeId = typeof prototypeResult === 'string' ? prototypeResult : prototypeResult?.id;

      if (!prototypeId) {
        throw new Error("Erro ao criar protótipo");
      }

      onSuccess?.(prototypeId);
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