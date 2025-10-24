import { auth, db } from '../firebaseConfig/config'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export interface UserData {
    userName: string;
    email: string;
}

export const checkIsLogIn = () => {
    const currentUser = auth.currentUser;

    if (currentUser == null) 
    {
        // alert("You must be logged in dudee.");
        return false;
    }
    else
    {
        // alert("You're already logged in.");
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
    }
    catch (err)
    {
        console.error(err);
    }
};

export const signIn = async (email:string, password: string) => {
    try{
        return signInWithEmailAndPassword(auth, email, password);
    }
    catch (err)
    {
        console.error(err);
    }
}

export const Logout = async () => {
    try{
        await signOut(auth);
    }
    catch (err)
    {
        console.error(err);
    }
}