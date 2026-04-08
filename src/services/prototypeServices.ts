import { db } from '../firebaseConfig/config'
import { addDoc, deleteDoc, collection, doc, getDoc, setDoc, onSnapshot, updateDoc, query, orderBy, getDocs, writeBatch, arrayUnion, where, serverTimestamp, Timestamp } from 'firebase/firestore'
import { getChecklistModel, type CategoriesProps, type CheckboxItemProps, type ChecklistProps } from './checklistServices';

export interface PrototypeProps {
    id?: string, 
    code?: string,
    name: string,
    description: string,
    stage: string,
    vertical: string,
    clientId?: string,
    state?: string,
    city?: string,
    areaSize?: string,
    editedAt?: string[],
    createdAt?: string,
    checklists?: ChecklistProps[],
    projectId: string,
}

// ----- ESTA FUNÇÃO ADICIONA UM PROTÓTIPO A UM PROJETO EXISTENTE -----
export const addPrototypeToProject = async ( prototype: PrototypeProps & { id: string } ) => {
    try
    {
        const prototypesIdsRef = collection(db, "projects", prototype.projectId, "prototypesIds");
        const docRef = doc(prototypesIdsRef, prototype.id);
        const docData = await setDoc(docRef, {
            prototypeName: prototype.name,
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
            code: prototype.code ?? "",
            name: prototype.name,
            description: prototype.description,
            stage: prototype.stage,
            clientId: prototype.clientId ?? "",
            state: prototype.state ?? "",
            city: prototype.city ?? "",
            areaSize: prototype.areaSize ?? "",
            vertical: prototype.vertical,
            createdAt: serverTimestamp(),
        });

        await addPrototypeToProject({...prototype, id: docRef.id});

        return docRef.id;
    }
    catch (err)
    {
        console.error("Erro na tentativa de criar um protótipo: " + err);
        return null;
    }
}

// ----- ESTA FUNÇÃO PEGA AS DADOS DE UM ÚNICO PROTÓTIPO -----
export const getPrototype = async (prototypeId: string) => {
    try {
        const prototypeRef = doc(db, "prototypes", prototypeId);
        const prototypeSnap = await getDoc(prototypeRef);

        if (!prototypeSnap.exists()) {
            console.error("Protótipo não encontrado! Id: " + prototypeId);
            return null;
        }

        // Dados principais do protótipo
        const prototypeData = { id: prototypeSnap.id, ...prototypeSnap.data() } as PrototypeProps;

        // Agora busca a subcoleção "checklists"
        const checklistRef = collection(db, "prototypes", prototypeId, "checklists");
        const checklistSnap = await getDocs(checklistRef);

        const checklists = checklistSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return {
            ...prototypeData,
            checklists,   
        };
    }
    catch (err) {
        console.error("Erro na tentativa de pegar os dados do protótipo: " + err);
        return null;
    }
}

export const listenPrototypesForProject = (
    projectId: string,
    callback: (data: PrototypeProps[]) => void
) => {
    const prototypesRef = collection(db, "prototypes");
    const q = query(prototypesRef, where("projectId", "==", projectId));

    const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
            const results = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            })) as PrototypeProps[];

            callback(results);
        },
        (error) => {
            console.error("Erro ao ouvir protótipos:", error);
            callback([]); 
        }
    );

    return unsubscribe;
};

