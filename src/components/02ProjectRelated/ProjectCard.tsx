import type React from "react";
import { useState } from "react";
import { useNavigate } from 'react-router'
// import { moveProjectToTrash } from "../services/dbService";
import { deleteProjectNPrototypes } from "../../services/projectServices";
import { ThreeDotsVertical, Trash3Fill } from 'react-bootstrap-icons'

// interface ReusableCardsProps {
//     infosList: {id: string | number, 
//                 imgUrl?: string, 
//                 title: string, 
//                 subtitle?: string | number, 
//                 description?: string, 
//                 element?: React.ReactNode, 
//                 hasUpdates?: boolean}[];
//     border?: boolean;
// }

interface ProjectCardProps {
    id: string, 
    imgUrl?: string, 
    title: string, 
    subtitle?: string | number, 
    description?: string, 
    element?: React.ReactNode, 
    // hasUpdates?: boolean;
    // border?: boolean;
    location: string;
}

export default function ProjectCard({ id, imgUrl, title, subtitle, description, element, location } : ProjectCardProps)
{
    const navigate = useNavigate();

    const [ moreOptions, setMoreOptions ] = useState(false);

    const handleMoveProjectToTrash = async (id: string) => {
        deleteProjectNPrototypes(id);
    }

    return(
        <>
            {/* {infosList.map((item) => ( */}
                
                 {/* --- 🔴 Inner card content div --- */}
                {/* <div key={id} style={{ maxWidth: '18rem', border: '1px solid var(--gray01)' }} 
                    className={ border ? (
                        hasUpdates ? 
                        "card h-auto w-100 w-sm-50 border border-2 border-danger bg-light" : "card h-auto w-100 w-sm-50 bg-light border border-2 border-secondary-subtle")
                    : (
                        "card h-auto w-100 w-sm-50 border-0 bg-light"
                    )
                    }> */}
                <div key={id} style={{ maxWidth: '18rem', border: '1px solid var(--gray01)' }} 
                     className="card h-auto w-100 w-sm-50 bg-light border border-2 border-secondary-subtle" >

                    <div className="row py-3 px-4">
                        {imgUrl && (
                            
                            /* --- 🟠 Img div --- */
                            
                            <div className="col-12 col-md-3 d-flex align-items-start justify-content-center" style={{ cursor: "pointer"}} onClick={() => navigate(location)}>
                                <img src={imgUrl} alt="Ícone do projeto" className="img-fluid" style={{ minWidth: '3rem' }} />
                            </div>
                        )}

                        {/* --- 🟠 Text infos div ---  */}
                        <div className="col-12 col-md-9">
                            <div className="d-flex">
                                <h3 className="text-custom-black" style={{ cursor: "pointer"}} onClick={() => navigate(location)}>{title}</h3>   
                                <ThreeDotsVertical size={30} onClick={() => setMoreOptions(!moreOptions) } style={{ cursor: 'pointer' }}/>
                                { moreOptions && (
                                    <div className="d-flex position-absolute rounded-2 h-auto w-auto p-2 z-3" 
                                         style={{ top: "3.5rem", right: "1.5rem", backgroundColor: "var(--gray02)" }}>
                                        
                                        <button onClick={() => handleMoveProjectToTrash(id)} className="d-flex gap-2 align-items-center justify-content-center btn-custom btn-custom-inside-primary">
                                            <Trash3Fill size={20} color="var(--gray00)"/>
                                            <p className="mb-0 text-custom-black">Mover para lixeira</p>
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div style={{ cursor: "pointer"}} onClick={() => navigate(location)}>
                                {subtitle && (
                                    <h4 className="text-custom-black">{subtitle}</h4>
                                )}
                                {description && (
                                    <p className="text-custom-black">{description}</p>
                                )}
                                {element && (
                                    <div className="">{element}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            {/* ))} */}
        </>
    )
}