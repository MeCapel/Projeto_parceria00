import type { ChangeEvent } from "react";
import FormSelect from "../forms/FormSelect";
import { useLocation } from "../../hooks/useLocation";

interface Props {
  stateValue: string
  cityValue: string
  onChangeState: (e: ChangeEvent<HTMLSelectElement>) => void
  onChangeCity: (e: ChangeEvent<HTMLSelectElement>) => void
}

export default function SelectLocation({ stateValue, cityValue, onChangeState, onChangeCity }: Props) {
    const { states, cities, setSelectedState } = useLocation();

    function handleStateChange(e: ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;

        setSelectedState(value);

        onChangeState({
            target: { name: "state", value }
        } as ChangeEvent<HTMLSelectElement>);

        onChangeCity({
            target: { name: "city", value: "" }
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
                    required
                    options={[
                        { value: "", label: "Selecione o estado", disabled: true },
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
                    required
                    options={[
                        { value: "", label: "Selecione a cidade", disabled: true },
                        ...cities
                    ]}
                />
            </div>
        </div>
    );
}