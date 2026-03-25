import { type StepProps } from "../ProtoMultiForm";
import ChooseChecklists from '../../04ChecklistRelated/instanced/ChooseChecklist';
import { useState, useEffect } from "react";
import FormRadioGroup from "../../forms/FormRadioGroup";

export default function Step3({ values, errors, onChange }: StepProps) {
    const [checklistsIds, setChecklistsIds] = useState<string[]>([]);

    // Sincroniza os IDs selecionados com o pai sempre que mudar
    useEffect(() => {
        // if (checklistsIds.length === 0) return;
        onChange("checklistsIds", checklistsIds);
    }, [checklistsIds]);

    // Limpa a seleção de checklists quando a vertical muda
    useEffect(() => {
        setChecklistsIds([]);
        onChange("checklistsIds", []); // garante sincronização imediata
    }, [values.vertical]);

    return (
        <div>
            {/* 🔵 Radio select div */}

            <FormRadioGroup
                label="Vertical"
                name="vertical"
                value={values.vertical}
                options={["Preparo", "Plantio", "Pulverização"]}
                onChange={e => onChange("vertical", e.target.value)}
            />

            {errors.vertical && <p style={{ color: "red" }}>{errors.vertical}</p>}

            {/* Componente de seleção de checklists */}
            <div className='my-5'>
                <ChooseChecklists vertical={values.vertical} onValueChange={setChecklistsIds} />
            </div>

            {errors.checklistsIds && <p style={{ color: "red" }}>{errors.checklistsIds}</p>}
        </div>
    );
}