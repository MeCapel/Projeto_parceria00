import { toast } from "react-toastify";
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebaseConfig/config'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'

export interface UserData {
    userName: string;
    email: string;
}

export const checkIsLogIn = () => {
    const currentUser = auth.currentUser;

    if (currentUser == null) 
    {
        // alert("You must be logged in dudee.");
        toast.warn("⚠️ Você precisa estar logado.");
        return false;
    }
    else
    {
        // alert("You're already logged in.");
        toast.info("ℹ️ Você já está logado.");
        return true;
    }
}

export const createAccount = async (username: string, email: string, password: string) => {
    try
    {
        await createUserWithEmailAndPassword(auth, email, password);
        const user = auth.currentUser;
        console.log("User created successfully!");

        if (user)
        {
            await setDoc(doc(db, "users", user.uid), {
                userName: username,                
                email: user.email,
            });
        }

        toast.success("✅ Conta criada com sucesso!");
    }
    catch (err: any)
    {
        // console.error(err);
        toast.error(`❌ Erro ao criar conta: ${err.message}`);
    }
};

export const signIn = async (email:string, password: string) => {
    try{
        // return signInWithEmailAndPassword(auth, email, password);
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("✅ Login realizado com sucesso!");
        // return true;
    }
    catch (err)
    {
        console.error(err);
        toast.error("❌ E-mail ou senha incorretos!");
    }
}

export const Logout = async () => {
    try{
        await signOut(auth);
        toast.info("👋 Logout realizado com sucesso!");
    }
    catch (err)
    {
        console.error(err);
        toast.error("❌ Erro ao fazer logout!");
    }
}