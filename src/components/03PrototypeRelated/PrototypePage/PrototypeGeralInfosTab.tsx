import { useEffect, useRef } from "react";
import { type PrototypeProps } from "../../../services/prototypes.service";
import ClientSelector from "../../08ClientsRelated/ClientSelector";
import FormInput from "../../forms/FormInput";
import FormRadioGroup from "../../forms/FormRadioGroup";
import FormTextarea from "../../forms/FormTextarea";
import { useImageUpload } from "../../../hooks/useImageUpload";
import { Paperclip, XCircleFill } from "react-bootstrap-icons";

interface Props {
  prototype: PrototypeProps;
  onChange: (data: Partial<PrototypeProps>) => void;
  onVerticalChange?: (id: string) => void;
}

export default function PrototypeGeralInfosTab({ prototype, onChange, onVerticalChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    image: selectedImage,
    setImage,
    handleImageChange,
    clearImage
  } = useImageUpload();

  const verticalArray = [
    {label: "Preparo", value: "preparo"},
    {label: "Plantio", value: "plantio"},
    {label: "Pulverização", value: "pulverizacao"},
  ];

  const stageArray = [
    {label: "Fabricação", value: "fabricacao"},
    {label: "Montagem", value: "montagem"},
    {label: "Validação de campo", value: "validacao de campo"},
  ];

  const handleVerticalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFieldChange(e);
    if (onVerticalChange && prototype.id) {
      onVerticalChange(prototype.id);
    }
  };

  function handleFieldChange( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    onChange({ [name]: value });
  }

  useEffect(() => {
    if (prototype.image) {
      setImage(prototype.image);
    } else {
      clearImage();
    }

  }, [
    prototype.image,
    setImage,
    clearImage
  ]);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const base64 = await handleImageChange(file);

    onChange({ image: base64 });
  };

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
                options={stageArray}
                onChange={handleFieldChange}
              />
            </div>
            <div className="col-12 col-md-6">
              <FormRadioGroup
                label="Vertical"
                name="vertical"
                value={prototype.vertical}
                options={verticalArray}
                onChange={handleVerticalChange}
              />
            </div>
          </div>

        {/* Seção Condicional: Validação de Campo 🌾 */}
        {prototype.stage === "validacao de campo" && (
          <ClientSelector
            value={prototype.clientId}
            onSelect={(client) => {
              onChange({
                clientId: client.id,
                location: { state: client.state, city: client.city },
                areaSize: client.area ? Number(client.area) : undefined,
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

        <div className="mt-4">

          <label className="text-custom-black fw-semibold small d-block mb-2">
            Foto do protótipo
          </label>

          <div className="d-flex align-items-center gap-3">

            <button
              type="button"
              className="btn-custom btn-custom-outline-secondary d-flex align-items-center gap-2"
              onClick={() =>
                fileInputRef.current?.click()
              }
            >
              <Paperclip size={18} />
              Selecionar Foto
            </button>

            <input
              type="file"
              ref={fileInputRef}
              className="d-none"
              accept="image/*"
              onChange={onFileChange}
            />

            {selectedImage ? (

              <div className="position-relative">

                <img
                  src={selectedImage}
                  alt="Preview"
                  className="rounded border"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover"
                  }}
                />

                <XCircleFill
                  className="position-absolute text-danger bg-white rounded-circle"
                  style={{
                    top: "-8px",
                    right: "-8px",
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    clearImage();

                    onChange({
                      image: ""
                    });
                  }}
                />

              </div>

            ) : (

              <p className="text-muted mb-0">
                Sem imagem geral
              </p>

            )}

          </div>

        </div>

      </form>
      
    </>
  );
}