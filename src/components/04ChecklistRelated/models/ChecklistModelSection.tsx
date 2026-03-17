// ===== GERAL IMPORTS =====

import { useNavigate } from "react-router";
import DisplayChecklistsModel from "./DisplayChecklistsModel";
import AddChecklistModel from "./AddChecklistModelModal";
import { useState } from "react";

// ===== MAIN COMPONENT =====
// ----- This component is in the home page as checklist models section -----
export default function ChecklistsModelSection() {
    
    // ===== DECLARING & INITIALIZING VARIABLES =====

    const navigate = useNavigate();
    const [ showAll, setShowAll ] = useState<boolean>(false);

    return (
        <div className="p-5 mx-3">
            <div className="d-flex row">
                
                <div className="d-flex flex-column col-12 col-md-10" >
                    <p 
                        style={{ cursor: "pointer" }}
                        className='mb-0 text-custom-red fs-5'
                        onClick={() => navigate(`/checklists`)}
                    >
                        Modelos de Checklist
                    </p>
                    <p className='mb-0 text-custom-black fs-1 fw-bold'>Gerenciar modelos</p>
                </div>

                <div className="d-flex align-items-start justify-content-end col-2 gap-3">
                    <AddChecklistModel />
                    <button className='btn-custom btn-custom-outline-black text-decoration-none' onClick={() => setShowAll(!showAll)}>
                        <p className='mb-0 p-1'>{showAll ? ("Ver todos") : ("Reduzir")}</p>
                    </button>
                </div>
            </div>

            <DisplayChecklistsModel inline={false} showAll={showAll}/>

        </div>
    );
}
