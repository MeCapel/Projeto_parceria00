import { db } from '../firebaseConfig/config'
import { addDoc, deleteDoc, collection, doc, getDoc, setDoc, serverTimestamp, onSnapshot, updateDoc, query, orderBy, getDocs, writeBatch, arrayUnion, where } from 'firebase/firestore'
import { getChecklistModel, type Categories, type CheckboxItem } from './checklistServices2';
import type { Checklist } from './checklistServices2';

export interface PrototypeProps {
    projectId: string,
    code?: string,
    name: string,
    description: string,
    stage: string,
    state?: string,
    city?: string,
    areaSize?: string,
    vertical: string,
    editedAt?: Date[],
    createdAt?: Date,
    checklistsIds?: string[],
}

// ----- ESTA FUNÇÃO ADICIONA UM PROTÓTIPO A UM PROJETO EXISTENTE -----
export const addPrototypeToProject = async ( prototype: PrototypeProps & { id: string } ) => {
    try
    {
        const prototypesIdsRef = collection(db, "projects", prototype.projectId, "prototypesIds");
        const docRef = doc(prototypesIdsRef, prototype.id);
        const docData = await setDoc(docRef, {
            prototypeName: prototype.name,
            // createdAt: new Date(),
            createdAt: serverTimestamp(),
        });

        return docData;
    }
    catch (err)
    {
        console.error("Erro na tentativa de vincular protótipo a projeto: " + err);
        return null;
    }
}

// ----- ESTA FUNÇÃO CRIA UM NOVO PROTÓTIPO -----
export const createPrototype = async ( prototype: PrototypeProps ) : Promise<string | null> => {
    try
    {
        const collectionRef = collection(db, "prototypes");
        const docRef = await addDoc(collectionRef, {
            projectId: prototype.projectId,
            code: prototype.code,
            name: prototype.name,
            description: prototype.description,
            stage: prototype.stage,
            state: prototype.state,
            city: prototype.city,
            areaSize: prototype.areaSize,
            vertical: prototype.vertical,
            // createdAt: new Date(),
            createdAt: serverTimestamp(),
        });

        addPrototypeToProject({...prototype, id: docRef.id});

        return docRef.id;
    }
    catch (err)
    {
        console.error("Erro na tentativa de criar um protótipo: " + err);
        return null;
    }
}

// ----- ESTA FUNÇÃO PEGA AS DADOS DE UM ÚNICO PROTÓTIPO -----
// export const getPrototype = async ( prototypeId: string ) => {
//     try
//     { 
//         const prototypeRef = doc(db, "prototypes", prototypeId);
//         const prototypeSnap = await getDoc(prototypeRef);

//         if (!prototypeSnap.exists())
//         {
//             console.error("Protótipo não encontrado! Id: " + prototypeId);
//             return null;
//         }

//         const prototypeData = { id: prototypeSnap.id, ...prototypeSnap.data() };

//         return prototypeData;
//     }
//     catch (err)
//     {
//         console.error("Erro na tentativa de pegar os dados do protótipo: " + err);
//         return null;
//     }
// }
export const getPrototype = async (prototypeId: string) => {
    try {
        const prototypeRef = doc(db, "prototypes", prototypeId);
        const prototypeSnap = await getDoc(prototypeRef);

        if (!prototypeSnap.exists()) {
            console.error("Protótipo não encontrado! Id: " + prototypeId);
            return null;
        }

        // Dados principais do protótipo
        const prototypeData = { id: prototypeSnap.id, ...prototypeSnap.data() };

        // Agora busca a subcoleção "checklists"
        const checklistRef = collection(db, "prototypes", prototypeId, "checklists");
        const checklistSnap = await getDocs(checklistRef);

        const checklists = checklistSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return {
            ...prototypeData,
            checklists,   // ← adiciona as checklists ao protótipo
        };
    }
    catch (err) {
        console.error("Erro na tentativa de pegar os dados do protótipo: " + err);
        return null;
    }
}


export const listenPrototypesForProject = (
    projectId: string,
    callback: (data: any[]) => void
) => {
    const prototypesRef = collection(db, "prototypes");
    const q = query(prototypesRef, where("projectId", "==", projectId));

    const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
            const results = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

            callback(results); // envia os dados atualizados
        },
        (error) => {
            console.error("Erro ao ouvir protótipos:", error);
            callback([]); 
        }
    );

    return unsubscribe; // necessário para parar o listener
};

// ----- ESTA FUNÇÃO PEGA OS DADOS DE TODOS OS PROTÓTIPOS -----
export const getPrototypes = (callback: any) => {
    const collectionRef = collection(db, "prototypes");
    const q = query(
        collectionRef,
        orderBy("createdAt", "desc")
    );
    
    return onSnapshot(q, (snapshot) => {
        const prototypesData = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data()
        }));

        callback(prototypesData);
    });
}


