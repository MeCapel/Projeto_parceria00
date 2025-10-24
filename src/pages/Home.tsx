import RecentProjects from '../components/RecentProjects'
import Layout from '../components/Layout'

export default function Home()
{    
    return(
        <Layout>
            <RecentProjects displayAll={false} />
        </Layout>
    )
}