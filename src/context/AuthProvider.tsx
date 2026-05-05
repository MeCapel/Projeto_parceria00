import { AuthContext } from "./AuthContext";
import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import type { User } from "firebase/auth";

export default function AuthProvider({ children } : { children: React.ReactNode }) {
    const [ user, setUser ] = useState<User | null>(null);
    const [ loading, setLoading ] = useState(true);

    const checkAuth = async () => {
        try 
        {
            // A API vai checar o cookie e retornar o usuário
            const res = await api.get("/users/me");
            setUser(res.data);
        } 
        catch 
        {
            setUser(null);
        } 
        finally 
        {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return(
        <AuthContext.Provider value={{ user, loading, checkAuth }}>
            {children}
        </AuthContext.Provider>
    )
}