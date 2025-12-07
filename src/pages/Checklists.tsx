import Layout from '../components/00Geral/Layout' 
import DisplayChecklistsModel from '../components/04ChecklistRelated/DisplayChecklists2'

export default function Checklists()
{
    return(
        <Layout>
            <DisplayChecklistsModel inline={true} />
        </Layout>
    )
}