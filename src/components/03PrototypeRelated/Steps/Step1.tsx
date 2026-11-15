import { type StepProps } from "../ProtoMultiForm";
import FormInput from "../../forms/FormInput";
import FormTextarea from "../../forms/FormTextarea";
import { useImageUpload } from "../../../hooks/useImageUpload";
import { useEffect, useRef, useState } from "react";
import {
    Paperclip,
    Search,
    XCircleFill
} from "react-bootstrap-icons";
import { getProjects } from "../../../services/projects.service";

interface ProjectOption {
        value: string;
        label: string;
}

export default function Step1({ values, errors, onChange, isFieldRequired, projectOptions }: StepProps) {
        const fileInputRef = useRef<HTMLInputElement>(null);
        const [projectSearch, setProjectSearch] = useState("");
        const [searchResults, setSearchResults] = useState<ProjectOption[]>(projectOptions ?? []);
        const [isSearchingProjects, setIsSearchingProjects] = useState(false);
        const [showProjectResults, setShowProjectResults] = useState(false);
        const [selectedProject, setSelectedProject] = useState<ProjectOption | null>(null);

        useEffect(() => {
                if (!projectSearch.trim()) {
                        setSearchResults(projectOptions ?? []);
                        setIsSearchingProjects(false);
                        return;
                }

                setIsSearchingProjects(true);
                let cancelled = false;
                const timeoutId = window.setTimeout(async () => {
                        try {
                                const response = await getProjects({ search: projectSearch.trim(), limit: 10 });
                                if (!cancelled) {
                                        setSearchResults(response.data.map(project => ({
                                                value: project.id,
                                                label: project.name,
                                        })));
                                }
                        } catch (error) {
                                console.error("Erro ao pesquisar projetos:", error);
                                if (!cancelled) setSearchResults([]);
                        } finally {
                                if (!cancelled) setIsSearchingProjects(false);
                        }
                }, 300);

                return () => {
                        cancelled = true;
                        window.clearTimeout(timeoutId);
                };
        }, [projectSearch, projectOptions]);
        
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

                                {projectOptions !== undefined && (
                                        <div className="w-100">
                                                <label htmlFor="prototype-project-search" className="text-custom-black fw-semibold small mb-2">
                                                        Projeto
                                                </label>
                                                <div className="position-relative">
                                                        <div className="input-group">
                                                                <span className="input-group-text bg-white border-end-0">
                                                                        <Search className="text-secondary" size={16} />
                                                                </span>
                                                                <input
                                                                        id="prototype-project-search"
                                                                        type="search"
                                                                        className={`form-control border-start-0 ${errors.projectId ? "is-invalid" : ""}`}
                                                                        placeholder="Pesquisar projeto pelo nome..."
                                                                        value={projectSearch || selectedProject?.label || projectOptions.find(option => option.value === values.projectId)?.label || ""}
                                                                        aria-autocomplete="list"
                                                                        aria-expanded={showProjectResults}
                                                                        aria-controls="prototype-project-results"
                                                                        onFocus={(event) => {
                                                                                event.currentTarget.select();
                                                                                setShowProjectResults(true);
                                                                        }}
                                                                        onChange={(event) => {
                                                                                setProjectSearch(event.target.value);
                                                                                setSelectedProject(null);
                                                                                setShowProjectResults(true);
                                                                                onChange("projectId", "");
                                                                        }}
                                                                        onKeyDown={(event) => {
                                                                                if (event.key === "Escape") setShowProjectResults(false);
                                                                                if (event.key === "Enter" && showProjectResults && !isSearchingProjects && searchResults[0]) {
                                                                                        event.preventDefault();
                                                                                        const option = searchResults[0];
                                                                                        setSelectedProject(option);
                                                                                        setProjectSearch("");
                                                                                        setShowProjectResults(false);
                                                                                        onChange("projectId", option.value);
                                                                                }
                                                                        }}
                                                                />
                                                        </div>
                                                        {showProjectResults && (
                                                                <div
                                                                        id="prototype-project-results"
                                                                        role="listbox"
                                                                        className="position-absolute start-0 end-0 bg-white border rounded shadow-sm mt-1 overflow-auto"
                                                                        style={{ maxHeight: "220px", zIndex: 5 }}
                                                                >
                                                                        {isSearchingProjects ? (
                                                                                <div className="p-3 text-muted small">Pesquisando...</div>
                                                                        ) : searchResults.length > 0 ? (
                                                                                searchResults.map(option => (
                                                                                        <button
                                                                                                key={option.value}
                                                                                                type="button"
                                                                                                role="option"
                                                                                                aria-selected={values.projectId === option.value}
                                                                                                className="btn btn-light w-100 text-start rounded-0"
                                                                                                onClick={() => {
                                                                                                        setSelectedProject(option);
                                                                                                        setProjectSearch("");
                                                                                                        setShowProjectResults(false);
                                                                                                        onChange("projectId", option.value);
                                                                                                }}
                                                                                        >
                                                                                                {option.label}
                                                                                        </button>
                                                                                ))
                                                                        ) : (
                                                                                <div className="p-3 text-muted small">Nenhum projeto encontrado</div>
                                                                        )}
                                                                </div>
                                                        )}
                                                </div>
                                                {errors.projectId && <div className="text-danger small mt-1">{errors.projectId}</div>}
                                                {!values.projectId && isFieldRequired("projectId") && !errors.projectId && (
                                                        <div className="text-muted small mt-1">Selecione um projeto para continuar.</div>
                                                )}
                                        </div>
                                )}

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