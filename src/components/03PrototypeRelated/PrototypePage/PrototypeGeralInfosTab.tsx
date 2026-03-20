import { useState } from "react";
import { type PrototypeProps } from "../../../services/prototypeServices";
import FormInput from "../../forms/FormInput";
import FormRadioGroup from "../../forms/FormRadioGroup";
import FormTextarea from "../../forms/FormTextarea";

interface Props {
    prototype: PrototypeProps;
    onChange: (data: Partial<PrototypeProps>) => void;
    onVerticalChange: (id: string) => void;
}

export default function PrototypeGeralInfosTab({ prototype, onChange, onVerticalChange }: Props) {
    const [cityError, setCityError] = useState("");

    // Atualiza pai direto (sem estado duplicado)
    function handleFieldChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value } = e.target;

        onChange({
            [name]: value,
        });
    }

    function handleStateChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;

        onChange({
            state: value,
            city: "", // reset cidade ao trocar estado
        });
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Validação de estado antes de selecioonar cidade
        if (prototype.city && !prototype.state) {
            setCityError("Selecione um estado antes da cidade");
            return;
        }

        setCityError("");
    }

    return (

        <>
        
            <div className="d-flex align-items-center justify-content-between mb-3">

                <div>
                <h4 className="fw-bold text-custom-black mb-0">
                    Informações gerais
                </h4>

                <small className="text-muted">
                    Aqui vão as principais informações de um protótipo
                </small>
                </div >

            </div>

            <form onSubmit={handleSubmit} className="">

                {/* Inputs principais */}
                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <FormInput
                            label="N° de série"
                            name="code"
                            value={prototype.code ?? ""}
                            onChange={handleFieldChange}
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <FormInput
                            label="Nome do protótipo"
                            name="name"
                            value={prototype.name}
                            onChange={handleFieldChange}
                        />
                    </div>
                </div>

                {/* Radios */}
                <div className="row g-3 mt-2">
                    <div className="col-12 col-md-6">
                        <FormRadioGroup
                            label="Etapa"
                            name="stage"
                            value={prototype.stage}
                            options={["Fabricação", "Montagem", "Validação de campo"]}
                            onChange={handleFieldChange}
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <FormRadioGroup
                            label="Vertical"
                            name="vertical"
                            value={prototype.vertical}
                            options={["Preparo", "Plantio", "Pulverização"]}
                            onChange={(e) => {
                                handleFieldChange(e);
                                // função para retirar todas as checklists do protótipo
                                onVerticalChange(prototype.id!);
                            }}
                        />
                    </div>
                </div>

                {/* Localização */}
                <div className="row g-3 mt-2">
                    <div className="col-12 col-md-4">
                        <div className="form-floating">
                            <select
                                name="state"
                                className="form-select"
                                value={prototype.state}
                                onChange={handleStateChange}
                            >
                                <option value="">Escolha o estado</option>
                                <option value="ES">ES</option>
                                <option value="MG">MG</option>
                                <option value="RJ">RJ</option>
                                <option value="SP">SP</option>
                            </select>
                            <label>Estado</label>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="form-floating">
                            <input
                                type="text"
                                name="city"
                                placeholder="Cidade"
                                value={prototype.city}
                                onChange={(e) => {
                                    setCityError("");
                                    handleFieldChange(e);
                                }}
                                className="form-control"
                            />
                            {cityError && (
                                <small className="text-danger">{cityError}</small>
                            )}
                            <label>Cidade</label>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <FormInput
                            label="Área"
                            name="areaSize"
                            value={prototype.areaSize ?? ""}
                            onChange={handleFieldChange}
                        />
                    </div>
                </div>

                {/* Descrição */}
                <div className="mt-3">
                    <FormTextarea
                        label="Descrição"
                        name="description"
                        value={prototype.description}
                        onChange={handleFieldChange}
                    />
                </div>

            </form>
        
        </>
    );
}