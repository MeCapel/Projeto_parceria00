import Layout from '../components/00Geral/Layout' 
import DisplayChecklistsModel from '../components/04ChecklistRelated/models/DisplayChecklistsModel'

export default function Checklists()
{
    return(
        <Layout>
            <DisplayChecklistsModel inline={true} />
        </Layout>
    )
}