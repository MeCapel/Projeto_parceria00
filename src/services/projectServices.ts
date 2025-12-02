import { toast } from "react-toastify";
import { db } from '../firebaseConfig/config'
import { addDoc, deleteDoc, collection, doc, getDoc, getDocs, updateDoc, onSnapshot, query, where, arrayUnion } from 'firebase/firestore'

// ----- PROJECT RELATED FUNCTIONS -----

// ----- Function to create a new project, that stands for a new machine ----- 
export const createProject = async ( projectName: string, description: string ) => {
    try
    {
        const projectsRef = collection(db, "projects");
        const docRef = await addDoc(projectsRef, { projectName: projectName, description: description });
        
        toast.success("✅ Projeto criado com sucesso!");

        return docRef.id;
    }
    catch (err)
    {
        toast.error(`❌ Erro ao criar um novo projeto: ${err}`);
    }
}

// export const AttachProjectToUser = async ( projectId: string, userId: string, projectName: string ) => {
//     try 
//     {
//         const userRef = doc(db, "users", userId);
//         const userProjectsRef = collection(userRef, "userProjects");
        
//         await setDoc(doc(userProjectsRef, projectId), {
//             projectName: projectName,
//             createdAt: new Date()
//         });
//     }
//     catch (err)
//     {
//         console.error(err);
//     }
// }

export const AttachProjectToUser = async ( projectId: string, userId: string ) => {
    try 
    {
        const userRef = doc(db, "users", userId);
        
        await updateDoc(userRef, {
            projectIds: arrayUnion(projectId)
        })
    }
    catch (err)
    {
        console.error(err);
    }
}

export const getUserProjects = async ( userId: string ) => {
    try 
        {
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) return [];

            const { projectIds } = userSnap.data();

            if (!projectIds || projectIds.length === 0) return [];

            const projectsRef = collection(db, "projects");
            const q = query(projectsRef, where('__name__', 'in', projectIds));

            const  projectsSnap = await getDocs(q);

            const projects = projectsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            return projects;
        }
        catch (err)
        {
            console.error(err);
            return [];
        }
}

export const listenUserProjects = async (userId: string, callback: (projects: any[]) => void) => {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            callback([]);
            return () => {};
        }

        const { projectIds } = userSnap.data();

        if (!projectIds || projectIds.length === 0) {
            callback([]);
            return () => {};
        }

        const projectsRef = collection(db, "projects");
        const q = query(projectsRef, where('__name__', 'in', projectIds));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const projects = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

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
    try 
    {
        const docRef = doc(db, "projects", id);
            const projectDTO = {
            name: name,
            description: description
        }
        await updateDoc(docRef, projectDTO);
    }
    catch (err)
    {
        console.error(err);
    }
}

export const deleteProjectNPrototypes = async (projectId: string) => {
    try
    {
        const projectRef = doc(db, "projects", projectId);

        const subRef = collection(db, "projects", projectId, "prototypesIds");
        const subSnap = await getDocs(subRef);

        if (!subSnap.empty) 
        {
            const deletePromises = subSnap.docs.map(async (d) => {
                const prototypeId = d.id;

                const prototypeRef = doc(db, "prototypes", prototypeId);
                await deleteDoc(prototypeRef);
            });

            await Promise.all(deletePromises);
        }
            
            await deleteDoc(projectRef);

            toast.info("ℹ️ Projeto excluído com sucesso!");
    }
    catch (err)
    {
        toast.error(`❌ Erro ao excluir projeto: ${err}`);
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