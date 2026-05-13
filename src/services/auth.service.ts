import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebaseConfig/config";
import { api } from "./api";
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";

export type Role = 'admin' | 'coordenador de validacao' | 'po' | 'tecnico de campo' | 'tecnico de desenvolvimento de producao';
export type Status = 'active' | 'inactive';

export interface UserProps {
    id: string;
    username: string;
    email: string;
    role: Role,
    profileImage?: string; // String Base64
    status: Status
}

// ----- This function returns the user selected by its id -----
export const lisenUserById = async (userId: string): Promise<UserProps | null> => {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as UserProps;
        }
        return null;
    } catch (err) {
        console.error("Erro ao buscar usuário:", err);
        return null;
    }
}

// ----- This function returns a list of users selected by their ids in reaal time -----
export const getUsersByIds = (userIds: string[], callback: (users: UserProps[]) => void) => {
    if (userIds.length === 0) {
        callback([]);
        return () => {};
    }

    // O Firestore tem um limite de 30 IDs no operador 'in'
    const chunks = [];
    for (let i = 0; i < userIds.length; i += 30) {
        chunks.push(userIds.slice(i, i + 30));
    }

    const docRef = collection(db, "users");
    
    // Para simplificar e manter o tempo real, vamos usar múltiplos snapshots se necessário
    // mas para a maioria dos casos de projetos, userIds será pequeno.
    const unsubscribes = chunks.map(chunk => {
        const q = query(docRef, where("uid", "in", chunk));
        return onSnapshot(q, (snapshot) => {
            const usersList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as UserProps[];
            callback(usersList);
        });
    });

    return () => unsubscribes.forEach(unsub => unsub());
}

export const getCurrentUser = async (): Promise<UserProps> => {
    const response = await api.get("/users/me");
    return response.data;
};

export const listenCurrentUser = (callback: (user: UserProps | null) => void) => {
    try 
    {
        const currentUser = auth.currentUser;

        if (!currentUser) 
        {
            callback(null);
            return () => {};
        }

        const docRef = doc(db, "users", currentUser.uid);

        return onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                callback({
                    id: docSnap.id,
                    ...docSnap.data(),
                } as UserProps);
            } else {
                callback(null);
            }
        });
    } 
    catch (err) 
    {
        console.error("Erro ao ouvir usuário:", err);
        callback(null);
        return () => {};
    }
};

export const getUserById = async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
};

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
    catch (error: any) 
    {
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

export const updateProfile = async (userId: string, data: { username?: string, profileImage?: string }) => {
    return await api.patch(`/users/${userId}`, data);
};

export const updateMyProfile = async (data: { username?: string; profileImage?: string }) => {
    // A API saberá quem é você pelo cookie de sessão
    return await api.patch("/users/me", data);
};