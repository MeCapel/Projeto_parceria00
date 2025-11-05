import { Link } from "react-router"

export default function NotFoundPage()
{
    return(
        <div className="container-fliud vh-100 d-flex flex-column gap-5 align-items-center justify-content-center"
             style={{ backgroundImage: "url(/fromBrand/background-pattern.png)"}} >

            <div className="p-5 d-flex flex-column gap-5 align-items-center justify-content-center bg-light rounded-3"
                 style={{ height: '25rem' }}>
                <img src="/fromBrand/baldan-principal.png" alt="" className="img-fluid" style={{ height: "3rem"}} />
                <h1 className="mb-0 text-custom-black fw-bold">Página não encontrada ❌</h1>
                <Link to={"/home"}>
                    <button className="btn-custom btn-custom-secondary">
                        <p className="mb-0 fs-4 text-white">
                            Ir para a página inicial
                        </p>
                    </button>
                </Link>
            </div>
        </div>
    )
}