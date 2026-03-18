// ===== GERAL IMPORTS =====
import { useNavigate } from "react-router";
import DisplayChecklistsModel from "./DisplayChecklistsModel";
import AddChecklistModel from "./AddChecklistModelModal";
import { useState } from "react";
//import { Link } from "react-router";

// ===== MAIN COMPONENT =====
// ----- This component is in the home page as checklist models section -----
export default function ChecklistsModelSection() {
    
    const navigate = useNavigate();
    const [ showAll, setShowAll ] = useState<boolean>(false);

    return (
        <div className="p-5 mx-3">
            <div className="d-flex row align-items-center mb-4">
                
                <div className="col-10" >
                    <p 
                        style={{ cursor: "pointer" }}
                        className='mb-0 text-custom-red fs-5'
                        onClick={() => navigate(`/checklists`)}
                    >
                        Checklists
                    </p>
                    <h1 className='mb-0 text-custom-black fw-bold'>
                        {showAll ? "Todos os modelos" : "Modelos de Checklist"}
                    </h1>
                </div>

                <div className="col-2 d-flex justify-content-end gap-3">
                    <AddChecklistModel />
                    <button 
                        className='btn-custom btn-custom-outline-black text-decoration-none' 
                        onClick={() => setShowAll(!showAll)}
                    >
                        <p className='mb-0 p-1'>{showAll ? "Reduzir" : "Ver todos"}</p>
                    </button>
                </div>
            </div>

            <DisplayChecklistsModel inline={false} showAll={showAll}/>
        </div>
    );
}
