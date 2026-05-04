import type { User } from "firebase/auth";
import { createContext } from "react";

interface AuthContextProps {
    user: User | null; // Agora usaremos os dados que vêm da sua API
    loading: boolean;
    checkAuth: () => Promise<void>; // Adicionando essa função
}

export const AuthContext = createContext<AuthContextProps>({
    user: null,
    loading: true,
    checkAuth: async () => {},
});