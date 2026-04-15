import type { ChangeEvent } from "react";
import FormSelect from "../forms/FormSelect";
import { useLocation } from "../../hooks/useLocation";

interface Props {
  stateValue: string
  cityValue: string
  onChangeState: (e: ChangeEvent<HTMLSelectElement>) => void
  onChangeCity: (e: ChangeEvent<HTMLSelectElement>) => void
  requiredState?: boolean
  requiredCity?: boolean
}

export default function SelectLocation({ stateValue, cityValue, onChangeState, onChangeCity, requiredState, requiredCity }: Props) {
    const { states, cities, setSelectedState } = useLocation();

    function handleStateChange(e: ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;

        setSelectedState(value);

        onChangeState({
            target: { value }
        } as ChangeEvent<HTMLSelectElement>);

        onChangeCity({
            target: { value: "" }
        } as ChangeEvent<HTMLSelectElement>);
        }

    function handleCityChange(e: ChangeEvent<HTMLSelectElement>) {
        onChangeCity(e);
    }

    return (
        <div className="d-flex gap-3">
            <div className="w-100">
                <FormSelect
                    label="Estado"
                    name="state"
                    value={stateValue}
                    onChange={handleStateChange}
                    required={requiredState}
                    options={[
                        { value: "", label: "Selecione o estado" },
                        ...states
                    ]}
                />
            </div>

            <div className="w-100"> 
                <FormSelect
                    label="Cidade"
                    name="city"
                    value={cityValue}
                    onChange={handleCityChange}
                    required={requiredCity}
                    options={[
                        { value: "", label: "Selecione a cidade" },
                        ...cities
                    ]}
                />
            </div>
        </div>
    );
}