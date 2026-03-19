import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, Timestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../firebaseConfig/config";

export interface OccurrenceProps {
    id: string
    name: string
    description: string
    criticity: string
    prototypeId: string
    createdAt?: string | Timestamp
    image?: string
}

export const createOccurrence = async ( occurrence: OccurrenceProps ) => {
    try 
    {
        const collectionRef = collection(db, "occurrences");

        // --- Verificação de duplicidade por nome no mesmo protótipo ---
        const q = query(
            collectionRef, 
            where("prototypeId", "==", occurrence.prototypeId),
            where("name", "==", occurrence.name)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            console.warn("Já existe uma ocorrência com este nome para este protótipo.");
            return "duplicate"; // Retorna um identificador de erro específico
        }

        const docRef = await addDoc(collectionRef, {
            name: occurrence.name,
            description: occurrence.description,
            criticity: occurrence.criticity,
            prototypeId: occurrence.prototypeId,
            image: occurrence.image || null,
            createdAt: serverTimestamp(),
        });

        return docRef.id;
    }
    catch(err)
    {
        console.error("Erro detalhado no Firestore ao criar ocorrência:", err);
        return null;
    }
}

export const listOccurrences = ( callback: (occurrences: OccurrenceProps[] ) => void ) => {
    const collectionRef = collection(db, "occurrences");

    return onSnapshot(collectionRef, (snapshot) => {
        const occurrencesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }) as OccurrenceProps);

        callback(occurrencesData);
    });
}

export const listOccurenciesByPrototype = ( proptotypeId: string, callback: (occurrences: OccurrenceProps[]) => void ) => {
    const q = query(collection(db, "occurrences"), where("prototypeId", "==", proptotypeId));

    return onSnapshot(q, (snapshot) => {
        const occurrencesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }) as OccurrenceProps);
        
        callback(occurrencesData);
    });

}

export const getOccurrence = async (id: string): Promise<OccurrenceProps | null> => {
    try {
        const docRef = doc(db, "occurrences", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return null;

        const data = docSnap.data();

        return {
            id: docSnap.id,
            name: data.name || "",
            description: data.description || "",
            criticity: data.criticity || "A",
            prototypeId: data.prototypeId || "",
        } as OccurrenceProps;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const updateOccurrence = async ( occurrence: OccurrenceProps ) => {
    try 
    {
        if(!occurrence.id) return;

        const docRef = doc(db, "occurrences", occurrence.id);

        const occurrenceDTO = {
            name: occurrence.name,
            description: occurrence.description,
            criticity: occurrence.criticity,
            prototypeId: occurrence.prototypeId,
            image: occurrence.image || null,
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
        const docRef = doc(db, "occurrences", occurrenceId);

        await deleteDoc(docRef);
    }
    catch(err)
    {
        console.error(`${err}`);
    }
}