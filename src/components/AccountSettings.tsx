import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { doc, getDoc } from 'firebase/firestore'
import { Logout } from "../services/authService";
import { auth, db } from "../firebaseConfig/config";

import { PersonCircle, BoxArrowRight, GearFill, PersonAdd } from "react-bootstrap-icons";

interface AccountSettingsProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

interface UserData {
    userName: string;
    email: string;
}

export default function Notifications({ isOpen, onOpen, onClose } : AccountSettingsProps)
{
    const [ userData, setUserData ] = useState<UserData | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            
            if (userData?.email === user?.email) return;

            if (!user)
            {
                console.log("User not logged in!");
                setUserData(null);
                navigate("/login");
                return;
            }

            try 
            {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists())
                {
                    setUserData(docSnap.data() as UserData);
                    console.log("Fetched user data: ", docSnap.data());
                }
                else 
                {
                    console.log("No user document found!");
                }
            }
            catch (error)
            {
                console.error("Error fetching user: ", error);
            }
        });


        return () => unsubscribe();
    }, [navigate, userData?.email]);

    return(
        <div className="d-flex justify-content-center">
            <button className={ isOpen ? "d-flex align-items-center btn-custom btn-custom-outline-primary" : "d-flex align-items-center text-custom-black btn-custom" } 
                    onClick={ () => (isOpen ? onClose() : onOpen() ) }>{<PersonCircle size={25} />}</button>

            { isOpen &&
                createPortal(
                    (
                        /* --- 🔴 Portal div --- */
                        <div className="w-auto position-fixed top-0 bg-light border rounded-2"
                                style={{ marginTop: '5rem', right: '3rem', zIndex: 999 }}>

                            {/* --- 🔵 Inner content portal --- */}
                            <div className="py-3 px-4 row g-0">

                                {/* --- 🔵 Img div - background configs --- */}
                                <div className="col-3 d-flex  justify-content-center rounded-circle border bg-white"
                                        style={{ width: '60px', height: '60px' }}>
                                        <img src='/vite.svg' alt="Foto de perfil" className="img-fluid"/>
                                </div>

                                {/* --- 🔵 Text infos div --- */}
                                <div className="col-7 ps-4">
                                    <p className="fs-4 mb-0 fw-bold text-custom-black overflow-hidden">{userData?.userName}</p>
                                    <p className="mb-0 text-custom-black overflow-hidden">{userData?.email}</p>
                                </div>

                                <div className="col d-flex flex-column align-items-end justify-content-center p-0">
                                    <button className="p-2 btn-custom btn-custom-secondary" 
                                            onClick={async () => {
                                                                    Logout();
                                                                    navigate("/login");
                                                                }}>
                                        <BoxArrowRight size={25}/>
                                    </button>
                                </div>
                            </div>

                            <div className="py-3 px-4 row bg-secondary-subtle g-0 d-flex gap-3">
                                <button className="col btn btn-outline-secondary d-flex gap-2 align-items-center justify-content-center">
                                    <GearFill color="var(--gray00)" size={25}/>
                                    <p className="text-custom-black mb-0">Configurações</p>
                                </button>
                                <button className="col btn btn-outline-secondary d-flex gap-2 align-items-center justify-content-center">
                                    <PersonAdd color="var(--gray00)" size={25}/>
                                    <p className="text-custom-black mb-0">Convidar</p>
                                </button>
                            </div>
                        </div>
                ), document.body
            )}
        </div>
    )
}