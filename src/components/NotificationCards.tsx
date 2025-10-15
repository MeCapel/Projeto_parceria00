interface NotificationCardsProps {
    infosList: {id: string | number, 
                imgUrl?: string, 
                title: string, 
                subtitle?: string | number, 
                description?: string}[];
}

export default function NotificationCards({ infosList } : NotificationCardsProps)
{

    return(
        <>
            {infosList.map((item) => (

                // --- 🔴 Inner card content div ---
                <div key={item.id} style={{ maxWidth: '100%', border: '1px solid var(--gray01)' }} 
                className={"card h-auto w-100 w-sm-50 bg-secondary-subtle border border-0 p-1"}>
                    
                    {/* --- 🔵 Row inner content, divide in two cols --- */}
                    <div className="row py-3 mx-4 p-0">
                        {item.imgUrl && (
                            
                            /* --- 🟠 Img div --- */
                            <div className="col-auto d-flex align-items-center justify-content-center border-0 bg-danger-subtle rounded-circle"
                                style={{ width: '70px', height: '70px' }}>
                                <img src={item.imgUrl} alt="Ícone do projeto" className="img-fluid" style={{ minWidth: '3rem' }} />
                            </div>
                        )}

                        {/* --- 🟠 Text infos div ---  */}
                        <div className="col">
                            <p className="text-custom-black fs-4 mb-0">{item.title}</p>   
                            {item.description && (
                                <p className="text-custom-black mb-0">{item.description}</p>
                            )}
                        </div>

                        <div className="col-auto text-end">
                            {item.subtitle && (
                                <p className="text-custom-black fs-5 p-0 mb-0">{item.subtitle} dias</p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}