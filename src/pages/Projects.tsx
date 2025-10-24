import RecentProjects from '../components/RecentProjects'
import Layout from '../components/Layout'

export default function Projects()
{
    return(
        <Layout>
            <RecentProjects displayAll={true}/>
        </Layout>
    )
}