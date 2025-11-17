import { toast } from "react-toastify";
import { db } from '../firebaseConfig/config'
import { addDoc, deleteDoc, collection, doc, getDoc, getDocs, setDoc, query, where, updateDoc, onSnapshot } from 'firebase/firestore'

// ----- PROJECT RELATED FUNCTIONS -----

// ----- Function to create a new project, that stands for a new machine ----- 
export const createProject = async ( projectName: string, description: string ) => {
    try
    {
        const projectsRef = collection(db, "projects");
        await addDoc(projectsRef, { projectName: projectName, description: description });
        
        toast.success("✅ Projeto criado com sucesso!");
    }
    catch (err)
    {
        toast.error(`❌ Erro ao criar um novo projeto: ${err}`);
    }
}

export const getProjectsData = (callback: any) => {
    const docRef = collection(db, "projects");

    return onSnapshot(docRef, (snapshot) => {
        const projectsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            
            callback(projectsData);
        });
} 

// ----- Function to get the porject data, like its name and description ----- 
export const getProjectData = async (id: string) => {
    const docRef = doc(db, "projects", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists())
    {
        return { id: docSnap.id, ...docSnap.data() };
    }
    else
    {
        toast.error("❌ Nenhum projeto encontrado.");
        return null;
    }
}

export const editProject = async (id: string, name: string, description: string) => {
    const docRef = doc(db, "projects", id);
    const projectDTO = {
        name: name,
        description: description
    }

    try 
    {
        await updateDoc(docRef, projectDTO);
    }
    catch (err)
    {
        console.error(err);
    }
}

// ----- Function to delete a project -----
export const moveProjectToTrash = async (id: string) => {
    try 
    {
        const projectDoc = doc(db, "projects", id)
        await deleteDoc(projectDoc);

        toast.info("ℹ️ Projeto excluído com sucesso!");
    }
    catch (err)
    {
        toast.error(`❌ Erro ao excluir projeto: ${err}`);
    }
}

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
        
        if (docSnap.exists())
        {
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

export interface CheckboxItem {
    id: number,
    name: string,
    checked: boolean,
}

export interface Checklist {
    name: string,
    dueDate?: string,
    items: CheckboxItem[],
    // maxLength: number,
}

// ----- CHECKLIST RELATED FUNCTIONS -----
export const createChecklist = async ( name: string, 
                                       items: CheckboxItem[], 
                                       dueDate?: string ) => {
    try 
    {
        const checklistsRef = collection(db, "checklists");
        
        const parentDocRef = await addDoc(checklistsRef, { 
            name: name, 
            dueDate: dueDate
        });
        
        const checkboxItemsRef = collection(db, "checklists", parentDocRef.id, "checkboxItems");

        for (const item of items)
        {
            // await setDoc(doc(checkboxItemsRef, item.id.toString()), {
            //     name: item.name,
            //     checked: item.checked 
            // })

            await addDoc(checkboxItemsRef, {
                name: item.name,
                checked: item.checked 
            })
        }
    }
    catch (err)
    {
        console.error(err);
    }
    finally
    {
        toast.success("✅ Checklist criada com sucesso!");
    }
}

export const getChecklist = async (id: string) => {
    try 
    {
        const docRef = doc(db, "checklists", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists())
        {
            return { id: docSnap.id, ...docSnap.data() };
        }
        else 
        {
            console.log("Não foi encontrado nada!");
            return null;
        }
    }
    catch (err)
    {
        console.error(err);
    }
}

export const getChecklists = (callback: any) => {
    const docRef = collection(db, "checklists");

    return onSnapshot(docRef, (snapshot) => {
        const checklistsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            
            callback(checklistsData);
        });
}

export interface EditChecklist {
    name: string,
    dueDate?: string,
    items: CheckboxItem[],
}

export const updateChecklist = async ( id: string, name: string, dueDate: string, items: CheckboxItem[] ) => {
    try
    {
        const doRef = doc(db, "checklists", id);
        const checklistDTO = {
            name: name,
            dueDate: dueDate,
            items: items
        }

        await updateDoc(doRef, checklistDTO)
    }
    catch (err)
    {
        console.error(err);
    }
}

export const deleteChecklist = async (id: string) => {
    try 
    {
        const docRef = doc(db, "checklists", id);

        await deleteDoc(docRef);
    }
    catch (err)
    {
        console.error(err);
    }
}
