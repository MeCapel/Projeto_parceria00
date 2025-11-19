import RecentProjects from '../components/RecentProjects'
import Layout from '../components/Layout'
import AddChecklist from '../components/AddChecklist'

export default function Home()
{    
    return(
        <Layout>
            <RecentProjects displayAll={false} />
            <AddChecklist />
        </Layout>
    )
}