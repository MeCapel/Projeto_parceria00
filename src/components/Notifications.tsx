import { createPortal } from "react-dom";
import { Bell } from "react-bootstrap-icons";
import NotificationCards from './NotificationCards'

interface NotificationsProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    notificationsList: {id: string | number, imgUrl?: string, title: string, subtitle?: string | number, description?: string}[] 
}

export default function Notifications({ isOpen, onOpen, onClose, notificationsList } : NotificationsProps)
{
    return(
        <div className="d-flex justify-content-center">
            <button className={ isOpen ? "d-flex align-items-center btn-custom btn-custom-outline-primary" : "d-flex align-items-center text-custom-black btn-custom" } 
                    onClick={ () => isOpen ? onClose() : onOpen()}>
                    {<Bell size={25} />}</button>

            { isOpen &&
                createPortal(
                    (
                        /* --- 🔴 Portal div --- */
                        <div className="position-fixed top-0 end-0 mx-4 mx-md-5 py-2 px-0 bg-light border rounded-2"
                                style={{ width: '100%', maxWidth: 'min(90vw, 30rem)', marginTop: '5rem', zIndex: 999 }}>

                            {/* --- 🔵 Items inner ---  */}
                            <div className="h-auto w-100 d-flex flex-column align-items-start py-3 px-4 gap-4">
                                <NotificationCards  infosList={notificationsList} />
                            </div>
                    </div>
                ), document.body
            )}
        </div>
    )
}