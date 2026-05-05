import type { User } from "firebase/auth";
import { createContext } from "react";

interface AuthContextProps {
    user: User | null;                 // Usamos os dados que vêm da API
    loading: boolean;
    checkAuth: () => Promise<void>;     // Adicionando essa função
}

export const AuthContext = createContext<AuthContextProps>({
    user: null,
    loading: true,
    checkAuth: async () => {},
});