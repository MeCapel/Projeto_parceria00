import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig/config";
import { api } from "./api";

export const signIn = async (email: string, password: string) => {
    try {
        // 1. Login no Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // 2. Pega token
        const idToken = await userCredential.user.getIdToken();

        // 3. Envia para backend criar cookie
        // console.log("antes login");
        
        await api.post("/login", { idToken });

        // console.log("depois login");

    } 
    catch (error: any) {
        // console.error("Erro no backend login:", error?.response?.data || error.message);
        
        if (error.code === "auth/wrong-password") throw new Error("Senha incorreta");

        if (error.code === "auth/user-not-found") throw new Error("Usuário não encontrado");

        if (error.response?.status === 401) throw new Error("Sessão inválida");

        throw new Error("Erro ao fazer login");
    }   
};

export const logout = async () => {
    try 
    {
        await api.post("/logout"); // backend invalida sessão
        await signOut(auth);       // limpa client
    } 
    catch (err) 
    {
        console.error(err);
    }
};

export const inviteUser = async (data: { username: string, email: string, role: string }) => {
    try 
    {
        const res = await api.post("/invite", {userCreated: data});
        console.log("Link para a nova conta: ", res.data.inviteLink);
        alert(`Link de redefinição:\n${res.data.inviteLink}`);
        return res.data;
    } 
    catch (err) 
    {
        console.error(err);
        throw err;
    }
};

export const getUserById = async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
};

export const updateProfile = async (data: { username?: string, profileImage?: string }) => {
    return await api.put("/users/current", data);
};