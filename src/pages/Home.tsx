import DisplayProjects from '../components/02ProjectRelated/DisplayProjects'
import Layout from '../components/00Geral/Layout'
import ChecklistsModelSection from '../components/04ChecklistRelated/models/ChecklistModelSection'

export default function Home()
{    
    return(
        <Layout>
            <DisplayProjects displayAll={false} />
            <ChecklistsModelSection />
        </Layout>
    )
}