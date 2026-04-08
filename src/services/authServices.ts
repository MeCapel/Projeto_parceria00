// ===== GERAL IMPORTS =====
import { toast } from "react-toastify";
import { auth, db } from '../firebaseConfig/config'
import { collection, doc, onSnapshot, setDoc, updateDoc, getDoc, query, where } from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'

// ===== TYPE INTERFACE ===== 
export interface UserProps {
    id: string;
    username: string;
    email?: string;
    profileImage?: string; // String Base64
    role?: string,
}

// ===== FUNCTIONS =====

// ----- This function creates a new user account -----
export const createAccount = async (username: string, email: string, password: string) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        const user = auth.currentUser;
        if (user) {
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email.toLowerCase().trim(),
                uid: user.uid
            });
        }
        // toast.success("Conta criada com sucesso!");
    } catch (err) {
        console.error(`Erro: ${err}`);
        toast.error(`Erro ao criar conta`);
    }
};

// ----- This function sign in a user that already got an account -----
export const signIn = async (email:string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        if (user) {
            await setDoc(doc(db, "users", user.uid), {
                username: user.displayName || email.split('@')[0],
                email: email.toLowerCase().trim(),
                uid: user.uid
            }, { merge: true });
        }
        // toast.success("Login realizado com sucesso!");
    } catch (err) {
        console.error(`Erro: ${err}`);
        toast.error("E-mail ou senha incorretos!");
    }
}

// ----- This function gets the current user logged in -----
export const getCurrentUser = () => {
    try 
    {
        const currentUser = auth.currentUser;
        return currentUser;
    }
    catch (err)
    {
        console.log(`Erro: ${err}`);
        toast.error("Erro ao puxar as informações do usuário!");
    }
}

// ----- This function updates the user data, its username and profile image ----- 
export const updateAccount = async ({ id, username, profileImage } : UserProps) => {
    if (!id) return null;
    try {
        const docRef = doc(db, "users", id);
        const updateData: Record<string, string> = { username };

        // se tiver foto de perfil...
        if (profileImage) updateData.profileImage = profileImage;

        await updateDoc(docRef, updateData);
        toast.success("Perfil atualizado com sucesso!");
    } catch (err) {
        console.error("Erro:", err);
        toast.error("Erro ao atualizar perfil.");
    }
}

// ----- This function logout the current user ----- 
export const Logout = async () => {
    try {
        await signOut(auth);
        // toast.info("Logout realizado com sucesso!");
    } catch (err) {
        console.error(`Erro: ${err}`);
        toast.error("Erro ao fazer logout!");
    }
}

// ----- This function returns the user selected by its id -----
export const getUserById = async (userId: string): Promise<UserProps | null> => {
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