import { toast } from "react-toastify";
import { db } from '../firebaseConfig/config'
import { addDoc, deleteDoc, collection, doc, getDoc, getDocs, updateDoc, onSnapshot, setDoc, query, where } from 'firebase/firestore'
import { getCurrentUser } from "./authService";
import type { PrototypeProps } from "./prototypeServices2";

// ----- PROJECT RELATED FUNCTIONS -----

// ----- Function to create a new project, that stands for a new machine ----- 
export const attachProjectToUser = async ( projectId: string, projectName: string, projectsDescription: string, userId: string ) => {
    try 
    {
        const docRef = doc(db, "users", userId, "projects", projectId);

        await setDoc(docRef, {
            name: projectName,
            description: projectsDescription,
            addedToUser: new Date(),
        });

        return { success: true };
    }
    catch (err)
    {
        console.error(err);
        return { success: false };
    }
}

export const createProject = async ( projectName: string, projectDescription: string, userId: string ) => {
    try
    {
        const projectsRef = collection(db, "projects");
        const docRef = await addDoc(projectsRef, { 
            name: projectName, 
            description: projectDescription,
            owner: userId,
        });
        
        // toast.success("✅ Projeto criado com sucesso!");

        attachProjectToUser(docRef.id, projectName, projectDescription, userId);

        return docRef.id;
    }
    catch (err)
    {
        toast.error(`❌ Erro ao criar um novo projeto: ${err}`);
    }
}

export const updateProject = async (projectId: string, name: string, description: string) => {
    try 
    {
        const userData = getCurrentUser();
        
        if (!userData) return;

        const userId = userData.uid;

        const projectRef = doc(db, "projects", projectId);
        const userProjectRef = doc(db, "users", userId, "projects", projectId);

        const projectDTO = {
            name: name,
            description: description
        }

        await updateDoc(projectRef, projectDTO);
        await updateDoc(userProjectRef, projectDTO);
    }
    catch (err)
    {
        console.error(err);
    }
}

export const getProjects = (callback: (projects: PrototypeProps[]) => void) => {
    const docRef = collection(db, "projects");

    return onSnapshot(docRef, (snapshot) => {
        const projectsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }) as PrototypeProps);
            
        callback(projectsData);
    });
} 

export const getUserProjects = (userId: string, callback: (projects: PrototypeProps[]) => void) => {
    try 
    {
        const projectsRef = collection(db, "users", userId, "projects");

        const unsubscribe = onSnapshot(projectsRef, (snapshot) => {
            const projects = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }) as PrototypeProps);

            callback(projects);
        });

        return unsubscribe;
    } 
    catch (err) {
        console.error(err);
        callback([]);
        return () => {};
    }
};

export const getProject = async (id: string) => {
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

export const deleteProjectNPrototypes = async (projectId: string) => {
    try
    {
        // ===== Function to return current user id =====

        const user = getCurrentUser();
        const userId = user?.uid;
        if (!userId) return;

        // ===== Once gotten the user id, go to "projects" sun collection and drop the project ref =====

        const userProjectRef = doc(db, "users", userId, "projects", projectId);
        await deleteDoc(userProjectRef);

        // ===== Delete all prototypes that got project id attache to them ===== 

        const prototypesRef = collection(db, "prototypes");
        const q = query(prototypesRef, where("projectId", "==", projectId))
        const prototypesSnap = await getDocs(q);
        
        if (!prototypesSnap.empty) 
        {
            const deletePromises = prototypesSnap.docs.map(async (d) => {
                const prototypeId = d.id;
                
                const prototypeRef = doc(db, "prototypes", prototypeId);
                await deleteDoc(prototypeRef);
            });
            
            await Promise.all(deletePromises);
        }

        // ===== Once all prototypes were deleted then delete the projects itself =====

        const projectRef = doc(db, "projects", projectId);
            
        await deleteDoc(projectRef);

        toast.info("ℹ️ Projeto e respectivos protótipos excluídos com sucesso!");
    }
    catch (err)
    {
        toast.error(`❌ Erro ao excluir projeto e seus protótipos: ${err}`);
    }
}
