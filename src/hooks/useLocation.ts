import { useEffect, useState } from "react";
import axios from "axios";

export interface IBGEUfProps {
    id: number,
    sigla: string,
    nome: string,
    selected: boolean,
    disabled: boolean,
    hidden: boolean
}

export interface IBGECityProps {
    id: number,
    nome: string,
    selected: boolean,
    disabled: boolean,
    hidden: boolean
}

export interface Option {
    value: string;
    label: string;
}

export function useLocation() {
    const [states, setStates] = useState<Option[]>([]);
    const [cities, setCities] = useState<Option[]>([]);
    const [selectedState, setSelectedState] = useState("");

    // 🔹 Buscar estados
    useEffect(() => {
        axios
            .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados/")
            .then(res => {
                const sorted = res.data
                    .sort((a: IBGEUfProps, b: IBGEUfProps) => a.nome.localeCompare(b.nome))
                    .map((uf: IBGEUfProps) => ({
                        value: uf.sigla,
                        label: uf.nome
                    }));

                setStates(sorted);
            })
            .catch(console.error);
    }, []);

    // 🔹 Buscar cidades quando estado muda
    useEffect(() => {
        if (!selectedState) {
            setCities([]);
            return;
        }

        axios
            .get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`)
            .then(res => {
                const sorted = res.data
                    .sort((a: IBGECityProps, b: IBGECityProps) => a.nome.localeCompare(b.nome))
                    .map((city: IBGECityProps) => ({
                        value: city.nome,
                        label: city.nome
                    }));

                setCities(sorted);
            })
            .catch(console.error);
    }, [selectedState]);

    return {
        states,
        cities,
        selectedState,
        setSelectedState
    };
}