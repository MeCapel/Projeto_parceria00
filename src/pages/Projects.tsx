import Layout from '../components/00Geral/Layout' 
import RecentProjects from '../components/02ProjectRelated/RecentProjects'

export default function Projects()
{
    return(
        <Layout>
            <RecentProjects displayAll={true}/>
        </Layout>
    )
}