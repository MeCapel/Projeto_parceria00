import ReusableCards from '../components/ReusableCards'
import MembersCircles from '../components/MembersCircles'
import NewProjectModal from '../components/NewProjectModal'
import { Link } from 'react-router'

interface RecentProjectsProps {
    displayAll: boolean;
}

export default function RecentProjects({ displayAll } : RecentProjectsProps)
{
     const membersList = [{ id: 1, img: '/vite.svg', name: "Maria"},
                          { id: 2, img: '/vite.svg', name: "Pedro"},
                          { id: 3, img: '/vite.svg', name: "Irene"},
                          { id: 4, img: '/vite.svg', name: "Dejair"},
                          { id: 5, img: '/vite.svg', name: "Nicolas"},
                          { id: 6, img: '/vite.svg', name: "Elen"}]

    const cardsInfos = [{id: 1, imgUrl: '/vite.svg', title: 'Project#1', description: 'Description', element: <MembersCircles membersList={membersList} />, hasUpdates: false },
                        {id: 1, imgUrl: '/vite.svg', title: 'Project#2', description: 'Description', element: <MembersCircles membersList={membersList} />, hasUpdates: false },
                        {id: 1, imgUrl: '/vite.svg', title: 'Project#3', description: 'Description', element: <MembersCircles membersList={membersList} />, hasUpdates: true },
    ]

    return(
        <div className='p-5 mx-3'>
            <div className="d-flex row">
                {displayAll ? (
                    <>
                        <div className="d-flex flex-column col-12 col-md-10">
                            <p className='mb-0 text-custom-red fs-5'>Projetos</p>
                            <p className='mb-0 text-custom-black fs-1 fw-bold'>Todos os projetos</p>
                        </div>
                        <div className="d-flex align-items-start justify-content-end col-12 col-md-2 my-3 my-md-0">
                            <NewProjectModal />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="d-flex flex-column col-10">
                            <p className='mb-0 text-custom-red fs-5'>Projetos</p>
                            <p className='mb-0 text-custom-black fs-1 fw-bold'>Visitados recentemente</p>
                        </div>
                        <div className="d-flex align-items-start justify-content-end col-2">
                            <Link to='/projects'>
                                <p className='mb-0 fs-5 text-custom-black'><u>Ver todos</u></p>
                            </Link>
                        </div>
                    </>
                )}
                
            </div>
            <div className="d-flex gap-4 my-5 flex-wrap">
                <ReusableCards infosList={cardsInfos} border={true} />
            </div>
        </div>
    )
}