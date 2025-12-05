import { toast } from "react-toastify";
import { auth, db } from '../firebaseConfig/config'
import { collection, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
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
                username: username,                
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

export interface EditUserData {
    userId: string,
    username: string,
    email: string,
}

// ----- This function updates the user data, its username and email ----- 
export const updateAccount = async ({ userId, username } : EditUserData) => {
    if (!userId) return null;

    try
    {
        const docRef = doc(db, "users", userId);
        
        const newUserData = {
            username,
        }
        
        await updateDoc(docRef, newUserData);
    }
    catch (err)
    {
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

export const getUsers = (callback: any) => {
    const docRef = collection(db, "users");
    
    return onSnapshot(docRef, (snapshot) => {
        const usersList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        callback(usersList);
    })
}

export const editUser = () => {
     
}

export const deleteUser = () => {

}

export const editUserRole = () => {
    
}
