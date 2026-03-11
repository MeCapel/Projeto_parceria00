import { useEffect, useState } from "react";
import { type UserProps } from "../../services/authServices";
import { getUsersNotInProject, linkProjectUser } from "../../services/projectServices";

interface Props {
    projectId: string;
}

export default function AddNewMember({ projectId } : Props)
{
    const [ users, setUsers ] = useState<UserProps[]>([]);

    // const [ selectedUsers, setSelectedUsers ] = useState<string[]>([]);
    
    // const handleToggle = (id: string) => {
    //     setSelectedUsers(prev =>
    //         prev.includes(id) ? prev.filter(user => user !== id) : [...prev, id]
    //     );
    // }; 

    const handleAddNewMember = async (projectId: string, userId: string, role: string) => {
        const x = await linkProjectUser(projectId, userId, role);

        if(x.success == false)
        {
            console.error("Erro na tentativa de adicionar um novo membro ao prrojeto!");
            return;
        }
    }

    useEffect(() => {
        const unsubscribe = getUsersNotInProject(projectId, (users) => {
            setUsers(users ?? []);
        });

        return () => unsubscribe();
    }, [projectId]); 

    return(
        <div className="d-flex flex-column overflow-auto" style={{ maxHeight: "50vh" }}>
            <ul className="list-unstyled d-flex flex-column gap-2">
                {users.map((user: UserProps) => (
                    <li key={user.id} className="d-flex gap-3 align-items-center justify-content-between">
                        {/* <p>{user.username}</p> */}
                        <label htmlFor={user.id} className="form-check-label">{user.email}</label>
                        {/* <input 
                            id={user.id}
                            type="checkbox" 
                            className="form-check-input"
                            onChange={() => handleToggle(user.id!)}
                            checked={selectedUsers.includes(user.id!)}
                        /> */}

                        <div 
                            className="d-flex align-items-center justify-content-center gap-3"
                        >
                                {/* <div className="d-flex w-100 gap-3 align-items-start justify-content-center"
                                style={{ top: '-0.75rem' }}>
                                {["Viwer", "Membro", "Admin"].map(s => (
                                    <label key={s} className="d-flex gap-2 form-check-label">
                                        <input
                                            className='form-check-input'
                                            type="radio"
                                            name="radio"
                                            value={s}
                                            checked={user.role === s}
                                            onChange={e => user.role = e.target.value}
                                            />
                                        {s}
                                    </label>
                                ))}
                                </div> */}

                            <button 
                                type='button' onClick={() => handleAddNewMember(projectId, user.id!, "member")}
                                className='btn-custom btn-custom-outline-success d-flex align-items-center justify-content-center gap-3'>
                                Adicionar
                            </button>
                        </div>

                    </li>
                ))}
            </ul>
        </div>

    )
}