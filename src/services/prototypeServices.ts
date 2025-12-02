import { toast } from "react-toastify";
import { db } from '../firebaseConfig/config'
import { addDoc, deleteDoc, collection, doc, getDoc, getDocs, setDoc, query, where, updateDoc, onSnapshot } from 'firebase/firestore'

// ----- PROTOTYPES RELATED FUNCTIONS -----

export interface PrototypeProps {
    prototype: {
        projectId?: string,
        code: string,
        name: string,
        status: string,
        description: string,
        whichP: string,
        state?: string,
        city?: string,
        area?: string,
        checklistId: string,
    }    
}

export interface EditPrototypeProps {
    prototype: {
        code: string,
        name: string,
        status: string,
        description: string,
        whichP: string,
        state?: string,
        city?: string,
        area?: string,
        checklistId?: string
    }    
}

// ----- Function to create a new prototype, that stands for a new tiny machine part test -----
export const createPrototype = async (prototype : PrototypeProps["prototype"]) => {
    try
    {
        const protypesCollectionRef = collection(db, "prototypes");

        const newPrototype = { 
                                projectId: prototype.projectId, 
                                code: prototype.code, 
                                name: prototype.name.trim(),
                                status: prototype.status,
                                description: prototype.description,
                                whichP: prototype.whichP,
                                state: prototype.state ?? null,
                                city: prototype.city ?? null,
                                area: prototype.area ?? null,
                                checklistId: prototype.checklistId ?? null,
                                createdAt: new Date()
        };

        const docRef = await addDoc(protypesCollectionRef, newPrototype);

        console.log("Prototype created with id: " + docRef.id);

        // toast.success("✅ Protótipo criado com sucesso!");

        return docRef.id;
    }
    catch (err)
    {
        toast.error(`❌ Erro ao criar o protótipo: ${err}`);
        console.error(err);
    }
}

// ----- Function to add a prototype to a list of prototypes inside its parent project -----
export const addPrototypeToProject = async ( projectId: string, prototypeId: string, prototypeName: string ) => {
    try
    {
        const projectRef = doc(db, "projects", projectId);
        const prototypesIdsRef = collection(projectRef, "prototypesIds");

        await setDoc(doc(prototypesIdsRef, prototypeId), {
            prototypeName: prototypeName,
            createdAt: new Date()
        });
        
        console.log("Prototype " + prototypeId + " added to project " + projectId + " successfully!");
    }
    catch (err)
    {
        toast.error("❌ Erro ao adicionar o protótipo ao seu projeto relativo.");
        console.error(err);
    }
}

// ----- Function to get prototypes data -----
export const getPrototypeData = async (prototypeId: string) => {
    try 
    {
        const docRef = doc(db, "prototypes", prototypeId);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists())
        {
            console.log("Nothing found!");
            return null;
        }

        const prototypeData = { id: docSnap.id, ...docSnap.data() };
        
        if(!prototypeData.checklistId) 
        {
            return { prototypeData, checklistData: null, itemsData: [] };
        }

        const checklistRef = doc(db, "checklists", prototypeData.checklistId);
        const checklistSnap = await getDoc(checklistRef);

        if (!checklistSnap.exists())
        {
            return { prototypeData, checklistData: null, itemsData: [] }
        }

        const checklistData = { id: checklistSnap.id, ...checklistSnap.data() };

        const itemsRef = collection(db, "checklists", prototypeData.checklistId, "checkboxItems");
        const itemsSnap = await getDocs(itemsRef);
        
        const itemsData: any[] = itemsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        return { prototypeData, checklistData, itemsData};
    }
    catch (err)
    {
        toast.error("❌ Nenhum protótipo encontrado.");
        console.error(err);
        return null;
    }
}

// ----- Function to get prototypes from its relative project parent -----
export const getPrototypesForProjectData = async (projectId: string) => {
    try 
    {
        const prototypesRef = collection(db, "prototypes");
        const q = query(prototypesRef, where("projectId", "==", projectId));
        const snapshot = await getDocs(q); 

        const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return results;
    }
    catch (err)
    {
        toast.error("❌ Nenhum protótipo encontrado.");
        console.error(err);
        return null;
    }
}


export const listenPrototypesForProject = (
    projectId: string,
    callback: (data: any[]) => void
) => {
    try {
        const prototypesRef = collection(db, "prototypes");
        const q = query(prototypesRef, where("projectId", "==", projectId));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const results = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                callback(results);
            },
            (error) => {
                console.error("Erro ao ouvir protótipos:", error);
                callback([]);
            }
        );

        return unsubscribe; // permite parar o listener
    } catch (err) {
        console.error("Erro ao iniciar listener de protótipos:", err);
        return () => {};
    }
};

// ----- Function to update the current prototype -----
export const updatePrototype = async (prototypeId: string, data : EditPrototypeProps["prototype"]) => {
    try
    {
        const docRef = doc(db, "prototypes", prototypeId);
        const newData = { 
                                code: data.code,
                                name: data.name.trim(),
                                status: data.status,
                                description: data.description,
                                whichP: data.whichP,
                                state: data.state ?? null,
                                city: data.city ?? null,
                                area: data.area ?? null,
                                checklistId: data.checklistId ?? null
        };
        
        await updateDoc(docRef, newData);
    }
    catch (err)
    {
        toast.error("❌ Erro ao editar os dados do protótipo.");
        console.error(err);;
    }
}

// ----- Function to delete a prototype ----- 
export const movePrototypeToTrash = async (projectId: string, prototypeId: string) => {
    try 
    {
        const projectDoc = doc(db, "projects", projectId)
        const ref = doc(projectDoc, "prototypesIds", prototypeId);
        const prototypeDoc = doc(db, "prototypes", prototypeId);

        await deleteDoc(ref);
        await deleteDoc(prototypeDoc);
    }
    catch (err)
    {
        toast.error("❌ Erro ao excluir o protótipo.");
        console.error(err);
    }
}
