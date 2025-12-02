    import { type StepProps } from "../ProtoMultiForm2";
    import ChooseChecklists from '../../04ChecklistRelated/ChooseChecklist2';
    import { useState, useEffect } from "react";

    export default function Step3({ values, errors, onChange }: StepProps) {
        const [checklistsIds, setChecklistsIds] = useState<string[]>([]);

        // Sincroniza os IDs selecionados com o pai sempre que mudar
        useEffect(() => {
            onChange("checklistsIds", checklistsIds);
        }, [checklistsIds]);

        // Limpa a seleção de checklists quando a vertical muda
        useEffect(() => {
            setChecklistsIds([]);
            onChange("checklistsIds", []); // opcional, garante sincronização imediata
        }, [values.vertical]);

        return (
            <div>
                {/* 🔵 Radio select div */}
                <fieldset className='d-flex flex-column mt-3 p-3 align-items-start border rounded-2'>
                    <div className="d-flex py-1 px-3 align-items-start justify-content-center rounded-5 position-relative border bg-secondary" 
                            style={{ top: '-2.5rem' }}>
                        <legend className='mb-0 text-white fs-5'>Vertical*</legend>
                    </div>

                    <div className="d-flex w-100 gap-3 align-items-start justify-content-center position-relative" style={{ top: '-0.75rem' }}>
                        {["Preparo", "Plantio", "Pulverização"].map(v => (
                            <label key={v} className="d-flex gap-2">
                                <input
                                    type="radio"
                                    name="vertical"
                                    value={v}
                                    checked={values.vertical === v}
                                    onChange={e => onChange("vertical", e.target.value)}
                                />
                                {v}
                            </label>
                        ))}
                    </div>
                </fieldset>

                {errors.vertical && <p style={{ color: "red" }}>{errors.vertical}</p>}

                {/* Componente de seleção de checklists */}
                <div className='my-5'>
                    <ChooseChecklists vertical={values.vertical} onValueChange={setChecklistsIds} />
                </div>

                {errors.checklistsIds && <p style={{ color: "red" }}>{errors.checklistsIds}</p>}
            </div>
        );
    }
