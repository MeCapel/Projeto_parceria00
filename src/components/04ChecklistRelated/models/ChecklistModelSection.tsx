// ===== GERAL IMPORTS =====
import DisplayChecklistsModel from "./DisplayChecklistsModel";
import AddChecklistModel from "./AddChecklistModelModal";
import { useState } from "react";
//import { Link } from "react-router";
import SearchInput from "../../forms/SearchInput";

// ===== MAIN COMPONENT =====
// ----- This component is in the home page as checklist models section -----
export default function ChecklistsModelSection() {
    
    const [ showAll, setShowAll ] = useState<boolean>(false);

    // Consulta Checklist pelo searchTerm
    const [search, setSearch] = useState("");

    return (
        <div className="p-5 mx-3">
            {/* 1. Div do Cabeçalho (Título + Botões) */}
            <div className="d-flex flex-wrap align-items-center gap-3 justify-content-between mb-4">
                <div>
                    <p className='mb-0 text-custom-red fs-5'>
                        Checklists
                    </p>
                    <h1 className='mb-0 text-custom-black fw-bold'>
                        Modelos de Checklist
                    </h1>
                </div>

                <div className="d-flex justify-content-end gap-3">
                    <AddChecklistModel />
                    <button 
                        className='btn-custom btn-custom-outline-black text-decoration-none' 
                        onClick={() => setShowAll(!showAll)}
                    >
                        <p className='mb-0'>{showAll ? "Reduzir" : "Ver todos"}</p>
                    </button>
                </div>
            </div>

            {/* 2. Div da Barra de Pesquisa*/}
            <div className="mb-4">
                <SearchInput 
                    value={search} 
                    onChange={setSearch} 
                    placeholder="Buscar checklist..." 
                />
            </div>

            {/* 3. Lista de Modelos */}
            <DisplayChecklistsModel 
                inline={false} 
                showAll={showAll} 
                search={search} 
            />
        </div>
    );
}