export const listenPrototypesForProjectWProgress = (
    projectId: string,
    callback: (data: PrototypeProps[]) => void
) => {
    const prototypesRef = collection(db, "prototypes");
    const q = query(prototypesRef, where("projectId", "==", projectId));

    const unsubscribes: (() => void)[] = [];

    const unsubscribePrototypes = onSnapshot(q, (snapshot) => {

        const prototypesMap: Record<string, PrototypeProps> = {};

        snapshot.docs.forEach(docSnap => {
            prototypesMap[docSnap.id] = {
                id: docSnap.id,
                ...(docSnap.data() as PrototypeProps),
                checklists: [],
            };
        });

        unsubscribes.forEach(unsub => unsub());
        unsubscribes.length = 0;

        Object.values(prototypesMap).forEach((prototype) => {

            const checklistsRef = collection(
                db,
                "prototypes",
                prototype.id!,
                "checklists"
            );

            const unsubscribeChecklists = onSnapshot(checklistsRef, (snap) => {

                const checklists = snap.docs.map(doc => ({
                    id: doc.id,
                    ...(doc.data() as ChecklistProps),
                }));

                prototypesMap[prototype.id!] = {
                    ...prototypesMap[prototype.id!],
                    checklists
                };

                callback(Object.values(prototypesMap));
            });

            unsubscribes.push(unsubscribeChecklists);
        });
    });

    return () => {
        unsubscribePrototypes();
        unsubscribes.forEach(unsub => unsub());
    };
};

// ----- ESTA FUNÇÃO PEGA OS DADOS DE TODOS OS PROTÓTIPOS -----
export const getPrototypes = (callback: (data: PrototypeProps[]) => void) => {
    const collectionRef = collection(db, "prototypes");
    const q = query(
        collectionRef,
        orderBy("createdAt", "desc")
    );
    
    return onSnapshot(q, (snapshot) => {
        const prototypesData = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data()
        })) as PrototypeProps[];

        callback(prototypesData);
    });
}


// ----- ESTA FUNÇÃO ATUALIZA AS INFORMAÇÕES DO PROTÓTIPO ----- 
export const updatePrototype = async (editedPrototype: PrototypeProps) => {
    try {
        const id = editedPrototype.id!;
        const docRef = doc(db, "prototypes", id);

        // 1. Atualiza dados básicos
        await updateDoc(docRef, {
            code: editedPrototype.code ?? "",
            name: editedPrototype.name,
            description: editedPrototype.description,
            stage: editedPrototype.stage,
            clientId: editedPrototype.clientId ?? "",
            state: editedPrototype.state ?? "",
            city: editedPrototype.city ?? "",
            areaSize: editedPrototype.areaSize ?? "",
            vertical: editedPrototype.vertical,
            editedAt: arrayUnion(Timestamp.now()),
        });

        // 2. Sincroniza checklists se estiverem presentes no objeto
        if (editedPrototype.checklists) {
            const batch = writeBatch(db);
            
            // Buscar checklists atuais para saber o que deletar
            const currentChecklistsSnap = await getDocs(collection(db, "prototypes", id, "checklists"));
            const currentIds = currentChecklistsSnap.docs.map(d => d.id);
            const newIds = editedPrototype.checklists.map(c => c.id!);

            // Deletar as que saíram
            currentIds.forEach(currId => {
                if (!newIds.includes(currId)) {
                    batch.delete(doc(db, "prototypes", id, "checklists", currId));
                }
            });

            // Adicionar/Atualizar as que ficaram
            editedPrototype.checklists.forEach(cl => {
                const clRef = doc(db, "prototypes", id, "checklists", cl.id!);
                const { id: _, ...data } = cl; // não salva o ID dentro do documento
                batch.set(clRef, {
                    ...data,
                    updatedAt: serverTimestamp()
                }, { merge: true });
            });

            await batch.commit();
        }

        return id;
    } catch (err) {
        console.error("Erro ao editar protótipo:", err);
        return null;
    }
};

