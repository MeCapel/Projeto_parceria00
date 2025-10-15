import type React from "react";

interface ReusableCardsProps {
    infosList: {id: string | number, 
                imgUrl?: string, 
                title: string, 
                subtitle?: string | number, 
                description?: string, 
                element?: React.ReactNode, 
                hasUpdates?: boolean}[];
    border?: boolean;
}

export default function ReusableCards({ infosList, border } : ReusableCardsProps)
{

    return(
        <>
            {infosList.map((item) => (
                
                // --- 🔴 Inner card content div ---
                <div key={item.id} style={{ maxWidth: '18rem', border: '1px solid var(--gray01)' }} 
                    className={ border ? (
                        item.hasUpdates ? 
                        "card h-auto w-100 w-sm-50 border border-2 border-danger bg-light" : "card h-auto w-100 w-sm-50 bg-light border border-2 border-secondary-subtle")
                    : (
                        "card h-auto w-100 w-sm-50 border-0 bg-light"
                    )
                    }>
                    <div className="row py-3 px-4">
                        {item.imgUrl && (
                            
                            /* --- 🟠 Img div --- */
                            <div className="col-12 col-md-3 d-flex align-items-start justify-content-center">
                                <img src={item.imgUrl} alt="Ícone do projeto" className="img-fluid" style={{ minWidth: '3rem' }} />
                            </div>
                        )}

                        {/* --- 🟠 Text infos div ---  */}
                        <div className="col-12 col-md-9">
                            <h3 className="text-custom-black">{item.title}</h3>   
                            {item.subtitle && (
                                <h4 className="text-custom-black">{item.subtitle}</h4>
                            )}
                            {item.description && (
                                <p className="text-custom-black">{item.description}</p>
                            )}
                            {item.element && (
                                <div className="">{item.element}</div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}