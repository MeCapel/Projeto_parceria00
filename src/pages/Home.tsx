import RecentProjects from '../components/02ProjectRelated/RecentProjects'
import Layout from '../components/00Geral/Layout'
import AddChecklist from '../components/04ChecklistRelated/AddChecklist'

export default function Home()
{    
    return(
        <Layout>
            <RecentProjects displayAll={false} />
            <AddChecklist />
        </Layout>
    )
}