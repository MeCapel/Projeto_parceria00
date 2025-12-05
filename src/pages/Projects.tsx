import Layout from '../components/00Geral/Layout' 
import DisplayProjects from '../components/02ProjectRelated/DisplayProjects'

export default function Projects()
{
    return(
        <Layout>
            <DisplayProjects displayAll={true}/>
        </Layout>
    )
}