// ----- ESTA FUNÇÃO ATUALIZA AS INFORMAÇÕES DO PROTÓTIPO ----- 
export const updatePrototype = async ( editedPrototype: PrototypeProps & { id: string } ) => {
    try 
    {
        const docRef = doc(db, "prototypes", editedPrototype.id);

        await updateDoc(docRef, {
            code: editedPrototype.code ?? "",
            name: editedPrototype.name,
            description: editedPrototype.description,
            stage: editedPrototype.stage,
            state: editedPrototype.state ?? "",
            city: editedPrototype.city ?? "",
            areaSize: editedPrototype.areaSize ?? "",
            vertical: editedPrototype.vertical,
            editedAt: arrayUnion(new Date()),
        });

        return editedPrototype.id;
    }
    catch (err)
    {
        console.error("Erro na tentativa de editar as informações do portótipo: " + err);
        return null;
    }
}

// ----- ESTA FUNÇÃO EXCLUI UM PROTÓTIPO ----- 
export const deletePrototype = async ( prototypeId: string ) => {
    try 
    {
        const checklistsRef = collection(db, "prototypes", prototypeId, "checklists");
        const checklistsSnap = await getDocs(checklistsRef);

        const batch = writeBatch(db);
        checklistsSnap.forEach((d) => {
            batch.delete(doc(db, "prototypes", prototypeId, "checklists", d.id));
        });

        await batch.commit();

        const prototypeDoc = doc(db, "prototypes", prototypeId);

        await deleteDoc(prototypeDoc);

        return true;
    }
    catch (err)
    {
        console.error("Erro na tentativa de excluir o protótipo: " + err);
        return null;
    }
}

// ================================================================================

// ----- ESTA FUNÇÃO CRIA UMA INSTANCIA DE UM MODELO DE CHECKLIST E ADICIONA CAMPOS CHECKED(BOLEANOS) -----
export const createChecklistInstance = async ( checklistModelId: string ) => {
    try 
    {
        const checklistModel = await getChecklistModel(checklistModelId);        
        
        if (!checklistModel || checklistModel == null)
        {
            console.error("Checklist modelo não encontrada!");
            return null;
        }
        
        const newCategories = checklistModel.categories.map((c: Categories) => ({
            name: c.name,
            items: c.items.map((i: CheckboxItem) => ({
                label: i.label,
                checked: false
            }))
        }));
        
        const newDoc = {
            name: checklistModel?.name,
            vertical: checklistModel?.vertical,
            categories: newCategories,
            version: checklistModel?.version,
            originalModel: checklistModelId,
            createdAt: new Date(),
        };

        return newDoc;
    }
    catch (err)
    {
        console.error("Erro ao criar instância da checklist para o protótipo: " + err)
        return null;
    }
}

// ----- ESTA FUNÇÃO ADICIONA UM INSTANCIA DA CHECKLIST MODELO A UM PROTÓTIPO -----
export const addChecklistToPrototype = async ( prototypeId: string, checklistModelId: string ) => {
    try
    {
        const checklistsRef = collection(db, "prototypes", prototypeId, "checklists");
        
        const newChecklist = await createChecklistInstance(checklistModelId);

        if (!newChecklist)
        {
            console.error("Erro ao criar instância da checklist para o protótipo!");
            return null;
        }

        const docRef = await addDoc(checklistsRef, newChecklist);

        const checklistData = { id: docRef.id, ...newChecklist }

        return { prototypeId, checklistData };
    }
    catch (err)
    {
        console.error("Erro na tentativa de adicionar um checklist ao protótipo: " + err);
        return null;
    }
}

// ----- ESTA FUNÇÃO ATUALIZA OS CAMPOS CHECKED DAS CHECKLISTS DO PROTÓTIPO -----
export const toggleChecklistItems = async ( prototypeId: string, checklistId: string, newChecklist: Checklist ) => {
    try 
    {
        const docRef = doc(db, "prototypes", prototypeId, "checklists", checklistId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists())
        {
            console.error("Erro ao pegar os dados da checklist do protótipo!");
            return null;
        }

        await setDoc(docRef, newChecklist);

        return true;
    }
    catch (err)
    {
        console.error("Erro na tentativa de alterar item da checklist: " + err);
        return null;
    }
}

export const getChecklistProgress = async () => {

}

// ----- ESTA FUNÇÃO DESVINCULA / EXCLUIU UM CHECKLIST DO PROTÓTIPO -----
export const deletePrototypeChecklist = async ( prototypeId: string, checklistId: string ) => {
    try 
    {
        const docRef = doc(db, "prototypes", prototypeId, "checklists", checklistId);

        await deleteDoc(docRef);

        return true;
    }
    catch (err)
    {
        console.error("Erro na tentativa de excluir uma checklist do projeto: " + err);
        return null;
    }
}
