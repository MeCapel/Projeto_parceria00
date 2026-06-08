import type { UserProps } from "../services/auth.service";
import { createContext } from "react";

interface AuthContextProps {
    user: UserProps | null;
    loading: boolean;
    checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
    user: null,
    loading: true,
    checkAuth: async () => {},
});