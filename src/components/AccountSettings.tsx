import { createPortal } from "react-dom";
import { PersonCircle } from "react-bootstrap-icons";

interface AccountSettingsProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    accountInfos: {id: number, img: string, name: string, email: string};
}


export default function Notifications({ isOpen, onOpen, onClose, accountInfos } : AccountSettingsProps)
{

    return(
        <div className="d-flex justify-content-center">
            <button className={ isOpen ? "d-flex align-items-center btn-custom btn-custom-outline-primary" : "d-flex align-items-center text-custom-black btn-custom" } 
                    onClick={ () => (isOpen ? onClose() : onOpen() ) }>{<PersonCircle size={25} />}</button>

            { isOpen &&
                createPortal(
                    (
                        /* --- 🔴 Portal div --- */
                        <div className="position-fixed top-0 end-0 mx-4 mx-md-5 py-2 px-0 bg-light border rounded-2"
                                style={{ width: '100%', maxWidth: 'min(90vw, 25rem)', marginTop: '5rem', zIndex: 999 }}>

                            {/* --- 🔵 Inner content portal --- */}
                            <div className="h-100 w-100 d-flex justify-content-center py-3 px-4 row" key={accountInfos.id}>

                                {/* --- 🔵 Img div - background configs --- */}
                                <div className="col-12 col-sm-3 d-flex align-items-center justify-content-center rounded-circle border bg-white"
                                        style={{ width: '70px', height: '70px' }}>
                                        <img src={accountInfos.img} alt="Foto de perfil" className="img-fluid" />
                                </div>

                                {/* --- 🔵 Text infos div --- */}
                                <div className="col-12 col-sm-9 ps-4">
                                    <p className="fs-4 mb-0 fw-bold text-custom-black overflow-hidden">{accountInfos.name}</p>
                                    <p className="mb-0 text-custom-black overflow-hidden">{accountInfos.email}</p>
                                </div>
                            </div>
                        </div>
                ), document.body
            )}
        </div>
    )
}