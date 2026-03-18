import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../firebaseConfig/config";

export interface OccurrenceProps {
    id: string,
    name: string,
    description: string,
    criticity: string,
    prototypeId: string,
    createdAt?: string,
    image?: string
}

export const createOccurrence = async ( occurrence: OccurrenceProps ) => {
    try 
    {
        const collectionRef = collection(db, "occourrencies");

        const docRef = await addDoc(collectionRef, {
            name: occurrence.name,
            description: occurrence.description,
            criticity: occurrence.criticity,
            prototypeId: occurrence.prototypeId,
            createdAt: serverTimestamp(),
        });

        return docRef.id;
    }
    catch(err)
    {
        console.error(`${err}`);
    }
}

export const listOccurrences = ( callback: (occourrencies: OccurrenceProps[] ) => void ) => {
    const collectionRef = collection(db, "occourrencies");

    return onSnapshot(collectionRef, (snapshot) => {
        const occourrenciesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }) as OccurrenceProps);

        callback(occourrenciesData);
    });
}

export const listOccourenciesByPrototype = ( proptotypeId: string, callback: (occourrencies: OccurrenceProps[]) => void ) => {
    const q = query(collection(db, "occourrencies"), where("prototypeId", "==", proptotypeId));

    return onSnapshot(q, (snapshot) => {
        const occourrenciesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }) as OccurrenceProps);
        
        callback(occourrenciesData);
    });

}

export const getOccurrence = async (id: string): Promise<OccurrenceProps | null> => {
    try {
        const docRef = doc(db, "occurrences", id);
        const snap = await getDoc(docRef);

        if (!snap.exists()) return null;

        return {
            id: snap.id,
            ...(snap.data() as Omit<OccurrenceProps, "id">)
        };
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const updateOccurrence = async ( occurrence: OccurrenceProps ) => {
    try 
    {
        if(!occurrence.id) return;

        const docRef = doc(db, "occourrencies", occurrence.id);

        const occurrenceDTO = {
            name: occurrence.name,
            description: occurrence.description,
            criticity: occurrence.criticity,
            prototypeId: occurrence.prototypeId,
        };

        await updateDoc(docRef, occurrenceDTO);
    }
    catch(err)
    {
        console.error(`${err}`);
    }
}

export const deleteOccorrence = async ( occurrenceId: string ) => {
    try 
    {
        const docRef = doc(db, "occourrencies", occurrenceId);

        await deleteDoc(docRef);
    }
    catch(err)
    {
        console.error(`${err}`);
    }
}
