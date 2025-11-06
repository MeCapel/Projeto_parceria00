import { db } from '../firebaseConfig/config'
import { addDoc, deleteDoc, collection, doc, getDoc, getDocs, setDoc, query, where } from 'firebase/firestore'

export const createProject = async ( projectName: string, description: string ) => {
    try
    {
        const projectsRef = collection(db, "projects");

        // await setDoc(doc(db, "projects", ), {
        //     projectName: projectName,
        //     rows: rows,
        //     cols: cols,
        // })

        await addDoc(projectsRef, { projectName: projectName, description: description });
    }
    catch (err)
    {
        console.error(err);
    }
}

export const getProjectData = async (id: string) => {
    const docRef = doc(db, "projects", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists())
    {
        // console.log(docSnap.data());x
        return { id: docSnap.id, ...docSnap.data() };
    }
    else
    {
        console.log("Nothing found");
        return null;
    }
}

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
        console.error(err);
    }
}

interface PrototypeProps {
    projectId: string,
    protoName: string,
    protoStatus: string,
    protoDescription: string,
    protoP: string,
    state?: string,
    city?: string,
    area?: string,
}

export const createPrototype = async ( { projectId,
                                         protoName,
                                         protoStatus,
                                         protoDescription,
                                         protoP,
                                         state,
                                         city,
                                         area } : PrototypeProps) => {
    try
    {
        const protypesCollectionRef = collection(db, "prototypes");

        const newPrototype = { 
                                projectId: projectId, 
                                name: protoName.trim(),
                                status: protoStatus,
                                description: protoDescription,
                                whichP: protoP,
                                state: state ?? null,
                                city: city ?? null,
                                area: area ?? null,
                                createdAt: new Date()
        };

        const docRef = await addDoc(protypesCollectionRef, newPrototype);

        console.log("Prototype created with id: " + docRef.id);

        return docRef.id;
    }
    catch (err)
    {
        console.error(err);
    }
}

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
        console.error(err);
        return null;
    }
}

export const getPrototypeData = async (projectId: string) => {
    try 
    {
        const docRef = doc(db, "prototypes", projectId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists())
        {
            // console.log(docSnap.data());
            return { id: docSnap.id, ...docSnap.data() };
        }
        else
        {
            console.log("Nothing found");
            return null;
        }
    }
    catch (err)
    {
        console.error(err);
    }
}

export const moveProjectToTrash = async (id: string) => {
    try 
    {
        const projectDoc = doc(db, "projects", id)
        await deleteDoc(projectDoc);
    }
    catch (err)
    {
        console.error(err);
    }
}