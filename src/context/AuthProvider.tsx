import { AuthContext } from "./AuthContext";
import { auth } from "../firebaseConfig/config"
import React, { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";

export default function AuthProvider({ children } : { children: React.ReactNode })
{
    const [ user, setUser ] = useState<User | null>(null);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return(
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    )
}