import RecentProjects from '../components/02ProjectRelated/RecentProjects'
import Layout from '../components/00Geral/Layout'
import AddChecklist2 from '../components/04ChecklistRelated/AddChecklist2'

export default function Home()
{    
    return(
        <Layout>
            <RecentProjects displayAll={false} />
            <AddChecklist2 />
        </Layout>
    )
}