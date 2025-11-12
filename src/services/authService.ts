import { toast } from "react-toastify";
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebaseConfig/config'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'

// ----- Interface to define UserData types ----- 
export interface UserData {
    userName: string;
    email: string;
}

export const getCurrentUser = () => {
    try 
    {
        const currentUser = auth.currentUser;
        return currentUser;
    }
    catch (err)
    {
        console.log(err);
    }
}

// ----- This function checks if the current user is logged in ----- 
export const checkIsLogIn = () => {
    const currentUser = auth.currentUser;

    if (currentUser == null) 
    {
        toast.warn("⚠️ Você precisa estar logado.");
        return false;
    }
    else
    {
        toast.info("ℹ️ Você já está logado.");
        return true;
    }
}

// ----- This function creates a new account -----
export const createAccount = async (username: string, email: string, password: string) => {
    try
    {
        await createUserWithEmailAndPassword(auth, email, password);
        const user = auth.currentUser;

        if (user)
        {
            await setDoc(doc(db, "users", user.uid), {
                userName: username,                
                email: user.email,
            });
        }

        toast.success("✅ Conta criada com sucesso!");
    }
    catch (err)
    {
        toast.error(`❌ Erro ao criar conta: ${err}`);
    }
};

// ----- This function sign in user that already got an account -----
export const signIn = async (email:string, password: string) => {
    try{
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("✅ Login realizado com sucesso!");
    }
    catch (err)
    {
        toast.error("❌ E-mail ou senha incorretos!");
        console.error(err);
    }
}

// ----- This function logout the current user ----- 
export const Logout = async () => {
    try{
        await signOut(auth);
        toast.info("👋 Logout realizado com sucesso!");
    }
    catch (err)
    {
        toast.error("❌ Erro ao fazer logout!");
        console.error(err);
    }
}