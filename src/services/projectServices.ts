// ===== GERAL IMPORTS =====
import { toast } from "react-toastify";
import { db } from '../firebaseConfig/config'
import { addDoc, deleteDoc, collection, doc, getDoc, getDocs, updateDoc, onSnapshot, query, where, serverTimestamp, setDoc } from 'firebase/firestore'
import { getCurrentUser, type UserProps } from "./authServices";
import { deletePrototype } from "./prototypeServices";

// ===== INTERFACE to define type =====
export interface ProjectProps {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    createdAt: string;
}

// ===== FUNCTIONS =====

// ----- This function creates a new project, that stands for a new machine ----- 
export const createProject = async ( projectName: string, projectDescription: string, userId: string ) => {
    try
    {
        const collectionRef = collection(db, "projects");
        const docRef = await addDoc(collectionRef, { 
            name: projectName, 
            description: projectDescription,
            ownerId: userId,
            createdAt: serverTimestamp()
        });

        await setDoc(doc(db, "projectMembers", `${docRef.id}_${userId}`), {
            projectId: docRef.id,
            userId,
            role: "owner",
            joinedAt: serverTimestamp(),
        });
        
        // toast.success("✅ Projeto criado com sucesso!"); 

        return docRef.id;
    }
    catch (err)
    {
        toast.error(`❌ Erro ao criar um novo projeto`);
        console.error(`${err}`);
    }
}

// ----- This function updates a already created project -----
export const updateProject = async ( projectId: string, name: string, description: string ) => {
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
        console.error(`${err}`);
    }
}

export const getProjects = (callback: ( projects: ProjectProps[] ) => void ) => {
    const docRef = collection(db, "projects");

    return onSnapshot(docRef, (snapshot) => {
        const projectsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }) as ProjectProps);
            
        callback(projectsData);
    });
} 

export const getUserProjects = ( userId: string, callback: ( projects: ProjectProps[] ) => void ) => {
    try 
    {
        const collectionRef = collection(db, "projectMembers");
        const q = query(collectionRef, where("userId", "==", userId));

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const projectsIds = snapshot.docs.map(doc => doc.data().projectId);

            if(projectsIds.length == 0)
            {
                callback([]);
                return;
            }

            const projects: ProjectProps[] = [];

            for( const id of projectsIds)
            {
                const projectSnap = await getDoc(doc(db, "projects", id));

                if(projectSnap.exists())
                {
                    projects.push({
                        id: projectSnap.id,
                        ...projectSnap.data()
                    } as ProjectProps);
                }
            }

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

export const getProject = async ( id: string ) => {
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

export const deleteProjectNPrototypes = async ( projectId: string ) => {
    try
    {
        const user = getCurrentUser();
        const userId = user?.uid;
        if (!userId) return;

        const userRole = await getUserRole(projectId);
        if(userRole !== "owner" || userRole !== "admin" || userRole !== "Owner" || userRole !== "Admin")
        {
            console.error(`Você não tem permissão!`);
            console.error(`${userRole}`);

            return;
        }

        // ----- Once gotten the user id, go to "projects" collection and drop the project ref -----

        const userProjectRef = doc(db, "users", userId, "projects", projectId);
        await deleteDoc(userProjectRef);

        // ----- Delete all prototypes that got project id attach to them ----- 

        const prototypesRef = collection(db, "prototypes");
        const q = query(prototypesRef, where("projectId", "==", projectId))
        const prototypesSnap = await getDocs(q);
        
        if (!prototypesSnap.empty) 
        {
            const deletePromises = prototypesSnap.docs.map(async (d) => {
                const prototypeId = d.id;

                // const prototypeRef = doc(db, "prototypes", prototypeId);
                // await deleteDoc(prototypeRef);

                await deletePrototype(prototypeId);
            });
            
            await Promise.all(deletePromises);
        }

        // ----- Once all prototypes were deleted then delete the projects itself -----

        const projectRef = doc(db, "projects", projectId);
            
        await deleteDoc(projectRef);

        await dropMember(projectId, userId);

        toast.info("ℹ️ Projeto e respectivos protótipos excluídos com sucesso!");
    }
    catch (err)
    {
        toast.error(`❌ Erro ao excluir projeto e seus protótipos`);
        console.error(`${err}`);
    }
}

// ----- This function links an user with a project -----
export const linkProjectUser = async ( projectId: string, userId: string, role: string ) => {
    try 
    {
        const docRef = doc(db, "projectMembers", `${projectId}_${userId}`);

        await setDoc(docRef, {
            projectId,
            userId,
            role: role,
            joinedAt: serverTimestamp(),
        });

        toast.success(`✅ Usuário adicionado com sucesso ao projeto!`);
        return { success: true };
    }
    catch (err)
    {
        console.error(`${err}`);
        return { success: false };
    }
}

// ---- This function returns a list of the members the current project got -----  
export const getProjectMembers = ( projectId: string, callback: ( users: UserProps[] ) => void ) => {
    const q = query(collection(db, "projectMembers"), where("projectId", "==", projectId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const membersList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }) as UserProps);;

        callback(membersList);
    });

    return unsubscribe;
}

// ----- This function returns a list of users that do not belong to the current project ----- 
export const getUsersNotInProject = ( projectId: string, callback: ( users: UserProps[] ) => void ) => {
    const q = query(collection(db, "projectMembers"), where("projectId", "==", projectId));

    const unsubscribe = onSnapshot(q, async (membersSnap) => {
        const membersIds = membersSnap.docs.map(doc => doc.data().userId);

        const usersSnap = await getDocs(collection(db, "users"));

        const users = usersSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })).filter(user => !membersIds.includes(user.id));

        callback(users as UserProps[]);
    });

    return unsubscribe;
}

// ----- This function gets and returns the user role -----
export const getUserRole = async ( projectId: string ) => {
    try
    {
        const userData = getCurrentUser();
        if(!userData)
        {
            console.error(`Erro na tentativa de puxar informações do usuário!`);
            return null;
        }

        const userId = userData?.uid;

        const docRef = doc(db, "projectMembers", `${projectId}_${userId}`);
        const docSnap = await getDoc(docRef);

        if(!docSnap.exists()) return null;

        return docSnap.data().role ?? null;
    }
    catch(err)
    {
        console.error(`${err}`);
        return null;
    }
}

// ----- This function changes the role of a project member -----
export const changeMemberRole = async ( projectId: string, userId: string, role: string ) => {
    try 
    {
        const userRole = await getUserRole(projectId);
        if(userRole !== "owner" || userRole !== "admin")
        {
            console.error(`Você não tem permissão!`);
            return;
        }

        const q = query(collection(db, "projectMembers"), where("projectId", "==", projectId), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        if(!querySnapshot.empty)
        {
            const docSnap = querySnapshot.docs[0];
            const docRef = docSnap.ref;

            await updateDoc(docRef, {
                role: role
            });
        }
    }
    catch(err)
    {
        console.error(`${err}`);
    }
}

// ----- This function drops out a member from a project -----
export const dropMember = async ( projectId: string, userId: string ) => {
    try 
    {
        const userRole = await getUserRole(projectId);
        if(userRole !== "owner" || userRole !== "admin")
        {
            console.error(`Você não tem permissão!`);
            return;
        }

        const q = query(collection(db, "projectMembers"), where("projectId", "==", projectId), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        if(!querySnapshot.empty)
        {
            const docSnap = querySnapshot.docs[0];
            const docRef = docSnap.ref;

            await deleteDoc(docRef);
        }
    }
    catch(err)
    {
        console.error(`${err}`);
    }
}