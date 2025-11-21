import { toast } from "react-toastify";
import { db } from '../firebaseConfig/config'
import { addDoc, deleteDoc, collection, doc, getDoc, getDocs, query, where, updateDoc, onSnapshot, writeBatch } from 'firebase/firestore'


export interface CheckboxItem {
    id: string,
    name: string,
    checked: boolean,
}

export interface Checklist {
    id?: string,
    whichP: string,
    name: string,
    dueDate?: string,
    items: CheckboxItem[],
    // maxLength: number,
}

// ----- CHECKLIST RELATED FUNCTIONS -----
export const createChecklist = async ( name: string, 
                                       whichP: string,
                                       items: CheckboxItem[], 
                                       dueDate?: string ) => {
    try 
    {
        const checklistsRef = collection(db, "checklists");
        
        const parentDocRef = await addDoc(checklistsRef, { 
            name: name, 
            whichP: whichP,
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
        const parentDocRef = doc(db, "checklists", id);
        const parentDocSnap = await getDoc(parentDocRef);

        const childDocRef = collection(db, "checklists", id, "checkboxItems");
        const childDocSnap = await getDocs(childDocRef);
        const items: CheckboxItem[] = [];

        childDocSnap.forEach((doc) => {
            const item = { id: doc.id, ...doc.data() };
            items.push(item);
        })

        if (items.length === 0) return null;
    
        if (parentDocSnap.exists())
        {
            const data = parentDocSnap.data();

            const checklist: Checklist = {
                id: parentDocSnap.id,
                name: data.name || "",
                whichP: data.whichP,
                dueDate: data.dueDate || "",
                items: items
            }

            return checklist;
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
        return null;
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

export const getChecklistsByP = async (whichP: string) => {
    try 
    {
        const docRef = collection(db, "checklists");
        const q = query(docRef, where("whichP", "==", whichP));
        const snapshot = await getDocs(q); 

        const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        return results;
    }
    catch (err)
    {
        console.error(err);
        return [];
    }
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

export const updateChecklistItems = async (checklistId: string, items: CheckboxItem[]) => {
    try
    {
        for (const item of items)
        {
            const docRef = doc(db, "checklists", checklistId, "checkboxItems", item.id);

            await updateDoc(docRef, {
                name: item.name,
                checked: item.checked
            })

        }
    }
    catch (err)
    {
        console.error(err);
        return null;
    }
}

// export const dropPrototypeChecklist = async (prototypeId: string, checklistId: string) =>
// {
//     try
//     {
//         const itemsRef = collection(db, "checklists", checklistId, "checkboxItems");
//         const itemsSnap = await getDocs(itemsRef);

//         if (!itemsSnap.empty)
//         {
//             const updatePromises = itemsSnap.docs.map(async (d) => {
//                 const itemId = d.id;

//                 const itemRef = doc(db, "checklists", checklistId, "checkboxItems", itemId);
//                 await updateDoc(itemRef, {
//                     checked: false
//                 });
//             });

//             await Promise.all(updatePromises);
//         }

//         const prototypeRef = doc(db, "prototypes", prototypeId);

//         await updateDoc(prototypeRef, {
//             checklistId: null
//         })
        
//         toast.info("ℹ️ Lista de requisitos excluída com sucesso!");
//     }
//     catch (err)
//     {
//         console.error(err);
//     }
// }

export const dropPrototypeChecklist = async (prototypeId: string, checklistId: string) =>
{
    try
    {
        const itemsRef = collection(db, "checklists", checklistId, "checkboxItems");
        const itemsSnap = await getDocs(itemsRef);

        const batch = writeBatch(db);

        itemsSnap.forEach((item) => {
            const itemRef = doc(db, "checklists", checklistId, "checkboxItems", item.id);
            batch.update(itemRef, { checked: false });
        })

        const prototypeRef = doc(db, "prototypes", prototypeId);
        batch.update(prototypeRef, { checklistId: null });

        await batch.commit();
        
        toast.info("ℹ️ Lista de requisitos excluída com sucesso!");
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