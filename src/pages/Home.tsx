import DisplayProjects from '../components/02ProjectRelated/DisplayProjects'
import Layout from '../components/00Geral/Layout'
import AddChecklist2 from '../components/04ChecklistRelated/AddChecklist2'

export default function Home()
{    
    return(
        <Layout>
            <DisplayProjects displayAll={false} />
            <AddChecklist2 />
        </Layout>
    )
}