import DisplayProjects from '../components/02ProjectRelated/DisplayProjects'
import AddChecklist2 from '../components/04ChecklistRelated/AddChecklist2'

export default function Home()
{    
    return(
        <>
            <DisplayProjects displayAll={false} />
            <AddChecklist2 />
        </>
    )
}