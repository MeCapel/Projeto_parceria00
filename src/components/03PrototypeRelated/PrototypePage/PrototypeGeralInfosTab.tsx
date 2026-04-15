import { type PrototypeProps } from "../../../services/prototypeServices";
import ClientSelector from "../../08ClientsRelated/ClientSelector";
import FormInput from "../../forms/FormInput";
import FormRadioGroup from "../../forms/FormRadioGroup";
import FormTextarea from "../../forms/FormTextarea";

interface Props {
  prototype: PrototypeProps;
  onChange: (data: Partial<PrototypeProps>) => void;
  onVerticalChange: (id: string) => void;
}

export default function PrototypeGeralInfosTab({
  prototype,
  onChange,
  onVerticalChange,
}: Props) {

  function handleFieldChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    onChange({ [name]: value });
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h4 className="fw-bold text-custom-black mb-0">Informações gerais</h4>
          <small className="text-muted">Gestão do protótipo e localização</small>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
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
                onVerticalChange(prototype.id!);
              }}
            />
          </div>
        </div>

        {/* Seção Condicional: Validação de Campo 🌾 */}
        {prototype.stage === "Validação de campo" && (
          <ClientSelector
            value={prototype.clientId}
            onSelect={(client) => {
              onChange({
                clientId: client.id,
                state: client.state,
                city: client.city,
                areaSize: client.area,
              });
            }}
          />
        )}

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