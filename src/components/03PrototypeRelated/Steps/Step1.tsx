import { type StepProps } from "../ProtoMultiForm";
import FormInput from "../../forms/FormInput";
import FormTextarea from "../../forms/FormTextarea";
import { useImageUpload } from "../../../hooks/useImageUpload";
import { useEffect, useRef } from "react";
import {
    Paperclip,
    XCircleFill
} from "react-bootstrap-icons";

export default function Step1({ values, onChange, isFieldRequired }: StepProps) {
        const fileInputRef = useRef<HTMLInputElement>(null);
        
        const {
                image: selectedImage,
                setImage,
                handleImageChange,
                clearImage
        } = useImageUpload();

        // ================= IMAGE =================
        const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];

                if (!file) return;

                const base64 =
                        await handleImageChange(file);

                onChange("image", base64);
        };

        useEffect(() => {
                if (values.image) {
                        setImage(values.image);
                } else {
                        clearImage();
                }
        }, [values.image, setImage, clearImage]);
  
        return (
                <div>
                
                        {/* --- 🔵 Inputs div --- */}
                        <div className="d-flex flex-column my-4 gap-3">

                                <FormInput
                                        label="N° de série"
                                        name="code"
                                        value={values.code ?? ""}
                                        onChange={e => onChange("code", e.target.value)}
                                        required={isFieldRequired("code")}
                                />

                                <FormInput
                                        label="Nome"
                                        name="name"
                                        value={values.name}
                                        onChange={e => onChange("name", e.target.value)}
                                        required={isFieldRequired("name")}
                                />

                                <FormTextarea
                                        label="Descrição"
                                        name="description"
                                        value={values.description}
                                        onChange={e => onChange("description", e.target.value)}
                                        required={isFieldRequired("description")}
                                />

                                <div className="d-flex flex-column gap-2">

                                        <label className="text-custom-black fw-semibold small">
                                                Foto do protótipo
                                        </label>

                                        <div className="d-flex align-items-center gap-3">

                                                <button
                                                        type="button"
                                                        className="btn-custom btn-custom-outline-secondary d-flex align-items-center gap-2"
                                                        onClick={() => fileInputRef.current?.click()}
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
                                                                        width: "60px",
                                                                        height: "60px",
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
                                                                        onChange("image", "");
                                                                }}
                                                                />

                                                        </div>
                                                ) : (

                                                <p className="text-muted mb-0">
                                                Nenhuma foto selecionada
                                                </p>

                                                )
                                        }

                                        </div>

                                </div>
                        </div>

                </div>
        );
}