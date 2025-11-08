import { useState, useEffect } from "react"
import { getPrototypesForProjectData } from "../services/dbService";

export default function Test()
{
    const [ prototypesList, setPrototypesList ] = useState<any[] | null>(null);
    const [ loading, setLoading ] = useState(true);

    const projectId = "5iRwi8CVvW6pGPnQe8w8"

    useEffect(() => {
        const fetchPrototypes = async () => {
            try 
            {
                const data = await getPrototypesForProjectData(projectId);
                setPrototypesList(data);
            }
            catch (err)
            {
                console.error(err);
            }
            finally
            {
                setLoading(false);
            }
        };

        fetchPrototypes();
    }, []);

    if (loading)
    {
        return <p>Carrengando o projeto...</p>
    }

    if (!prototypesList || prototypesList.length === 0)
    {
        return <p>Nenhum protótipo encontrado!</p>;
    }

    return(
        <>
            <h1>Prototypes from project {projectId}</h1>
            <ul>
                {prototypesList.map((item) => (
                    <li key={item.id}>
                        <strong>{item.name}</strong> - {item.status}
                        <p>{item.description}</p>
                    </li>
                ))}
            </ul>
        </>
    )
}