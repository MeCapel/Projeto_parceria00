import { db } from '../firebaseConfig/config'
import { addDoc, deleteDoc, collection, doc, getDoc } from 'firebase/firestore'

export const createProject = async (projectName: string, description: string) => {
    try
    {
        const projectsCollectionRef = collection(db, "projects");

        // await setDoc(doc(db, "projects", ), {
        //     projectName: projectName,
        //     rows: rows,
        //     cols: cols,
        // })

        await addDoc(projectsCollectionRef, { projectName: projectName, description: description });
        
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