export const updatePrototypeChecklists = async (
  prototypeId: string,
  localChecklists: ChecklistProps[]
) => {
  try {
    const batch = writeBatch(db);

    const colRef = collection(db, "prototypes", prototypeId, "checklists");
    const snapshot = await getDocs(colRef);

    // IDs que EXISTEM no banco
    const remoteIds = snapshot.docs.map(d => d.id);

    // IDs que DEVEM existir (estado local)
    const localIds = localChecklists.map(cl => cl.id!).filter(Boolean);

    remoteIds
      .filter(id => !localIds.includes(id))
      .forEach(id => {
        batch.delete(doc(colRef, id));
      });

    localChecklists.forEach(cl => {
      const ref = doc(colRef, cl.id!);

      batch.set(
        ref,
        {
          name: cl.name,
          vertical: cl.vertical,
          categories: cl.categories,
          version: cl.version,
          originalModel: cl.originalModel ?? null,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    });

    await batch.commit();
    return true;
  } catch (err) {
    console.error("Erro ao atualizar checklists:", err);
    return false;
  }
};

// ----- ESTA FUNÇÃO EXCLUI UM PROTÓTIPO ----- 
export const deletePrototype = async (prototypeId: string) => {
    try {
        // 1. Buscar o protótipo para pegar o projectId
        const prototypeRef = doc(db, "prototypes", prototypeId);
        const prototypeSnap = await getDoc(prototypeRef);

        if (!prototypeSnap.exists()) {
            console.error("Protótipo não encontrado!");
            return null;
        }

        const projectId = prototypeSnap.data().projectId;

        // deleta ocorrências
        const occRef = collection(db, "occourrencies");
        const q = query(occRef, where("prototypeId", "==", prototypeId));
        const snap = await getDocs(q);

        await Promise.all(snap.docs.map(doc => deleteDoc(doc.ref)));

        // 2. Deletar subcollection (checklists)
        const checklistsRef = collection(db, "prototypes", prototypeId, "checklists");
        const snapshot = await getDocs(checklistsRef);

        for (const docSnap of snapshot.docs) {
            await deleteDoc(docSnap.ref);
        }

        // 3. Deletar vínculo com projeto
        if (projectId) {
            await deleteDoc(
                doc(db, "projects", projectId, "prototypesIds", prototypeId)
            );
        }

        // 4. Deletar protótipo
        await deleteDoc(prototypeRef);

        return true;

    } catch (err) {
        console.error("Erro ao excluir protótipo:", err);
        return null;
    }
};

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
        
        const newCategories = checklistModel.categories.map((c: CategoriesProps) => ({
            id: c.id ?? crypto.randomUUID(),
            name: c.name,
            items: c.items.map((i: CheckboxItemProps) => ({
                id: i.id,
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
            createdAt: serverTimestamp(),
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

export const getPrototypeChecklists = async (prototypeId: string) => {
    const colRef = collection(db, "prototypes", prototypeId, "checklists");
    const snapshot = await getDocs(colRef);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as ChecklistProps[];
};

// ----- ESTA FUNÇÃO ATUALIZA OS CAMPOS CHECKED DAS CHECKLISTS DO PROTÓTIPO -----
export const toggleChecklistItems = async ( prototypeId: string, checklistId: string, newChecklist: ChecklistProps ) => {
    try 
    {
        const docRef = doc(db, "prototypes", prototypeId, "checklists", checklistId);

        await updateDoc(docRef, {
            categories: newChecklist.categories
        });

        return true;
    }
    catch (err)
    {
        console.error("Erro na tentativa de alterar item da checklist: " + err);
        return null;
    }
}

export const findChecklistInstance = async (prototypeId: string, modelId: string) => {
    const checklistsRef = collection(db, "prototypes", prototypeId, "checklists");
    const q = query(checklistsRef, where("originalModel", "==", modelId));
    const snap = await getDocs(q);

    if (snap.empty) return null;

    return { id: snap.docs[0].id, ...snap.docs[0].data() };
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

export const deleteAllPrototypeChecklists = async (prototypeId: string) => {
    try {
        const collectionRef = collection(db, "prototypes", prototypeId, "checklists");
        const snapshot = await getDocs(collectionRef);

        if (snapshot.empty) return;

        const batch = writeBatch(db);

        snapshot.docs.forEach((docSnap) => {
            batch.delete(docSnap.ref);
        });

        await batch.commit();
    } catch (err) {
        console.error("Erro ao deletar checklists:", err);
    }
};  