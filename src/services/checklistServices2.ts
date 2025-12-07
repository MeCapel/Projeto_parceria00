import { db } from '../firebaseConfig/config'
import { addDoc, deleteDoc, collection, doc, getDocs, query, where, onSnapshot, orderBy, limit, getDoc } from 'firebase/firestore'

export interface CheckboxItem {
    id: string,
    label: string,
    checked: boolean,
}

export interface Categories {
    name: string,
    items: CheckboxItem[],
    newItemName?: string;
}

export interface Checklist {
    id?: string,
    name: string,
    vertical: string,
    categories: Categories[],
    version: number,
    originalModel?: string,
    createdAt: string;
}

// ----- ESTA FUNÇÃO CRIA UM NOVA CHECKLISTS MODELO -----
export const createChecklistModel = async ( checklist: Checklist ) => {
    try 
    {
        const checklistRef = collection(db, "checklistModels");

        const checklistDTO = {
            name: checklist.name,
            vertical: checklist.vertical,
            categories: checklist.categories,
            version: 1,
            createdAt: Date(),
        };

        const docRef = await addDoc(checklistRef, checklistDTO);

        return docRef.id;
    }
    catch (err)
    {
        console.error("Erro ao criar checklist modelo:" + err);
    }

}

// ----- ESTA FUNÇÃO PEGA A ÚLTIMA VERSÃO DA CHECKLIST MODELO QUE O USUÁRIO SOLICITAR -----
const fetchLatestChecklistVersion = async ( checklist: Checklist ) => {
    try 
    {
        const checklistRef = collection(db, "checklistModels");
        const q = query(
            checklistRef, 
            where("name", "==", checklist.name),
            orderBy("version", "desc"),
            limit(1)
        );

        const docSnap = await getDocs(q);

        if (docSnap.empty)
        {
            return 1;
        }
        
        const latestVersion = docSnap.docs[0].data().version;

        return latestVersion;
    }
    catch (err)
    {
        console.error("Erro ao pegar última checklist modelo:" + err);
        return null;
    }
}

// ----- ESTA FUNÇÃO CRIA UMA NOVA VERSÃO DE UMA CHECKLIST, OU SEJA, O NOME, A VERTICAL E ALGUNS OUTROS ITENS SE MANTEM OS MESMOS, POREM HÁ ALGUMA ALTERAÇÃO DO ESTADO INICIAL -----
export const createNewChecklistVersion = async ( checklist: Checklist, checklistId: string ) => {
    try
    {
        const docRef = collection(db, "checklistModels");

        const latestVersion = await fetchLatestChecklistVersion( checklist );

        if (latestVersion == null)
        {
            console.log("Não foi possível pegar o último modelo da checklist!");
            return;
        }

        const originalModel = checklist.originalModel || checklistId;

        const checklistDTO = {
            name: checklist.name,
            vertical: checklist.vertical,
            categories: checklist.categories,
            version: latestVersion + 1,
            originalModel: originalModel,
        };

        const newChecklist = await addDoc(docRef, checklistDTO);

        return newChecklist.id;
    }
    catch (err)
    {
        console.error("Erro ao editar checklist modelo:" + err);
    }
}

// ----- ESTA FUNÇÃO PEGA UM ÚNICO MODELE DE CHECKLIST -----
export const getChecklistModel = async ( checklistModelId: string ) : Promise<(Checklist & { id: string }) | null> => {
    try 
    {
        const docRef = doc(db, "checklistModels", checklistModelId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists())
        {
            console.error("Checklist modelo não encontrada!");
            return null;
        }

        return { id: docSnap.id, ...(docSnap.data() as Checklist) };
    }
    catch (err)
    {
        console.error("Erro na tentativa de pegar a checklist modelo: " + err);
        return null;
    }
}

// ----- ESTA FUNÇÃO PEGA TODOS OS MODELOS DE CHECKLIST -----
export const getChecklistsModel = (callback: (items: (Checklist & { id: string })[]) => void) => {
    const docRef = collection(db, "checklistModels");
    const q = query(
        docRef,
        orderBy("version", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
        })) as (Checklist & { id: string })[];

        callback(data);
    });
} 

// ----- ESTA FUNÇÃO PEGA OS MODELOS DE CHECKLIST DE ACORDO COM A VERTICAL SOLICITADA -----
export const getChecklistsModelByP = async (vertical: string) => {
    try
    {
        const docRef = collection(db, "checklistModels");
        const q = query(
            docRef,
            where("vertical", "==", vertical),
            orderBy("version", "desc")
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) return [];
        
        const results = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data()
        })) as (Checklist & { id: string })[];

        return results;
    }
    catch (err)
    {
        console.error("Erro na tentativa de pegar a lista de checklists por vertical(P): " + err);
        return [];
    }
}

// ----- ESTA FUNÇÃO EXCLUI UMA CHECLIST MODELO COM TODAS AS SUAS CATEGORIAS E ITEMS/CHECKBOXES
export const deleteChecklistModel = async ( checklistId: string ) => {
    try 
    {
        const checklistDoc = doc(db, "checklistModels", checklistId);

        await deleteDoc(checklistDoc);
    }
    catch (err)
    {
        console.error("Erro ao deletar checklist modelo:" + err);
    }
}