// ===== GERAL IMPORTS =====
import { toast } from "react-toastify";
import { auth, db } from '../firebaseConfig/config'
import { collection, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'

// ===== INTERFACE to define type ===== 
export interface UserProps {
    id: string;
    username: string;
    email: string;
    role: string;
}

// ===== FUNCTIONS =====

// ----- This function creates a new user account -----
export const createAccount = async ( username: string, email: string, password: string ) => {
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
        toast.error(`❌ Erro ao criar conta!`);
        console.error(`${err}`);
    }
};

// ----- This function sign in a user that already got an account -----
export const signIn = async ( email:string, password: string ) => {
    try
    {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("✅ Login realizado com sucesso!");
    }
    catch (err)
    {
        toast.error("❌ E-mail ou senha incorretos!");
        console.error(`${err}`);
    }
}

// ----- This function updates the user data, its username and email ----- 
export const updateAccount = async ( { id, username } : UserProps ) => {
    if (!id) return null;

    try
    {
        const docRef = doc(db, "users", id);
        
        const newUserData = {
            username,
        }
        
        await updateDoc(docRef, newUserData);
    }
    catch (err)
    {
        console.error(`${err}`);
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
        console.error(`${err}`);
    }
}

// ----- This function returns a realtime list of all the users accounts -----
export const getUsers = ( callback: ( usersList: UserProps[] ) => void ) => {
    const docRef = collection(db, "users");
    
    return onSnapshot(docRef, (snapshot) => {
        const usersList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }) as UserProps);

        callback(usersList);
    })
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
        console.log(`Erro na tentativa de puxar as informações do usuário! ${err}`);
    }
}

// ----- This function checks if the current user is logged in ----- 
export const checkIsLogIn = () => {
    try 
    {
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
    catch(err)
    {
        console.error(`${err}`);
    }
}

export const editUser = () => {
     
}

export const deleteUser = () => {

}

export const editUserRole = () => {
    
}
