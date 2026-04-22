import ProjectsPage from './ProjectsPage'
import ChecklistsModelSection from '../components/04ChecklistRelated/models/ChecklistModelSection'

export default function Home()
{    
    return(
        <>
            <ProjectsPage />
            <div className="px-5 d-flex gap-5 align-items-center justify-content-between">
                <hr style={{ width: "50%" }} />
                <img src="/fromBrand/gray.png" alt="Logotipo Baldan" 
                    style={{ height: "2rem", fill: "#fce57e" }} />
                <hr style={{ width: "50%" }} />
            </div>
            <ChecklistsModelSection />
        </>
    )
}