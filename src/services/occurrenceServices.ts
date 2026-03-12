import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../firebaseConfig/config";
import { toast } from "react-toastify";

interface OccourrenceProps {
    id?: string,
    name: string,
    description: string,
    criticity: string,
    prototypeId: string,
    createdAt: string,
}

export const createOccourrence = async ( name: string, description: string, criticity: string, prototypeId: string ) => {
    try 
    {
        const collectionRef = collection(db, "occourrencies");

        const docRef = await addDoc(collectionRef, {
            name,
            description,
            criticity,
            prototypeId,
            createdAt: serverTimestamp(),
        });

        return docRef.id;
    }
    catch(err)
    {
        console.error(`${err}`);
    }
}

export const listOccourrences = ( callback: (occourrencies: OccourrenceProps[] ) => void ) => {
    const collectionRef = collection(db, "occourrencies");

    return onSnapshot(collectionRef, (snapshot) => {
        const occourrenciesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }) as OccourrenceProps);

        callback(occourrenciesData);
    });
}

export const listOccourenciesByPrototype = ( proptotypeId: string, callback: (occourrencies: OccourrenceProps[]) => void ) => {
    const q = query(collection(db, "occourrencies"), where("prototypeId", "==", proptotypeId));

    return onSnapshot(q, (snapshot) => {
        const occourrenciesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }) as OccourrenceProps);
        
        callback(occourrenciesData);
    });

}

export const getOccourrence = async ( occourrenceId: string ) => {
    try
    {
        const docRef = doc(db, "occourrencies", occourrenceId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists())
        {
            return { id: docSnap.id, ...docSnap.data() };
        }
        else
        {
            toast.error("❌ Nenhuma ocorrencia encontrada.");
            return null;
        }
    }
    catch(err)
    {
        console.error(`${err}`);
    }
}

export const updateOccourrence = async ( name: string, description: string, criticity: string, prototypeId: string, occourrenceId: string ) => {
    try 
    {
        const docRef = doc(db, "occourrencies", occourrenceId);

        const occourrenceDTO = {
            name: name,
            description: description,
            criticity: criticity,
            prototypeId:prototypeId
        };

        await updateDoc(docRef, occourrenceDTO);
    }
    catch(err)
    {
        console.error(`${err}`);
    }
}

export const deleteOccorrence = async ( occourrenceId: string ) => {
    try 
    {
        const docRef = doc(db, "occourrencies", occourrenceId);

        await deleteDoc(docRef);
    }
    catch(err)
    {
        console.error(`${err}`);
    }
}
