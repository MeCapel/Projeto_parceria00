import DisplayProjects from '../components/02ProjectRelated/DisplayProjects'
import ChecklistsModelSection from '../components/04ChecklistRelated/models/ChecklistModelSection'

export default function Home()
{    
    return(
        <>
            <DisplayProjects displayAll={false} />
            <ChecklistsModelSection />
        </>
    )
}